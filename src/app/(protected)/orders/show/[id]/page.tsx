"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useOrderDetail,
  formatCurrency,
  formatDate,
  statusConfig,
  paymentStatusConfig,
  OrderItem
} from "@/services/orderService";

export default function OrdersDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Sử dụng orderService để lấy chi tiết đơn hàng
  const { order, isLoading, isError } = useOrderDetail(id);

  // UI cho trạng thái loading
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Chi tiết đơn hàng: {order.orderNumber || `PO-${order.id}`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ngày tạo: {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/orders/edit/${id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sửa đơn hàng
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Quay lại
            </button>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Thông tin khách hàng</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Tên:</span> {order.customer.name}</p>
              {order.customer.email && <p><span className="font-medium">Email:</span> {order.customer.email}</p>}
              {order.customer.phone && <p><span className="font-medium">Số điện thoại:</span> {order.customer.phone}</p>}
              {order.customer.address && <p><span className="font-medium">Địa chỉ:</span> {order.customer.address}</p>}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Trạng thái:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                  {statusConfig[order.status].text}
                </span>
              </p>
              {order.paymentStatus && (
                <p>
                  <span className="font-medium">Thanh toán:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.paymentStatus].color}`}>
                    {paymentStatusConfig[order.paymentStatus].text}
                  </span>
                </p>
              )}
              {order.deliveryDate && <p><span className="font-medium">Ngày giao hàng:</span> {formatDate(order.deliveryDate)}</p>}
              <p><span className="font-medium">Tổng tiền:</span> {formatCurrency(order.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">STT</th>
                  <th scope="col" className="py-3 px-6">Sản phẩm</th>
                  <th scope="col" className="py-3 px-6">Mã SP</th>
                  <th scope="col" className="py-3 px-6">Số lượng</th>
                  <th scope="col" className="py-3 px-6">Đơn giá</th>
                  <th scope="col" className="py-3 px-6">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: OrderItem, index: number) => {
                  // Tính totalPrice nếu không có sẵn
                  const totalPrice = item.totalPrice || (item.quantity * item.unitPrice);
                  
                  return (
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6">{index + 1}</td>
                      <td className="py-4 px-6">{item.product}</td>
                      <td className="py-4 px-6">{item.sku}</td>
                      <td className="py-4 px-6">{item.quantity}</td>
                      <td className="py-4 px-6">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-4 px-6">{formatCurrency(totalPrice)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={5} className="py-4 px-6 font-semibold text-right">Tổng cộng:</td>
                  <td className="py-4 px-6 font-semibold">{formatCurrency(order.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Lịch sử thanh toán</h2>
            {order.paymentHistory && order.paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="py-3 px-6">STT</th>
                      <th scope="col" className="py-3 px-6">Ngày</th>
                      <th scope="col" className="py-3 px-6">Phương thức</th>
                      <th scope="col" className="py-3 px-6">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.paymentHistory.map((payment: {id: string, amount: number, date: string, method: string}, index: number) => (
                      <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="py-4 px-6">{index + 1}</td>
                        <td className="py-4 px-6">{formatDate(payment.date)}</td>
                        <td className="py-4 px-6">{payment.method}</td>
                        <td className="py-4 px-6">{formatCurrency(payment.amount)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan={3} className="py-4 px-6 font-semibold text-right">Đã thanh toán:</td>
                      <td className="py-4 px-6 font-semibold">{formatCurrency(order.paymentHistory.reduce((sum: number, item: {amount: number}) => sum + item.amount, 0))}</td>
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-600">
                      <td colSpan={3} className="py-4 px-6 font-semibold text-right">Còn lại:</td>
                      <td className="py-4 px-6 font-semibold">{formatCurrency(order.totalAmount - order.paymentHistory.reduce((sum: number, item: {amount: number}) => sum + item.amount, 0))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có thanh toán nào</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Ghi chú</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg min-h-[100px]">
              {order.notes || <p className="text-gray-500 italic">Không có ghi chú</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 