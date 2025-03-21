"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Sử dụng dynamic import để không gây ra lỗi SSR
const ReactQueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then(d => d.ReactQueryDevtools),
  { ssr: false }
);

export const DevtoolsPanel: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Chỉ hiển thị trong môi trường development và client-side
  if (process.env.NODE_ENV !== "development" || !isClient) {
    return null;
  }
  
  return (
    // Khi đã đảm bảo là client-side, render ReactQueryDevtools
    <ReactQueryDevtools />
  );
}; 