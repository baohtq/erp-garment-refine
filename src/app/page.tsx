"use client";

import React, { useEffect, useState } from "react";
import { RefineClient } from "./client";
import AppLayout from "@/components/layout/AppLayout";
import Todo from "@/components/Todo";

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    ordersPending: 5,
    ordersInProgress: 24,
    ordersCompleted: 18,
    materialLow: 5,
    employees: 120,
    revenueMonth: "1.2 tỷ",
  });

  useEffect(() => {
    setIsClient(true);
    // Trong tương lai sẽ fetch dữ liệu từ API
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    );
  }

  return (
    <RefineClient>
      <AppLayout>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tổng quan</h1>
            <div className="flex gap-2">
              <button className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Đơn hàng mới
              </button>
              <button className="btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Lọc
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thống kê đơn hàng */}
            <div className="card hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đơn hàng</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.ordersPending + stats.ordersInProgress + stats.ordersCompleted}</h3>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1.5 rounded-lg">
                    <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{stats.ordersPending}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Chờ xử lý</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.ordersInProgress}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Đang SX</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1.5 rounded-lg">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">{stats.ordersCompleted}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Hoàn thành</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vật tư */}
            <div className="card hover:shadow-md">
              <div className="card-body">
              <div className="flex items-center">
                  <div className="flex items-center justify-center p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vật tư tồn kho thấp</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.materialLow}</h3>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="btn-danger w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem danh sách
                  </button>
                </div>
              </div>
            </div>

            {/* Nhân viên */}
            <div className="card hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex items-center justify-center p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nhân viên</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.employees}</h3>
                  </div>
                </div>
                <div className="mt-6 flex flex-col">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Hiệu suất</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doanh thu */}
            <div className="card hover:shadow-md">
              <div className="card-body">
              <div className="flex items-center">
                  <div className="flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Doanh thu tháng</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.revenueMonth}</h3>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">So với tháng trước</div>
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">+12.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Các phần tử tiếp theo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Đơn hàng gần đây */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Đơn hàng sản xuất gần đây</h3>
                <button className="btn-sm btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem tất cả
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Mã đơn
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        PO-2023-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        Áo sơ mi nam
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        500
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-blue">
                          Đang sản xuất
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        PO-2023-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        Quần jean nữ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        300
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-green">
                          Hoàn thành
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        PO-2023-003
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        Áo khoác mùa đông
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        200
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-yellow">
                          Chờ xử lý
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-footer text-center">
                <button className="btn-secondary btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo đơn hàng mới
                </button>
              </div>
            </div>

            {/* Tiến độ sản xuất */}
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tiến độ sản xuất</h3>
                <button className="btn-sm btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem chi tiết
                </button>
              </div>
              <div className="card-body space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PO-2023-001: Áo sơ mi nam</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PO-2023-004: Váy dạ hội</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: "45%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PO-2023-005: Áo thun in logo</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>
              <div className="card-footer flex justify-center">
                <button className="btn-primary btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Cập nhật tiến độ
                </button>
              </div>
            </div>
          </div>

          {/* Thêm một hàng mới cho các tính năng bổ sung */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thống kê nhanh */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Thống kê nhanh</h3>
              </div>
              <div className="card-body space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Nhân viên mới</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">3 nhân viên</p>
                    </div>
                  </div>
                  <button className="btn-sm btn-secondary w-20">Xem</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Đơn hàng hoàn thành</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">4 đơn hàng hôm nay</p>
                    </div>
                  </div>
                  <button className="btn-sm btn-secondary w-20">Xem</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cảnh báo</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">2 vấn đề cần xử lý</p>
                    </div>
                  </div>
                  <button className="btn-sm btn-danger w-20">Xử lý</button>
                </div>
              </div>
            </div>

            {/* Hoạt động gần đây */}
            <div className="card col-span-1 md:col-span-2">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Hoạt động gần đây</h3>
              </div>
              <div className="card-body">
                <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[21px] h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Đơn hàng PO-2023-002 đã hoàn thành</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">20 phút trước - Phạm Văn A</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                    <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nhập kho 500 mét vải cotton</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">1 giờ trước - Nguyễn Thị B</div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Cảnh báo tồn kho thấp: Cúc áo 4 lỗ</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">3 giờ trước - Hệ thống</div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-secondary w-full">Xem tất cả hoạt động</button>
              </div>
            </div>
          </div>

          {/* Thêm component Todo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Todo />
          </div>
        </div>
      </AppLayout>
    </RefineClient>
  );
}

