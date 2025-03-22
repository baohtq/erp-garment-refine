'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { resources } from '@/app/resources';
import { getIconByName } from '@/shared/utils/icons';

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  text: string;
  submenu?: { href: string; text: string; }[];
}

interface AppMenuProps {
  onItemClick?: () => void;
}

export function AppMenu({ onItemClick }: AppMenuProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Lọc các resources cấp cao nhất (không có parent)
    const topLevelResources = resources.filter(
      resource => !resource.meta?.parent
    );
    
    // Tạo items menu
    const items = topLevelResources.map(resource => {
      // Tìm các submenu (resources có parent trỏ đến resource hiện tại)
      const submenuItems = resources.filter(
        item => item.meta?.parent === resource.name
      );
      
      return {
        href: resource.list,
        icon: getIconByName(resource.meta?.icon || ''),
        text: resource.meta?.label || resource.name,
        submenu: submenuItems.length > 0 
          ? submenuItems.map(subitem => ({
              href: subitem.list,
              text: subitem.meta?.label || subitem.name
            }))
          : undefined
      } as MenuItem;
    });
    
    // Thêm dashboard vào đầu menu nếu chưa có
    if (!items.find(item => item.href === '/')) {
      items.unshift({
        href: '/',
        icon: <Home className="h-4 w-4" />,
        text: 'Tổng quan'
      } as MenuItem);
    }
    
    setMenuItems(items);
  }, []);

  const toggleSubmenu = (text: string) => {
    if (expanded === text) {
      setExpanded(null);
    } else {
      setExpanded(text);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <React.Fragment key={item.href}>
            {item.submenu ? (
              <div className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item.text)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-primary/5 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                  <span
                    className={`transform transition-transform ${
                      expanded === item.text ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {expanded === item.text && (
                  <ul className="ml-6 space-y-1">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.href}>
                        <Link
                          href={subitem.href}
                          onClick={onItemClick}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(subitem.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'hover:bg-primary/5 text-muted-foreground'
                          }`}
                        >
                          {subitem.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
                  isActive(item.href) ? 'bg-accent text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {item.icon}
                <span>{item.text}</span>
                {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
} 