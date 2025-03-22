"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { 
  User,
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth';
import { AppMenu } from '@/shared/components/layout/AppMenu';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="hidden md:flex flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">ERP Garment</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center gap-4 md:gap-2 md:justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback>
                    {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.fullName && (
                    <p className="font-medium">{user.fullName}</p>
                  )}
                  {user?.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 z-50 mt-16 w-64 border-r bg-background transition-transform md:translate-x-0 md:sticky md:top-16 md:transition-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AppMenu onItemClick={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="container flex-1 p-4 md:p-6 pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 