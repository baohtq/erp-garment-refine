import { ClientMain } from "@/components/layout";
import { authProviderServer } from "@/providers/auth-provider/auth-provider.server";
import { redirect } from "next/navigation";
import React from "react";

// Biến cờ để kích hoạt chế độ demo, không yêu cầu xác thực
const BYPASS_AUTH_FOR_DEMO = true;

export default async function ProtectedLayout({ children }: React.PropsWithChildren) {
  if (BYPASS_AUTH_FOR_DEMO) {
    console.log("Authentication bypassed for demo mode in (protected) layout");
    return <ClientMain>{children}</ClientMain>;
  }

  // Kiểm tra xác thực server-side nếu không ở chế độ demo
  const { authenticated, redirectTo } = await authProviderServer.check();

  if (!authenticated) {
    return redirect(redirectTo || "/login");
  }

  return <ClientMain>{children}</ClientMain>;
} 