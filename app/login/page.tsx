"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { apiClient } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin"); // Prep-filled with admin
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded bypass as requested
    if (
      (email === "admin" || email === "admin@crm.com") &&
      password === "password"
    ) {
      toast.success("Login successful (Hardcoded Admin bypass)");
      login("mock-jwt-token-admin-123", {
        id: "mock-admin-id-001",
        name: "System Admin",
        email: "admin@crm.com",
        roleId: "mock-admin-role-id",
        role: {
          name: "Admin",
          permissions: [], // Admin implicitly passes all permission checks in AuthProvider
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<{ token: string; user: any }>(
        "/api/auth/login",
        {
          email,
          password,
        },
      );

      toast.success("Login successful");
      login(response.token, response.user);
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Leadfy-CRM</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
