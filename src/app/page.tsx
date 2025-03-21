"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserRole } from "@/hooks/useUserRole";
import { supabaseBrowserClient } from "@/utils/supabase/client";

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const { isAdmin, loading, role } = useUserRole();
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<string>('Đang kiểm tra phiên đăng nhập...');

  useEffect(() => {
    setIsClient(true);
    
    // Kiểm tra session
    const checkSession = async () => {
      try {
        const { data, error } = await supabaseBrowserClient.auth.getSession();
        if (error) {
          console.error("Lỗi khi kiểm tra phiên đăng nhập:", error);
          setSessionStatus('Lỗi khi kiểm tra phiên đăng nhập');
          return;
        }
        
        if (!data.session) {
          console.log("Người dùng chưa đăng nhập");
          setSessionStatus('Chưa đăng nhập');
          window.location.href = "/login";
          return;
        }
        
        setSessionStatus('Đã đăng nhập');
      } catch (err) {
        console.error("Lỗi khi kiểm tra phiên đăng nhập:", err);
        setSessionStatus('Lỗi khi kiểm tra phiên đăng nhập');
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, []);

  if (!isClient || checkingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-lg font-medium text-gray-900">Đang tải...</p>
          <p className="mt-1 text-sm text-gray-500">{sessionStatus}</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard />
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: 47,
    lowStock: 5,
    employees: 120,
    revenue: "1.2 tỷ",
    growthPercent: 12.5,
    efficiency: 85
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Tổng quan</h1>
      
      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Đơn hàng */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Đơn hàng</p>
              <p className="text-3xl font-bold">{stats.orders}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-yellow-50 py-1 px-2">
                <p className="text-lg font-semibold text-yellow-600">5</p>
                <p className="text-xs text-yellow-600">Chờ xử lý</p>
              </div>
              <div className="rounded-md bg-blue-50 py-1 px-2">
                <p className="text-lg font-semibold text-blue-600">24</p>
                <p className="text-xs text-blue-600">Đang SX</p>
              </div>
              <div className="rounded-md bg-green-50 py-1 px-2">
                <p className="text-lg font-semibold text-green-600">18</p>
                <p className="text-xs text-green-600">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vật tư tồn kho thấp */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vật tư tồn kho thấp</p>
              <p className="text-3xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/inventory"
              className="flex items-center justify-center rounded-md bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem danh sách
            </Link>
          </div>
        </div>
        
        {/* Nhân viên */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nhân viên</p>
              <p className="text-3xl font-bold">{stats.employees}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-1 text-sm font-medium text-gray-500">Hiệu suất</p>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-500"
                style={{ width: `${stats.efficiency}%` }}
              ></div>
            </div>
            <p className="mt-1 text-right text-sm font-medium text-indigo-600">{stats.efficiency}%</p>
          </div>
        </div>
        
        {/* Doanh thu */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Doanh thu tháng</p>
              <p className="text-3xl font-bold">{stats.revenue}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="flex items-center text-sm font-medium text-gray-500">
              So với tháng trước
              <span className="ml-1 flex items-center text-green-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +{stats.growthPercent}%
              </span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Đơn hàng gần đây và tiến độ sản xuất */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Đơn hàng gần đây */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Đơn hàng sản xuất gần đây</h2>
            <Link href="/production-orders" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem tất cả
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">Mã đơn</th>
                  <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">Sản phẩm</th>
                  <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">Số lượng</th>
                  <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-sm">PO-2023-001</td>
                  <td className="py-3 text-sm">Áo sơ mi nam</td>
                  <td className="py-3 text-sm">500</td>
                  <td className="py-3 text-sm">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Đang sản xuất
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-sm">PO-2023-002</td>
                  <td className="py-3 text-sm">Quần jean nữ</td>
                  <td className="py-3 text-sm">300</td>
                  <td className="py-3 text-sm">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Hoàn thành
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-sm">PO-2023-003</td>
                  <td className="py-3 text-sm">Áo khoác mùa đông</td>
                  <td className="py-3 text-sm">200</td>
                  <td className="py-3 text-sm">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Chờ xử lý
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tạo đơn hàng mới
            </button>
          </div>
        </div>
        
        {/* Tiến độ sản xuất */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tiến độ sản xuất</h2>
            <Link href="/production-progress" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Xem chi tiết
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">PO-2023-001: Áo sơ mi nam</span>
                <span className="text-xs font-medium text-gray-500">70%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: "70%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">PO-2023-004: Váy dạ hội</span>
                <span className="text-xs font-medium text-gray-500">45%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-purple-600" style={{ width: "45%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">PO-2023-005: Áo thun in logo</span>
                <span className="text-xs font-medium text-gray-500">90%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Cập nhật tiến độ
            </button>
          </div>
        </div>
      </div>
      
      {/* Thống kê nhanh và hoạt động gần đây */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Thống kê nhanh */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Thống kê nhanh</h2>
          
          <div className="space-y-4">
            <div className="flex items-center border-b pb-3">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nhân viên mới</p>
                <p className="text-lg font-medium">3 nhân viên</p>
              </div>
            </div>
            
            <div className="flex items-center border-b pb-3">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đơn hàng hoàn thành</p>
                <p className="text-lg font-medium">4 đơn hàng hôm nay</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cảnh báo</p>
                <p className="text-lg font-medium">2 vấn đề cần xử lý</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hoạt động gần đây */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Hoạt động gần đây</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                <span className="text-xs font-bold">P</span>
              </div>
              <div>
                <p className="text-sm font-medium">Đơn hàng PO-2023-002 đã hoàn thành</p>
                <p className="text-xs text-gray-500">20 phút trước - Phạm Văn A</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-3 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                <span className="text-xs font-bold">N</span>
              </div>
              <div>
                <p className="text-sm font-medium">Nhập kho 500 mét vải cotton</p>
                <p className="text-xs text-gray-500">1 giờ trước - Nguyễn Thị B</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mr-3 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
                <span className="text-xs font-bold">C</span>
              </div>
              <div>
                <p className="text-sm font-medium">Cảnh báo tồn kho thấp: Cúc áo 4 lỗ</p>
                <p className="text-xs text-gray-500">2 giờ trước - Hệ thống</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

