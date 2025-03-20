"use client";

import React, { useState, useEffect } from "react";
import { RefineClient } from "../client";
import AppLayout from "@components/layout/AppLayout";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { SUPABASE_URL, SUPABASE_KEY } from "@utils/supabase/constants";

// Định nghĩa kiểu dữ liệu cho nguyên vật liệu
interface Material {
  id: string;
  code: string;
  name: string;
  type_id: string;
  type_name?: string;
  unit: string;
  stock_quantity: number;
  min_quantity: number;
  price: number;
  supplier_id: string;
  supplier_name?: string;
  status: string;
  properties?: Record<string, any>;
  created_at: string;
}

// Định nghĩa kiểu dữ liệu cho dữ liệu nhận từ Supabase
interface SupplierDB {
  id: number;
  name: string;
}

interface MaterialTypeDB {
  id: string;
  name: string;
  code: string;
  parent_id: string | null;
}

interface MaterialFromDB {
  id: number;
  code: string;
  name: string;
  description: string | null;
  unit: string;
  current_stock: number;
  min_quantity: number;
  supplier_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  suppliers?: SupplierDB;
}

interface MaterialReceiptDB {
  id: number;
  receipt_no: string;
  receive_date: string;
  supplier_id: number | null;
}

interface MaterialIssueDB {
  id: number;
  issue_no: string;
  issue_date: string;
  production_order_id: number | null;
}

interface ProductionOrderDB {
  id: number;
  order_no: string;
}

interface MaterialReceiptItemDB {
  id: number;
  material_receipt_id: number;
  quantity: number;
  received_quantity: number;
  unit_price: number | null;
  created_at: string;
}

interface MaterialIssueItemDB {
  id: number;
  material_issue_id: number;
  planned_quantity: number;
  issued_quantity: number;
  created_at: string;
}

interface MaterialHistoryItem {
  id: string;
  date: string;
  type: 'Nhập kho' | 'Xuất kho';
  document: string;
  quantity: number;
  planQuantity: number;
  reference: string;
  created_at: string;
}

const UNITS = [
  { value: "m", label: "Mét" },
  { value: "kg", label: "Kg" },
  { value: "yard", label: "Yard" },
  { value: "pcs", label: "Cái" },
  { value: "roll", label: "Cuộn" },
  { value: "dozen", label: "Tá" },
  { value: "box", label: "Hộp" },
];

export default function MaterialsPage() {
  const [isClient, setIsClient] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [materialTypes, setMaterialTypes] = useState<{ id: string; name: string; code: string; parent_id: string | null }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockItems, setLowStockItems] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [materialHistory, setMaterialHistory] = useState<MaterialHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentTypeProperties, setCurrentTypeProperties] = useState<any[]>([]);
  
  // Thêm state cho bộ lọc nâng cao
  const [filters, setFilters] = useState({
    type: '',
    supplier: '',
    stockStatus: '',
    showAdvancedFilters: false
  });
  
  // Thêm state cho debug
  const [debugInfo, setDebugInfo] = useState<{tables: string[], error: string | null}>({
    tables: [],
    error: null
  });
  
  // Function để kiểm tra kết nối database
  const checkDatabaseConnection = async () => {
    try {
      console.log("Checking database connection...");
      
      // Thử truy vấn đơn giản
      const { data, error } = await supabaseBrowserClient
        .from('materials')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error("Error connecting to materials table:", error);
        
        // Nếu không có bảng, thử tạo bảng
        if (error.code === "PGRST116") { // Table does not exist
          await initializeMaterialsTable();
        }
        
        setDebugInfo({
          tables: [],
          error: `Lỗi kết nối đến bảng materials: ${error.message}`
        });
        return;
      }
      
      const materialsCount = data ? data.length : 0;
      
      // Không sử dụng RPC get_columns vì gây lỗi 404
      setDebugInfo({
        tables: [`materials (count: ${materialsCount})`, 
          "Không thể hiển thị danh sách cột (chức năng RPC không khả dụng)"],
        error: null
      });
    } catch (error) {
      console.error("Error in checkDatabaseConnection:", error);
      setDebugInfo({
        tables: [],
        error: `Lỗi kết nối: ${error}`
      });
    }
  };
  
  // Khởi tạo bảng materials nếu chưa tồn tại
  const initializeMaterialsTable = async () => {
    try {
      console.log("Initializing materials table...");
      
      // Sử dụng SQL để tạo bảng materials
      const { error } = await supabaseBrowserClient.rpc('initialize_materials_table');
      
      if (error) {
        console.error("Error creating materials table:", error);
        
        // Thử phương pháp khác: sử dụng client API
        const createTableResult = await supabaseBrowserClient
          .from('materials')
          .insert([
            { 
              code: 'SAMPLE-001', 
              name: 'Sample Material',
              description: 'fabric',
              unit: 'pcs',
              current_stock: 100,
              min_quantity: 10,
              status: 'active'
            }
          ]);
          
        console.log("Create table result:", createTableResult);
      } else {
        console.log("Materials table created successfully");
      }
    } catch (error) {
      console.error("Error in initializeMaterialsTable:", error);
    }
  };
  
  useEffect(() => {
    setIsClient(true);
    fetchMaterials();
    fetchSuppliers();
    checkDatabaseConnection(); // Kiểm tra kết nối thay vì danh sách bảng
  }, []);

  // Thêm useEffect để tải danh sách loại nguyên vật liệu
  useEffect(() => {
    if (isClient) {
      fetchMaterialTypes();
    }
  }, [isClient]);
  
  // Hàm tải danh sách loại nguyên vật liệu
  const fetchMaterialTypes = async () => {
    try {
      /*
      const { data, error } = await supabaseBrowserClient
        .from('material_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setMaterialTypes(data || []);
      */
      
      // Dữ liệu mẫu
      const sampleData = [
        { id: '1', name: 'Vải', code: 'FABRIC', parent_id: null },
        { id: '2', name: 'Cúc', code: 'BUTTONS', parent_id: null },
        { id: '3', name: 'Vải Cotton', code: 'CTNFABRIC', parent_id: '1' },
        { id: '4', name: 'Vải Lụa', code: 'SILKFABRIC', parent_id: '1' },
        { id: '5', name: 'Cúc Nhựa', code: 'PLASTICBTN', parent_id: '2' }
      ];
      
      setMaterialTypes(sampleData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách loại nguyên vật liệu:", error);
    }
  };
  
  // Hàm tải thuộc tính của loại nguyên vật liệu
  const fetchTypeProperties = async (typeId: string) => {
    if (!typeId) {
      setCurrentTypeProperties([]);
      return;
    }
    
    try {
      const { data, error } = await supabaseBrowserClient
        .from('material_type_properties')
        .select('*')
        .eq('material_type_id', typeId);
      
      if (error) throw error;
      
      setCurrentTypeProperties(data || []);
      
      // Khởi tạo giá trị mặc định cho các thuộc tính
      const defaultProperties: Record<string, any> = {};
      
      data?.forEach(prop => {
        if (prop.default_value) {
          defaultProperties[prop.name] = prop.default_value;
        } else {
          if (prop.type === 'text') defaultProperties[prop.name] = '';
          if (prop.type === 'number') defaultProperties[prop.name] = 0;
          if (prop.type === 'boolean') defaultProperties[prop.name] = false;
          if (prop.type === 'select') defaultProperties[prop.name] = prop.options?.[0] || '';
        }
      });
      
      // Cập nhật properties cho nguyên vật liệu hiện tại
      setCurrentMaterial(prev => ({
        ...prev,
        properties: {
          ...(prev.properties || {}),
          ...defaultProperties
        }
      }));
      
    } catch (error) {
      console.error("Lỗi khi tải thuộc tính của loại nguyên vật liệu:", error);
    }
  };
  
  // Cập nhật hàm handleTypeChange
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    setCurrentMaterial({...currentMaterial, type_id: typeId});
    fetchTypeProperties(typeId);
  };
  
  // Thêm hàm cập nhật giá trị thuộc tính
  const handlePropertyChange = (name: string, value: any) => {
    setCurrentMaterial(prev => ({
      ...prev,
      properties: {
        ...(prev.properties || {}),
        [name]: value
      }
    }));
  };

  // Tìm kiếm nguyên vật liệu
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch danh sách nguyên vật liệu
  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      // Sử dụng dữ liệu mẫu thay vì gọi API
      /*
      // Lấy dữ liệu với join để lấy tên của loại nguyên vật liệu
      const { data, error } = await supabaseBrowserClient
        .from('materials')
        .select(`
          *,
          suppliers:supplier_id (name),
          material_types:type_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data.map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        type_id: item.type_id,
        type_name: item.material_types?.name || 'Không xác định',
        unit: item.unit,
        stock_quantity: item.stock_quantity,
        min_quantity: item.min_quantity,
        price: item.price,
        supplier_id: item.supplier_id,
        supplier_name: item.suppliers?.name || 'Không xác định',
        status: item.status,
        properties: item.properties || {},
        created_at: item.created_at
      }));
      
      setMaterials(formattedData);
      */

      // Dữ liệu mẫu
      const sampleData: Material[] = [
        {
          id: '1',
          code: 'VAI-001',
          name: 'Vải cotton 100%',
          type_id: '1',
          type_name: 'Vải',
          unit: 'm',
          stock_quantity: 1200,
          min_quantity: 500,
          price: 85000,
          supplier_id: '1',
          supplier_name: 'Công ty Vải Phương Nam',
          status: 'active',
          properties: {
            'Thành phần': 'Cotton 100%',
            'Màu sắc': 'Trắng',
            'Khổ vải': 1.5
          },
          created_at: '2023-01-15',
        },
        {
          id: '2',
          code: 'CUC-001',
          name: 'Cúc nhựa 4 lỗ',
          type_id: '2',
          type_name: 'Cúc',
          unit: 'pcs',
          stock_quantity: 15000,
          min_quantity: 2000,
          price: 500,
          supplier_id: '2',
          supplier_name: 'Xưởng May Thanh Hương',
          status: 'active',
          properties: {
            'Kích thước': 'Nhỏ',
            'Chất liệu': 'Nhựa'
          },
          created_at: '2023-02-20',
        },
        {
          id: '3',
          code: 'VAI-002',
          name: 'Vải cotton lụa',
          type_id: '3',
          type_name: 'Vải Cotton',
          unit: 'm',
          stock_quantity: 450,
          min_quantity: 500,
          price: 120000,
          supplier_id: '1',
          supplier_name: 'Công ty Vải Phương Nam',
          status: 'active',
          properties: {
            'Thành phần': 'Cotton 80%, Lụa 20%',
            'Màu sắc': 'Xanh',
            'Khổ vải': 1.2,
            'Tỷ lệ cotton': 80,
            'Độ co giãn': true
          },
          created_at: '2023-03-10',
        }
      ];
      
      setMaterials(sampleData);
      
      // Kiểm tra tồn kho thấp
      const lowStock = sampleData
        .filter(item => item.stock_quantity < item.min_quantity)
        .map(item => item.id);
      
      setLowStockItems(lowStock);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetchMaterials:", error);
      setIsLoading(false);
    }
  };

  // Fetch danh sách nhà cung cấp
  const fetchSuppliers = async () => {
    try {
      // Sử dụng dữ liệu mẫu
      const sampleSuppliers = [
        { id: '1', name: 'Công ty Vải Phương Nam' },
        { id: '2', name: 'Xưởng May Thanh Hương' },
        { id: '3', name: 'Nhà máy Dệt Tiến Phát' },
      ];
      
      setSuppliers(sampleSuppliers);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  // Mở modal để thêm nguyên vật liệu mới
  const handleAddNew = () => {
    setCurrentMaterial({
      type_id: 'fabric',
      unit: 'm',
      stock_quantity: 0,
      min_quantity: 0,
      price: 0,
      status: 'active'
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa nguyên vật liệu
  const handleEdit = (material: Material) => {
    setCurrentMaterial(material);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Xử lý lưu form
  const handleSave = async () => {
    if (!currentMaterial.name || !currentMaterial.code || !currentMaterial.supplier_id) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    try {
      if (isEditing) {
        // Cập nhật nguyên vật liệu
        const { error } = await supabaseBrowserClient
          .from('materials')
          .update({
            code: currentMaterial.code,
            name: currentMaterial.name,
            type_id: currentMaterial.type_id,
            unit: currentMaterial.unit,
            min_quantity: currentMaterial.min_quantity,
            price: currentMaterial.price,
            supplier_id: currentMaterial.supplier_id,
            properties: currentMaterial.properties || {},
            updated_at: new Date().toISOString()
          })
          .eq('id', currentMaterial.id);
        
        if (error) throw error;
      } else {
        // Thêm mới nguyên vật liệu
        const { error } = await supabaseBrowserClient
          .from('materials')
          .insert({
            code: currentMaterial.code,
            name: currentMaterial.name,
            type_id: currentMaterial.type_id,
            unit: currentMaterial.unit,
            stock_quantity: 0,
            min_quantity: currentMaterial.min_quantity,
            price: currentMaterial.price,
            supplier_id: currentMaterial.supplier_id,
            properties: currentMaterial.properties || {},
            status: 'active'
          });
        
        if (error) throw error;
      }
      
      // Đóng modal
      setIsModalOpen(false);
      setCurrentMaterial({});
    } catch (error) {
      console.error('Error saving material:', error);
      alert('Có lỗi xảy ra khi lưu nguyên vật liệu');
    }
  };

  // Xử lý xóa nguyên vật liệu
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nguyên vật liệu này?')) return;
    
    try {
      // Xóa nguyên vật liệu khỏi danh sách
      setMaterials(prev => prev.filter(m => m.id !== id));
      console.log("Đã xóa nguyên vật liệu có ID:", id);
      
      // Xóa khỏi danh sách cảnh báo tồn kho thấp nếu có
      setLowStockItems(prev => prev.filter(itemId => itemId !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Có lỗi xảy ra khi xóa nguyên vật liệu');
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

  // Lấy tên loại nguyên vật liệu
  const getMaterialTypeName = (type: string) => {
    const typeInfo = materialTypes.find(t => t.id === type);
    return typeInfo ? typeInfo.name : type;
  };

  // Lấy tên đơn vị
  const getUnitName = (unit: string) => {
    return UNITS.find(u => u.value === unit)?.label || unit;
  };

  // Lấy lịch sử nhập xuất của một nguyên vật liệu
  const fetchMaterialHistory = async (materialId: string) => {
    if (selectedMaterial === materialId) {
      setSelectedMaterial(null);
      setMaterialHistory([]);
      return;
    }

    setIsLoadingHistory(true);
    setSelectedMaterial(materialId);

    try {
      // Dữ liệu mẫu cho lịch sử nhập kho
      const sampleReceiptHistory: MaterialHistoryItem[] = [
        {
          id: `receipt-1`,
          date: '2023-12-10',
          type: 'Nhập kho',
          document: 'NK001',
          quantity: 500,
          planQuantity: 500,
          reference: 'Công ty Vải Phương Nam',
          created_at: '2023-12-10T09:00:00Z'
        },
        {
          id: `receipt-2`,
          date: '2023-11-05',
          type: 'Nhập kho',
          document: 'NK002',
          quantity: 300,
          planQuantity: 300,
          reference: 'Công ty Vải Phương Nam',
          created_at: '2023-11-05T10:30:00Z'
        }
      ];

      // Dữ liệu mẫu cho lịch sử xuất kho
      const sampleIssueHistory: MaterialHistoryItem[] = [
        {
          id: `issue-1`,
          date: '2024-01-10',
          type: 'Xuất kho',
          document: 'XK001',
          quantity: 200,
          planQuantity: 200,
          reference: 'Đơn hàng: SX001',
          created_at: '2024-01-10T14:00:00Z'
        },
        {
          id: `issue-2`,
          date: '2023-12-20',
          type: 'Xuất kho',
          document: 'XK002',
          quantity: 150,
          planQuantity: 150,
          reference: 'Đơn hàng: SX002',
          created_at: '2023-12-20T11:45:00Z'
        }
      ];

      // Lọc lịch sử theo materialId
      let filteredHistory: MaterialHistoryItem[] = [];
      
      if (materialId === '1') { // Vải cotton
        filteredHistory = [...sampleReceiptHistory, ...sampleIssueHistory];
      } else if (materialId === '2') { // Cúc nhựa
        filteredHistory = [sampleReceiptHistory[0], sampleIssueHistory[1]];
      } else if (materialId === '3') { // Khóa kéo
        filteredHistory = [sampleReceiptHistory[1], sampleIssueHistory[0]];
      } else if (materialId === '4') { // Chỉ may
        filteredHistory = [
          {
            id: `receipt-3`,
            date: '2024-01-05',
            type: 'Nhập kho',
            document: 'NK003',
            quantity: 100,
            planQuantity: 100,
            reference: 'Nhà máy Dệt Tiến Phát',
            created_at: '2024-01-05T09:15:00Z'
          },
          {
            id: `issue-3`,
            date: '2024-01-12',
            type: 'Xuất kho',
            document: 'XK003',
            quantity: 50,
            planQuantity: 50,
            reference: 'Đơn hàng: SX003',
            created_at: '2024-01-12T13:30:00Z'
          }
        ];
      }

      // Sắp xếp theo ngày tạo giảm dần
      const sortedHistory = filteredHistory.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setMaterialHistory(sortedHistory);
      console.log("Đã tải dữ liệu mẫu cho lịch sử nhập/xuất");
    } catch (error) {
      console.error('Error fetching material history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <RefineClient>
      <AppLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Nguyên phụ liệu</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Quản lý và theo dõi nguyên vật liệu trong kho
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="btn btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm nguyên liệu
            </button>
          </div>

          {/* Debug info */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Debug Information</h3>
            <p>Supabase URL: {SUPABASE_URL}</p>
            {debugInfo.error && (
              <p className="text-red-500">Error: {debugInfo.error}</p>
            )}
            <p>Tables in database:</p>
            {debugInfo.tables.length === 0 ? (
              <p className="italic">No tables found or unable to retrieve table list</p>
            ) : (
              <ul className="list-disc pl-5">
                {debugInfo.tables.map((table, index) => (
                  <li key={index}>{table}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Low Stock Warning */}
          {lowStockItems.length > 0 && (
            <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Cảnh báo: {lowStockItems.length} nguyên vật liệu dưới mức tồn kho tối thiểu
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {materials.filter(m => lowStockItems.includes(m.id)).map(m => (
                      <div key={m.id} className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                          {m.code}
                        </span>
                        <span>{m.name}</span>
                        <span className="text-red-600 dark:text-red-400">
                          {m.stock_quantity} {getUnitName(m.unit)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          (Tối thiểu: {m.min_quantity} {getUnitName(m.unit)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã, tên hoặc loại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Lọc
                </button>
                <button className="btn btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Xuất
                </button>
              </div>
            </div>
          </div>

          {/* Materials Table */}
          {isLoading ? (
            <div className="card">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="card">
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy nguyên vật liệu phù hợp</p>
                <button 
                  onClick={handleAddNew}
                  className="mt-4 btn btn-primary"
                >
                  Thêm nguyên vật liệu mới
                </button>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Mã NPL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tên NPL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Loại NPL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Đơn vị
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tồn kho
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Mức tồn tối thiểu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Đơn giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nhà cung cấp
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                            {material.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{material.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{material.type_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-secondary">
                            {getMaterialTypeName(material.type_id)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {getUnitName(material.unit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            lowStockItems.includes(material.id) 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {material.stock_quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {material.min_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(material.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {material.supplier_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(material)}
                              className="btn btn-icon btn-secondary"
                              title="Sửa"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(material.id)}
                              className="btn btn-icon btn-danger"
                              title="Xóa"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button
                              onClick={() => fetchMaterialHistory(material.id)}
                              className="btn btn-icon btn-primary"
                              title={selectedMaterial === material.id ? 'Ẩn lịch sử' : 'Xem lịch sử'}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Material History Section */}
          {selectedMaterial && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Lịch sử nhập xuất
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {materials.find(m => m.id === selectedMaterial)?.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="btn btn-icon btn-secondary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : materialHistory.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Chưa có dữ liệu nhập xuất cho nguyên vật liệu này
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Số chứng từ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Số lượng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Dự kiến
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tham chiếu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {materialHistory.map((item) => (
                        <tr key={item.id} className={`${
                          item.type === 'Nhập kho' 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              item.type === 'Nhập kho' ? 'badge-success' : 'badge-primary'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.document}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.planQuantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.reference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing ? "Chỉnh sửa nguyên vật liệu" : "Thêm nguyên vật liệu mới"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-icon btn-secondary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mã nguyên liệu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentMaterial.code || ""}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, code: e.target.value })
                        }
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tên nguyên liệu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentMaterial.name || ""}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, name: e.target.value })
                        }
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Loại nguyên liệu
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={currentMaterial.type_id || ''}
                        onChange={handleTypeChange}
                      >
                        <option value="">-- Chọn loại nguyên vật liệu --</option>
                        {materialTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.parent_id ? '└─ ' : ''}{type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Đơn vị tính
                      </label>
                      <select
                        value={currentMaterial.unit || "m"}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, unit: e.target.value })
                        }
                        className="input w-full"
                      >
                        {UNITS.map(unit => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Số lượng tồn kho
                      </label>
                      <input
                        type="number"
                        value={currentMaterial.stock_quantity || 0}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, stock_quantity: Number(e.target.value) })
                        }
                        className="input w-full"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mức tồn tối thiểu
                      </label>
                      <input
                        type="number"
                        value={currentMaterial.min_quantity || 0}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, min_quantity: Number(e.target.value) })
                        }
                        className="input w-full"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Đơn giá (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={currentMaterial.price || 0}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, price: Number(e.target.value) })
                        }
                        className="input w-full"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nhà cung cấp <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentMaterial.supplier_id || ""}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, supplier_id: e.target.value })
                        }
                        className="input w-full"
                        required
                      >
                        <option value="">-- Chọn nhà cung cấp --</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trạng thái
                      </label>
                      <select
                        value={currentMaterial.status || "active"}
                        onChange={(e) =>
                          setCurrentMaterial({ ...currentMaterial, status: e.target.value })
                        }
                        className="input w-full"
                      >
                        <option value="active">Đang sử dụng</option>
                        <option value="inactive">Ngừng sử dụng</option>
                      </select>
                    </div>
                  )}

                  {currentTypeProperties.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Thuộc tính</h3>
                      <div className="space-y-3">
                        {currentTypeProperties.map((prop) => (
                          <div key={prop.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {prop.name} {prop.required && <span className="text-red-500">*</span>}
                            </label>
                            
                            {prop.type === 'text' && (
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                value={currentMaterial.properties?.[prop.name] || ''}
                                onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                              />
                            )}
                            
                            {prop.type === 'number' && (
                              <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                value={currentMaterial.properties?.[prop.name] || 0}
                                onChange={(e) => handlePropertyChange(prop.name, parseFloat(e.target.value))}
                              />
                            )}
                            
                            {prop.type === 'boolean' && (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  checked={currentMaterial.properties?.[prop.name] || false}
                                  onChange={(e) => handlePropertyChange(prop.name, e.target.checked)}
                                />
                                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                  {prop.name}
                                </label>
                              </div>
                            )}
                            
                            {prop.type === 'select' && prop.options && (
                              <select
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                value={currentMaterial.properties?.[prop.name] || ''}
                                onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                              >
                                <option value="">-- Chọn {prop.name} --</option>
                                {(prop.options || []).map((option: string, index: number) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-6">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      {isEditing ? "Cập nhật" : "Thêm mới"}
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