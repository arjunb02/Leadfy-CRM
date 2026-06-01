import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const payload = await requireAuth(req);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        role: {
          include: { permissions: true },
        },
      },
    });
    return ok(user);
  } catch (err) {
    return handleError(err);
  }
}
