"use client";

import React from "react";
import { ThemeProvider } from '@/providers/theme';
import { AuthProvider } from '@/providers/auth';
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "./query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </QueryClientProvider>
  );
} 