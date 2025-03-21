"use client";

import React, { useState, useEffect } from "react";
import { RefineClient } from "../client";
import AppLayout from "@components/layout/AppLayout";
import { createClient } from "@supabase/supabase-js";
import Link from 'next/link';
import { Product, Material, ProductStandard, MATERIAL_TYPES } from "@/types";

// Use environment variables directly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function ProductStandardsPage() {
  const [isClient, setIsClient] = useState(false);
  const [productStandards, setProductStandards] = useState<ProductStandard[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStandard, setCurrentStandard] = useState<Partial<ProductStandard>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [sourceProductId, setSourceProductId] = useState<string | null>(null);
  const [targetProductId, setTargetProductId] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>('');
  const [materialSearchTerm, setMaterialSearchTerm] = useState<string>('');

  // Khởi tạo Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
    fetchMaterials();
    fetchProductStandards();
  }, []);

  // Lọc nguyên liệu khi thay đổi bộ lọc hoặc từ khóa tìm kiếm
  useEffect(() => {
    let filtered = materials;
    
    // Lọc theo loại nguyên liệu
    if (materialTypeFilter) {
      filtered = filtered.filter(material => material.type === materialTypeFilter);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (materialSearchTerm) {
      const searchLower = materialSearchTerm.toLowerCase();
      filtered = filtered.filter(material => 
        material.name.toLowerCase().includes(searchLower) || 
        material.code.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredMaterials(filtered);
  }, [materials, materialTypeFilter, materialSearchTerm]);

  // Lọc định mức theo sản phẩm đã chọn
  const filteredStandards = selectedProductId
    ? productStandards.filter(standard => standard.product_id === selectedProductId)
    : productStandards;

  // Fetch danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Dữ liệu mẫu khi chưa có sản phẩm thực
        const sampleData: Product[] = [
          {
            id: '1',
            code: 'SP001',
            name: 'Áo sơ mi nam dài tay',
            description: 'Áo sơ mi nam dài tay, chất liệu cotton 100%',
            category: 'shirt',
            unit_price: 350000,
            status: 'active',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            code: 'SP002',
            name: 'Quần jean nam slim fit',
            description: 'Quần jean nam, kiểu dáng slim fit',
            category: 'jeans',
            unit_price: 450000,
            status: 'active',
            created_at: new Date().toISOString(),
          }
        ];
        setProducts(sampleData);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch danh sách nguyên vật liệu
  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*, suppliers(name)')
        .eq('status', 'active');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Dữ liệu mẫu khi chưa có nguyên vật liệu thực
        const sampleData: Material[] = [
          {
            id: '1',
            code: 'VAI-001',
            name: 'Vải cotton 100%',
            type: 'fabric',
            unit: 'm',
            stock_quantity: 1200,
            min_quantity: 500,
            price: 85000,
            supplier_id: '1',
            supplier_name: 'Công ty Vải Phương Nam',
            status: 'active',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            code: 'CUC-001',
            name: 'Cúc nhựa 4 lỗ',
            type: 'button',
            unit: 'pcs',
            stock_quantity: 15000,
            min_quantity: 2000,
            price: 500,
            supplier_id: '2',
            supplier_name: 'Xưởng May Thanh Hương',
            status: 'active',
            created_at: new Date().toISOString(),
          }
        ];
        setMaterials(sampleData);
      } else {
        // Format dữ liệu từ Supabase
        const formattedData = data.map(item => ({
          ...item,
          supplier_name: item.suppliers?.name,
        }));
        setMaterials(formattedData);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  // Fetch danh sách định mức sản phẩm
  const fetchProductStandards = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_standards')
        .select('*, materials(*)');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Dữ liệu mẫu khi chưa có định mức thực
        const sampleData: ProductStandard[] = [
          {
            id: '1',
            product_id: '1',
            material_id: '1',
            quantity: 2.5,
            notes: 'Vải chính cho thân áo',
            material: {
              id: '1',
              code: 'VAI-001',
              name: 'Vải cotton 100%',
              type: 'fabric',
              unit: 'm',
              stock_quantity: 1200,
              min_quantity: 500,
              price: 85000,
              supplier_id: '1',
              supplier_name: 'Công ty Vải Phương Nam',
              status: 'active',
              created_at: new Date().toISOString(),
            },
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            product_id: '1',
            material_id: '2',
            quantity: 10,
            notes: 'Cúc áo sơ mi',
            material: {
              id: '2',
              code: 'CUC-001',
              name: 'Cúc nhựa 4 lỗ',
              type: 'button',
              unit: 'pcs',
              stock_quantity: 15000,
              min_quantity: 2000,
              price: 500,
              supplier_id: '2',
              supplier_name: 'Xưởng May Thanh Hương',
              status: 'active',
              created_at: new Date().toISOString(),
            },
            created_at: new Date().toISOString(),
          }
        ];
        setProductStandards(sampleData);
      } else {
        // Format dữ liệu từ Supabase
        setProductStandards(data);
      }
    } catch (error) {
      console.error('Error fetching product standards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal để thêm định mức mới
  const handleAddNew = () => {
    setCurrentStandard({});
    setIsEditing(false);
    setIsModalOpen(true);
    setMaterialTypeFilter('');
    setMaterialSearchTerm('');
    setFilteredMaterials(materials);
  };

  // Mở modal để chỉnh sửa định mức
  const handleEdit = (standard: ProductStandard) => {
    setCurrentStandard(standard);
    setIsEditing(true);
    setIsModalOpen(true);
    setMaterialTypeFilter('');
    setMaterialSearchTerm('');
    setFilteredMaterials(materials);
  };

  // Kiểm tra xem định mức có hợp lý không
  const checkStandardThreshold = (standard: ProductStandard): { isValid: boolean; message?: string } => {
    const material = materials.find(m => m.id === standard.material_id);
    if (!material) return { isValid: true };

    const materialType = material.type;
    const quantity = standard.quantity;

    // Ngưỡng hợp lý cho từng loại nguyên liệu
    const thresholds: Record<string, { min: number; max: number; unit: string }> = {
      // Vải thường từ 0.5m đến 10m cho 1 sản phẩm
      'fabric': { min: 0.5, max: 10, unit: 'm' },
      // Cúc thường từ 1 đến 20 cái cho 1 sản phẩm
      'button': { min: 1, max: 20, unit: 'pcs' },
      // Khóa kéo thường từ 1 đến 5 cái cho 1 sản phẩm
      'zipper': { min: 1, max: 5, unit: 'pcs' },
      // Chỉ thường từ 0.01 đến 0.5 kg cho 1 sản phẩm
      'thread': { min: 0.01, max: 0.5, unit: 'kg' },
      // Thun thường từ 0.1 đến 3m cho 1 sản phẩm
      'elastic': { min: 0.1, max: 3, unit: 'm' },
      // Nhãn mác thường từ 1 đến 10 cái cho 1 sản phẩm
      'label': { min: 1, max: 10, unit: 'pcs' },
      // Bao bì thường từ 1 đến 5 cái cho 1 sản phẩm
      'packaging': { min: 1, max: 5, unit: 'pcs' },
      // Phụ kiện khác thường từ 1 đến 20 cái cho 1 sản phẩm
      'accessory': { min: 1, max: 20, unit: 'pcs' },
    };

    // Nếu không có ngưỡng cụ thể cho loại nguyên liệu, coi là hợp lý
    if (!thresholds[materialType]) return { isValid: true };

    const threshold = thresholds[materialType];

    // Nếu số lượng nằm ngoài ngưỡng, cảnh báo
    if (quantity < threshold.min) {
      return {
        isValid: false,
        message: `Định mức thấp hơn mức thông thường (${threshold.min}${threshold.unit})`
      };
    }
    if (quantity > threshold.max) {
      return {
        isValid: false,
        message: `Định mức cao hơn mức thông thường (${threshold.max}${threshold.unit})`
      };
    }

    return { isValid: true };
  };

  // Xử lý lưu form
  const handleSave = async () => {
    if (!currentStandard.product_id || !currentStandard.material_id || !currentStandard.quantity) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Kiểm tra tính hợp lý của định mức
    const standardCheck = checkStandardThreshold(currentStandard as ProductStandard);
    if (!standardCheck.isValid) {
      const continueAnyway = window.confirm(`Cảnh báo: ${standardCheck.message}. Bạn có muốn tiếp tục lưu không?`);
      if (!continueAnyway) return;
    }
    
    try {
      if (isEditing) {
        // Cập nhật định mức
        const { data, error } = await supabase
          .from('product_standards')
          .update({
            product_id: currentStandard.product_id,
            material_id: currentStandard.material_id,
            quantity: currentStandard.quantity,
            notes: currentStandard.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentStandard.id)
          .select('*, materials(*)');
        
        if (error) throw error;
        
        // Cập nhật state
        setProductStandards(prev => 
          prev.map(s => s.id === currentStandard.id 
            ? { 
                ...s, 
                ...currentStandard,
                material: materials.find(m => m.id === currentStandard.material_id) 
              } as ProductStandard 
            : s
          )
        );
      } else {
        // Thêm định mức mới
        const { data, error } = await supabase
          .from('product_standards')
          .insert({
            product_id: currentStandard.product_id,
            material_id: currentStandard.material_id,
            quantity: currentStandard.quantity,
            notes: currentStandard.notes
          })
          .select('*, materials(*)');
        
        if (error) {
          // Nếu có lỗi khi thêm vào Supabase, thêm vào state với ID tạm
          console.error('Error adding product standard to Supabase:', error);
          const newStandard = {
            ...currentStandard,
            id: Math.random().toString(36).substring(2, 9),
            created_at: new Date().toISOString(),
            material: materials.find(m => m.id === currentStandard.material_id)
          } as ProductStandard;
          
          setProductStandards(prev => [...prev, newStandard]);
        } else if (data) {
          // Nếu thêm thành công, cập nhật state với dữ liệu từ Supabase
          setProductStandards(prev => [...prev, ...data]);
        }
      }
      
      // Đóng modal
      setIsModalOpen(false);
      setCurrentStandard({});
    } catch (error) {
      console.error('Error saving product standard:', error);
      alert('Có lỗi xảy ra khi lưu định mức sản phẩm');
    }
  };

  // Xử lý xóa định mức
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa định mức này?')) return;
    
    try {
      // Xóa định mức từ Supabase
      const { error } = await supabase
        .from('product_standards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Cập nhật state
      setProductStandards(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting product standard:', error);
      alert('Có lỗi xảy ra khi xóa định mức sản phẩm');
    }
  };

  // Xử lý sao chép định mức
  const handleCopyStandards = async () => {
    if (!sourceProductId || !targetProductId) {
      alert('Vui lòng chọn sản phẩm nguồn và sản phẩm đích');
      return;
    }

    if (sourceProductId === targetProductId) {
      alert('Sản phẩm nguồn và sản phẩm đích không thể giống nhau');
      return;
    }

    setIsCopying(true);

    try {
      // Lấy danh sách định mức của sản phẩm nguồn
      const sourceStandards = productStandards.filter(s => s.product_id === sourceProductId);
      
      if (sourceStandards.length === 0) {
        alert('Sản phẩm nguồn không có định mức nào');
        setIsCopying(false);
        return;
      }

      // Kiểm tra xem sản phẩm đích đã có định mức chưa
      const existingTargetStandards = productStandards.filter(s => s.product_id === targetProductId);
      
      if (existingTargetStandards.length > 0) {
        if (!window.confirm('Sản phẩm đích đã có định mức. Bạn có muốn ghi đè không?')) {
          setIsCopying(false);
          return;
        }
        
        // Xóa định mức hiện có của sản phẩm đích
        for (const standard of existingTargetStandards) {
          await supabase
            .from('product_standards')
            .delete()
            .eq('id', standard.id);
        }
      }

      // Chuẩn bị dữ liệu để thêm vào sản phẩm đích
      const newStandards = sourceStandards.map(standard => ({
        product_id: targetProductId,
        material_id: standard.material_id,
        quantity: standard.quantity,
        notes: standard.notes
      }));

      // Thêm định mức mới cho sản phẩm đích
      const { data, error } = await supabase
        .from('product_standards')
        .insert(newStandards)
        .select('*, materials(*)');

      if (error) throw error;

      // Cập nhật state
      if (data) {
        // Cập nhật state bằng cách xóa các định mức cũ và thêm các định mức mới
        setProductStandards(prev => [
          ...prev.filter(s => s.product_id !== targetProductId),
          ...data
        ]);
        
        alert(`Đã sao chép ${data.length} định mức từ "${getProductName(sourceProductId)}" sang "${getProductName(targetProductId)}"`);
      }
      
      // Đóng modal
      setIsCopyModalOpen(false);
      setSourceProductId(null);
      setTargetProductId(null);
    } catch (error) {
      console.error('Error copying product standards:', error);
      alert('Có lỗi xảy ra khi sao chép định mức sản phẩm');
    } finally {
      setIsCopying(false);
    }
  };

  // Lấy tên sản phẩm
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Sản phẩm không xác định';
  };

  // Lấy tên nguyên vật liệu
  const getMaterialName = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : 'Nguyên liệu không xác định';
  };

  // Lấy đơn vị của nguyên vật liệu
  const getMaterialUnit = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.unit : '';
  };

  // Tính chi phí của một định mức
  const calculateCost = (standard: ProductStandard) => {
    const material = materials.find(m => m.id === standard.material_id);
    if (!material) return 0;
    return material.price * standard.quantity;
  };

  // Tính tổng chi phí cho một sản phẩm
  const calculateTotalCost = (productId: string) => {
    const productStandardsList = productStandards.filter(s => s.product_id === productId);
    return productStandardsList.reduce((total, standard) => total + calculateCost(standard), 0);
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <RefineClient>
      <AppLayout>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý Định mức sản phẩm</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Thêm định mức
              </button>
              <button
                onClick={() => setIsCopyModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Sao chép định mức
              </button>
            </div>
          </div>

          {/* Bộ lọc sản phẩm */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Chọn sản phẩm:</label>
              <select
                value={selectedProductId || ""}
                onChange={(e) => setSelectedProductId(e.target.value || null)}
                className="border border-gray-300 rounded-md p-2 min-w-[300px]"
              >
                <option value="">-- Tất cả sản phẩm --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <svg className="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {filteredStandards.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">
                    {selectedProductId 
                      ? "Sản phẩm này chưa có định mức nào" 
                      : "Chưa có định mức sản phẩm nào"}
                  </p>
                  <button 
                    onClick={handleAddNew}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Thêm định mức mới
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Nhóm các định mức theo sản phẩm */}
                  {selectedProductId ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-blue-100 p-4 border-b">
                        <h3 className="text-lg font-semibold">
                          {getProductName(selectedProductId)} - Định mức nguyên vật liệu
                        </h3>
                      </div>
                      <div className="p-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nguyên liệu
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chi phí
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ghi chú
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredStandards.map((standard) => (
                              <tr key={standard.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {standard.material?.name || getMaterialName(standard.material_id)}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {standard.material?.code}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {standard.quantity} {standard.material?.unit || getMaterialUnit(standard.material_id)}
                                  </div>
                                  {!checkStandardThreshold(standard).isValid && (
                                    <div className="text-xs text-orange-600 mt-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      {checkStandardThreshold(standard).message}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {calculateCost(standard).toLocaleString('vi-VN')} đ
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm text-gray-900">
                                    {standard.notes || "-"}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEdit(standard)}
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    onClick={() => handleDelete(standard.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-gray-50 p-4 border-t flex justify-end">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">Tổng chi phí:</span>
                          <span className="text-base font-semibold text-gray-900">
                            {calculateTotalCost(selectedProductId).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Hiển thị theo nhóm sản phẩm
                    Array.from(new Set(productStandards.map(standard => standard.product_id)))
                      .map(productId => (
                        <div key={productId} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="bg-blue-100 p-4 border-b">
                            <h3 className="text-lg font-semibold">
                              {getProductName(productId)} - Định mức nguyên vật liệu
                            </h3>
                          </div>
                          <div className="p-4">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nguyên liệu
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượng
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chi phí
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ghi chú
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {productStandards
                                  .filter(standard => standard.product_id === productId)
                                  .map((standard) => (
                                    <tr key={standard.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                              {standard.material?.name || getMaterialName(standard.material_id)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {standard.material?.code}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {standard.quantity} {standard.material?.unit || getMaterialUnit(standard.material_id)}
                                        </div>
                                        {!checkStandardThreshold(standard).isValid && (
                                          <div className="text-xs text-orange-600 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {checkStandardThreshold(standard).message}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {calculateCost(standard).toLocaleString('vi-VN')} đ
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">
                                          {standard.notes || "-"}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                        <button
                                          onClick={() => handleEdit(standard)}
                                          className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                          Sửa
                                        </button>
                                        <button
                                          onClick={() => handleDelete(standard.id)}
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          Xóa
                                        </button>
                                      </td>
                                    </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-gray-50 p-4 border-t flex justify-end">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-2">Tổng chi phí:</span>
                              <span className="text-base font-semibold text-gray-900">
                                {calculateTotalCost(productId).toLocaleString('vi-VN')} đ
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Modal thêm/sửa định mức */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {isEditing ? "Chỉnh sửa định mức" : "Thêm định mức mới"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentStandard.product_id || ""}
                      onChange={(e) =>
                        setCurrentStandard({ ...currentStandard, product_id: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.code} - {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nguyên liệu <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="space-y-3">
                      {/* Bộ lọc nguyên liệu */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Tìm kiếm nguyên liệu..."
                            value={materialSearchTerm}
                            onChange={(e) => setMaterialSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="w-48">
                          <select
                            value={materialTypeFilter}
                            onChange={(e) => setMaterialTypeFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Tất cả loại nguyên liệu</option>
                            {MATERIAL_TYPES.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Danh sách nguyên liệu */}
                      <div className="border border-gray-300 rounded-md h-48 overflow-y-auto">
                        <div className="sticky top-0 bg-gray-100 p-2 border-b border-gray-300 text-xs font-medium grid grid-cols-12 gap-2">
                          <div className="col-span-1"></div>
                          <div className="col-span-2">Mã</div>
                          <div className="col-span-3">Tên</div>
                          <div className="col-span-2">Loại</div>
                          <div className="col-span-2">Đơn giá</div>
                          <div className="col-span-2">Tồn kho</div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {filteredMaterials.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">
                              Không tìm thấy nguyên liệu phù hợp
                            </div>
                          ) : (
                            filteredMaterials.map(material => (
                              <div 
                                key={material.id} 
                                className={`p-2 hover:bg-blue-50 cursor-pointer grid grid-cols-12 gap-2 items-center ${currentStandard.material_id === material.id ? 'bg-blue-100' : ''}`}
                                onClick={() => setCurrentStandard({ ...currentStandard, material_id: material.id })}
                              >
                                <div className="col-span-1">
                                  <input 
                                    type="radio" 
                                    name="material" 
                                    checked={currentStandard.material_id === material.id} 
                                    onChange={() => {}} 
                                    className="ml-1" 
                                  />
                                </div>
                                <div className="col-span-2 text-xs">{material.code}</div>
                                <div className="col-span-3 text-sm font-medium">{material.name}</div>
                                <div className="col-span-2 text-xs">
                                  {MATERIAL_TYPES.find(t => t.value === material.type)?.label || material.type}
                                </div>
                                <div className="col-span-2 text-xs">
                                  {material.price.toLocaleString('vi-VN')} đ
                                </div>
                                <div className="col-span-2 text-xs">
                                  {material.stock_quantity} {material.unit}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.01"
                        value={currentStandard.quantity || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setCurrentStandard({ ...currentStandard, quantity: value });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        min="0"
                      />
                      {currentStandard.material_id && (
                        <span className="ml-2 text-gray-600">
                          {getMaterialUnit(currentStandard.material_id)}
                        </span>
                      )}
                    </div>
                    {currentStandard.product_id && currentStandard.material_id && currentStandard.quantity && (
                      <div className="mt-1">
                        {!checkStandardThreshold(currentStandard as ProductStandard).isValid ? (
                          <div className="text-xs text-orange-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {checkStandardThreshold(currentStandard as ProductStandard).message}
                          </div>
                        ) : (
                          <div className="text-xs text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Định mức hợp lý
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Hiển thị chi phí */}
                    {currentStandard.product_id && currentStandard.material_id && currentStandard.quantity && (
                      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="text-sm">
                          <span className="font-medium">Chi phí:</span>{' '}
                          <span className="text-blue-700">
                            {calculateCost(currentStandard as ProductStandard).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      value={currentStandard.notes || ""}
                      onChange={(e) =>
                        setCurrentStandard({ ...currentStandard, notes: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {isEditing ? "Cập nhật" : "Thêm mới"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal sao chép định mức */}
          {isCopyModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Sao chép định mức</h3>
                  <button
                    onClick={() => setIsCopyModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sản phẩm nguồn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sourceProductId || ""}
                      onChange={(e) => setSourceProductId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">-- Chọn sản phẩm nguồn --</option>
                      {products
                        .filter(product => productStandards.some(s => s.product_id === product.id))
                        .map(product => (
                          <option key={product.id} value={product.id}>
                            {product.code} - {product.name}
                          </option>
                        ))}
                    </select>
                    {sourceProductId && (
                      <p className="mt-1 text-xs text-gray-500">
                        {productStandards.filter(s => s.product_id === sourceProductId).length} định mức
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sản phẩm đích <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={targetProductId || ""}
                      onChange={(e) => setTargetProductId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">-- Chọn sản phẩm đích --</option>
                      {products
                        .filter(product => product.id !== sourceProductId)
                        .map(product => (
                          <option key={product.id} value={product.id}>
                            {product.code} - {product.name}
                          </option>
                        ))}
                    </select>
                    {targetProductId && (
                      <p className="mt-1 text-xs text-gray-500">
                        {productStandards.filter(s => s.product_id === targetProductId).length > 0
                          ? `${productStandards.filter(s => s.product_id === targetProductId).length} định mức hiện có`
                          : 'Chưa có định mức'
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsCopyModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleCopyStandards}
                      disabled={!sourceProductId || !targetProductId || isCopying}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCopying ? 'Đang sao chép...' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </RefineClient>
  );
} 