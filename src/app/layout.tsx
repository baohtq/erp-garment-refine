import React from "react";
import { Metadata } from "next";
import "@styles/global.css";

export const metadata: Metadata = {
  title: "ERP Quản Lý Sản Xuất May Mặc",
  description: "Hệ thống quản lý hoạt động sản xuất may mặc",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
