"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  Phone,
  Mail,
  Star,
  Funnel,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/crm/status-badge";
import { PageLayout } from "@/components/crm/page-layout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LeadForm } from "@/components/crm/forms/lead-form";
import { toast } from "sonner";

const leads = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@acme.com",
    company: "Acme Corp",
    status: "qualified" as const,
    value: "$45,000",
    phone: "+1 (555) 123-4567",
    avatar: "SC",
    source: "LinkedIn",
    score: 85,
    lastContact: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "mrodriguez@techstartup.io",
    company: "TechStartup",
    status: "proposal" as const,
    value: "$78,000",
    phone: "+1 (555) 234-5678",
    avatar: "MR",
    source: "Website",
    score: 72,
    lastContact: "Yesterday",
  },
  {
    id: "3",
    name: "Emily Watson",
    email: "emily@innovatetech.com",
    company: "InnovateTech",
    status: "contacted" as const,
    value: "$32,000",
    phone: "+1 (555) 345-6789",
    avatar: "EW",
    source: "Referral",
    score: 58,
    lastContact: "3 days ago",
  },
  {
    id: "4",
    name: "David Kumar",
    email: "dkumar@globalventures.com",
    company: "Global Ventures",
    status: "new" as const,
    value: "$56,000",
    phone: "+1 (555) 456-7890",
    avatar: "DK",
    source: "Email",
    score: 41,
    lastContact: "1 week ago",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jmartinez@fintech.io",
    company: "FinTech Solutions",
    status: "qualified" as const,
    value: "$92,000",
    phone: "+1 (555) 567-8901",
    avatar: "JM",
    source: "LinkedIn",
    score: 91,
    lastContact: "Today",
  },
  {
    id: "6",
    name: "Alex Thompson",
    email: "alex@cloudservices.com",
    company: "Cloud Services",
    status: "new" as const,
    value: "$28,000",
    phone: "+1 (555) 678-9012",
    avatar: "AT",
    source: "Website",
    score: 35,
    lastContact: "2 weeks ago",
  },
];

const statCards = [
  { label: "Total Leads", value: "2,458", change: "+12%" },
  { label: "New This Week", value: "147", change: "+8%" },
  { label: "Qualified", value: "384", change: "+5%" },
  { label: "Avg Lead Score", value: "64", change: "+3pts" },
];

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium w-6 text-right">{score}</span>
    </div>
  );
}

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);

  const handleAdd = () => {
    setEditingLead(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (lead: any) => {
    setEditingLead(lead);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("Lead submitted:", data);
    toast.success(
      editingLead ? "Lead updated successfully" : "Lead created successfully",
    );
    setIsSheetOpen(false);
  };
  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout
      title="Leads"
      subtitle="Manage and track your sales leads"
      actions={
        <>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button size="sm" className="gap-2" onClick={handleAdd}>
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{s.value}</p>
              <p className="text-xs text-accent mt-1">{s.change} this month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <CardTitle className="text-base">All Leads</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-muted h-9"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-xs">
                            {lead.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="w-28">
                      <ScoreBar score={lead.score} />
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {lead.value}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.lastContact}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(lead)}>
                              Edit Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem>Convert to Deal</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filtered.map((lead) => (
              <div
                key={lead.id}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="text-sm">
                        {lead.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 shrink-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(lead)}>
                        Edit Lead
                      </DropdownMenuItem>
                      <DropdownMenuItem>Convert to Deal</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="font-medium truncate">{lead.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="font-medium">{lead.value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <Badge variant="secondary" className="text-xs mt-0.5">
                      {lead.source}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-0.5">
                      <StatusBadge status={lead.status} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Lead Score
                  </p>
                  <ScoreBar score={lead.score} />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 h-8"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 h-8"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              {editingLead ? "Edit Lead" : "Add New Lead"}
            </SheetTitle>
          </SheetHeader>
          <LeadForm
            initialData={editingLead}
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
