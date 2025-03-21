"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";

interface ClientMainProps {
  children: React.ReactNode;
}

export const ClientMain: React.FC<ClientMainProps> = ({ children }) => {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}; 