"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@components/layout/AppLayout";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { Supplier } from "@db/types";
import { useRouter } from "next/navigation";
import { mockSuppliers } from "@mock/suppliers";
import { Status, SupplierType } from "@/types/db";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseBrowserClient
        .from("suppliers")
        .select("*")
        .order("name");
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setSuppliers(data);
        setUseMockData(false);
      } else {
        // If no suppliers found in database, use mock data
        console.log("No suppliers found in database, using mock data");
        
        // Convert mock data to match the database schema
        const compatibleMockData = mockSuppliers.map(supplier => ({
          id: supplier.id,
          code: supplier.code || "",
          name: supplier.name,
          address: supplier.address || "",
          phone: supplier.phone || "",
          email: supplier.email || "",
          contact_person: supplier.contact_person || "",
          status: supplier.status || Status.ACTIVE as string,
          supplier_type: supplier.supplier_type || SupplierType.MANUFACTURER as string,
          tax_id: supplier.tax_id,
          payment_terms: supplier.payment_terms,
          notes: supplier.notes,
          website: supplier.website,
          created_at: supplier.created_at,
          updated_at: supplier.updated_at || supplier.created_at
        })) as Supplier[];
        
        setSuppliers(compatibleMockData);
        setUseMockData(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhà cung cấp:", error);
      // Fallback to mock data on error
      const compatibleMockData = mockSuppliers.map(supplier => ({
        id: supplier.id,
        code: supplier.code || "",
        name: supplier.name,
        address: supplier.address || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        contact_person: supplier.contact_person || "",
        status: supplier.status || Status.ACTIVE as string,
        supplier_type: supplier.supplier_type || SupplierType.MANUFACTURER as string,
        tax_id: supplier.tax_id,
        payment_terms: supplier.payment_terms,
        notes: supplier.notes,
        website: supplier.website,
        created_at: supplier.created_at,
        updated_at: supplier.updated_at || supplier.created_at
      })) as Supplier[];
      
      setSuppliers(compatibleMockData);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentSupplier({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      status: Status.ACTIVE as string,
      code: '',
      supplier_type: SupplierType.MANUFACTURER as string,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier({...supplier});
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentSupplier.name) {
      alert("Vui lòng nhập tên nhà cung cấp!");
      return;
    }

    try {
      if (isEditing && currentSupplier.id) {
        const { error } = await supabaseBrowserClient
          .from("suppliers")
          .update({
            name: currentSupplier.name,
            contact_person: currentSupplier.contact_person,
            phone: currentSupplier.phone,
            email: currentSupplier.email,
            address: currentSupplier.address,
            status: currentSupplier.status,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentSupplier.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabaseBrowserClient
          .from("suppliers")
          .insert({
            name: currentSupplier.name,
            contact_person: currentSupplier.contact_person,
            phone: currentSupplier.phone,
            email: currentSupplier.email,
            address: currentSupplier.address,
            status: currentSupplier.status || Status.ACTIVE as string,
            code: currentSupplier.code || `SUP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            supplier_type: currentSupplier.supplier_type || SupplierType.MANUFACTURER as string
          });
        
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      await fetchSuppliers();
    } catch (error) {
      console.error("Lỗi khi lưu nhà cung cấp:", error);
      alert("Đã xảy ra lỗi khi lưu nhà cung cấp");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        // Xóa nhà cung cấp
        const { error } = await supabaseBrowserClient
          .from("suppliers")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        
        await fetchSuppliers();
      } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
        alert("Đã xảy ra lỗi khi xóa nhà cung cấp");
      }
    }
  };

  const handleViewDetail = (id: string | number) => {
    router.push(`/suppliers/show/${id}`);
  };

  // Lọc nhà cung cấp theo từ khóa tìm kiếm
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.contact_person || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.phone || '').includes(searchTerm) ||
      (supplier.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý Nhà cung cấp</h1>
            <div className="flex space-x-2 items-center">
              {useMockData && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm flex items-center mr-2">
                  Đang dùng dữ liệu mẫu
                </div>
              )}
              <a 
                href="/suppliers/demo"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Form Demo
              </a>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Thêm mới
              </button>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm nhà cung cấp..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên công ty</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Người liên hệ</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Điện thoại</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Ngày tạo</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Trạng thái</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                          <div className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleViewDetail(supplier.id)}>
                            {supplier.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{supplier.address}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{supplier.contact_person || '---'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{supplier.phone || '---'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{supplier.email || '---'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(supplier.created_at)}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            supplier.status === Status.ACTIVE as string 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {supplier.status === Status.ACTIVE as string ? 'Hoạt động' : 'Ngừng hoạt động'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(supplier)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(supplier.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

              {filteredSuppliers.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Không tìm thấy nhà cung cấp nào
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal thêm/sửa nhà cung cấp */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {isEditing ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={currentSupplier.name || ''}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Người liên hệ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={currentSupplier.contact_person || ''}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, contact_person: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    value={currentSupplier.phone || ''}
                    onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    value={currentSupplier.email || ''}
                    onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  rows={3}
                  value={currentSupplier.address || ''}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, address: e.target.value})}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  value={currentSupplier.status || Status.ACTIVE as string}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, status: e.target.value})}
                >
                  <option value={Status.ACTIVE as string}>Hoạt động</option>
                  <option value={Status.INACTIVE as string}>Ngừng hoạt động</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSave}
              >
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
} 