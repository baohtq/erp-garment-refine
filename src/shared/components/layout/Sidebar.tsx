'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';
import { SIDEBAR_WIDTH } from '@/config/constants';
import { AppMenu } from './AppMenu';

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 bg-card border-r border-border z-30 flex flex-col"
      style={{ width: `${SIDEBAR_WIDTH}px` }}
    >
      {/* Logo */}
      <div className="h-16 border-b border-border flex items-center justify-center">
        <h1 className="text-xl font-bold gradient-heading">ERP Garment</h1>
      </div>

      {/* Navigation menu */}
      <AppMenu />

      {/* User info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            A
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
} 