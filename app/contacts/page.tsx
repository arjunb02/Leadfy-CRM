"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ContactForm } from "@/components/crm/forms/contact-form";
import { toast } from "sonner";

const contacts = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    role: "Account Manager",
    avatar: "SC",
    tag: "Customer",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "mrodriguez@techstartup.io",
    phone: "+1 (555) 234-5678",
    company: "TechStartup",
    role: "CTO",
    avatar: "MR",
    tag: "Prospect",
  },
  {
    id: "3",
    name: "Emily Watson",
    email: "emily@innovatetech.com",
    phone: "+1 (555) 345-6789",
    company: "InnovateTech",
    role: "CEO",
    avatar: "EW",
    tag: "Lead",
  },
  {
    id: "4",
    name: "David Kumar",
    email: "dkumar@globalventures.com",
    phone: "+1 (555) 456-7890",
    company: "Global Ventures",
    role: "VP Sales",
    avatar: "DK",
    tag: "Prospect",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jmartinez@fintech.io",
    phone: "+1 (555) 567-8901",
    company: "FinTech Solutions",
    role: "CFO",
    avatar: "JM",
    tag: "Customer",
  },
  {
    id: "6",
    name: "Alex Thompson",
    email: "alex@cloudservices.com",
    phone: "+1 (555) 678-9012",
    company: "Cloud Services",
    role: "Director",
    avatar: "AT",
    tag: "Lead",
  },
  {
    id: "7",
    name: "Laura Kim",
    email: "laura@enterprise.io",
    phone: "+1 (555) 789-0123",
    company: "Enterprise IO",
    role: "COO",
    avatar: "LK",
    tag: "Customer",
  },
  {
    id: "8",
    name: "James Carter",
    email: "jcarter@datapro.com",
    phone: "+1 (555) 890-1234",
    company: "DataPro",
    role: "Head of IT",
    avatar: "JC",
    tag: "Prospect",
  },
];

const tagColors: Record<string, string> = {
  Customer: "bg-green-500/10 text-green-700 dark:text-green-400",
  Prospect: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Lead: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
};

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  const handleAdd = () => {
    setEditingContact(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setIsSheetOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("Contact submitted:", data);
    toast.success(
      editingContact
        ? "Contact updated successfully"
        : "Contact created successfully",
    );
    setIsSheetOpen(false);
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout
      title="Contacts"
      subtitle="Manage your business contacts"
      actions={
        <>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none h-9"
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none h-9"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-2" onClick={handleAdd}>
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </>
      }
    >
      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((contact) => (
            <Card
              key={contact.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6 pb-4">
                <div className="flex flex-col items-center text-center gap-3">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="text-sm font-semibold">
                      {contact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contact.company}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[contact.tag]}`}
                  >
                    {contact.tag}
                  </span>
                  <div className="w-full space-y-1 text-xs text-muted-foreground">
                    <p className="truncate">{contact.email}</p>
                    <p>{contact.phone}</p>
                  </div>
                  <div className="flex gap-2 w-full pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 h-8"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 h-8"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(contact)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className="text-xs">
                              {contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {contact.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {contact.company}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {contact.role}
                      </TableCell>
                      <TableCell className="text-sm">{contact.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[contact.tag]}`}
                        >
                          {contact.tag}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
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
                              <DropdownMenuItem onClick={() => {}}>
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(contact)}
                              >
                                Edit
                              </DropdownMenuItem>
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

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((contact) => (
                <div key={contact.id} className="p-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarFallback className="text-sm">
                      {contact.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.role} · {contact.company}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${tagColors[contact.tag]}`}
                    >
                      {contact.tag}
                    </span>
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
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(contact)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </SheetTitle>
          </SheetHeader>
          <ContactForm
            initialData={editingContact}
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
