"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";
import { ClientAuth } from "./ClientAuth";
import { ClientMain } from "./ClientMain";
import { RefineLayout } from "./RefineLayout";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [canRenderMenu, setCanRenderMenu] = useState(false);
  const [useRefineLayout, setUseRefineLayout] = useState(true); // Default to Refine layout

  useEffect(() => {
    // Chỉ render menu ở phía client sau khi hydrate
    setCanRenderMenu(true);
    
    // Đọc cài đặt từ localStorage (nếu có)
    const savedLayoutPref = localStorage.getItem('useRefineLayout');
    if (savedLayoutPref !== null) {
      setUseRefineLayout(savedLayoutPref === 'true');
    }
  }, []);

  // Lưu cài đặt layout khi thay đổi
  useEffect(() => {
    if (canRenderMenu) {
      localStorage.setItem('useRefineLayout', String(useRefineLayout));
    }
  }, [useRefineLayout, canRenderMenu]);

  // Sử dụng Refine Layout
  if (useRefineLayout && canRenderMenu) {
    return <RefineLayout>{children}</RefineLayout>;
  }

  // Sử dụng layout tự tạo cũ (legacy layout)
  return (
    <div className="layout">
      {canRenderMenu ? (
        <div className="menu-container">
          <Menu />
          <button 
            onClick={() => setUseRefineLayout(true)}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md text-xs"
          >
            Chuyển sang Refine UI
          </button>
        </div>
      ) : (
        <div className="menu-placeholder">
          {/* Placeholder cho menu khi chưa sẵn sàng */}
        </div>
      )}
      <div className="content">
        <Breadcrumb />
        <div>{children}</div>
      </div>
    </div>
  );
};

export { ClientAuth, ClientMain };
