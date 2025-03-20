"use client";

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";

export function RefineClient({ children }: { children: React.ReactNode }) {
  return (
    <RefineKbarProvider>
      <Refine
        routerProvider={routerProvider}
        authProvider={authProviderClient}
        dataProvider={dataProvider}
        resources={[
          {
            name: "dashboard",
            list: "/",
          },
          {
            name: "suppliers",
            list: "/suppliers",
          },
          {
            name: "materials",
            list: "/materials",
          },
          {
            name: "products",
            list: "/products",
          },
          {
            name: "product-standards",
            list: "/product-standards",
          },
          {
            name: "production-orders",
            list: "/production-orders",
          },
          {
            name: "production-stages",
            list: "/production-stages",
          },
          {
            name: "production-progress",
            list: "/production-progress",
          },
          {
            name: "finished-products",
            list: "/finished-products",
          },
          {
            name: "employees",
            list: "/employees",
          },
          {
            name: "material-receipts",
            list: "/material-receipts",
          },
          {
            name: "material-issues",
            list: "/material-issues",
          },
          {
            name: "employee-productivity",
            list: "/employee-productivity",
          },
        ]}
        options={{
          syncWithLocation: true,
          disableTelemetry: true,
        }}
      >
        {children}
        <RefineKbar />
      </Refine>
    </RefineKbarProvider>
  );
} 