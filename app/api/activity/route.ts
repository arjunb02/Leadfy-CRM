import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const module = url.searchParams.get("module") || "";
    const recordId = url.searchParams.get("recordId") || "";

    const where: any = {};
    if (module) where.module = module;
    if (recordId) where.recordId = recordId;

    const logs = await prisma.activityLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return ok(logs);
  } catch (err) {
    return handleError(err);
  }
}
