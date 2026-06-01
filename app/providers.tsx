"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
