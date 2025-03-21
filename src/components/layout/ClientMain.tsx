"use client";

import React from "react";
import { Layout } from "./index";

interface ClientMainProps {
  children: React.ReactNode;
}

export const ClientMain: React.FC<ClientMainProps> = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
}; 