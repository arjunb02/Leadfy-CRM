 import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, notFound, noContent, handleError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
  leadId: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  accountId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      parseInt(url.searchParams.get("limit") ?? "20"),
    );
    const skip = (page - 1) * limit;
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const priority = url.searchParams.get("priority") || "";
    const assignedTo = url.searchParams.get("assignedTo") || "";

    const where: any = {};
    if (search) where.title = { contains: search };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignee: { select: { id: true, name: true } },
          lead: { select: { id: true, name: true } },
          deal: { select: { id: true, name: true } },
          contact: { select: { id: true, name: true } },
          account: { select: { id: true, name: true } },
        },
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      }),
      prisma.task.count({ where }),
    ]);

    return ok({
      data: tasks,
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

    const task = await prisma.task.create({
      data: {
        ...data,
        assignedTo: data.assignedTo ?? user.userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    await logActivity({
      userId: user.userId,
      module: "tasks",
      recordId: task.id,
      action: "created",
      description: `Task "${task.title}" created`,
    });

    return ok(task, 201);
  } catch (err) {
    return handleError(err);
  }
}

// Individual task route — handles complete/update/delete
type Params = { params: Promise<{ id: string }> };

export async function PUT_TASK(req: NextRequest, id: string, userId: string) {
  const body = await req.json();
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return notFound("Task");

  const updateData: any = { ...body };
  if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
  if (body.status === "Done" && existing.status !== "Done") {
    updateData.completedAt = new Date();
    await logActivity({
      userId,
      module: "tasks",
      recordId: id,
      action: "completed",
      description: `Task "${existing.title}" marked as done`,
    });
  }

  return prisma.task.update({ where: { id }, data: updateData });
}
