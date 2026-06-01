import prisma from "./db";
import { logActivity } from "./activity-log";

// ─── Trigger Types ────────────────────────────────────────────

export type AutomationTrigger =
  | "lead_created"
  | "lead_status_changed"
  | "lead_converted"
  | "deal_created"
  | "deal_stage_changed"
  | "deal_won"
  | "deal_lost"
  | "task_overdue"
  | "task_completed"
  | "ticket_created"
  | "contact_created";

interface TriggerPayload {
  recordId: string;
  userId?: string;
  data?: Record<string, unknown>;
}

// ─── Main Trigger Function ────────────────────────────────────

export async function triggerAutomation(
  event: AutomationTrigger,
  payload: TriggerPayload,
) {
  // Find all active automations watching this event
  const automations = await prisma.automation.findMany({
    where: { isActive: true, triggerType: event },
  });

  for (const automation of automations) {
    try {
      // Parse trigger config for conditional matching
      const config = automation.triggerConfig
        ? JSON.parse(automation.triggerConfig)
        : {};

      // Check if condition matches (e.g. deal stage === "Closed Won")
      if (!matchesTriggerCondition(event, config, payload.data)) continue;

      // Execute the action
      await executeAction(
        automation.actionType,
        automation.actionConfig,
        payload,
      );

      // Update run count
      await prisma.automation.update({
        where: { id: automation.id },
        data: { runCount: { increment: 1 }, lastRunAt: new Date() },
      });

      // Log the run
      await prisma.automationLog.create({
        data: {
          automationId: automation.id,
          triggerEvent: event,
          payload: JSON.stringify(payload),
          status: "success",
        },
      });
    } catch (err: any) {
      await prisma.automationLog
        .create({
          data: {
            automationId: automation.id,
            triggerEvent: event,
            payload: JSON.stringify(payload),
            status: "failed",
            error: err?.message || "Unknown error",
          },
        })
        .catch(() => {}); // ignore log errors
    }
  }
}

// ─── Condition Matcher ────────────────────────────────────────

function matchesTriggerCondition(
  event: AutomationTrigger,
  config: Record<string, unknown>,
  data?: Record<string, unknown>,
): boolean {
  if (!data || Object.keys(config).length === 0) return true;

  // e.g. config: { stage: "Closed Won" } must match data.stage
  for (const [key, value] of Object.entries(config)) {
    if (data[key] !== value) return false;
  }
  return true;
}

// ─── Action Executor ──────────────────────────────────────────

async function executeAction(
  actionType: string,
  actionConfig: string | null,
  payload: TriggerPayload,
) {
  const config = actionConfig ? JSON.parse(actionConfig) : {};

  switch (actionType) {
    case "send_email":
      // In production: integrate SendGrid/SES
      console.log(`[Automation] 📧 Send email to ${config.to || "lead owner"}`);
      break;

    case "create_task":
      if (
        payload.data?.leadId ||
        payload.data?.dealId ||
        payload.data?.contactId
      ) {
        await prisma.task.create({
          data: {
            title: config.taskTitle || "Follow-up required",
            description:
              config.taskDescription || "Auto-generated task from automation",
            priority: config.priority || "medium",
            status: "Pending",
            assignedTo: payload.userId ?? null,
            leadId: payload.data?.leadId as string | undefined,
            dealId: payload.data?.dealId as string | undefined,
            contactId: payload.data?.contactId as string | undefined,
          },
        });
        console.log(`[Automation] ✅ Task created: ${config.taskTitle}`);
      }
      break;

    case "send_notification":
      // In production: integrate Slack/Teams/Push
      console.log(
        `[Automation] 🔔 Notification: ${config.message || "Event occurred"}`,
      );
      break;

    case "update_lead_score":
      if (payload.data?.leadId) {
        console.log(
          `[Automation] 📊 Lead score update for ${payload.data.leadId}`,
        );
      }
      break;

    case "assign_to":
      // Round-robin or specific assignment
      console.log(`[Automation] 👤 Assign to: ${config.assignTo || "auto"}`);
      break;

    default:
      console.log(`[Automation] Unknown action: ${actionType}`);
  }
}
