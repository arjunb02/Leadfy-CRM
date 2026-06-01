"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  FileText,
  File,
  Download,
  Eye,
  MoreHorizontal,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { DocForm } from "@/components/crm/forms/doc-form";
import { toast } from "sonner";

const documents = [
  {
    id: "1",
    name: "Acme Corp - Proposal v2.pdf",
    type: "PDF",
    size: "2.4 MB",
    modified: "2 hours ago",
    related: "Acme Corp",
    category: "Proposal",
  },
  {
    id: "2",
    name: "TechStartup - Contract.docx",
    type: "DOC",
    size: "1.1 MB",
    modified: "Yesterday",
    related: "TechStartup",
    category: "Contract",
  },
  {
    id: "3",
    name: "Q1 2026 Pipeline Report.xlsx",
    type: "XLS",
    size: "856 KB",
    modified: "Mar 8",
    related: "",
    category: "Report",
  },
  {
    id: "4",
    name: "Global Ventures NDA.pdf",
    type: "PDF",
    size: "340 KB",
    modified: "Mar 7",
    related: "Global Ventures",
    category: "Legal",
  },
  {
    id: "5",
    name: "Product Demo Deck.pptx",
    type: "PPT",
    size: "5.2 MB",
    modified: "Mar 5",
    related: "",
    category: "Presentation",
  },
  {
    id: "6",
    name: "FinTech - SOW Draft.docx",
    type: "DOC",
    size: "789 KB",
    modified: "Mar 4",
    related: "FinTech Solutions",
    category: "Contract",
  },
  {
    id: "7",
    name: "Company Brochure 2026.pdf",
    type: "PDF",
    size: "3.8 MB",
    modified: "Feb 28",
    related: "",
    category: "Marketing",
  },
  {
    id: "8",
    name: "Pricing Spreadsheet Q2.xlsx",
    type: "XLS",
    size: "412 KB",
    modified: "Feb 25",
    related: "",
    category: "Report",
  },
];

const folders_data = [
  { name: "Proposals", count: 12, icon: "📄" },
  { name: "Contracts", count: 8, icon: "📋" },
  { name: "Reports", count: 15, icon: "📊" },
  { name: "Templates", count: 6, icon: "🗂️" },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-500/10 text-red-600",
  DOC: "bg-blue-500/10 text-blue-600",
  XLS: "bg-green-500/10 text-green-600",
  PPT: "bg-orange-500/10 text-orange-600",
};

const categoryColors: Record<string, string> = {
  Proposal: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  Contract: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Report: "bg-green-500/10 text-green-700 dark:text-green-400",
  Legal: "bg-red-500/10 text-red-700 dark:text-red-400",
  Presentation: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  Marketing: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Document created:", data);
    toast.success(`Document "${data.name}" created successfully`);
    setIsSheetOpen(false);
  };

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.related.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout
      title="Documents"
      subtitle="Manage files and attachments"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Upload className="w-4 h-4" /> Upload
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus className="w-4 h-4" /> New Doc
          </Button>
        </>
      }
    >
      {/* Folders */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          Folders
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {folders_data.map((folder) => (
            <Card
              key={folder.name}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{folder.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {folder.count} files
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Files */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <CardTitle className="text-base">All Files</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-muted h-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Name
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Category
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Related
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Size
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Modified
                  </th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-border hover:bg-muted/30 group"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold font-mono ${typeColors[doc.type]}`}
                        >
                          {doc.type}
                        </span>
                        <span className="font-medium truncate max-w-[200px]">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[doc.category] || ""}`}
                      >
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {doc.related || "—"}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {doc.size}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {doc.modified}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Preview</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-2">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30"
              >
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold font-mono shrink-0 ${typeColors[doc.type]}`}
                >
                  {doc.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} · {doc.modified}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>New Document</SheetTitle>
          </SheetHeader>
          <DocForm
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
