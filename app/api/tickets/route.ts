'import { NextRequest } from "next/server";
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
import { triggerAutomation } from "@/lib/automation-engine";

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  resolution: z.string().optional(),
  contactId: z.string().optional(),
  assignedAgent: z.string().optional(),
});

function generateTicketNumber() {
  return `TKT-${Date.now().toString().slice(-6)}`;
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const { skip, limit, page } = parsePagination(url);
    const status = url.searchParams.get("status") || "";
    const priority = url.searchParams.get("priority") || "";
    const search = url.searchParams.get("search") || "";

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search)
      where.OR = [
        { title: { contains: search } },
        { ticketNumber: { contains: search } },
      ];

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        include: {
          contact: { select: { id: true, name: true, email: true } },
          agent: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.ticket.count({ where }),
    ]);

    return ok(paginatedResponse(tickets, total, page, limit));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = schema.parse(body);

    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        ticketNumber: generateTicketNumber(),
        assignedAgent: data.assignedAgent ?? undefined,
      },
      include: { contact: true },
    });

    await logActivity({
      userId: user.userId,
      module: "tickets",
      recordId: ticket.id,
      action: "created",
      description: `Ticket ${ticket.ticketNumber}: "${ticket.title}" created`,
    });
    await triggerAutomation("ticket_created", {
      recordId: ticket.id,
      userId: user.userId,
      data: { ticketId: ticket.id, priority: ticket.priority },
    });

    return ok(ticket, 201);
  } catch (err) {
    return handleError(err);
  }
}
