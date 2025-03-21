"use client";

import React, { useState } from "react";
import { useTable } from "@refinedev/react-table";
import { useNavigation, BaseRecord } from "@refinedev/core";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";

import { 
  useOrderList, 
  formatCurrency, 
  statusConfig,
  Order
} from "@/services/orderService";

export default function OrdersPage() {
  const { create, edit, show } = useNavigation();
  const [globalFilter, setGlobalFilter] = useState("");

  // Sử dụng orderService để lấy dữ liệu (với fallback về mock data)
  const { orders, total, isLoading, isError } = useOrderList();

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Mã đơn",
        cell: ({ row }) => {
          const orderNumber = row.original.orderNumber || `PO-${row.original.id}`;
          return <span>{orderNumber}</span>;
        }
      },
      {
        id: "customer",
        accessorKey: "customer.name",
        header: "Khách hàng",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          const status = statusConfig[value] || { color: "bg-gray-100 text-gray-800", text: value };
          
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.text}
            </span>
          );
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Tổng tiền",
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return formatCurrency(value);
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return new Date(value).toLocaleDateString('vi-VN');
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => show("orders", row.original.id)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Chi tiết
              </button>
              <button
                onClick={() => edit("orders", row.original.id)}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
              >
                Sửa
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Cấu hình cho React Table (TanStack Table)
  const { 
    getHeaderGroups,
    getRowModel,
    setPageIndex,
    getPageCount,
    getState,
    nextPage,
    previousPage,
    getCanNextPage,
    getCanPreviousPage,
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "orders",
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
  });

  const { pageIndex: current } = getState().pagination;
  const pageCount = getPageCount();

  // UI cho trạng thái loading
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý đơn hàng</h1>
          <button 
            onClick={() => create("orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo đơn hàng mới
          </button>
        </div>

        {/* Hiển thị thông báo nếu không kết nối được database */}
        {isError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Không thể kết nối với database. Đang hiển thị dữ liệu mẫu.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tìm kiếm */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full max-w-md p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Tìm kiếm đơn hàng..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              {getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="py-3 px-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {(orders as Order[]).map((order) => (
                <tr 
                  key={order.id} 
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="py-4 px-6">{order.orderNumber || `PO-${order.id}`}</td>
                  <td className="py-4 px-6">{order.customer.name}</td>
                  <td className="py-4 px-6">
                    {(() => {
                      const status = statusConfig[order.status] || { color: "bg-gray-100 text-gray-800", text: order.status };
                      
                      return (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => show("orders", order.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => edit("orders", order.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                      >
                        Sửa
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-700 dark:text-white">
            Hiển thị <span className="font-semibold">{current + 1}</span> / <span className="font-semibold">{pageCount}</span> trang
          </span>
          <div className="flex space-x-2">
            <button
              onClick={previousPage}
              disabled={!getCanPreviousPage()}
              className={`px-3 py-1 text-sm rounded-md border ${!getCanPreviousPage() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Trước
            </button>
            <button
              onClick={nextPage}
              disabled={!getCanNextPage()}
              className={`px-3 py-1 text-sm rounded-md border ${!getCanNextPage() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 