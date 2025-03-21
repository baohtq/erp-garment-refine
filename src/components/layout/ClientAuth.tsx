"use client";

import React, { PropsWithChildren } from "react";

export const ClientAuth: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="auth-container">
      {children}
    </div>
  );
}; 