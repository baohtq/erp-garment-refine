"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useEffect } from "react";

import { dataProvider } from "@/providers/data-provider";
import { authProvider } from "@/providers/auth-provider";
import { notificationProvider } from "@/providers/notification-provider";
import routerProvider from "@/providers/router-provider";
import { resources } from "./resources";

// ErrorBoundary component để bắt lỗi trong quá trình render
import { ErrorBoundary } from "@/components/error-boundary";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Custom QueryClientProvider để lấy được queryClient
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ClientRefineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (queryClient) {
      console.log("RefineClient mounted, QueryClient available:", !!queryClient);
    }
  }, [queryClient]);

  // Clear authentication data from localStorage on startup for demo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Demo mode: Clearing authentication data from localStorage");
      localStorage.removeItem('erp-garment-auth');
      localStorage.removeItem('supabase.auth.token');
    }
  }, []);

  return (
    <>
      <RefineKbarProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
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
              {children}
              <RefineKbar />
            </Refine>
          </QueryClientProvider>
        </ErrorBoundary>
      </RefineKbarProvider>
    </>
  );
} 