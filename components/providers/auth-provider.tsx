"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: {
    name: string;
    permissions: Array<{
      moduleName: string;
      canView: boolean;
      canCreate: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }>;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (
    module: string,
    action: "view" | "create" | "edit" | "delete",
  ) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = apiClient.getToken();
      if (!token) {
        setIsLoading(false);
        if (pathname !== "/login") {
          router.push("/login"); // Redirect to login if unauthenticated on app route
        }
        return;
      }

      // Handle Hardcoded Admin bypass
      if (token === "mock-jwt-token-admin-123") {
        setUser({
          id: "mock-admin-id-001",
          name: "System Admin",
          email: "admin@crm.com",
          roleId: "mock-admin-role-id",
          role: {
            name: "Admin",
            permissions: [],
          },
        });
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiClient.get<{ user: User }>("/api/auth/me");
        setUser(data.user);
      } catch (error) {
        console.error("Failed to authenticate token", error);
        apiClient.removeToken();
        setUser(null);
        if (pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const login = (token: string, userData: User) => {
    apiClient.setToken(token);
    setUser(userData);
    router.push("/");
  };

  const logout = () => {
    apiClient.removeToken();
    setUser(null);
    router.push("/login");
  };

  const hasPermission = (
    module: string,
    action: "view" | "create" | "edit" | "delete",
  ) => {
    if (!user) return false;

    // Admin implicit override check (matches backend)
    if (user.role.name === "Admin") return true;

    const modPerms = user.role.permissions?.find(
      (p) => p.moduleName === module,
    );
    if (!modPerms) return false;

    switch (action) {
      case "view":
        return modPerms.canView;
      case "create":
        return modPerms.canCreate;
      case "edit":
        return modPerms.canEdit;
      case "delete":
        return modPerms.canDelete;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
