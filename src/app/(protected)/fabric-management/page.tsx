"use client";

import React, { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import FabricTable from "@/components/fabric-management/FabricTable";
import FabricForm from "@/components/fabric-management/FabricForm";
import { InventoryTable } from "@/components/fabric-management/InventoryTable";
import InventoryForm from "@/components/fabric-management/InventoryForm";
import CuttingOrderList from "@/components/fabric-management/CuttingOrderList";
import { Tabs, Tab } from "@/components/fabric-management/Tabs";
import InventoryDashboard from '@/components/fabric-management/InventoryDashboard';
import FabricIssueTable from '@/components/fabric-management/FabricIssueTable';
import FabricIssueForm from '@/components/fabric-management/FabricIssueForm';
import CuttingOrderDetail from '@/components/fabric-management/CuttingOrderDetail';
import InventoryCheckForm from '@/components/fabric-management/InventoryCheckForm';
import InventoryCheckList from '@/components/fabric-management/InventoryCheckList';
import InventoryCheckReport from '../../components/fabric-management/InventoryCheckReport';
import FabricQualityControl from '../../components/fabric-management/FabricQualityControl';
import { TabItem } from '../../components/fabric-management/Tabs';

// Import mock data
import { 
  Fabric, 
  FabricInventory, 
  CuttingOrder,
  FabricIssue,
  mockFabrics, 
  mockInventory, 
  mockCuttingOrders, 
  mockSuppliers,
  mockFabricIssues,
  mockFabricIssueItems,
  mockEmployees,
  mockCuttingOrderDetails,
  mockInventoryChecks,
  mockInventoryCheckItems,
  InventoryCheck,
  InventoryCheckItem
} from "@/mocks/fabric-management.mock";

// Thêm mock data cho báo cáo chất lượng
interface QualityControlRecord {
  id: string;
  inventoryId: number;
  rollId: string;
  fabricName: string;
  inspectionDate: string;
  inspectedBy: string;
  originalGrade: string;
  newGrade: string;
  defects: any[];
  comments: string;
}

// Thay thế các hàm fetch dữ liệu bằng cách sử dụng API services
import { fabricService, inventoryService } from '@/services/fabric-management';

export default function FabricManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [inventory, setInventory] = useState<FabricInventory[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<{id: number, name: string}[]>([]);
  const [cuttingOrders, setCuttingOrders] = useState<CuttingOrder[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State cho FabricForm
  const [showFabricForm, setShowFabricForm] = useState<boolean>(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  
  // State cho InventoryForm
  const [showInventoryForm, setShowInventoryForm] = useState<boolean>(false);
  
  // State cho IssueForm
  const [showIssueForm, setShowIssueForm] = useState<boolean>(false);
  const [editingIssue, setEditingIssue] = useState<any>(null);
  
  const [selectedTab, setSelectedTab] = useState('fabric');
  const [selectedCuttingOrder, setSelectedCuttingOrder] = useState<CuttingOrder | null>(null);
  
  // State cho kiểm kê
  const [showInventoryCheckForm, setShowInventoryCheckForm] = useState(false);
  const [selectedInventoryCheck, setSelectedInventoryCheck] = useState<InventoryCheck | undefined>(undefined);
  
  // State mới cho quản lý chất lượng
  const [qualityRecords, setQualityRecords] = useState<QualityControlRecord[]>([]);
  
  // Mảng tabs cho chức năng mới
  const fabricTabs: TabItem[] = [
    { id: 'dashboard', label: 'Tổng quan' },
    { id: 'inventory', label: 'Kho vải' },
    { id: 'quality', label: 'Kiểm soát chất lượng' },
    { id: 'cutting-orders', label: 'Lệnh cắt' },
    { id: 'check', label: 'Kiểm kê' },
    { id: 'reports', label: 'Báo cáo' },
  ];
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Kiểm tra xem API có hoạt động không
        console.log("Kiểm tra API...");
        
        // Sử dụng API thực tế với xử lý lỗi, fallback về mock data nếu cần
        try {
          // 1. Tải dữ liệu nhà cung cấp
          const suppliersData = await fetchSuppliers();
          console.log("Loaded suppliers:", suppliersData.length);
          
          // 2. Tải dữ liệu loại vải
          const fabricsData = await fetchFabrics();
          console.log("Loaded fabrics:", fabricsData.length);
          
          // 3. Tải dữ liệu kho
          const inventoryData = await fetchInventory();
          console.log("Loaded inventory:", inventoryData.length);
          
          // 4. Tải các dữ liệu khác
          await fetchCuttingOrders();
          await fetchIssues();
          await fetchEmployees();
        } catch (apiError) {
          console.error("API error, falling back to mock data:", apiError);
          setError("Không thể kết nối đến Supabase API. Sử dụng dữ liệu mẫu thay thế.");
          
          // Fallback to mock data
          setSuppliers(mockSuppliers);
          setFabrics(mockFabrics);
          
          // Đảm bảo dữ liệu kho hợp lệ
          const validInventory = mockInventory.filter(item => 
            mockFabrics.some(f => f.id === item.fabric_id)
          );
          setInventory(validInventory);
          
          setCuttingOrders(mockCuttingOrders);
          setIssues(mockFabricIssues);
          setEmployees(mockEmployees);
        }
        
        // Đặt dashboard làm tab mặc định sau khi dữ liệu đã sẵn sàng
        setActiveTab("dashboard");
      } catch (err) {
        console.error("Error during initialization:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Debug effect to log data when it changes
  useEffect(() => {
    if (!isLoading) {
      console.log("Debug - Fabrics:", fabrics);
      console.log("Debug - Inventory:", inventory);
    }
  }, [fabrics, inventory, isLoading]);
  
  // Sử dụng API services thay vì mock data
  const fetchSuppliers = async () => {
    try {
      // Giả định sẽ có supplierService
      // const suppliers = await supplierService.getAllSuppliers();
      // Tạm thời sử dụng mock data
      const suppliers = mockSuppliers;
      setSuppliers(suppliers);
      return suppliers;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  };
  
  const fetchFabrics = async () => {
    try {
      // Sử dụng API service
      let fabrics;
      try {
        fabrics = await fabricService.getAllFabrics();
        console.log("Fetched fabrics from API:", fabrics.length);
      } catch (apiError) {
        console.warn("Error fetching fabrics from API, using mock data:", apiError);
        fabrics = mockFabrics;
      }
      
      setFabrics(fabrics);
      return fabrics;
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      throw error;
    }
  };
  
  const fetchInventory = async () => {
    try {
      // Sử dụng API service
      let inventory;
      try {
        inventory = await inventoryService.getAllInventory();
        console.log("Fetched inventory from API:", inventory.length);
      } catch (apiError) {
        console.warn("Error fetching inventory from API, using mock data:", apiError);
        
        // Đảm bảo chỉ sử dụng các mục kho có fabric_id hợp lệ
        inventory = mockInventory.filter(item => 
          mockFabrics.some(f => f.id === item.fabric_id)
        );
      }
      
      setInventory(inventory);
      return inventory;
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
  
  const fetchIssues = async () => {
    try {
      // Sử dụng mock data
      setIssues(mockFabricIssues);
    } catch (error) {
      console.error("Error fetching fabric issues:", error);
      throw error;
    }
  };
  
  const fetchEmployees = async () => {
    try {
      // Sử dụng mock data
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };
  
  // Xử lý cho Fabric Form
  const handleOpenFabricForm = (fabric: Fabric | null = null) => {
    setEditingFabric(fabric);
    setShowFabricForm(true);
  };
  
  const handleCloseFabricForm = () => {
    setEditingFabric(null);
    setShowFabricForm(false);
  };
  
  const handleSaveFabric = async (fabric: Omit<Fabric, 'created_at' | 'updated_at'> & { created_at?: string, updated_at?: string }) => {
    try {
      if (fabric.id) {
        // Cập nhật vải
        const updatedFabric = await fabricService.updateFabric(fabric.id, fabric);
        
        // Cập nhật state
        setFabrics(prevFabrics => 
          prevFabrics.map(item => item.id === updatedFabric.id ? updatedFabric : item)
        );
        
        setSuccess("Đã cập nhật thông tin vải thành công!");
      } else {
        // Thêm vải mới
        const newFabric = await fabricService.createFabric(fabric);
        
        // Cập nhật state
        setFabrics(prevFabrics => [newFabric, ...prevFabrics]);
        
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
      // Xóa vải
      await fabricService.deleteFabric(id);
      
      // Cập nhật state
      setFabrics(prevFabrics => prevFabrics.filter(item => item.id !== id));
      
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
      // Thêm cuộn vải mới vào kho
      const newInventoryItem = await inventoryService.createInventoryItem(inventoryItem);
      
      // Cập nhật state
      setInventory(prevInventory => [newInventoryItem, ...prevInventory]);
      
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
  
  // Lọc ra các cuộn vải có sẵn để chọn khi xuất kho
  const availableInventory = inventory.filter(item => item.status === 'available');
  
  // Xử lý cho Issue Form
  const handleOpenIssueForm = (issue = null) => {
    setEditingIssue(issue);
    setShowIssueForm(true);
  };
  
  const handleCloseIssueForm = () => {
    setEditingIssue(null);
    setShowIssueForm(false);
  };
  
  const handleSaveIssue = async (issueData: Omit<FabricIssue, 'id' | 'created_at' | 'updated_at'>, selectedInventoryIds: number[]) => {
    try {
      // Tạo mới hoặc cập nhật phiếu xuất
      let newIssue: FabricIssue;
      let updatedInventory = [...inventory];
      
      if (editingIssue) {
        // Cập nhật phiếu xuất hiện có
        newIssue = {
          ...editingIssue,
          ...issueData,
          updated_at: new Date().toISOString()
        };
        
        setIssues(issues.map(issue => issue.id === editingIssue.id ? newIssue : issue));
        setSuccess("Cập nhật phiếu xuất vải thành công!");
      } else {
        // Tạo mới phiếu xuất
        newIssue = {
          ...issueData,
          id: issues.length > 0 ? Math.max(...issues.map(issue => issue.id)) + 1 : 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          issue_code: issueData.issue_code,
          issue_date: issueData.issue_date,
          production_order_id: issueData.production_order_id,
          production_order_no: issueData.production_order_no,
          cutting_order_id: issueData.cutting_order_id,
          cutting_order_no: issueData.cutting_order_no,
          issued_by: issueData.issued_by,
          issued_by_name: issueData.issued_by_name,
          received_by: issueData.received_by,
          received_by_name: issueData.received_by_name,
          status: issueData.status,
          notes: issueData.notes,
          total_rolls: issueData.total_rolls,
          total_length: issueData.total_length,
          total_weight: issueData.total_weight
        };
        
        setIssues([newIssue, ...issues]);
        
        // Cập nhật trạng thái của các cuộn vải đã chọn
        updatedInventory = inventory.map(item => {
          if (selectedInventoryIds.includes(item.id)) {
            return {
              ...item,
              status: 'in_use',
              updated_at: new Date().toISOString()
            };
          }
          return item;
        });
        
        setInventory(updatedInventory);
        setSuccess("Tạo phiếu xuất vải thành công!");
      }
      
      setShowIssueForm(false);
      setEditingIssue(null);
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error saving fabric issue:", err);
      setError("Có lỗi xảy ra khi lưu phiếu xuất vải. Vui lòng thử lại.");
    }
  };
  
  // Xử lý cập nhật trạng thái lệnh cắt
  const handleUpdateCuttingOrderStatus = (
    orderId: number, 
    status: string, 
    data?: { actual_start_date?: string; actual_end_date?: string; }
  ) => {
    // Cập nhật trạng thái lệnh cắt trong dữ liệu giả
    const updatedCuttingOrders = mockCuttingOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          ...data
        };
      }
      return order;
    });

    // Giả lập việc lưu dữ liệu
    console.log('Đã cập nhật trạng thái lệnh cắt:', updatedCuttingOrders.find(o => o.id === orderId));
    
    // Cập nhật lệnh cắt đã chọn
    if (selectedCuttingOrder && selectedCuttingOrder.id === orderId) {
      setSelectedCuttingOrder({
        ...selectedCuttingOrder,
        status,
        ...data
      });
    }
  };

  // Xử lý cập nhật tiêu thụ vải
  const handleUpdateFabricConsumption = (detailId: number, actualConsumed: number, wasteLength: number) => {
    // Tìm chi tiết lệnh cắt trong dữ liệu giả
    const updatedDetails = mockCuttingOrderDetails.map(detail => {
      if (detail.id === detailId) {
        const wastePercent = actualConsumed > 0 ? (wasteLength / actualConsumed) * 100 : 0;
        return {
          ...detail,
          actual_consumed_length: actualConsumed,
          waste_length: wasteLength,
          waste_percent: wastePercent
        };
      }
      return detail;
    });

    // Giả lập việc lưu dữ liệu
    console.log('Đã cập nhật tiêu thụ vải:', updatedDetails.find(d => d.id === detailId));
  };

  // Xử lý mở chi tiết lệnh cắt
  const handleOpenCuttingOrderDetail = (cuttingOrder: CuttingOrder) => {
    setSelectedCuttingOrder(cuttingOrder);
  };

  // Xử lý đóng chi tiết lệnh cắt
  const handleCloseCuttingOrderDetail = () => {
    setSelectedCuttingOrder(null);
  };

  // Xử lý khi mở form kiểm kê
  const handleOpenInventoryCheckForm = (inventoryCheck?: InventoryCheck) => {
    if (inventoryCheck) {
      setSelectedInventoryCheck(inventoryCheck);
    } else {
      setSelectedInventoryCheck(undefined);
    }
    setShowInventoryCheckForm(true);
  };

  // Xử lý khi đóng form kiểm kê
  const handleCloseInventoryCheckForm = () => {
    setShowInventoryCheckForm(false);
    setSelectedInventoryCheck(undefined);
  };

  // Xử lý khi lưu phiếu kiểm kê
  const handleSaveInventoryCheck = (checkData: InventoryCheck, checkItems: InventoryCheckItem[]) => {
    // Trong môi trường thực tế, sẽ gọi API để lưu dữ liệu
    console.log('Lưu phiếu kiểm kê:', checkData);
    console.log('Chi tiết kiểm kê:', checkItems);
    
    // Đóng form sau khi lưu
    setShowInventoryCheckForm(false);
    setSelectedInventoryCheck(undefined);
  };

  // Xử lý khi xóa phiếu kiểm kê
  const handleDeleteInventoryCheck = (checkId: number) => {
    // Xác nhận trước khi xóa
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu kiểm kê này không?')) {
      // Trong môi trường thực tế, sẽ gọi API để xóa dữ liệu
      console.log('Đã xóa phiếu kiểm kê có ID:', checkId);
    }
  };
  
  // Xử lý lưu báo cáo kiểm soát chất lượng
  const handleSaveQualityRecord = (record: QualityControlRecord) => {
    setQualityRecords([...qualityRecords, record]);
    
    // Cập nhật quality_grade cho inventory item
    const updatedInventory = mockInventory.map(item => {
      if (item.id === record.inventoryId) {
        return {
          ...item,
          quality_grade: record.newGrade,
          defect_notes: record.comments || item.defect_notes
        };
      }
      return item;
    });
    
    // Cập nhật state (trong thực tế sẽ gọi API)
    setInventory(updatedInventory);
    alert(`Đã lưu đánh giá chất lượng cho cuộn vải ${record.rollId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý kho vải</h1>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setSuccess(null)}
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Tabs
        tabs={fabricTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      >
        <Tab id="dashboard" label="Tổng quan">
          <div className="mt-4">
            {isLoading ? (
              <div className="text-center py-4">Đang tải dữ liệu...</div>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2 justify-end mb-4">
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      // Xử lý và sửa chữa dữ liệu
                      const validInventory = mockInventory.filter(item => 
                        mockFabrics.some(f => f.id === item.fabric_id)
                      );
                      
                      // Sửa các trạng thái không hợp lệ
                      const validStatuses = ['available', 'reserved', 'in_use', 'used'];
                      const correctedInventory = validInventory.map(item => {
                        const newItem = {...item};
                        
                        // Sửa trạng thái không hợp lệ
                        if (!validStatuses.includes(item.status)) {
                          newItem.status = 'available';
                        }
                        
                        // Sửa cấp chất lượng không hợp lệ
                        if (!['A', 'B', 'C', 'D'].includes(item.quality_grade)) {
                          newItem.quality_grade = 'A';
                        }
                        
                        // Đảm bảo giá trị số hợp lệ
                        if (typeof item.length !== 'number' || item.length <= 0) {
                          newItem.length = 100; // Giá trị mặc định
                        }
                        
                        if (typeof item.weight !== 'number' || item.weight <= 0) {
                          newItem.weight = 20; // Giá trị mặc định
                        }
                        
                        return newItem;
                      });
                      
                      // Cập nhật dữ liệu
                      setFabrics(mockFabrics);
                      setInventory(correctedInventory);
                      console.log("Đã sửa chữa dữ liệu: fabrics=", mockFabrics.length, "inventory=", correctedInventory.length);
                      setSuccess("Đã sửa chữa dữ liệu thành công!");
                      
                      setTimeout(() => setIsLoading(false), 500);
                    }}
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                  >
                    Sửa chữa dữ liệu
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setFabrics(mockFabrics);
                      setInventory(mockInventory);
                      console.log("Reset data: fabrics=", mockFabrics.length, "inventory=", mockInventory.length);
                      setTimeout(() => setIsLoading(false), 500);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Làm mới dữ liệu
                  </button>
                </div>
                <InventoryDashboard fabrics={fabrics} inventory={inventory} />
              </div>
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
              <InventoryTable 
                data={inventory as any} 
                isLoading={isLoading}
                edit={(id) => console.log('Edit inventory item:', id)}
                show={(id) => console.log('Show inventory item:', id)}
                handlePrefetch={(id) => console.log('Prefetch inventory item:', id)}
              />
            )}
          </div>
        </Tab>
        
        <Tab id="quality" label="Kiểm soát chất lượng">
          <div className="mt-4">
            <FabricQualityControl
              inventory={mockInventory}
              onSaveQualityRecord={handleSaveQualityRecord}
            />
          </div>
        </Tab>
        
        <Tab id="cutting-orders" label="Lệnh cắt">
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
              <CuttingOrderList 
                cuttingOrders={cuttingOrders} 
                onView={handleOpenCuttingOrderDetail}
                onStartCutting={(order: CuttingOrder) => handleUpdateCuttingOrderStatus(order.id, 'in-progress', { actual_start_date: new Date().toISOString() })}
              />
            )}
          </div>
        </Tab>
        
        <Tab id="check" label="Kiểm kê">
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Kiểm kê tồn kho vải</h2>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => handleOpenInventoryCheckForm()}
              >
                Tạo phiếu kiểm kê mới
              </button>
            </div>
            
            <InventoryCheckList 
              inventoryChecks={mockInventoryChecks}
              onView={(check) => console.log('Xem chi tiết kiểm kê:', check)}
              onEdit={handleOpenInventoryCheckForm}
              onDelete={handleDeleteInventoryCheck}
            />
          </div>
        </Tab>
        
        <Tab id="reports" label="Báo cáo">
          <div className="mt-4">
            <div className="space-y-8">
              {/* Hiển thị báo cáo kiểm kê gần nhất nếu có */}
              {mockInventoryChecks.length > 0 && mockInventoryCheckItems.length > 0 && (
                <InventoryCheckReport
                  inventoryCheck={mockInventoryChecks[mockInventoryChecks.length - 1]}
                  inventoryCheckItems={mockInventoryCheckItems.filter(
                    item => item.inventory_check_id === mockInventoryChecks[mockInventoryChecks.length - 1].id
                  )}
                  fabrics={mockFabrics}
                />
              )}
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Form nhập kho vải */}
      {showInventoryForm && (
        <InventoryForm
          fabrics={fabricsForInventoryForm}
          onSave={handleSaveInventory}
          onCancel={handleCloseInventoryForm}
        />
      )}

      {/* Form kiểm kê */}
      {showInventoryCheckForm && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:align-middle">
              <InventoryCheckForm
                inventoryCheck={selectedInventoryCheck}
                inventoryItems={mockInventory}
                fabrics={mockFabrics}
                onSave={handleSaveInventoryCheck}
                onCancel={handleCloseInventoryCheckForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chi tiết lệnh cắt */}
      {selectedCuttingOrder && (
        <CuttingOrderDetail
          cuttingOrder={selectedCuttingOrder}
          cuttingOrderDetails={mockCuttingOrderDetails.filter(detail => detail.cutting_order_id === selectedCuttingOrder.id)}
          fabricIssues={mockFabricIssues.filter(issue => issue.cutting_order_id === selectedCuttingOrder.id)}
          employees={mockEmployees}
          onUpdateOrderStatus={handleUpdateCuttingOrderStatus}
          onUpdateFabricConsumption={handleUpdateFabricConsumption}
          onClose={handleCloseCuttingOrderDetail}
        />
      )}
    </div>
  );
} 