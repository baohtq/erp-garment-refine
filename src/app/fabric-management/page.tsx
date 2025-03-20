"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import FabricTable from "@/components/fabric-management/FabricTable";
import FabricForm from "@/components/fabric-management/FabricForm";
import InventoryTable from "@/components/fabric-management/InventoryTable";
import InventoryForm from "@/components/fabric-management/InventoryForm";
import CuttingOrderList from "@/components/fabric-management/CuttingOrderList";
import { Tabs, Tab } from "@/components/fabric-management/Tabs";

// Import mock data
import { 
  Fabric, 
  FabricInventory, 
  CuttingOrder,
  mockFabrics, 
  mockInventory, 
  mockCuttingOrders, 
  mockSuppliers 
} from "@/mocks/fabric-management.mock";

export default function FabricManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("fabrics");
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [inventory, setInventory] = useState<FabricInventory[]>([]);
  const [cuttingOrders, setCuttingOrders] = useState<CuttingOrder[]>([]);
  const [suppliers, setSuppliers] = useState<{id: number, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State cho FabricForm
  const [showFabricForm, setShowFabricForm] = useState<boolean>(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  
  // State cho InventoryForm
  const [showInventoryForm, setShowInventoryForm] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await fetchSuppliers();
        await fetchFabrics();
        await fetchInventory();
        await fetchCuttingOrders();
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Sử dụng mock data thay vì gọi API
  const fetchSuppliers = async () => {
    try {
      // Sử dụng mock data
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  };
  
  const fetchFabrics = async () => {
    try {
      // Sử dụng mock data
      setFabrics(mockFabrics);
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      throw error;
    }
  };
  
  const fetchInventory = async () => {
    try {
      // Sử dụng mock data
      setInventory(mockInventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  };
  
  const fetchCuttingOrders = async () => {
    try {
      // Sử dụng mock data
      setCuttingOrders(mockCuttingOrders);
    } catch (error) {
      console.error("Error fetching cutting orders:", error);
      throw error;
    }
  };
  
  // Xử lý cho Fabric Form
  const handleAddNewFabric = () => {
    setEditingFabric(null);
    setShowFabricForm(true);
  };
  
  const handleEditFabric = (fabric: Fabric) => {
    setEditingFabric(fabric);
    setShowFabricForm(true);
  };
  
  const handleCloseFabricForm = () => {
    setShowFabricForm(false);
    setEditingFabric(null);
  };
  
  const handleSaveFabric = async (fabric: Omit<Fabric, 'created_at' | 'updated_at'> & { created_at?: string, updated_at?: string }) => {
    try {
      if (fabric.id) {
        // Cập nhật vải (mock)
        const updatedFabrics = fabrics.map(item => 
          item.id === fabric.id ? {
            ...fabric,
            updated_at: new Date().toISOString(),
            created_at: item.created_at
          } as Fabric : item
        );
        setFabrics(updatedFabrics);
        setSuccess("Đã cập nhật thông tin vải thành công!");
      } else {
        // Thêm vải mới (mock)
        const newFabric: Fabric = {
          ...fabric,
          id: fabrics.length > 0 ? Math.max(...fabrics.map(f => f.id)) + 1 : 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          supplier_name: suppliers.find(s => s.id === fabric.supplier_id)?.name
        };
        setFabrics([...fabrics, newFabric]);
        setSuccess("Đã thêm vải mới thành công!");
      }
      
      setShowFabricForm(false);
      setEditingFabric(null);
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error saving fabric:", err);
      setError("Có lỗi xảy ra khi lưu dữ liệu vải. Vui lòng thử lại.");
    }
  };
  
  const handleDeleteFabric = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vải này không?")) {
      return;
    }
    
    try {
      // Xóa vải (mock)
      const updatedFabrics = fabrics.filter(item => item.id !== id);
      setFabrics(updatedFabrics);
      setSuccess("Đã xóa vải thành công!");
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error deleting fabric:", err);
      setError("Có lỗi xảy ra khi xóa vải. Vui lòng thử lại.");
    }
  };
  
  // Xử lý cho Inventory Form
  const handleOpenInventoryForm = () => {
    setShowInventoryForm(true);
  };
  
  const handleCloseInventoryForm = () => {
    setShowInventoryForm(false);
  };
  
  const handleSaveInventory = async (inventoryItem: Omit<FabricInventory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Thêm cuộn vải mới vào kho (mock)
      const newInventoryItem: FabricInventory = {
        ...inventoryItem,
        id: inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        fabric_name: fabrics.find(f => f.id === inventoryItem.fabric_id)?.name,
        // Tự động tạo mã roll_id nếu chưa có
        roll_id: inventoryItem.roll_id || `R-${inventoryItem.supplier_code}`
      };
      
      setInventory([newInventoryItem, ...inventory]);
      setSuccess("Đã nhập kho vải thành công!");
      setShowInventoryForm(false);
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error saving inventory:", err);
      setError("Có lỗi xảy ra khi nhập kho vải. Vui lòng thử lại.");
    }
  };
  
  // Lọc ra thông tin cần thiết cho form nhập kho
  const fabricsForInventoryForm = fabrics.map(fabric => ({
    id: fabric.id,
    code: fabric.code,
    name: fabric.name
  }));
  
  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Quản lý kho vải</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p>{success}</p>
          </div>
        )}
        
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <Tab id="fabrics" label="Danh sách vải">
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Danh sách vải</h2>
                <button
                  type="button"
                  onClick={handleAddNewFabric}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Thêm mới
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <FabricTable 
                  fabrics={fabrics} 
                  onEdit={handleEditFabric} 
                  onDelete={handleDeleteFabric}
                  suppliers={suppliers}
                />
              )}
            </div>
          </Tab>
          
          <Tab id="inventory" label="Kho vải">
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Kho vải</h2>
                <button
                  type="button"
                  onClick={handleOpenInventoryForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Nhập kho vải
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <InventoryTable inventory={inventory} />
              )}
            </div>
          </Tab>
          
          <Tab id="cutting" label="Lệnh cắt">
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Lệnh cắt</h2>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Tạo lệnh cắt
                </button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
              ) : (
                <CuttingOrderList cuttingOrders={cuttingOrders} />
              )}
            </div>
          </Tab>
        </Tabs>
        
        {/* Form thêm/sửa vải */}
        {showFabricForm && (
          <FabricForm
            fabric={editingFabric}
            suppliers={suppliers}
            onSave={handleSaveFabric}
            onCancel={handleCloseFabricForm}
          />
        )}
        
        {/* Form nhập kho vải */}
        {showInventoryForm && (
          <InventoryForm
            fabrics={fabricsForInventoryForm}
            onSave={handleSaveInventory}
            onCancel={handleCloseInventoryForm}
          />
        )}
      </div>
    </AppLayout>
  );
} 