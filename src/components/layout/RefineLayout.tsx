"use client";

import React from "react";
import { useLogout } from "@refinedev/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { Menu } from "@/components/menu";

// Thay thế các imports từ thư viện khác bằng icons tự tạo
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@/components/icons';

// Layout components tạm thời để thay thế
const ThemedLayoutV2: React.FC<{
  children: React.ReactNode;
  Header?: React.FC;
  Sider?: React.FC;
}> = ({ children, Header, Sider }) => {
  return (
    <div className="flex min-h-screen">
      {Sider && <div className="w-64 bg-gray-800 text-white"><Sider /></div>}
      <div className="flex-1 flex flex-col">
        {Header && <div className="h-16 border-b"><Header /></div>}
        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

const ThemedSiderV2: React.FC<{
  Title?: React.FC;
  render?: (props: SiderRenderProps) => React.ReactNode;
}> = ({ Title, render }) => {
  return (
    <div className="h-full flex flex-col">
      {Title && <Title />}
      {render && render({
        items: <div className="px-3 py-2"><Menu /></div>,
        collapsed: false,
        setSiderCollapsed: () => {}
      })}
    </div>
  );
};

// Custom Header Component
const CustomHeader: React.FC = () => {
  const { mutate: logout } = useLogout();
  const { isAdmin } = useUserRole();
  
  return (
    <header className="flex justify-end items-center px-6 h-16 bg-white">
      <div className="flex gap-2">
        <Link href="/(protected)/profile">
          <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
            <UserOutlined />
            <span>Tài khoản</span>
          </button>
        </Link>
        {isAdmin && (
          <Link href="/(protected)/settings">
            <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Cài đặt hệ thống
            </button>
          </Link>
        )}
        <button 
          className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
          onClick={() => logout()}
        >
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

// Custom Sider interface 
interface SiderRenderProps {
  items: React.ReactNode;
  collapsed: boolean;
  setSiderCollapsed: (collapsed: boolean) => void;
}

// Custom Sider
const CustomSider: React.FC = () => {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  
  return (
    <ThemedSiderV2
      Title={() => <div className="p-4 text-xl font-bold text-white">ERP Garment</div>}
      render={({ items, collapsed, setSiderCollapsed }: SiderRenderProps) => {
        return (
          <>
            {/* Top menu items */}
            <div className="py-3">
              {items}
            </div>
            
            {/* Footer với nút logout */}
            <div className="mt-auto border-t border-gray-700 p-3">
              <button 
                className="flex items-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-gray-700 rounded text-left"
                onClick={() => logout()}
              >
                <LogoutOutlined />
                {!collapsed && <span>Đăng xuất</span>}
              </button>
            </div>
          </>
        );
      }}
    />
  );
};

export const RefineLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <ThemedLayoutV2
      Header={CustomHeader}
      Sider={CustomSider}
    >
      {children}
    </ThemedLayoutV2>
  );
}; 