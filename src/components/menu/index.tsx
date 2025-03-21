"use client";

import { useLogout, useMenu } from "@refinedev/core";
import Link from "next/link";
import { useState, useEffect } from "react";

export const Menu = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  
  try {
    const { menuItems, selectedKey } = useMenu();
    const { mutate: logoutMutate } = useLogout();
    
    useEffect(() => {
      if (menuItems) {
        setItems(menuItems || []);
        setSelected(selectedKey);
        setError(false);
      }
    }, [menuItems, selectedKey]);
    
    return (
      <nav className="menu">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.route ?? "/"}
                className={`flex items-center px-3 py-2 text-sm rounded hover:bg-gray-700 ${
                  selected === item.key ? "bg-gray-700 text-white" : "text-gray-300"
                }`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => logoutMutate && logoutMutate()}
          className="flex items-center gap-2 w-full mt-4 px-3 py-2 text-red-400 hover:bg-gray-700 rounded text-left text-sm"
        >
          <span>Logout</span>
        </button>
      </nav>
    );
  } catch (err) {
    console.error("Error in Menu component:", err);
    
    return (
      <nav className="menu error">
        <div className="p-4 text-amber-300">
          <p>Đang tải menu...</p>
          <p className="text-xs mt-2">
            (Không thể tải menu từ Refine. Thử làm mới trang hoặc kiểm tra kết nối cơ sở dữ liệu.)
          </p>
          <div className="mt-4 space-y-1">
            <Link href="/" 
              className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
              Tổng quan
            </Link>
            <Link href="/(protected)/orders"
              className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
              Quản lý đơn hàng
            </Link>
            <Link href="/(protected)/products"
              className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
              Quản lý sản phẩm
            </Link>
            <Link href="/(protected)/materials"
              className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
              Quản lý nguyên liệu
            </Link>
            <Link href="/(protected)/production"
              className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
              Quản lý sản xuất
            </Link>
          </div>
        </div>
      </nav>
    );
  }
};
