"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Briefcase,
  Settings,
  HelpCircle,
  Contact2,
  Building2,
  CheckSquare,
  Calendar,
  Mail,
  FileText,
  Zap,
  TicketIcon,
  BookOpen,
  UserCog,
  Shield,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <BarChart3 className="w-5 h-5" />, label: "Dashboard", href: "/" },
  { icon: <Users className="w-5 h-5" />, label: "Leads", href: "/leads" },
  {
    icon: <Contact2 className="w-5 h-5" />,
    label: "Contacts",
    href: "/contacts",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Accounts",
    href: "/accounts",
  },
  { icon: <Briefcase className="w-5 h-5" />, label: "Deals", href: "/deals" },
  { icon: <CheckSquare className="w-5 h-5" />, label: "Tasks", href: "/tasks" },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: "Calendar",
    href: "/calendar",
  },
  { icon: <Mail className="w-5 h-5" />, label: "Emails", href: "/emails" },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Reports",
    href: "/reports",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Documents",
    href: "/documents",
  },
  {
    icon: <TicketIcon className="w-5 h-5" />,
    label: "Support Tickets",
    href: "/tickets",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Automation",
    href: "/automation",
  },
  { icon: <UserCog className="w-5 h-5" />, label: "Users", href: "/users" },
  { icon: <Shield className="w-5 h-5" />, label: "Roles", href: "/roles" },
  {
    icon: <Key className="w-5 h-5" />,
    label: "Permissions",
    href: "/permissions",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
        <div className="text-sidebar-foreground font-bold text-lg">Leadfy-CRM</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
          "md:relative md:translate-x-0 md:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-20" : "w-64",
          "pt-16 md:pt-0 flex flex-col",
        )}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-sidebar-border shrink-0">
          <h1
            className={cn(
              "font-bold text-sidebar-foreground transition-all",
              isCollapsed ? "hidden" : "text-lg",
            )}
          >
            CRM
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-sidebar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap md:whitespace-normal",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "active:bg-sidebar-primary active:text-sidebar-primary-foreground",
                item.active &&
                  "bg-sidebar-primary text-sidebar-primary-foreground",
              )}
              title={isCollapsed ? item.label : ""}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer - Sticky */}
        <div className="border-t border-sidebar-border p-4 space-y-2 shrink-0">
          <Link
            href="/help"
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
            title={isCollapsed ? "Help" : ""}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-sm truncate">Help</span>}
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-sm truncate">Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Offset */}
      <div
        className={cn(
          "hidden md:block transition-all duration-300 shrink-0",
          isCollapsed ? "w-20" : "w-64",
        )}
      />
    </>
  );
}
