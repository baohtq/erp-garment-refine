"use client";

import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { dataProvider } from "@/providers/data-provider";
import { authProvider } from "@/providers/auth-provider";
import { notificationProvider } from "@/providers/notification-provider";

import { ClientAuth, ClientMain } from "@/components/layout";
import { DevtoolsPanel } from "@/components/devtools-panel";

import routerProvider from "@/providers/router-provider";
import { resources } from "./resources";

interface RefineClientProps {
  children: React.ReactNode;
}

export function RefineClient({ children }: RefineClientProps) {
  // Tạo QueryClient trong component để tránh shared state giữa các requests
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  // Dev mode check
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <QueryClientProvider client={queryClient}>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider}
          notificationProvider={notificationProvider}
          authProvider={authProvider}
          routerProvider={routerProvider}
          resources={resources}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: "ErP-Garment-1",
            disableTelemetry: true,
          }}
        >
          <RefineKbar />
          <ClientAuth>
            {isDevelopment ? (
              <ClientMain>{children}</ClientMain>
            ) : (
              <Authenticated
                key="authenticated"
                fallback={<div>Đang chuyển hướng...</div>}
                loading={<div>Đang kiểm tra xác thực...</div>}
              >
                <ClientMain>{children}</ClientMain>
              </Authenticated>
            )}
          </ClientAuth>
        </Refine>
      </RefineKbarProvider>
      {/* DevtoolsPanel được đặt bên ngoài Refine nhưng vẫn trong QueryClientProvider */}
      <DevtoolsPanel />
    </QueryClientProvider>
  );
} 