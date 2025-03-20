"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@components/layout/AppLayout";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

// Định nghĩa kiểu dữ liệu cho phân loại nguyên vật liệu
interface MaterialType {
  id: string;
  code: string;
  name: string;
  description: string;
  parent_id: string | null;
  properties: MaterialTypeProperty[];
  created_at: string;
}

interface MaterialTypeProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  default_value: string | null;
  options: string[] | null;
}

export default function MaterialTypesPage() {
  const [isClient, setIsClient] = useState(false);
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMaterialType, setCurrentMaterialType] = useState<Partial<MaterialType>>({
    properties: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProperty, setNewProperty] = useState<Partial<MaterialTypeProperty>>({
    name: '',
    type: 'text',
    required: false,
    default_value: '',
    options: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchMaterialTypes();
  }, []);

  const fetchMaterialTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Sử dụng dữ liệu mẫu thay vì gọi API Supabase
      // Khi cơ sở dữ liệu đã sẵn sàng, bạn có thể mở comment phần sau
      /*
      // Lấy danh sách phân loại từ Supabase
      const { data: typeData, error: typeError } = await supabaseBrowserClient
        .from('material_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (typeError) throw typeError;

      // Lấy thuộc tính cho mỗi phân loại
      const typesWithProperties = await Promise.all(typeData.map(async (type) => {
        const { data: propData, error: propError } = await supabaseBrowserClient
          .from('material_type_properties')
          .select('*')
          .eq('material_type_id', type.id);
        
        if (propError) throw propError;
        
        const formattedProperties = propData.map(prop => ({
          id: prop.id,
          name: prop.name,
          type: prop.type as 'text' | 'number' | 'select' | 'boolean',
          required: prop.required,
          default_value: prop.default_value,
          options: prop.type === 'select' ? (prop.options as any || []) : null
        }));

        return {
          ...type,
          properties: formattedProperties
        } as MaterialType;
      }));

      setMaterialTypes(typesWithProperties);
      */

      // Dữ liệu mẫu
      const sampleData: MaterialType[] = [
        {
          id: '1',
          code: 'FABRIC',
          name: 'Vải',
          description: 'Các loại vải dùng trong sản xuất',
          parent_id: null,
          properties: [
            {
              id: '1',
              name: 'Thành phần',
              type: 'text',
              required: true,
              default_value: null,
              options: null
            },
            {
              id: '2',
              name: 'Màu sắc',
              type: 'select',
              required: true,
              default_value: null,
              options: ['Đỏ', 'Xanh', 'Đen', 'Trắng', 'Khác']
            },
            {
              id: '3',
              name: 'Khổ vải',
              type: 'number',
              required: true,
              default_value: '1.5',
              options: null
            }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          code: 'BUTTONS',
          name: 'Cúc',
          description: 'Các loại cúc',
          parent_id: null,
          properties: [
            {
              id: '4',
              name: 'Kích thước',
              type: 'select',
              required: true,
              default_value: null,
              options: ['Nhỏ', 'Vừa', 'Lớn']
            },
            {
              id: '5',
              name: 'Chất liệu',
              type: 'select',
              required: true,
              default_value: null,
              options: ['Nhựa', 'Kim loại', 'Gỗ', 'Khác']
            }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          code: 'CTNFABRIC',
          name: 'Vải Cotton',
          description: 'Vải cotton các loại',
          parent_id: '1',
          properties: [
            {
              id: '6',
              name: 'Tỷ lệ cotton',
              type: 'number',
              required: true,
              default_value: '100',
              options: null
            },
            {
              id: '7',
              name: 'Độ co giãn',
              type: 'boolean',
              required: false,
              default_value: 'false',
              options: null
            }
          ],
          created_at: new Date().toISOString()
        }
      ];

      setMaterialTypes(sampleData);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phân loại:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentMaterialType({
      code: '',
      name: '',
      description: '',
      parent_id: null,
      properties: []
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (materialType: MaterialType) => {
    setCurrentMaterialType({...materialType});
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentMaterialType.name || !currentMaterialType.code) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      setIsLoading(true);
      
      // Tạm thời sử dụng logic cục bộ thay vì gọi API
      if (isEditing && currentMaterialType.id) {
        // Cập nhật phân loại trong state
        const updatedTypes = materialTypes.map(type => 
          type.id === currentMaterialType.id 
            ? {...currentMaterialType as MaterialType} 
            : type
        );
        setMaterialTypes(updatedTypes);
      } else {
        // Thêm phân loại mới
        const newType: MaterialType = {
          ...currentMaterialType as MaterialType,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          properties: currentMaterialType.properties || []
        };
        setMaterialTypes([...materialTypes, newType]);
      }
      
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lưu phân loại:", error);
      alert("Đã xảy ra lỗi khi lưu phân loại nguyên vật liệu");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phân loại này?")) {
      try {
        // Chỉ xóa từ state
        setMaterialTypes(materialTypes.filter(type => type.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa phân loại:", error);
        alert("Đã xảy ra lỗi khi xóa phân loại nguyên vật liệu");
      }
    }
  };

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.type) {
      alert("Vui lòng nhập tên và chọn kiểu dữ liệu cho thuộc tính");
      return;
    }

    const property: MaterialTypeProperty = {
      id: Date.now().toString(),
      name: newProperty.name || '',
      type: newProperty.type as 'text' | 'number' | 'select' | 'boolean',
      required: newProperty.required || false,
      default_value: newProperty.default_value || null,
      options: newProperty.type === 'select' ? newProperty.options || [] : null
    };

    setCurrentMaterialType({
      ...currentMaterialType,
      properties: [...(currentMaterialType.properties || []), property]
    });

    setNewProperty({
      name: '',
      type: 'text',
      required: false,
      default_value: '',
      options: []
    });
  };

  const handleRemoveProperty = (propertyId: string) => {
    setCurrentMaterialType({
      ...currentMaterialType,
      properties: (currentMaterialType.properties || []).filter(prop => prop.id !== propertyId)
    });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const options = e.target.value.split('\n').filter(option => option.trim() !== '');
    setNewProperty({
      ...newProperty,
      options
    });
  };

  // Lọc phân loại nguyên vật liệu theo từ khóa tìm kiếm
  const filteredMaterialTypes = materialTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Lấy danh sách phân loại cha
  const parentTypes = materialTypes.filter(type => type.parent_id === null);

  // Sắp xếp phân loại cha và con để hiển thị theo cấu trúc phân cấp
  const getHierarchicalTypes = () => {
    const result: MaterialType[] = [];
    
    // Thêm các nhóm cha
    parentTypes.forEach(parent => {
      result.push(parent);
      
      // Thêm các nhóm con
      materialTypes
        .filter(type => type.parent_id === parent.id)
        .forEach(child => {
          result.push(child);
        });
    });
    
    return result;
  };

  // Lấy tên phân loại cha
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "Không có";
    const parent = materialTypes.find(type => type.id === parentId);
    return parent ? parent.name : "Không tìm thấy";
  };

  // Kiểm tra xem một phân loại có phải là con của phân loại khác không
  const isChildType = (type: MaterialType) => {
    return type.parent_id !== null;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý Phân loại Nguyên vật liệu</h1>
            <button 
              onClick={handleAddNew}
              className="btn-primary"
            >
              + Thêm mới
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm phân loại..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mã</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên phân loại</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mô tả</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Phân loại cha</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Số thuộc tính</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchTerm 
                      ? filteredMaterialTypes.map((type) => (
                          <tr key={type.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isChildType(type) ? 'pl-8' : ''}`}>
                            <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{type.code}</td>
                            <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                              {isChildType(type) && <span className="text-gray-400 mr-2">└─</span>}
                              {type.name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{type.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {getParentName(type.parent_id)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {type.properties?.length || 0}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(type)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDelete(type.id)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      : getHierarchicalTypes().map((type) => (
                          <tr key={type.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isChildType(type) ? 'pl-8' : ''}`}>
                            <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{type.code}</td>
                            <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                              {isChildType(type) && <span className="text-gray-400 mr-2">└─</span>}
                              {type.name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{type.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {getParentName(type.parent_id)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {type.properties?.length || 0}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(type)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDelete(type.id)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>

              {filteredMaterialTypes.length === 0 && searchTerm && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Không tìm thấy phân loại nào
                </div>
              )}

              {materialTypes.length === 0 && !searchTerm && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Chưa có phân loại nguyên vật liệu nào. Hãy thêm phân loại mới.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal thêm/sửa phân loại */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {isEditing ? "Sửa phân loại" : "Thêm phân loại mới"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mã phân loại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={currentMaterialType.code || ''}
                  onChange={(e) => setCurrentMaterialType({...currentMaterialType, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên phân loại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={currentMaterialType.name || ''}
                  onChange={(e) => setCurrentMaterialType({...currentMaterialType, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={currentMaterialType.description || ''}
                onChange={(e) => setCurrentMaterialType({...currentMaterialType, description: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phân loại cha
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={currentMaterialType.parent_id || ''}
                onChange={(e) => setCurrentMaterialType({
                  ...currentMaterialType, 
                  parent_id: e.target.value === '' ? null : e.target.value
                })}
              >
                <option value="">Không có</option>
                {parentTypes
                  .filter(type => type.id !== currentMaterialType.id) // Loại bỏ phân loại hiện tại khỏi danh sách cha
                  .map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Thuộc tính</h3>
              
              {(currentMaterialType.properties || []).length > 0 ? (
                <div className="mb-4 overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên thuộc tính</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Kiểu dữ liệu</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Bắt buộc</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Giá trị mặc định</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {(currentMaterialType.properties || []).map((prop) => (
                        <tr key={prop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-2 px-3 text-xs text-gray-800 dark:text-gray-200">{prop.name}</td>
                          <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">
                            {prop.type === 'text' && 'Văn bản'}
                            {prop.type === 'number' && 'Số'}
                            {prop.type === 'select' && 'Lựa chọn'}
                            {prop.type === 'boolean' && 'Boolean'}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">
                            {prop.required ? 'Có' : 'Không'}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">
                            {prop.default_value || '-'}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">
                            <button
                              onClick={() => handleRemoveProperty(prop.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500 dark:text-gray-400 mb-4">
                  Chưa có thuộc tính nào
                </div>
              )}
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">Thêm thuộc tính mới</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên thuộc tính <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProperty.name || ''}
                      onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kiểu dữ liệu <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProperty.type || 'text'}
                      onChange={(e) => setNewProperty({...newProperty, type: e.target.value as any})}
                    >
                      <option value="text">Văn bản</option>
                      <option value="number">Số</option>
                      <option value="select">Lựa chọn</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Giá trị mặc định
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={newProperty.default_value || ''}
                      onChange={(e) => setNewProperty({...newProperty, default_value: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiredField"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={newProperty.required || false}
                      onChange={(e) => setNewProperty({...newProperty, required: e.target.checked})}
                    />
                    <label htmlFor="requiredField" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Bắt buộc nhập
                    </label>
                  </div>
                </div>
                
                {newProperty.type === 'select' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Các lựa chọn (mỗi dòng một lựa chọn)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={(newProperty.options || []).join('\n')}
                      onChange={handleOptionChange}
                      rows={3}
                    />
                  </div>
                )}
                
                <button
                  onClick={handleAddProperty}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Thêm thuộc tính
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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