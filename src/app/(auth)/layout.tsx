'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/shared/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="ERP Garment Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-xl hidden md:inline-block">
              ERP Garment
            </span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Toggle Theme" 
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-muted/40">
        <div className="container max-w-lg py-10">
          {children}
        </div>
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ERP Garment. Bản quyền thuộc về Công ty TNHH ABC.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Điều khoản
            </Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Bảo mật
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 