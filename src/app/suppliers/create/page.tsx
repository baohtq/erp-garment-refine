"use client";

import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useGo } from "@refinedev/core";
import { Status } from "@utils/supabase/constants";
import { Supplier } from "@db/types";

export default function SupplierCreate() {
  const go = useGo();

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Supplier>({
    refineCoreProps: {
      resource: "suppliers",
      redirect: "list",
      action: "create",
    },
    defaultValues: {
      status: Status.ACTIVE,
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thêm mới nhà cung cấp</h1>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => go({ to: "/suppliers" })}
        >
          Quay lại
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="block text-gray-700 mb-2">Mã nhà cung cấp</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("code", { required: "Mã nhà cung cấp là bắt buộc" })}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message?.toString()}</p>
            )}
          </div>

          <div className="form-control">
            <label className="block text-gray-700 mb-2">Tên nhà cung cấp</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("name", { required: "Tên nhà cung cấp là bắt buộc" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
            )}
          </div>

          <div className="form-control">
            <label className="block text-gray-700 mb-2">Địa chỉ</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("address")}
            />
          </div>

          <div className="form-control">
            <label className="block text-gray-700 mb-2">Số điện thoại</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("phone")}
            />
          </div>

          <div className="form-control">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>
            )}
          </div>

          <div className="form-control">
            <label className="block text-gray-700 mb-2">Người liên hệ</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("contact_person")}
            />
          </div>

          <div className="form-control">
            <label className="block text-gray-700 mb-2">Trạng thái</label>
            <select
              className="w-full p-2 border rounded"
              {...register("status")}
            >
              <option value={Status.ACTIVE}>Hoạt động</option>
              <option value={Status.INACTIVE}>Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-blue-300"
            disabled={formLoading}
          >
            {formLoading ? "Đang xử lý..." : "Thêm mới"}
          </button>
        </div>
      </form>
    </div>
  );
} 