import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-helpers";
import { logActivity } from "@/lib/activity-log";
import { triggerAutomation } from "@/lib/automation-engine";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
  accountId: z.string().optional(),
  ownerId: z.string().optional(),
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
    const accountId = url.searchParams.get("accountId") || "";

    const where: any = {};
    if (search)
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    if (accountId) where.accountId = accountId;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.contact.count({ where }),
    ]);

    return ok({
      data: contacts,
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

    const contact = await prisma.contact.create({
      data: { ...data, ownerId: data.ownerId ?? user.userId },
      include: { account: true },
    });

    await logActivity({
      userId: user.userId,
      module: "contacts",
      recordId: contact.id,
      action: "created",
      description: `Contact "${contact.name}" created`,
    });
    await triggerAutomation("contact_created", {
      recordId: contact.id,
      userId: user.userId,
      data: { contactId: contact.id },
    });

    return ok(contact, 201);
  } catch (err) {
    return handleError(err);
  }
}
