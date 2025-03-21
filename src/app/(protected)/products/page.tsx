"use client";

import React, { useState, useEffect } from "react";
import { RefineClient } from "../client";
import AppLayout from "@components/layout/AppLayout";
import { createClient } from "@supabase/supabase-js";
import { Product, Status, PRODUCT_CATEGORIES } from "@/types";
import ProductForm from "@components/products/ProductForm";
import ImportExport from "@components/products/ImportExport";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState<keyof Product>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showImportExport, setShowImportExport] = useState(false);

  // Use environment variables directly
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  // Khởi tạo Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  useEffect(() => {
    setIsClient(true);
    fetchProducts();
  }, [currentPage, sortField, sortDirection]);

  // Tìm kiếm sản phẩm
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fetch danh sách sản phẩm với phân trang
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Tính toán offset cho phân trang
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Gọi API Supabase để lấy danh sách sản phẩm với phân trang và sắp xếp
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range(from, to);

      if (error) throw error;
      
      if (count !== null) {
        setTotalItems(count);
      }

      // Nếu chưa có dữ liệu, sử dụng dữ liệu mẫu
      if (!data || data.length === 0) {
        const sampleData: Product[] = [
          {
            id: '1',
            code: 'SP001',
            name: 'Áo sơ mi nam dài tay',
            description: 'Áo sơ mi nam dài tay, chất liệu cotton 100%, form fit',
            category: 'shirt',
            unit_price: 350000,
            image_url: 'https://example.com/shirt1.jpg',
            status: Status.ACTIVE,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            code: 'SP002',
            name: 'Quần jean nam slim fit',
            description: 'Quần jean nam, kiểu dáng slim fit, màu xanh đậm',
            category: 'jeans',
            unit_price: 450000,
            image_url: 'https://example.com/jeans1.jpg',
            status: Status.ACTIVE,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            code: 'SP003',
            name: 'Áo thun nữ form rộng',
            description: 'Áo thun nữ form rộng, chất liệu cotton 100%, màu trắng',
            category: 'tshirt',
            unit_price: 250000,
            image_url: 'https://example.com/tshirt1.jpg',
            status: Status.ACTIVE,
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            code: 'SP004',
            name: 'Váy đầm dự tiệc',
            description: 'Váy đầm dự tiệc, chất liệu lụa cao cấp, màu đỏ',
            category: 'dress',
            unit_price: 850000,
            image_url: 'https://example.com/dress1.jpg',
            status: Status.ACTIVE,
            created_at: new Date().toISOString(),
          },
        ];
        setProducts(sampleData);
        setTotalItems(sampleData.length);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal để thêm sản phẩm mới
  const handleAddNew = () => {
    setCurrentProduct({
      status: Status.ACTIVE,
      unit_price: 0,
      category: 'shirt'
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa sản phẩm
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Xử lý lưu form
  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (isEditing) {
        // Cập nhật sản phẩm
        const { data, error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentProduct.id)
          .select();
        
        if (error) throw error;
        
        // Cập nhật state
        setProducts(prev => 
          prev.map(p => p.id === currentProduct.id ? { ...p, ...productData } as Product : p)
        );
      } else {
        // Thêm sản phẩm mới
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();
        
        if (error) throw error;
        
        if (data) {
          setProducts(prev => [data[0], ...prev]);
          setTotalItems(prev => prev + 1);
        }
      }
      
      // Đóng modal
      setIsModalOpen(false);
      setCurrentProduct({});
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      // Xóa sản phẩm từ Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Cập nhật state
      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalItems(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  // Định dạng giá tiền
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Lấy tên loại sản phẩm
  const getCategoryName = (category: string | undefined) => {
    return PRODUCT_CATEGORIES.find(c => c.value === category)?.label || category || 'Chưa phân loại';
  };

  // Xử lý sắp xếp
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <RefineClient>
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
            <div className="flex space-x-4">
              <div className="flex border border-gray-300 rounded-md">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  <span className="material-icons">grid_view</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`px-3 py-1 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  <span className="material-icons">list</span>
                </button>
              </div>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    !showImportExport
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setShowImportExport(false)}
                >
                  Danh sách sản phẩm
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    showImportExport
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setShowImportExport(true)}
                >
                  Nhập/Xuất dữ liệu
                </button>
              </nav>
            </div>
          </div>

          {showImportExport ? (
            <ImportExport 
              products={products}
              onImportSuccess={(newProducts) => {
                setProducts(prev => [...newProducts, ...prev]);
                setTotalItems(prev => prev + newProducts.length);
                setShowImportExport(false);
              }}
            />
          ) : (
            <>
              {/* Search bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Products grid/list */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2">{product.code}</p>
                        <p className="text-blue-600 font-semibold mb-2">
                          {formatCurrency(product.unit_price)}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {getCategoryName(product.category)}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <span className="material-icons">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          Tên sản phẩm
                          {sortField === 'name' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('code')}
                        >
                          Mã sản phẩm
                          {sortField === 'code' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('category')}
                        >
                          Danh mục
                          {sortField === 'category' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('unit_price')}
                        >
                          Giá
                          {sortField === 'unit_price' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('status')}
                        >
                          Trạng thái
                          {sortField === 'status' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={product.image_url || '/placeholder.png'}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {getCategoryName(product.category)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(product.unit_price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.status === Status.ACTIVE
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status === Status.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <span className="material-icons">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <span className="material-icons">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <span className="material-icons">chevron_left</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <span className="material-icons">chevron_right</span>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                <ProductForm
                  product={currentProduct}
                  onSave={handleSave}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setCurrentProduct({});
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </RefineClient>
  );
} 