"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/crm/status-badge";
import { PageLayout } from "@/components/crm/page-layout";
import { UserForm } from "@/components/crm/forms/user-form";
import { toast } from "sonner";

const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@crm.com",
    role: "Admin",
    status: "active" as const,
    avatar: "AU",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Alex Sales",
    email: "sales@crm.com",
    role: "Sales Executive",
    status: "active" as const,
    avatar: "AS",
    lastActive: "2 hours ago",
  },
  {
    id: "3",
    name: "Sarah Support",
    email: "support@crm.com",
    role: "Support Agent",
    status: "inactive" as const,
    avatar: "SS",
    lastActive: "1 week ago",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleAdd = () => {
    setEditingUser(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("User submitted:", data);
    toast.success(
      editingUser ? "User updated successfully" : "User created successfully",
    );
    setIsSheetOpen(false);
  };

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout
      title="Users"
      subtitle="Manage system users and access"
      actions={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="w-4 h-4" /> Add User
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCog className="w-5 h-5 text-muted-foreground" /> All Users
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </TableCell>
                    <TableCell className="text-right">
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
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            {user.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </SheetTitle>
          </SheetHeader>
          <UserForm
            initialData={editingUser}
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
