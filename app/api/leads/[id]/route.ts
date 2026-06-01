import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, notFound, noContent, handleError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";
import { triggerAutomation } from "@/lib/automation-engine";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        contact: true,
        account: true,
        deal: true,
        tasks: { include: { assignee: { select: { id: true, name: true } } } },
        emails: true,
        documents: true,
      },
    });
    if (!lead) return notFound("Lead");
    return ok(lead);
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return notFound("Lead");

    const lead = await prisma.lead.update({
      where: { id },
      data: body,
      include: { owner: { select: { id: true, name: true } } },
    });

    await logActivity({
      userId: user.userId,
      module: "leads",
      recordId: id,
      action: "updated",
      description: `Lead "${lead.name}" was updated`,
      metadata: { changes: body },
    });

    if (body.status && body.status !== existing.status) {
      await triggerAutomation("lead_status_changed", {
        recordId: id,
        userId: user.userId,
        data: {
          leadId: id,
          oldStatus: existing.status,
          newStatus: body.status,
        },
      });
    }

    return ok(lead);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return notFound("Lead");

    await prisma.lead.delete({ where: { id } });
    await logActivity({
      userId: user.userId,
      module: "leads",
      recordId: id,
      action: "deleted",
      description: `Lead "${lead.name}" was deleted`,
    });

    return noContent();
  } catch (err) {
    return handleError(err);
  }
}
