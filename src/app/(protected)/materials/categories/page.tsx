"use client";

import React, { useState, useEffect } from "react";
import { supabaseBrowserClient } from '@/utils/supabase/client";

interface MaterialType {
  id: string;
  code: string;
  name: string;
  description: string;
  parent_id: string | null;
  children?: MaterialType[];
  created_at: string;
}

export default function MaterialCategoriesPage() {
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterialTypes();
  }, []);

  const fetchMaterialTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sử dụng dữ liệu mẫu thay vì gọi API
      /*
      const { data, error } = await supabaseBrowserClient
        .from('material_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Chuyển đổi dữ liệu phẳng thành cấu trúc cây phân cấp
      const hierarchy = buildTypeHierarchy(data || []);
      setMaterialTypes(hierarchy);
      */

      // Dữ liệu mẫu
      const sampleData: MaterialType[] = [
        {
          id: '1',
          code: 'FABRIC',
          name: 'Vải',
          description: 'Các loại vải dùng trong sản xuất',
          parent_id: null,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          code: 'BUTTONS',
          name: 'Cúc',
          description: 'Các loại cúc',
          parent_id: null,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          code: 'CTNFABRIC',
          name: 'Vải Cotton',
          description: 'Vải cotton các loại',
          parent_id: '1',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          code: 'SILKFABRIC',
          name: 'Vải Lụa',
          description: 'Vải lụa các loại',
          parent_id: '1',
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          code: 'PLASTICBTN',
          name: 'Cúc Nhựa',
          description: 'Cúc nhựa các loại',
          parent_id: '2',
          created_at: new Date().toISOString()
        }
      ];
      
      // Chuyển đổi dữ liệu phẳng thành cấu trúc cây phân cấp
      const hierarchy = buildTypeHierarchy(sampleData);
      setMaterialTypes(hierarchy);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phân loại:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  // Chuyển đổi dữ liệu phẳng sang cấu trúc cây phân cấp
  const buildTypeHierarchy = (types: MaterialType[]): MaterialType[] => {
    const typesMap = new Map<string, MaterialType>();
    const rootTypes: MaterialType[] = [];
    
    // Tạo map cho tất cả các loại
    types.forEach(type => {
      typesMap.set(type.id, { ...type, children: [] });
    });
    
    // Xây dựng cấu trúc cây phân cấp
    types.forEach(type => {
      const typeWithChildren = typesMap.get(type.id) as MaterialType;
      
      if (type.parent_id === null) {
        // Đây là nút gốc
        rootTypes.push(typeWithChildren);
      } else {
        // Đây là nút con, thêm vào danh sách con của nút cha
        const parent = typesMap.get(type.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(typeWithChildren);
        } else {
          // Nếu không tìm thấy cha, xử lý như một nút gốc
          rootTypes.push(typeWithChildren);
        }
      }
    });
    
    return rootTypes;
  };

  // Hiển thị một nút trong cây phân cấp
  const renderTypeNode = (type: MaterialType, level: number = 0) => {
    return (
      <div key={type.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className={`flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${level > 0 ? 'border-l-2 border-gray-300 dark:border-gray-600' : ''}`}>
          <div className="flex-1">
            <div className="flex items-center">
              {level > 0 && (
                <span className="text-gray-400 mr-2">└─</span>
              )}
              <span className="font-medium text-gray-800 dark:text-white">{type.name}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({type.code})</span>
            </div>
            {type.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{type.description}</p>
            )}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {type.children?.length || 0} loại con
          </div>
        </div>
        
        {type.children && type.children.length > 0 && (
          <div className="mt-1">
            {type.children.map(child => renderTypeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Phân cấp Phân loại Nguyên vật liệu</h1>
          <button 
            onClick={() => window.location.href = '/materials/material-types'}
            className="btn-secondary"
          >
            Quản lý phân loại
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {materialTypes.length > 0 ? (
              <div className="mt-4 space-y-2">
                {materialTypes.map(type => renderTypeNode(type))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Chưa có phân loại nguyên vật liệu nào. Vui lòng thêm phân loại mới.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 