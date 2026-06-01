import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import {
  ok,
  notFound,
  noContent,
  handleError,
  parsePagination,
  paginatedResponse,
} from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  triggerType: z.string(),
  triggerConfig: z.string().optional(), // JSON string
  actionType: z.string(),
  actionConfig: z.string().optional(), // JSON string
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const { skip, limit, page } = parsePagination(url);
    const category = url.searchParams.get("category") || "";

    const where: any = {};
    if (category) where.category = category;

    const [automations, total] = await Promise.all([
      prisma.automation.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: { select: { id: true, name: true } },
          _count: { select: { logs: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.automation.count({ where }),
    ]);

    return ok(paginatedResponse(automations, total, page, limit));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = schema.parse(body);

    const automation = await prisma.automation.create({
      data: { ...data, createdBy: user.userId },
    });

    await logActivity({
      userId: user.userId,
      module: "automation",
      recordId: automation.id,
      action: "created",
      description: `Automation "${automation.name}" created`,
    });
    return ok(automation, 201);
  } catch (err) {
    return handleError(err);
  }
}
