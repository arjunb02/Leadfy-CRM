import prisma from "./db";

type Module =
  | "leads"
  | "contacts"
  | "accounts"
  | "deals"
  | "tasks"
  | "emails"
  | "documents"
  | "tickets"
  | "automation"
  | "reports"
  | "users"
  | "dashboard";

type Action = "view" | "create" | "edit" | "delete";

// ─── Check Permission ─────────────────────────────────────────

export async function checkPermission(
  userId: string,
  module: Module,
  action: Action,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            where: { moduleName: module },
          },
        },
      },
    },
  });

  if (!user) return false;

  // Admin role bypass — full access
  if (user.role.name === "Admin") return true;

  const perm = user.role.permissions[0];
  if (!perm) return false;

  switch (action) {
    case "view":
      return perm.canView;
    case "create":
      return perm.canCreate;
    case "edit":
      return perm.canEdit;
    case "delete":
      return perm.canDelete;
    default:
      return false;
  }
}

// ─── Default Role Permissions ────────────────────────────────

export const DEFAULT_PERMISSIONS: Record<
  string,
  Record<Module, Partial<Record<Action, boolean>>>
> = {
  Admin: {
    leads: { view: true, create: true, edit: true, delete: true },
    contacts: { view: true, create: true, edit: true, delete: true },
    accounts: { view: true, create: true, edit: true, delete: true },
    deals: { view: true, create: true, edit: true, delete: true },
    tasks: { view: true, create: true, edit: true, delete: true },
    emails: { view: true, create: true, edit: true, delete: true },
    documents: { view: true, create: true, edit: true, delete: true },
    tickets: { view: true, create: true, edit: true, delete: true },
    automation: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    dashboard: { view: true, create: true, edit: true, delete: true },
  },
  "Sales Manager": {
    leads: { view: true, create: true, edit: true, delete: false },
    contacts: { view: true, create: true, edit: true, delete: false },
    accounts: { view: true, create: true, edit: true, delete: false },
    deals: { view: true, create: true, edit: true, delete: false },
    tasks: { view: true, create: true, edit: true, delete: true },
    emails: { view: true, create: true, edit: false, delete: false },
    documents: { view: true, create: true, edit: true, delete: false },
    tickets: { view: true, create: false, edit: true, delete: false },
    automation: { view: true, create: false, edit: true, delete: false },
    reports: { view: true, create: true, edit: false, delete: false },
    users: { view: true, create: false, edit: false, delete: false },
    dashboard: { view: true, create: false, edit: false, delete: false },
  },
  "Sales Executive": {
    leads: { view: true, create: true, edit: true, delete: false },
    contacts: { view: true, create: true, edit: true, delete: false },
    accounts: { view: true, create: false, edit: false, delete: false },
    deals: { view: true, create: true, edit: true, delete: false },
    tasks: { view: true, create: true, edit: true, delete: true },
    emails: { view: true, create: true, edit: false, delete: false },
    documents: { view: true, create: true, edit: false, delete: false },
    tickets: { view: false, create: false, edit: false, delete: false },
    automation: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    dashboard: { view: true, create: false, edit: false, delete: false },
  },
  "Support Agent": {
    leads: { view: false, create: false, edit: false, delete: false },
    contacts: { view: true, create: false, edit: false, delete: false },
    accounts: { view: true, create: false, edit: false, delete: false },
    deals: { view: false, create: false, edit: false, delete: false },
    tasks: { view: true, create: true, edit: true, delete: false },
    emails: { view: true, create: true, edit: false, delete: false },
    documents: { view: true, create: false, edit: false, delete: false },
    tickets: { view: true, create: true, edit: true, delete: false },
    automation: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    dashboard: { view: false, create: false, edit: false, delete: false },
  },
};

// ─── Response Helper ──────────────────────────────────────────

export class PermissionError extends Error {
  status = 403;
  constructor(module: string, action: string) {
    super(`You don't have permission to ${action} ${module}`);
    this.name = "PermissionError";
  }
}
