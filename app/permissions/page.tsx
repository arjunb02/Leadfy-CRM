"use client";

import { useState } from "react";
import { Key, Save, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLayout } from "@/components/crm/page-layout";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const roles = ["Admin", "Sales Manager", "Sales Executive", "Support Agent"];

const modules = [
  "Leads",
  "Contacts",
  "Accounts",
  "Deals",
  "Tasks",
  "Emails",
  "Documents",
  "Tickets",
  "Automation",
  "Reports",
  "Users",
];

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("Sales Executive");
  const [isSaving, setIsSaving] = useState(false);

  // Mock permissions state for UI interaction demonstration
  const [permissions, setPermissions] = useState<
    Record<
      string,
      { view: boolean; create: boolean; edit: boolean; delete: boolean }
    >
  >({
    Leads: { view: true, create: true, edit: true, delete: false },
    Contacts: { view: true, create: true, edit: true, delete: false },
    Accounts: { view: true, create: false, edit: false, delete: false },
    Deals: { view: true, create: true, edit: true, delete: false },
    Tasks: { view: true, create: true, edit: true, delete: true },
    Emails: { view: true, create: true, edit: false, delete: false },
    Documents: { view: true, create: true, edit: false, delete: false },
    Tickets: { view: false, create: false, edit: false, delete: false },
    Automation: { view: false, create: false, edit: false, delete: false },
    Reports: { view: false, create: false, edit: false, delete: false },
    Users: { view: false, create: false, edit: false, delete: false },
  });

  const togglePermission = (
    mod: string,
    action: "view" | "create" | "edit" | "delete",
    checked: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [mod]: { ...prev[mod], [action]: checked },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${selectedRole} permissions saved successfully`);
    }, 600);
  };

  return (
    <PageLayout
      title="Permissions Matrix"
      subtitle="Configure modular access controls per role"
      actions={
        <Button
          size="sm"
          className="gap-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-5 h-5 text-muted-foreground" /> Select Target
                Role
              </CardTitle>
              <CardDescription>
                Choose a role below to configure its module access levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4 text-sm text-muted-foreground">
              <span className="block font-semibold text-foreground mb-1">
                Tip:
              </span>
              The <strong>Admin</strong> role always has implicit full access
              bypass and cannot be restricted here.
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card
            className={`${selectedRole === "Admin" ? "opacity-50 pointer-events-none grayscale" : ""}`}
          >
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">
                Module Permissions Configuration
              </CardTitle>
              <CardDescription>
                Target: <strong>{selectedRole}</strong>
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium border-b">Module</th>
                    <th className="px-6 py-4 font-medium border-b text-center">
                      View
                    </th>
                    <th className="px-6 py-4 font-medium border-b text-center">
                      Create
                    </th>
                    <th className="px-6 py-4 font-medium border-b text-center">
                      Edit
                    </th>
                    <th className="px-6 py-4 font-medium border-b text-center">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {modules.map((mod) => (
                    <tr
                      key={mod}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{mod}</td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={permissions[mod]?.view || false}
                          onCheckedChange={(c) =>
                            togglePermission(mod, "view", c)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={permissions[mod]?.create || false}
                          onCheckedChange={(c) =>
                            togglePermission(mod, "create", c)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={permissions[mod]?.edit || false}
                          onCheckedChange={(c) =>
                            togglePermission(mod, "edit", c)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={permissions[mod]?.delete || false}
                          onCheckedChange={(c) =>
                            togglePermission(mod, "delete", c)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
