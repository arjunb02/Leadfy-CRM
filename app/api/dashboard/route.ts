import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // first of current month

    // Aggregate queries in parallel for performance
    const [
      totalLeads,
      newLeadsThisMonth,
      activeDeals,
      dealsWon,
      dealsLost,
      totalContacts,
      totalAccounts,
      openTickets,
      overdueTasksCount,
      dealsByStage,
      recentLeadSources,
      topDeals,
      recentActivity,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: start } } }),
      prisma.deal.count({
        where: { stage: { notIn: ["Closed Won", "Closed Lost"] } },
      }),
      prisma.deal.count({ where: { stage: "Closed Won" } }),
      prisma.deal.count({ where: { stage: "Closed Lost" } }),
      prisma.contact.count(),
      prisma.account.count(),
      prisma.ticket.count({
        where: { status: { in: ["open", "in-progress"] } },
      }),
      prisma.task.count({
        where: { status: { not: "Done" }, dueDate: { lt: now } },
      }),

      // Pipeline by stage
      prisma.deal.groupBy({
        by: ["stage"],
        _count: { id: true },
        _sum: { value: true },
      }),

      // Lead sources breakdown
      prisma.lead.groupBy({
        by: ["source"],
        _count: { id: true },
      }),

      // Top deals by value
      prisma.deal.findMany({
        where: { stage: { notIn: ["Closed Lost"] } },
        orderBy: { value: "desc" },
        take: 5,
        include: {
          account: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
        },
      }),

      // Recent activity
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { id: true, name: true } } },
      }),
    ]);

    // Calculate monthly revenue (Closed Won this month)
    const monthlyRevenue = await prisma.deal.aggregate({
      where: { stage: "Closed Won", updatedAt: { gte: start } },
      _sum: { value: true },
    });

    // Total pipeline value
    const pipelineValue = await prisma.deal.aggregate({
      where: { stage: { notIn: ["Closed Won", "Closed Lost"] } },
      _sum: { value: true },
    });

    // Conversion rate: Converted leads / Total leads
    const convertedLeads = await prisma.lead.count({
      where: { status: "Converted" },
    });
    const conversionRate =
      totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return ok({
      kpis: {
        totalLeads,
        newLeadsThisMonth,
        activeDeals,
        dealsWon,
        dealsLost,
        totalContacts,
        totalAccounts,
        openTickets,
        overdueTasksCount,
        monthlyRevenue: monthlyRevenue._sum.value ?? 0,
        pipelineValue: pipelineValue._sum.value ?? 0,
        conversionRate,
      },
      charts: {
        dealsByStage: dealsByStage.map((s) => ({
          stage: s.stage,
          count: s._count.id,
          value: s._sum.value ?? 0,
        })),
        leadSources: recentLeadSources.map((s) => ({
          source: s.source || "Unknown",
          count: s._count.id,
        })),
      },
      topDeals,
      recentActivity,
    });
  } catch (err) {
    return handleError(err);
  }
}
