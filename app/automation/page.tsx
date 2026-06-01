"use client";

import { useState } from "react";
import {
  Plus,
  Zap,
  Play,
  Pause,
  MoreHorizontal,
  ArrowRight,
  Mail,
  Bell,
  CheckSquare,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLayout } from "@/components/crm/page-layout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AutomationForm } from "@/components/crm/forms/automation-form";
import { toast } from "sonner";

const automations = [
  {
    id: "1",
    name: "New Lead Welcome Email",
    description:
      "Automatically send a welcome email when a new lead is created",
    trigger: "Lead Created",
    action: "Send Email",
    status: true,
    runs: 248,
    lastRun: "2 hours ago",
    category: "Email",
  },
  {
    id: "2",
    name: "Stale Lead Follow-up",
    description: "Create a task when a lead has had no activity for 7 days",
    trigger: "No Activity (7d)",
    action: "Create Task",
    status: true,
    runs: 63,
    lastRun: "Yesterday",
    category: "Tasks",
  },
  {
    id: "3",
    name: "Deal Won Notification",
    description: "Notify the team channel when a deal is moved to Closed Won",
    trigger: "Deal Won",
    action: "Send Notification",
    status: true,
    runs: 14,
    lastRun: "3 days ago",
    category: "Notifications",
  },
  {
    id: "4",
    name: "Proposal Reminder",
    description:
      "Send reminder email if proposal has not been viewed in 48 hours",
    trigger: "Proposal Unviewed (48h)",
    action: "Send Email",
    status: false,
    runs: 31,
    lastRun: "1 week ago",
    category: "Email",
  },
  {
    id: "5",
    name: "Lead Score Update",
    description: "Update lead score based on email opens and website visits",
    trigger: "Email Opened / Page Visit",
    action: "Update Lead Score",
    status: true,
    runs: 892,
    lastRun: "5 minutes ago",
    category: "Scoring",
  },
];

const templates = [
  {
    icon: <Mail className="w-5 h-5" />,
    name: "Welcome Email Series",
    desc: "Drip emails for new leads",
    category: "Email",
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    name: "Task on Deal Stage",
    desc: "Auto-create tasks per stage",
    category: "Tasks",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    name: "Slack Notifications",
    desc: "Alert team on key events",
    category: "Notifications",
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Lead Rotation",
    desc: "Round-robin assignment",
    category: "Assignment",
  },
];

const categoryColors: Record<string, string> = {
  Email: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Tasks: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  Notifications: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  Scoring: "bg-green-500/10 text-green-700 dark:text-green-400",
  Assignment: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
};

export default function AutomationPage() {
  const [automationList, setAutomationList] = useState(automations);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggle = (id: string) =>
    setAutomationList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: !a.status } : a)),
    );

  const handleSubmit = (data: any) => {
    console.log("Automation created:", data);
    toast.success(`Automation "${data.name}" created`);
    setIsSheetOpen(false);
  };

  const active = automationList.filter((a) => a.status).length;

  return (
    <PageLayout
      title="Automation"
      subtitle="Streamline your workflows"
      actions={
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsSheetOpen(true)}
        >
          <Plus className="w-4 h-4" /> New Automation
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Automations", value: automationList.length },
          { label: "Active", value: active },
          {
            label: "Total Runs",
            value: automationList.reduce((acc, a) => acc + a.runs, 0),
          },
          { label: "Time Saved", value: "~48h" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automations List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Automations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {automationList.map((auto) => (
              <div
                key={auto.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${auto.status ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{auto.name}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[auto.category] || ""}`}
                          >
                            {auto.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {auto.description}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 shrink-0"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>View Logs</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Flow */}
                    <div className="flex items-center gap-2 mt-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {auto.trigger}
                      </Badge>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <Badge variant="outline" className="text-xs">
                        {auto.action}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{auto.runs} runs</span>
                        <span>·</span>
                        <span>Last: {auto.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {auto.status ? "Active" : "Paused"}
                        </span>
                        <Switch
                          checked={auto.status}
                          onCheckedChange={() => toggle(auto.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <div>
        <h2 className="text-base font-semibold mb-3">Automation Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((t) => (
            <Card
              key={t.name}
              className="hover:shadow-md transition-shadow cursor-pointer border-dashed hover:border-primary"
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex flex-col gap-3">
                  <div className="text-primary">{t.icon}</div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.desc}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 mt-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>New Automation</SheetTitle>
          </SheetHeader>
          <AutomationForm
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
