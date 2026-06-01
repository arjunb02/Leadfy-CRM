"use client";

import {
  Plus,
  Search,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  MoreHorizontal,
  MapPin,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { AccountForm } from "@/components/crm/forms/account-form";
import { toast } from "sonner";

const accounts = [
  {
    id: "1",
    name: "Acme Corporation",
    industry: "Technology",
    size: "Enterprise",
    location: "San Francisco, CA",
    website: "acme.com",
    contacts: 8,
    deals: 3,
    revenue: "$145,000",
    health: 85,
    avatar: "AC",
    status: "Active",
  },
  {
    id: "2",
    name: "TechStartup Inc",
    industry: "SaaS",
    size: "SMB",
    location: "Austin, TX",
    website: "techstartup.io",
    contacts: 3,
    deals: 1,
    revenue: "$78,000",
    health: 72,
    avatar: "TS",
    status: "Active",
  },
  {
    id: "3",
    name: "Global Ventures",
    industry: "Finance",
    size: "Enterprise",
    location: "New York, NY",
    website: "globalventures.com",
    contacts: 12,
    deals: 5,
    revenue: "$320,000",
    health: 91,
    avatar: "GV",
    status: "Active",
  },
  {
    id: "4",
    name: "InnovateTech",
    industry: "Healthcare",
    size: "Mid-Market",
    location: "Boston, MA",
    website: "innovatetech.com",
    contacts: 5,
    deals: 2,
    revenue: "$65,000",
    health: 60,
    avatar: "IT",
    status: "At Risk",
  },
  {
    id: "5",
    name: "RetailCo",
    industry: "Retail",
    size: "Mid-Market",
    location: "Chicago, IL",
    website: "retailco.com",
    contacts: 4,
    deals: 1,
    revenue: "$32,000",
    health: 45,
    avatar: "RC",
    status: "At Risk",
  },
  {
    id: "6",
    name: "DataSys",
    industry: "Data",
    size: "SMB",
    location: "Seattle, WA",
    website: "datasys.io",
    contacts: 6,
    deals: 2,
    revenue: "$98,000",
    health: 78,
    avatar: "DS",
    status: "Active",
  },
];

const healthColor = (h: number) =>
  h >= 80 ? "bg-green-500" : h >= 60 ? "bg-yellow-500" : "bg-red-400";

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const handleAdd = () => {
    setEditingAccount(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("Account submitted:", data);
    toast.success(
      editingAccount
        ? "Account updated successfully"
        : "Account created successfully",
    );
    setIsSheetOpen(false);
  };

  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout
      title="Accounts"
      subtitle="Manage your company accounts"
      actions={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="w-4 h-4" /> Add Account
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Accounts",
            value: "156",
            icon: <Building2 className="w-5 h-5" />,
          },
          {
            label: "Total Contacts",
            value: "1,248",
            icon: <Users className="w-5 h-5" />,
          },
          {
            label: "Total Revenue",
            value: "$2.4M",
            icon: <DollarSign className="w-5 h-5" />,
          },
          {
            label: "Avg Health Score",
            value: "72",
            icon: <TrendingUp className="w-5 h-5" />,
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <div className="text-primary">{s.icon}</div>
              </div>
              <p className="text-xl md:text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted"
          />
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-sm font-semibold">
                      {account.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{account.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.industry} · {account.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      account.status === "Active" ? "default" : "destructive"
                    }
                    className="text-xs"
                  >
                    {account.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        View Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(account)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {account.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 shrink-0" /> {account.website}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {[
                  { label: "Contacts", value: account.contacts },
                  { label: "Deals", value: account.deals },
                  { label: "Revenue", value: account.revenue },
                ].map((s) => (
                  <div key={s.label} className="bg-muted rounded-lg p-2">
                    <p className="text-xs font-semibold truncate">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Account Health
                  </span>
                  <span className="text-xs font-semibold">
                    {account.health}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${healthColor(account.health)}`}
                    style={{ width: `${account.health}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              {editingAccount ? "Edit Account" : "Add New Account"}
            </SheetTitle>
          </SheetHeader>
          <AccountForm
            initialData={editingAccount}
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
