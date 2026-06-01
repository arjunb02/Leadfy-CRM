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
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        account: true,
        contact: true,
        owner: { select: { id: true, name: true, email: true } },
        tasks: { include: { assignee: { select: { id: true, name: true } } } },
        emails: true,
        documents: true,
      },
    });
    if (!deal) return notFound("Deal");
    return ok(deal);
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.deal.findUnique({ where: { id } });
    if (!existing) return notFound("Deal");

    const updateData = { ...body };
    if (body.expectedClose)
      updateData.expectedClose = new Date(body.expectedClose);

    const deal = await prisma.deal.update({ where: { id }, data: updateData });

    await logActivity({
      userId: user.userId,
      module: "deals",
      recordId: id,
      action: "updated",
      description: `Deal "${deal.name}" updated`,
      metadata: { changes: body },
    });

    // Stage change automation triggers
    if (body.stage && body.stage !== existing.stage) {
      await logActivity({
        userId: user.userId,
        module: "deals",
        recordId: id,
        action: "stage_changed",
        description: `Deal stage changed from "${existing.stage}" to "${body.stage}"`,
      });
      await triggerAutomation("deal_stage_changed", {
        recordId: id,
        userId: user.userId,
        data: {
          dealId: id,
          oldStage: existing.stage,
          newStage: body.stage,
          stage: body.stage,
        },
      });
      if (body.stage === "Closed Won") {
        await triggerAutomation("deal_won", {
          recordId: id,
          userId: user.userId,
          data: { dealId: id, value: deal.value },
        });
      }
      if (body.stage === "Closed Lost") {
        await triggerAutomation("deal_lost", {
          recordId: id,
          userId: user.userId,
          data: { dealId: id },
        });
      }
    }

    return ok(deal);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return notFound("Deal");

    await prisma.deal.delete({ where: { id } });
    await logActivity({
      userId: user.userId,
      module: "deals",
      recordId: id,
      action: "deleted",
      description: `Deal "${deal.name}" deleted`,
    });

    return noContent();
  } catch (err) {
    return handleError(err);
  }
}
