"use client";

import React from "react";
import { ThemeProvider } from '@/providers/theme';
import { AuthProvider } from '@/providers/auth';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
} 