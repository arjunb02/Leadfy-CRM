"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RoleForm } from "@/components/crm/forms/role-form";
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
import { PageLayout } from "@/components/crm/page-layout";
import { toast } from "sonner";

const mockRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access including security and billing",
    usersCount: 2,
    isSystem: true,
  },
  {
    id: "2",
    name: "Sales Manager",
    description: "Can view all leads, manage team deals and reporting",
    usersCount: 4,
    isSystem: false,
  },
  {
    id: "3",
    name: "Sales Executive",
    description: "Manages own leads and deals pipeline",
    usersCount: 18,
    isSystem: false,
  },
  {
    id: "4",
    name: "Support Agent",
    description: "Handles customer support tickets and contact viewing",
    usersCount: 8,
    isSystem: false,
  },
];

export default function RolesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const handleAdd = () => {
    setEditingRole(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("Role submitted:", data);
    toast.success(
      editingRole ? "Role updated successfully" : "Role created successfully",
    );
    setIsSheetOpen(false);
  };

  return (
    <PageLayout
      title="Roles"
      subtitle="Define user roles and group assignments"
      actions={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <Plus className="w-4 h-4" /> Create Role
        </Button>
      }
    >
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" /> Defined Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Role Name</TableHead>
                  <TableHead className="w-1/2">Description</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {role.name}
                      {role.isSystem && (
                        <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-normal">
                          System Default
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role.description}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Users className="w-3 h-3" /> {role.usersCount}
                      </div>
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
                          <DropdownMenuItem onClick={() => handleEdit(role)}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>View permissions</DropdownMenuItem>
                          {!role.isSystem && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Role
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              {editingRole ? "Edit Role" : "Add New Role"}
            </SheetTitle>
          </SheetHeader>
          <RoleForm
            initialData={editingRole}
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
