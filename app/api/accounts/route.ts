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
  name: z.string().min(2),
  industry: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  employees: z.number().optional(),
  annualRevenue: z.number().optional(),
  ownerId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const { skip, limit, page } = parsePagination(url);
    const search = url.searchParams.get("search") || "";
    const industry = url.searchParams.get("industry") || "";

    const where: any = {};
    if (search) where.name = { contains: search };
    if (industry) where.industry = industry;

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { contacts: true, deals: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.account.count({ where }),
    ]);

    return ok(paginatedResponse(accounts, total, page, limit));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const data = schema.parse(body);

    const account = await prisma.account.create({
      data: { ...data, ownerId: data.ownerId ?? user.userId },
    });

    await logActivity({
      userId: user.userId,
      module: "accounts",
      recordId: account.id,
      action: "created",
      description: `Account "${account.name}" created`,
    });
    return ok(account, 201);
  } catch (err) {
    return handleError(err);
  }
}
