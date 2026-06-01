"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Inbox,
  Send,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageLayout } from "@/components/crm/page-layout";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ComposeForm } from "@/components/crm/forms/compose-form";

const emails = [
  {
    id: "1",
    from: "Sarah Chen",
    email: "sarah.chen@acme.com",
    avatar: "SC",
    subject: "Re: Website Redesign Proposal",
    preview:
      "Hi, I reviewed the proposal and I think we should schedule a call to discuss the timeline and resources needed. I have a few concerns about the budget allocation...",
    body: `Hi,\n\nI reviewed the proposal and I think we should schedule a call to discuss the timeline and resources needed. I have a few concerns about the budget allocation that I'd like to address.\n\nSpecifically, I noticed the design phase is allocated only 2 weeks, which seems tight given the scope. Can we revisit that?\n\nLooking forward to your thoughts.\n\nBest regards,\nSarah Chen`,
    time: "2h ago",
    read: false,
    starred: true,
    tag: "Lead",
  },
  {
    id: "2",
    from: "Michael Rodriguez",
    email: "mrodriguez@techstartup.io",
    avatar: "MR",
    subject: "Contract Review - TechStartup",
    preview:
      "Thank you for sending over the contract. Our legal team will review by Friday and get back to you with any requested changes...",
    body: `Hi,\n\nThank you for sending over the contract. Our legal team will review by Friday and get back to you with any requested changes.\n\nOne quick note — please ensure the SLA clauses in Section 4 are updated to reflect the new response times we discussed.\n\nThanks,\nMichael Rodriguez`,
    time: "4h ago",
    read: false,
    starred: false,
    tag: "Deal",
  },
  {
    id: "3",
    from: "Emily Watson",
    email: "emily@innovatetech.com",
    avatar: "EW",
    subject: "Follow-up from our meeting",
    preview:
      "Great meeting yesterday! As discussed, I'm attaching the RFP document for your review...",
    body: `Hi,\n\nGreat meeting yesterday! As discussed, I'm attaching the RFP document for your review.\n\nPlease let me know if you have any questions or if any clarifications are needed. We'd love to move forward as soon as possible.\n\nBest,\nEmily Watson`,
    time: "Yesterday",
    read: true,
    starred: false,
    tag: "Contact",
  },
  {
    id: "4",
    from: "David Kumar",
    email: "dkumar@globalventures.com",
    avatar: "DK",
    subject: "Budget Approval - Q2 2026",
    preview:
      "I'm happy to inform you that we've received budget approval for the project. Please proceed with the next steps...",
    body: `Hi,\n\nI'm happy to inform you that we've received budget approval for the Q2 2026 project. Please proceed with the next steps as outlined in the project plan.\n\nWe're excited to kick things off. Let's schedule a kickoff call next week.\n\nBest regards,\nDavid Kumar`,
    time: "Yesterday",
    read: true,
    starred: true,
    tag: "Deal",
  },
  {
    id: "5",
    from: "Jessica Martinez",
    email: "jmartinez@fintech.io",
    avatar: "JM",
    subject: "Checking in on proposal",
    preview: "Hi, just wanted to check in on the proposal I sent last week...",
    body: `Hi,\n\nJust wanted to check in on the proposal I sent last week. Let me know if you need any additional information or have any questions.\n\nI'm available for a call anytime this week.\n\nBest,\nJessica Martinez`,
    time: "Mar 9",
    read: true,
    starred: false,
    tag: "Lead",
  },
  {
    id: "6",
    from: "Alex Thompson",
    email: "alex@cloudservices.com",
    avatar: "AT",
    subject: "New partnership opportunity",
    preview:
      "I wanted to reach out regarding a potential partnership that could benefit both of our organizations...",
    body: `Hi,\n\nI wanted to reach out regarding a potential partnership that could benefit both of our organizations.\n\nWe've been following your company's growth and believe there's a strong alignment between our offerings. Would love to explore this further.\n\nLet me know if you'd be open to a call.\n\nBest,\nAlex Thompson`,
    time: "Mar 8",
    read: true,
    starred: false,
    tag: "Lead",
  },
];

const folders = [
  { label: "Inbox", icon: <Inbox className="w-4 h-4" />, count: 24 },
  { label: "Sent", icon: <Send className="w-4 h-4" />, count: 0 },
  { label: "Drafts", icon: <FileText className="w-4 h-4" />, count: 3 },
  { label: "Spam", icon: <AlertCircle className="w-4 h-4" />, count: 2 },
  { label: "Archive", icon: <Archive className="w-4 h-4" />, count: 0 },
  { label: "Trash", icon: <Trash2 className="w-4 h-4" />, count: 0 },
];

const tagColors: Record<string, string> = {
  Lead: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  Deal: "bg-green-500/10 text-green-700 dark:text-green-400",
  Contact: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

export default function EmailsPage() {
  const [selected, setSelected] = useState<string | null>("1");
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [search, setSearch] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>(
    Object.fromEntries(emails.map((e) => [e.id, e.starred])),
  );

  const filtered = emails.filter(
    (e) =>
      e.from.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedEmail = emails.find((e) => e.id === selected);

  const toggleStar = (id: string) => {
    setStarredMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageLayout
      title="Emails"
      subtitle="Manage your CRM communications"
      actions={
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsComposeOpen(true)}
        >
          <Plus className="w-4 h-4" /> Compose
        </Button>
      }
    >
      {/* Main Email Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_2fr] gap-4 h-[calc(100vh-240px)] min-h-[520px]">
        {/* Folder Sidebar */}
        <div className="hidden lg:flex flex-col gap-0.5">
          {folders.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFolder(f.label)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors w-full text-left",
                activeFolder === f.label
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-2.5">
                {f.icon}
                {f.label}
              </span>
              {f.count > 0 && (
                <Badge
                  variant={activeFolder === f.label ? "secondary" : "default"}
                  className="text-xs h-5 px-1.5 min-w-[20px] justify-center"
                >
                  {f.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Email List */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border flex items-center gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-muted h-8 text-xs"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <Inbox className="w-10 h-10 mb-3 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">
                    No emails found
                  </p>
                </div>
              ) : (
                filtered.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelected(email.id)}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                      selected === email.id && "bg-muted",
                      !email.read && "border-l-2 border-primary pl-[10px]",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                          {email.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs truncate",
                            !email.read
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {email.from}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {email.time}
                        </p>
                      </div>
                      {starredMap[email.id] && (
                        <Star
                          className="w-3 h-3 text-yellow-500 shrink-0"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate mb-1",
                        !email.read
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {email.subject}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {email.preview}
                    </p>
                    {email.tag && (
                      <span
                        className={`mt-1.5 inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${tagColors[email.tag]}`}
                      >
                        {email.tag}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Email Detail */}
        <Card className="flex flex-col overflow-hidden">
          {selectedEmail ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border shrink-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="font-semibold text-sm leading-snug flex-1">
                    {selectedEmail.subject}
                  </h2>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => toggleStar(selectedEmail.id)}
                      title="Star"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          starredMap[selectedEmail.id]
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground",
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
                        <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                        <DropdownMenuItem>Add to CRM</DropdownMenuItem>
                        <DropdownMenuItem>Create Task</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Block Sender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Sender info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                      {selectedEmail.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{selectedEmail.from}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedEmail.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {selectedEmail.time}
                    </span>
                    {selectedEmail.tag && (
                      <div
                        className={`mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-block ${tagColors[selectedEmail.tag]}`}
                      >
                        {selectedEmail.tag}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <ScrollArea className="flex-1 p-4">
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {selectedEmail.body}
                </div>
              </ScrollArea>

              {/* Actions */}
              <div className="p-4 border-t border-border flex gap-2 shrink-0">
                <Button size="sm" className="gap-2">
                  <Reply className="w-4 h-4" /> Reply
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Forward className="w-4 h-4" /> Forward
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No email selected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click an email to read it
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Sheet */}
      <Sheet open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-lg">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>New Message</SheetTitle>
          </SheetHeader>
          <ComposeForm onClose={() => setIsComposeOpen(false)} />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
