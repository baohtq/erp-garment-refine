import React from 'react';
import { Fabric, FabricInventory } from '../../mocks/fabric-management.mock';

interface InventoryDashboardProps {
  fabrics: Fabric[];
  inventory: FabricInventory[];
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ fabrics = [], inventory = [] }) => {
  // Log props to help debug
  console.log("InventoryDashboard received props:", { fabricsLength: fabrics.length, inventoryLength: inventory.length });
  
  // Kiểm tra mối quan hệ dữ liệu
  const validateDataRelationships = () => {
    const fabricIds = fabrics.map(f => f.id);
    const orphanedInventoryItems = inventory.filter(item => !fabricIds.includes(item.fabric_id));
    
    if (orphanedInventoryItems.length > 0) {
      console.error("Phát hiện mục kho không có loại vải tương ứng:", orphanedInventoryItems);
      return {
        valid: false,
        message: `Có ${orphanedInventoryItems.length} mục kho không tìm thấy loại vải tương ứng`,
        items: orphanedInventoryItems
      };
    }
    
    return { valid: true };
  };
  
  // Kiểm tra tính hợp lệ của dữ liệu
  const validateDataValues = () => {
    const validStatuses = ['available', 'reserved', 'in_use', 'used'];
    const validGrades = ['A', 'B', 'C', 'D'];
    const issues = [];
    
    // Kiểm tra trạng thái hợp lệ
    const invalidStatusItems = inventory.filter(item => !validStatuses.includes(item.status));
    if (invalidStatusItems.length > 0) {
      issues.push({
        type: 'invalid_status',
        message: `Có ${invalidStatusItems.length} mục có trạng thái không hợp lệ`,
        items: invalidStatusItems
      });
    }
    
    // Kiểm tra chất lượng hợp lệ
    const invalidGradeItems = inventory.filter(item => !validGrades.includes(item.quality_grade));
    if (invalidGradeItems.length > 0) {
      issues.push({
        type: 'invalid_grade',
        message: `Có ${invalidGradeItems.length} mục có cấp chất lượng không hợp lệ`,
        items: invalidGradeItems
      });
    }
    
    // Kiểm tra các giá trị số
    const invalidNumberItems = inventory.filter(item => 
      typeof item.length !== 'number' || 
      typeof item.weight !== 'number' || 
      item.length <= 0 || 
      item.weight <= 0
    );
    if (invalidNumberItems.length > 0) {
      issues.push({
        type: 'invalid_numbers',
        message: `Có ${invalidNumberItems.length} mục có giá trị số không hợp lệ`,
        items: invalidNumberItems
      });
    }
    
    return { 
      valid: issues.length === 0,
      issues
    };
  };
  
  // Thực hiện kiểm tra
  const dataRelationshipValidation = validateDataRelationships();
  const dataValueValidation = validateDataValues();
  
  // Kiểm tra nếu không có dữ liệu
  if (!fabrics.length || !inventory.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Tổng quan kho vải</h2>
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <p className="text-yellow-700">Không có dữ liệu hiển thị. Vui lòng thêm thông tin vải và nhập kho.</p>
        </div>
      </div>
    );
  }
  
  // Tính tổng số cuộn vải trong kho
  const totalRolls = inventory.length;
  
  // Tính tổng chiều dài vải còn khả dụng
  const totalAvailableLength = inventory
    .filter(item => item.status === 'available')
    .reduce((sum, item) => sum + item.length, 0);
  
  // Tính tổng trọng lượng vải còn khả dụng
  const totalAvailableWeight = inventory
    .filter(item => item.status === 'available')
    .reduce((sum, item) => sum + item.weight, 0);
  
  // Tính số cuộn theo trạng thái
  const rollsByStatus = inventory.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Tính số cuộn theo chất lượng
  const rollsByQuality = inventory.reduce((acc, item) => {
    acc[item.quality_grade] = (acc[item.quality_grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Phân tích tồn kho theo loại vải
  const inventoryByFabricType = fabrics.map(fabric => {
    // Lọc ra các mục kho thuộc loại vải này và có trạng thái "available"
    const fabricInventory = inventory.filter(item => 
      item.fabric_id === fabric.id && item.status === 'available'
    );
    
    // Log để debug
    if (fabricInventory.length === 0) {
      console.log(`Không có dữ liệu kho cho loại vải: ${fabric.name} (ID: ${fabric.id})`);
    }
    
    // Tính toán tổng hợp
    const totalLength = fabricInventory.reduce((sum, item) => sum + item.length, 0);
    const totalWeight = fabricInventory.reduce((sum, item) => sum + item.weight, 0);
    const totalRolls = fabricInventory.length;
    
    // Tính tồn kho tối thiểu
    const minStockAlert = totalLength < fabric.min_stock;
    const stockPercentage = fabric.min_stock > 0 ? (totalLength / fabric.min_stock) * 100 : 100;
    
    return {
      id: fabric.id,
      code: fabric.code,
      name: fabric.name,
      totalLength,
      totalWeight,
      totalRolls,
      minStock: fabric.min_stock,
      minStockAlert,
      stockPercentage: Math.min(stockPercentage, 100)
    };
  }).filter(item => item !== null);
  
  // Lọc ra các loại vải cần cảnh báo (dưới mức tồn kho tối thiểu)
  const fabricsNeedingRestock = inventoryByFabricType.filter(item => item.minStockAlert);
  
  // Tính toán xu hướng sử dụng vải (mô phỏng - trong thực tế cần dữ liệu sử dụng theo thời gian)
  const fabricUsageTrend = [
    { name: "Tháng 1", usage: 450 },
    { name: "Tháng 2", usage: 520 },
    { name: "Tháng 3", usage: 480 },
    { name: "Tháng 4", usage: 560 },
    { name: "Tháng 5", usage: 590 },
    { name: "Tháng 6", usage: 610 }
  ];
  
  // Hiệu suất sử dụng vải (KPI)
  const fabricEfficiency = {
    actualUsage: 85.6, // Tỷ lệ sử dụng thực tế (%)
    plannedUsage: 90.0, // Tỷ lệ sử dụng kế hoạch (%)
    wastage: 14.4 // Tỷ lệ hao hụt (%)
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tổng quan kho vải</h2>
      
      {/* Hiển thị cảnh báo lỗi dữ liệu nếu có */}
      {!dataRelationshipValidation.valid && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="text-md font-medium text-red-800">Cảnh báo: Lỗi mối quan hệ dữ liệu</h3>
          <p className="text-sm text-red-700 mt-1">{dataRelationshipValidation.message}</p>
          <p className="text-sm text-red-700 mt-1">Vui lòng kiểm tra lại dữ liệu kho và vải.</p>
        </div>
      )}
      
      {dataValueValidation.valid ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tổng số cuộn vải */}
          <div className="bg-indigo-50 rounded-lg p-4 shadow">
            <h3 className="text-sm font-medium text-indigo-600 uppercase">Tổng số cuộn vải</h3>
            <p className="text-3xl font-bold text-indigo-800">{totalRolls}</p>
            <div className="mt-2 text-sm text-indigo-600">
              <span className="font-medium">Khả dụng: </span>
              {rollsByStatus['available'] || 0} cuộn
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((rollsByStatus['available'] || 0) / totalRolls) * 100}%` }}></div>
            </div>
          </div>
          
          {/* Tổng chiều dài vải khả dụng */}
          <div className="bg-green-50 rounded-lg p-4 shadow">
            <h3 className="text-sm font-medium text-green-600 uppercase">Tổng chiều dài khả dụng</h3>
            <p className="text-3xl font-bold text-green-800">{totalAvailableLength.toLocaleString('vi-VN')} m</p>
            <div className="mt-2 text-sm text-green-600">
              <span className="font-medium">Đã đặt: </span>
              {inventory
                .filter(item => item.status === 'reserved')
                .reduce((sum, item) => sum + item.length, 0)
                .toLocaleString('vi-VN')} m
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(((totalAvailableLength) / 1000) * 100, 100)}%` }}></div>
            </div>
          </div>
          
          {/* Tổng trọng lượng vải khả dụng */}
          <div className="bg-blue-50 rounded-lg p-4 shadow">
            <h3 className="text-sm font-medium text-blue-600 uppercase">Tổng trọng lượng khả dụng</h3>
            <p className="text-3xl font-bold text-blue-800">{totalAvailableWeight.toLocaleString('vi-VN')} kg</p>
            <div className="mt-2 text-sm text-blue-600">
              <span className="font-medium">Đã đặt: </span>
              {inventory
                .filter(item => item.status === 'reserved')
                .reduce((sum, item) => sum + item.weight, 0)
                .toLocaleString('vi-VN')} kg
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(((totalAvailableWeight) / 200) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="text-md font-medium text-red-800">Cảnh báo: Lỗi giá trị dữ liệu</h3>
          <p className="text-sm text-red-700 mt-1">{dataValueValidation.issues[0].message}</p>
          <p className="text-sm text-red-700 mt-1">Vui lòng kiểm tra lại dữ liệu kho và vải.</p>
        </div>
      )}
      
      {/* Hiệu suất sử dụng vải (KPI) */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow">
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Hiệu suất sử dụng vải (KPI)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Tỷ lệ sử dụng thực tế</p>
            <p className="text-2xl font-bold text-indigo-600">{fabricEfficiency.actualUsage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${fabricEfficiency.actualUsage}%` }}></div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tỷ lệ sử dụng kế hoạch</p>
            <p className="text-2xl font-bold text-green-600">{fabricEfficiency.plannedUsage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${fabricEfficiency.plannedUsage}%` }}></div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tỷ lệ hao hụt</p>
            <p className="text-2xl font-bold text-red-600">{fabricEfficiency.wastage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${fabricEfficiency.wastage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Biểu đồ xu hướng sử dụng vải */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow">
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Xu hướng sử dụng vải 6 tháng gần đây (m)</h3>
        
        {fabricUsageTrend.length > 0 ? (
          <div className="h-60 flex items-end space-x-2">
            {fabricUsageTrend.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-indigo-500 rounded-t" 
                  style={{ height: `${(month.usage / 650) * 100}%` }}
                ></div>
                <p className="text-xs text-gray-600 mt-1">{month.name}</p>
                <p className="text-xs font-medium">{month.usage}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-60 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Không có dữ liệu xu hướng sử dụng vải</p>
          </div>
        )}
      </div>
      
      {/* Phân tích theo trạng thái và chất lượng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Phân tích theo trạng thái */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Phân tích theo trạng thái</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Khả dụng</span>
              <span className="text-sm font-medium">{rollsByStatus['available'] || 0} cuộn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Đã đặt</span>
              <span className="text-sm font-medium">{rollsByStatus['reserved'] || 0} cuộn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Đang sử dụng</span>
              <span className="text-sm font-medium">{rollsByStatus['in_use'] || 0} cuộn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Đã sử dụng</span>
              <span className="text-sm font-medium">{rollsByStatus['used'] || 0} cuộn</span>
            </div>
          </div>
          
          {/* Biểu đồ tròn đơn giản */}
          <div className="mt-4 flex justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#d1d5db" strokeWidth="3"></circle>
                
                {/* Khả dụng */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.91549430918954" 
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${(rollsByStatus['available'] || 0) / totalRolls * 100} 100`}
                  strokeDashoffset="25"
                ></circle>
                
                {/* Đã đặt */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.91549430918954" 
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray={`${(rollsByStatus['reserved'] || 0) / totalRolls * 100} 100`}
                  strokeDashoffset={`${100 - ((rollsByStatus['available'] || 0) / totalRolls * 100) + 25}`}
                ></circle>
                
                {/* Đang sử dụng */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.91549430918954" 
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${(rollsByStatus['in_use'] || 0) / totalRolls * 100} 100`}
                  strokeDashoffset={`${100 - ((rollsByStatus['available'] || 0) / totalRolls * 100 + (rollsByStatus['reserved'] || 0) / totalRolls * 100) + 25}`}
                ></circle>
                
                {/* Đã sử dụng */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.91549430918954" 
                  fill="transparent"
                  stroke="#6b7280"
                  strokeWidth="3"
                  strokeDasharray={`${(rollsByStatus['used'] || 0) / totalRolls * 100} 100`}
                  strokeDashoffset={`${100 - ((rollsByStatus['available'] || 0) / totalRolls * 100 + (rollsByStatus['reserved'] || 0) / totalRolls * 100 + (rollsByStatus['in_use'] || 0) / totalRolls * 100) + 25}`}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">{totalRolls} cuộn</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Phân tích theo chất lượng */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Phân tích theo chất lượng</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Loại A</span>
              <span className="text-sm font-medium">{rollsByQuality['A'] || 0} cuộn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Loại B</span>
              <span className="text-sm font-medium">{rollsByQuality['B'] || 0} cuộn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600 flex-1">Loại C</span>
              <span className="text-sm font-medium">{rollsByQuality['C'] || 0} cuộn</span>
            </div>
          </div>
          
          {/* Thanh tiến trình cho chất lượng */}
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Loại A</span>
                <span>{Math.round((rollsByQuality['A'] || 0) / totalRolls * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(rollsByQuality['A'] || 0) / totalRolls * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Loại B</span>
                <span>{Math.round((rollsByQuality['B'] || 0) / totalRolls * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(rollsByQuality['B'] || 0) / totalRolls * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Loại C</span>
                <span>{Math.round((rollsByQuality['C'] || 0) / totalRolls * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(rollsByQuality['C'] || 0) / totalRolls * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cảnh báo tồn kho thấp */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Cảnh báo tồn kho thấp</h3>
        
        {fabricsNeedingRestock.length === 0 ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg shadow">
            Tất cả nguyên liệu vải đều đủ tồn kho tối thiểu
          </div>
        ) : (
          <div className="bg-red-50 rounded-lg overflow-hidden shadow">
            <div className="px-4 py-2 bg-red-100 text-red-800 font-medium">
              Có {fabricsNeedingRestock.length} loại vải dưới mức tồn kho tối thiểu
            </div>
            <ul className="divide-y divide-red-100">
              {fabricsNeedingRestock.map(fabric => (
                <li key={fabric.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{fabric.name}</p>
                    <p className="text-sm text-gray-600">Mã: {fabric.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium">
                      {fabric.totalLength.toLocaleString('vi-VN')} m / {fabric.minStock.toLocaleString('vi-VN')} m
                    </p>
                    <p className="text-sm text-gray-600">
                      Thiếu: {Math.max(0, fabric.minStock - fabric.totalLength).toLocaleString('vi-VN')} m
                    </p>
                    <div className="w-40 bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${fabric.stockPercentage}%` }}></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Bảng tồn kho theo loại vải */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Tồn kho theo loại vải</h3>
        
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã vải
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên vải
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số cuộn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng chiều dài (m)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng trọng lượng (kg)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho tối thiểu (m)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ tồn kho
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryByFabricType.length > 0 ? (
                inventoryByFabricType.map((fabric) => (
                  <tr key={fabric.id} className={fabric.minStockAlert ? "bg-red-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fabric.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fabric.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fabric.totalRolls}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fabric.totalLength}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fabric.totalWeight}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fabric.minStock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${fabric.minStockAlert ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {fabric.minStockAlert ? 'Dưới mức' : 'Đạt chuẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${fabric.minStockAlert ? 'bg-red-600' : 'bg-green-600'} h-2 rounded-full`} 
                          style={{ width: `${fabric.stockPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {Math.round(fabric.stockPercentage)}%
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Không có dữ liệu tồn kho theo loại vải
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard; 