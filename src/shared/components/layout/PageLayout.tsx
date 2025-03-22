'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '@/config/constants';

export interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className="bg-background"
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          marginTop: `${TOPBAR_HEIGHT}px`,
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
        }}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
} 