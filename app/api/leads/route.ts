import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, notFound, noContent, handleError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";
import { triggerAutomation } from "@/lib/automation-engine";

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  ownerId: z.string().optional(),
  assignedTo: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      parseInt(url.searchParams.get("limit") ?? "20"),
    );
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const source = url.searchParams.get("source") || "";

    const where: any = {};
    if (search)
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    if (status) where.status = status;
    if (source) where.source = source;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);

    return ok({
      data: leads,
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
    const data = createLeadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: { ...data, ownerId: data.ownerId ?? user.userId },
      include: { owner: { select: { id: true, name: true } } },
    });

    await logActivity({
      userId: user.userId,
      module: "leads",
      recordId: lead.id,
      action: "created",
      description: `Lead "${lead.name}" was created`,
    });

    await triggerAutomation("lead_created", {
      recordId: lead.id,
      userId: user.userId,
      data: { leadId: lead.id, name: lead.name, status: lead.status },
    });

    return ok(lead, 201);
  } catch (err) {
    return handleError(err);
  }
}
