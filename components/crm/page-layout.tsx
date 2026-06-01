"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/providers/auth-provider";
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
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  UserCog,
  Shield,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
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

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageLayout({
  children,
  title,
  subtitle,
  actions,
}: PageLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout, hasPermission } = useAuth();

  // Filter navigation items based on user role permissions
  const authorizedNavItems = navItems.filter((item) => {
    if (item.label === "Dashboard") return true;
    if (item.label === "Support Tickets")
      return hasPermission("Tickets", "view");
    return hasPermission(item.label, "view");
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-4 h-14 flex items-center justify-between">
        <div className="text-sidebar-foreground font-bold text-lg">CRM</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col",
          "md:translate-x-0",
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0",
          isCollapsed ? "md:w-20" : "md:w-64",
          "pt-14 md:pt-0",
        )}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center justify-between px-5 py-4 border-b border-sidebar-border shrink-0 h-16">
          {!isCollapsed && (
            <h1 className="font-bold text-sidebar-foreground text-lg">
              Leadfy-CRM
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {authorizedNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : ""}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span
                  className={cn(
                    "truncate transition-all",
                    isCollapsed ? "md:hidden" : "",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-0.5 shrink-0">
          <Link
            href="/help"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent text-sm",
              pathname === "/help" &&
                "bg-sidebar-primary text-sidebar-primary-foreground",
            )}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className={cn("truncate", isCollapsed ? "md:hidden" : "")}>
              Help
            </span>
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent text-sm",
              pathname === "/settings" &&
                "bg-sidebar-primary text-sidebar-primary-foreground",
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className={cn("truncate", isCollapsed ? "md:hidden" : "")}>
              Settings
            </span>
          </Link>
        </div>
      </aside>

      {/* Spacer for fixed sidebar on md+ */}
      <div
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
        )}
      />

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="hidden md:flex sticky top-0 z-30 bg-card border-b border-border h-16 items-center px-6 gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads, deals, companies..."
                className="pl-10 bg-muted border-border"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {/* Theme Toggle Quick Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative text-muted-foreground hover:text-foreground"
              title="Toggle theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 ring-2 ring-transparent hover:ring-primary/20 rounded-full transition-all"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://avatar.vercel.sh/user"
                      alt="User"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2.5">
                  <p className="text-sm font-semibold">
                    {user?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "loading@example.com"}
                  </p>
                  <p className="text-xs font-medium text-primary mt-1">
                    Role: {user?.role?.name || "Unknown"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="w-4 h-4" /> Profile
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="w-4 h-4" /> Settings
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                {/* Theme Selector */}
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 pt-1">
                  Appearance
                </DropdownMenuLabel>
                <div className="flex gap-1 px-2 pb-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs border transition-all",
                      theme === "light"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs border transition-all",
                      theme === "dark"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs border transition-all",
                      theme === "system"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    System
                  </button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive gap-2"
                  onClick={() => logout()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pt-[calc(3.5rem+1rem)] md:pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap gap-2 sm:shrink-0">{actions}</div>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
