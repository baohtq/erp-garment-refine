"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "react-toastify";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { UserRole } from "@/utils/supabase/constants";
import { Menu } from "@/components/menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAdmin, loading, role } = useUserRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCustomMenu, setShowCustomMenu] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Tự động đóng sidebar khi ở màn hình nhỏ
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Khởi tạo
    handleResize();

    // Đăng ký sự kiện
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Đóng menu di động khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Kiểm tra menu nào đang active
  const isActiveMenu = (path: string): boolean => {
    if (path === "/") {
      return pathname === path;
    }
    // Xử lý đường dẫn đặc biệt với /(protected)
    if (path.startsWith("/(protected)/")) {
      return pathname.includes(path.substring(12)); // Loại bỏ "/(protected)/" để so sánh
    }
    return pathname.startsWith(path);
  };

  const logout = async () => {
    try {
      await supabaseBrowserClient.auth.signOut();
      // Xóa token và thông tin người dùng từ localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow md:left-0 md:pl-4 lg:pl-64">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none md:hidden"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 hidden rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none md:block"
          >
            {isSidebarOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <h1 className="text-xl font-bold text-gray-900">ERP Garment</h1>
          
          {/* Toggle menu button */}
          <button 
            onClick={() => setShowCustomMenu(!showCustomMenu)}
            className="ml-4 rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          >
            <span className="text-xs">
              {showCustomMenu ? 'Dùng Menu Refine' : 'Dùng Menu Custom'}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="flex items-center rounded-full bg-gray-100 p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Mở menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <Link
                  href="/(protected)/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tài khoản
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/(protected)/users"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Quản lý người dùng
                    </Link>
                    <Link
                      href="/(protected)/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt hệ thống
                    </Link>
                  </>
                )}
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-20 w-64 transform bg-gray-800 pt-16 transition-transform duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full overflow-y-auto px-3 py-4 scrollbar-thin">
          {!showCustomMenu ? (
            // Menu de Refine
            <div className="refine-menu text-gray-300">
              <Menu />
            </div>
          ) : (
            // Menu personalizado
            <div className="space-y-2">
              {/* Dashboard */}
              <Link
                href="/"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Tổng quan</span>
              </Link>

              {/* Quản lý đơn hàng */}
              <Link
                href="/(protected)/orders"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/orders")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>Quản lý đơn hàng</span>
              </Link>

              {/* Quản lý sản xuất */}
              <Link
                href="/(protected)/production"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/production")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                <span>Sản xuất</span>
              </Link>

              {/* Quản lý nguyên vật liệu */}
              <Link
                href="/(protected)/materials"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/materials")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span>Quản lý nguyên vật liệu</span>
              </Link>

              {/* Nhân viên */}
              <Link
                href="/(protected)/employees"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/employees")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Nhân viên</span>
              </Link>

              {/* Quản lý kho */}
              <Link
                href="/(protected)/inventory"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/inventory")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                <span>Quản lý kho</span>
              </Link>

              {/* Quản lý chất lượng */}
              <Link
                href="/(protected)/quality"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/quality")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>Quản lý chất lượng</span>
              </Link>

              {/* Báo cáo */}
              <Link
                href="/(protected)/reports"
                className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                  isActiveMenu("/(protected)/reports")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Báo cáo</span>
              </Link>

              {/* System Management - Chỉ hiển thị cho admin */}
              {!loading && isAdmin && (
                <div className="sidebar-section mt-4">
                  <h3 className="sidebar-heading text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Quản lý hệ thống
                  </h3>
                  
                  {/* User Management */}
                  <Link
                    href="/(protected)/users"
                    className={`mt-2 flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      isActiveMenu("/(protected)/users")
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span>Quản lý người dùng</span>
                  </Link>

                  {/* Settings */}
                  <Link
                    href="/(protected)/settings"
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      isActiveMenu("/(protected)/settings")
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Cài đặt hệ thống</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* Logout - Hiển thị ở cuối */}
          <div className="sidebar-section mt-4">
            <button
              onClick={logout}
              className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <svg
                className="mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop when sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <div className="container mx-auto p-4">{children}</div>
      </main>
    </div>
  );
} 