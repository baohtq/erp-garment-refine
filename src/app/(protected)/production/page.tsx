"use client";

import React from "react";
import AppLayout from "@/components/layout/AppLayout";

export default function ProductionPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý Sản xuất</h1>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Thêm mới
              </button>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Tính năng đang phát triển</h2>
            <p className="text-gray-600">
              Trang quản lý sản xuất đang trong quá trình phát triển. Vui lòng quay lại sau.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 