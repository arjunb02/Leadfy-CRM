import prisma from "./db";

interface LogActivityParams {
  userId?: string;
  module: string;
  recordId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity({
  userId,
  module,
  recordId,
  action,
  description,
  metadata,
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId ?? null,
        module,
        recordId,
        action,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (err) {
    // Never let logging fail the main operation
    console.error("[ActivityLog] Failed to log activity:", err);
  }
}

export async function getActivityTimeline(module: string, recordId: string) {
  return prisma.activityLog.findMany({
    where: { module, recordId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUserActivity(userId: string, limit = 20) {
  return prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
