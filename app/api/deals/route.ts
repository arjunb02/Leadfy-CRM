import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";
import { triggerAutomation } from "@/lib/automation-engine";

const schema = z.object({
  name: z.string().min(2),
  stage: z.string().optional(),
  value: z.number().optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedClose: z.string().optional(),
  notes: z.string().optional(),
  accountId: z.string().optional(),
  contactId: z.string().optional(),
  ownerId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      parseInt(url.searchParams.get("limit") ?? "50"),
    );
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";
    const stage = url.searchParams.get("stage") || "";

    const where: any = {};
    if (search) where.name = { contains: search };
    if (stage) where.stage = stage;

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          contact: { select: { id: true, name: true, email: true } },
          owner: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.deal.count({ where }),
    ]);

    return ok({
      data: deals,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = schema.parse(body);

    const deal = await prisma.deal.create({
      data: {
        ...data,
        ownerId: data.ownerId ?? user.userId,
        expectedClose: data.expectedClose
          ? new Date(data.expectedClose)
          : undefined,
      },
      include: { account: true, contact: true },
    });

    await logActivity({
      userId: user.userId,
      module: "deals",
      recordId: deal.id,
      action: "created",
      description: `Deal "${deal.name}" created at ${deal.stage} stage`,
    });
    await triggerAutomation("deal_created", {
      recordId: deal.id,
      userId: user.userId,
      data: { dealId: deal.id, stage: deal.stage },
    });

    return ok(deal, 201);
  } catch (err) {
    return handleError(err);
  }
}
