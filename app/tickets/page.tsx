"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { TicketForm } from "@/components/crm/forms/ticket-form";
import { toast } from "sonner";

type Priority = "critical" | "high" | "medium" | "low";
type Status = "open" | "in-progress" | "resolved" | "closed";

const tickets = [
  {
    id: "TKT-001",
    title: "Integration API not responding",
    customer: "Acme Corp",
    avatar: "AC",
    priority: "critical" as Priority,
    status: "open" as Status,
    created: "1 hour ago",
    assignee: "Alice",
    category: "Technical",
  },
  {
    id: "TKT-002",
    title: "Unable to export data in CSV format",
    customer: "TechStartup",
    avatar: "TS",
    priority: "high" as Priority,
    status: "in-progress" as Status,
    created: "3 hours ago",
    assignee: "Bob",
    category: "Bug",
  },
  {
    id: "TKT-003",
    title: "Request for custom dashboard feature",
    customer: "Global Ventures",
    avatar: "GV",
    priority: "medium" as Priority,
    status: "open" as Status,
    created: "Yesterday",
    assignee: "Carol",
    category: "Feature",
  },
  {
    id: "TKT-004",
    title: "Billing invoice incorrect amount",
    customer: "FinTech Solutions",
    avatar: "FT",
    priority: "high" as Priority,
    status: "in-progress" as Status,
    created: "Yesterday",
    assignee: "David",
    category: "Billing",
  },
  {
    id: "TKT-005",
    title: "Password reset not working",
    customer: "RetailCo",
    avatar: "RC",
    priority: "medium" as Priority,
    status: "resolved" as Status,
    created: "2 days ago",
    assignee: "Alice",
    category: "Account",
  },
  {
    id: "TKT-006",
    title: "Email notifications delayed",
    customer: "DataSys",
    avatar: "DS",
    priority: "low" as Priority,
    status: "closed" as Status,
    created: "3 days ago",
    assignee: "Eve",
    category: "Bug",
  },
];

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  critical: {
    label: "Critical",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  high: {
    label: "High",
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  low: {
    label: "Low",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
  },
};

const statusConfig: Record<
  Status,
  { label: string; color: string; icon: React.ReactNode }
> = {
  open: {
    label: "Open",
    color: "bg-blue-500/10 text-blue-600",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-500/10 text-yellow-600",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-500/10 text-green-600",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-500/10 text-gray-600",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

function TicketCard({ ticket }: { ticket: (typeof tickets)[0] }) {
  const p = priorityConfig[ticket.priority];
  const s = statusConfig[ticket.status];
  return (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors group">
      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9 shrink-0">
          <AvatarFallback className="text-xs">{ticket.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-mono text-muted-foreground">
                  {ticket.id}
                </span>
                <Badge variant="outline" className="text-xs h-4 px-1.5">
                  {ticket.category}
                </Badge>
              </div>
              <p className="text-sm font-medium leading-snug">{ticket.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ticket.customer}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Ticket</DropdownMenuItem>
                <DropdownMenuItem>Assign To</DropdownMenuItem>
                <DropdownMenuItem>Change Status</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Close Ticket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${p.color}`}
            >
              {p.label}
            </span>
            <span
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}
            >
              {s.icon} {s.label}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {ticket.created}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Ticket created:", data);
    toast.success(`Ticket created: ${data.title}`);
    setIsSheetOpen(false);
  };

  const filtered = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()),
  );

  const open = filtered.filter((t) => t.status === "open");
  const inProgress = filtered.filter((t) => t.status === "in-progress");
  const resolved = filtered.filter((t) =>
    ["resolved", "closed"].includes(t.status),
  );

  const stats = [
    {
      label: "Open",
      value: tickets.filter((t) => t.status === "open").length,
      color: "text-blue-500",
    },
    {
      label: "In Progress",
      value: tickets.filter((t) => t.status === "in-progress").length,
      color: "text-yellow-500",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
      color: "text-green-500",
    },
    {
      label: "Critical",
      value: tickets.filter((t) => t.priority === "critical").length,
      color: "text-red-500",
    },
  ];

  return (
    <PageLayout
      title="Support Tickets"
      subtitle="Track and resolve customer issues"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
          <TabsTrigger value="progress">
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolved.length})
          </TabsTrigger>
        </TabsList>
        {(
          [
            { value: "all", list: filtered },
            { value: "open", list: open },
            { value: "progress", list: inProgress },
            { value: "resolved", list: resolved },
          ] as const
        ).map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="space-y-3">
              {tab.list.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {tab.list.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No tickets in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>New Support Ticket</SheetTitle>
          </SheetHeader>
          <TicketForm
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
