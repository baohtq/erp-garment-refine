"use client";

import React, { useEffect, useState } from "react";
import { RefineClient } from "../client";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabaseBrowserClient } from "@/utils/supabase/client";

const SettingsPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { isAdmin, loading, role } = useUserRole();
  const router = useRouter();
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
          toast.error("Vui lòng đăng nhập để tiếp tục");
          router.push("/login");
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
    
    // Nếu không phải admin, chuyển hướng về trang chủ
    if (!loading && !isAdmin) {
      console.log("User role:", role, "isAdmin:", isAdmin);
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [isAdmin, loading, router, role]);

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
          {loading && <p className="mt-1 text-sm text-gray-500">Đang kiểm tra quyền người dùng...</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-lg font-medium text-gray-900">Đang kiểm tra quyền người dùng...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-lg font-medium text-gray-900">Bạn không có quyền truy cập</p>
          <p className="mt-1 text-sm text-gray-500">Đang chuyển hướng về trang chủ...</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <RefineClient>
      <Settings />
      <ToastContainer />
    </RefineClient>
  );
};

const Settings = () => {
  const categories = [
    {
      id: "general",
      title: "Cài đặt chung",
      description: "Cấu hình thông tin cơ bản của hệ thống",
      icon: (
        <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: "notifications",
      title: "Thông báo",
      description: "Cấu hình hệ thống thông báo và email",
      icon: (
        <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: "security",
      title: "Bảo mật",
      description: "Thiết lập các chính sách bảo mật và xác thực",
      icon: (
        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "backup",
      title: "Sao lưu dữ liệu",
      description: "Cấu hình sao lưu và khôi phục dữ liệu",
      icon: (
        <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
    },
    {
      id: "system",
      title: "Cấu hình hệ thống",
      description: "Thiết lập các thông số kỹ thuật của hệ thống",
      icon: (
        <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      id: "logs",
      title: "Nhật ký hệ thống",
      description: "Xem các hoạt động và sự kiện trong hệ thống",
      icon: (
        <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "permissions",
      title: "Quyền hạn",
      description: "Quản lý phân quyền và vai trò người dùng",
      icon: (
        <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: "integrations",
      title: "Tích hợp",
      description: "Kết nối với các dịch vụ và API bên ngoài",
      icon: (
        <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: "appearance",
      title: "Giao diện",
      description: "Tùy chỉnh giao diện và hiển thị hệ thống",
      icon: (
        <svg className="h-6 w-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("general");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
        <div className="mt-2 sm:mt-0">
          <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Lưu thay đổi
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="rounded-lg border bg-white shadow-sm">
            <ul className="divide-y">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex w-full items-center px-4 py-3 text-left hover:bg-gray-50 ${
                      selectedCategory === category.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    <span className="font-medium">{category.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">{categories.find(c => c.id === selectedCategory)?.title}</h2>
            <p className="text-gray-500">{categories.find(c => c.id === selectedCategory)?.description}</p>
          </div>
          
          {selectedCategory === "general" && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tên công ty</label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Nhập tên công ty"
                  defaultValue="ERP Garment Company"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                  defaultValue="123 Đường ABC, Quận XYZ, TP HCM"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                  defaultValue="(028) 1234 5678"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email liên hệ</label>
                <input
                  type="email"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Nhập email liên hệ"
                  defaultValue="contact@erp-garment.com"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Logo công ty</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Thay đổi
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {selectedCategory !== "general" && (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-1 text-sm text-gray-500">Chức năng này đang được phát triển</p>
                <p className="text-xs text-gray-500">Vui lòng quay lại sau</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 