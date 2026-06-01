import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { requireAuth, hashPassword } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  handleError,
  parsePagination,
  paginatedResponse,
} from "@/lib/api-helpers";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  roleId: z.string(),
  teamId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const { skip, limit, page } = parsePagination(url);
    const search = url.searchParams.get("search") || "";

    const where = search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          role: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return ok(paginatedResponse(users, total, page, limit));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const body = await req.json();
    const data = createUserSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) return badRequest("Email already in use");

    const user = await prisma.user.create({
      data: { ...data, password: await hashPassword(data.password) },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        roleId: true,
        createdAt: true,
      },
    });

    return created(user);
  } catch (err) {
    return handleError(err);
  }
}
