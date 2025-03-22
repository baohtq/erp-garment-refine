'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/theme';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '@/config/constants';
import { cn } from '@/shared/utils/cn';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <header
      className="fixed top-0 right-0 h-16 border-b border-border bg-background z-20 flex items-center justify-between px-6"
      style={{
        left: `${SIDEBAR_WIDTH}px`,
        height: `${TOPBAR_HEIGHT}px`,
      }}
    >
      {/* Left section - Breadcrumb or Page title */}
      <div className="flex items-center">
        <h2 className="text-lg font-medium">Dashboard</h2>
      </div>

      {/* Right section - Actions and user menu */}
      <div className="flex items-center space-x-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-accent relative"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* Help */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-accent"
          aria-label="Help"
        >
          ?
        </button>

        {/* Profile dropdown - simplified */}
        <div className="relative">
          <button className="flex items-center space-x-2 hover:bg-accent rounded-md px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              A
            </div>
            <span className="font-medium text-sm hidden md:inline-block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
} 