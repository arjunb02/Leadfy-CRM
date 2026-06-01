"use client";

import { useState } from "react";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { TaskForm } from "@/components/crm/forms/task-form";
import { toast } from "sonner";

type Priority = "high" | "medium" | "low";

const tasks = [
  {
    id: "1",
    title: "Follow up with Sarah Chen on proposal",
    due: "Today, 2:00 PM",
    priority: "high" as Priority,
    done: false,
    related: "Acme Corp",
    category: "Call",
  },
  {
    id: "2",
    title: "Send contract to TechStartup",
    due: "Today, 5:00 PM",
    priority: "high" as Priority,
    done: false,
    related: "TechStartup",
    category: "Email",
  },
  {
    id: "3",
    title: "Schedule discovery call with Global Ventures",
    due: "Tomorrow",
    priority: "medium" as Priority,
    done: false,
    related: "Global Ventures",
    category: "Meeting",
  },
  {
    id: "4",
    title: "Update CRM notes from yesterday's calls",
    due: "Tomorrow",
    priority: "low" as Priority,
    done: false,
    related: "",
    category: "Admin",
  },
  {
    id: "5",
    title: "Prepare Q2 pipeline report",
    due: "This Friday",
    priority: "medium" as Priority,
    done: false,
    related: "",
    category: "Report",
  },
  {
    id: "6",
    title: "Review FinTech Solutions proposal",
    due: "Mar 15",
    priority: "high" as Priority,
    done: false,
    related: "FinTech Solutions",
    category: "Review",
  },
  {
    id: "7",
    title: "Send thank you email to GrowthCo",
    due: "Yesterday",
    priority: "low" as Priority,
    done: true,
    related: "GrowthCo",
    category: "Email",
  },
  {
    id: "8",
    title: "Update lead scores in dashboard",
    due: "Mar 10",
    priority: "medium" as Priority,
    done: true,
    related: "",
    category: "Admin",
  },
];

const priorityConfig: Record<
  Priority,
  { label: string; color: string; icon: React.ReactNode }
> = {
  high: {
    label: "High",
    color: "text-red-500 bg-red-500/10",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  medium: {
    label: "Medium",
    color: "text-yellow-600 bg-yellow-500/10",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  low: {
    label: "Low",
    color: "text-green-600 bg-green-500/10",
    icon: <Circle className="w-3.5 h-3.5" />,
  },
};

function TaskItem({
  task,
  onToggle,
  onEdit,
}: {
  task: (typeof tasks)[0];
  onToggle: (id: string) => void;
  onEdit: (task: any) => void;
}) {
  const p = priorityConfig[task.priority];
  return (
    <div
      className={`flex items-start gap-3 p-3 md:p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors group ${task.done ? "opacity-60" : ""}`}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-0.5 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : ""} leading-snug`}
        >
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="text-xs text-muted-foreground">{task.due}</span>
          {task.related && (
            <Badge variant="secondary" className="text-xs h-4 px-1.5">
              {task.related}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs h-4 px-1.5">
            {task.category}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`hidden sm:flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${p.color}`}
        >
          {p.icon} {p.label}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Reassign</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const handleAdd = () => {
    setEditingTask(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("Task submitted:", data);
    toast.success(
      editingTask ? "Task updated successfully" : "Task created successfully",
    );
    setIsSheetOpen(false);
  };

  const [taskList, setTaskList] = useState(tasks);

  const toggle = (id: string) =>
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const pending = taskList.filter((t) => !t.done);
  const completed = taskList.filter((t) => t.done);
  const overdue = pending.filter((t) => t.due === "Yesterday");

  return (
    <PageLayout
      title="Tasks"
      subtitle="Manage your to-dos and follow-ups"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button size="sm" className="gap-2" onClick={handleAdd}>
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Tasks",
            value: taskList.length,
            color: "text-foreground",
          },
          { label: "Pending", value: pending.length, color: "text-blue-500" },
          { label: "Overdue", value: overdue.length, color: "text-red-500" },
          {
            label: "Completed",
            value: completed.length,
            color: "text-green-500",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task List */}
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({taskList.length})</TabsTrigger>
        </TabsList>

        {(["pending", "completed", "all"] as const).map((tab) => {
          const list =
            tab === "pending"
              ? pending
              : tab === "completed"
                ? completed
                : taskList;
          return (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {list.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggle}
                        onEdit={handleEdit}
                      />
                    ))}
                    {list.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No tasks here!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </SheetTitle>
          </SheetHeader>
          <TaskForm
            initialData={editingTask}
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
