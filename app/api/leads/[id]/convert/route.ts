import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, notFound, badRequest, handleError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";
import { triggerAutomation } from "@/lib/automation-engine";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/leads/[id]/convert
 *
 * Converts a lead into a Contact, Account (if company name exists),
 * and a new Deal — all in one atomic transaction.
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return notFound("Lead");
    if (lead.status === "Converted")
      return badRequest("Lead is already converted");

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create / find Account
      let account = lead.accountId
        ? await tx.account.findUnique({ where: { id: lead.accountId } })
        : null;

      if (!account && lead.company) {
        account = await tx.account.create({
          data: {
            name: lead.company,
            ownerId: user.userId,
          },
        });
      }

      // 2. Create Contact
      const contact = await tx.contact.create({
        data: {
          name: lead.name,
          email: lead.email ?? undefined,
          phone: lead.phone ?? undefined,
          accountId: account?.id ?? undefined,
          ownerId: user.userId,
        },
      });

      // 3. Create Deal
      const deal = await tx.deal.create({
        data: {
          name: `${lead.name} - Opportunity`,
          stage: "Prospecting",
          accountId: account?.id ?? undefined,
          contactId: contact.id,
          ownerId: user.userId,
        },
      });

      // 4. Mark lead as Converted
      const updatedLead = await tx.lead.update({
        where: { id },
        data: {
          status: "Converted",
          contactId: contact.id,
          accountId: account?.id ?? undefined,
          dealId: deal.id,
        },
      });

      return { lead: updatedLead, contact, account, deal };
    });

    await logActivity({
      userId: user.userId,
      module: "leads",
      recordId: id,
      action: "converted",
      description: `Lead "${lead.name}" converted to Contact, Account, and Deal`,
      metadata: {
        contactId: result.contact.id,
        accountId: result.account?.id,
        dealId: result.deal.id,
      },
    });

    await triggerAutomation("lead_converted", {
      recordId: id,
      userId: user.userId,
      data: {
        leadId: id,
        contactId: result.contact.id,
        dealId: result.deal.id,
      },
    });

    return ok({
      message: "Lead converted successfully",
      contact: result.contact,
      account: result.account,
      deal: result.deal,
    });
  } catch (err) {
    return handleError(err);
  }
}
