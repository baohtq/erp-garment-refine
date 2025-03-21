import React from 'react';
import { InventoryCheck, InventoryCheckItem, Fabric } from '../../mocks/fabric-management.mock';

interface InventoryCheckReportProps {
  inventoryCheck: InventoryCheck;
  inventoryCheckItems: InventoryCheckItem[];
  fabrics: Fabric[];
}

const InventoryCheckReport: React.FC<InventoryCheckReportProps> = ({ 
  inventoryCheck, 
  inventoryCheckItems,
  fabrics
}) => {
  // Tính toán tổng hợp
  const totalItems = inventoryCheckItems.length;
  
  // Lọc các mục có chênh lệch
  const itemsWithDifference = inventoryCheckItems.filter(
    item => (item.length_difference && item.length_difference !== 0) || 
           (item.weight_difference && item.weight_difference !== 0)
  );
  
  // Tính tổng chênh lệch
  const totalLengthDifference = inventoryCheckItems.reduce(
    (sum, item) => sum + (item.length_difference || 0), 
    0
  );
  
  const totalWeightDifference = inventoryCheckItems.reduce(
    (sum, item) => sum + (item.weight_difference || 0), 
    0
  );
  
  // Tính chênh lệch theo phần trăm
  const totalSystemLength = inventoryCheckItems.reduce(
    (sum, item) => sum + item.system_length, 
    0
  );
  
  const totalSystemWeight = inventoryCheckItems.reduce(
    (sum, item) => sum + item.system_weight, 
    0
  );
  
  const totalActualLength = inventoryCheckItems.reduce(
    (sum, item) => sum + (item.actual_length || 0), 
    0
  );
  
  const totalActualWeight = inventoryCheckItems.reduce(
    (sum, item) => sum + (item.actual_weight || 0), 
    0
  );
  
  const lengthDifferencePercentage = totalSystemLength > 0 
    ? (totalLengthDifference / totalSystemLength) * 100 
    : 0;
  
  const weightDifferencePercentage = totalSystemWeight > 0 
    ? (totalWeightDifference / totalSystemWeight) * 100 
    : 0;
  
  // Phân tích theo loại vải
  const analysisByFabric = fabrics
    .filter(fabric => inventoryCheckItems.some(item => item.fabric_id === fabric.id))
    .map(fabric => {
      const fabricItems = inventoryCheckItems.filter(item => item.fabric_id === fabric.id);
      
      const fabricSystemLength = fabricItems.reduce(
        (sum, item) => sum + item.system_length, 
        0
      );
      
      const fabricActualLength = fabricItems.reduce(
        (sum, item) => sum + (item.actual_length || 0), 
        0
      );
      
      const fabricLengthDifference = fabricItems.reduce(
        (sum, item) => sum + (item.length_difference || 0), 
        0
      );
      
      const fabricDifferencePercentage = fabricSystemLength > 0 
        ? (fabricLengthDifference / fabricSystemLength) * 100 
        : 0;
      
      return {
        id: fabric.id,
        name: fabric.name,
        code: fabric.code,
        itemCount: fabricItems.length,
        systemLength: fabricSystemLength,
        actualLength: fabricActualLength,
        difference: fabricLengthDifference,
        differencePercentage: fabricDifferencePercentage
      };
    });
  
  // Phân loại mức độ chênh lệch
  const getDifferenceClass = (percentage: number) => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage < 1) return 'text-green-600';
    if (absPercentage < 3) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Phân loại mức độ chênh lệch cho báo cáo chi tiết
  const getItemDifferenceClass = (difference: number | null) => {
    if (!difference) return 'text-gray-500';
    const abs = Math.abs(difference);
    if (abs < 0.5) return 'text-green-600';
    if (abs < 2) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Báo cáo kiểm kê #{inventoryCheck.check_code}
        </h2>
        
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            inventoryCheck.status === 'completed' ? 'bg-green-100 text-green-800' :
            inventoryCheck.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {inventoryCheck.status === 'completed' ? 'Đã hoàn thành' :
             inventoryCheck.status === 'in-progress' ? 'Đang tiến hành' :
             'Nháp'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-3">Thông tin kiểm kê</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Mã kiểm kê</p>
                <p className="font-medium">{inventoryCheck.check_code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ngày kiểm kê</p>
                <p className="font-medium">{new Date(inventoryCheck.check_date).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Trạng thái</p>
                <p className="font-medium">{inventoryCheck.status === 'completed' ? 'Đã hoàn thành' :
                                          inventoryCheck.status === 'in-progress' ? 'Đang tiến hành' :
                                          'Nháp'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng số mục kiểm kê</p>
                <p className="font-medium">{totalItems}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 uppercase mb-3">Kết quả tổng hợp</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Chênh lệch chiều dài</p>
                <p className={`font-medium ${getDifferenceClass(lengthDifferencePercentage)}`}>
                  {totalLengthDifference.toLocaleString('vi-VN')} m ({lengthDifferencePercentage.toFixed(2)}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Chênh lệch khối lượng</p>
                <p className={`font-medium ${getDifferenceClass(weightDifferencePercentage)}`}>
                  {totalWeightDifference.toLocaleString('vi-VN')} kg ({weightDifferencePercentage.toFixed(2)}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Số mục có chênh lệch</p>
                <p className="font-medium">
                  {itemsWithDifference.length} / {totalItems} ({((itemsWithDifference.length / totalItems) * 100).toFixed(2)}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Loại vải có chênh lệch cao nhất</p>
                {analysisByFabric.length > 0 && (
                  <p className="font-medium">
                    {analysisByFabric.sort((a, b) => Math.abs(b.differencePercentage) - Math.abs(a.differencePercentage))[0].name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Biểu đồ so sánh */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">So sánh tổng thể</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-4">So sánh chiều dài (m)</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Hệ thống</span>
                  <span>{totalSystemLength.toLocaleString('vi-VN')} m</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Thực tế</span>
                  <span>{totalActualLength.toLocaleString('vi-VN')} m</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={totalActualLength >= totalSystemLength ? "bg-green-600 h-2.5 rounded-full" : "bg-red-600 h-2.5 rounded-full"}
                    style={{ width: `${(totalActualLength / totalSystemLength) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Chênh lệch</span>
                  <span className={getDifferenceClass(lengthDifferencePercentage)}>
                    {totalLengthDifference > 0 ? '+' : ''}{totalLengthDifference.toLocaleString('vi-VN')} m
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={totalLengthDifference >= 0 ? "bg-green-600 h-2.5 rounded-full" : "bg-red-600 h-2.5 rounded-full"}
                    style={{ 
                      width: `${Math.min(Math.abs(totalLengthDifference) / totalSystemLength * 100, 100)}%`,
                      marginLeft: totalLengthDifference < 0 ? 'auto' : '0'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-4">So sánh khối lượng (kg)</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Hệ thống</span>
                  <span>{totalSystemWeight.toLocaleString('vi-VN')} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Thực tế</span>
                  <span>{totalActualWeight.toLocaleString('vi-VN')} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={totalActualWeight >= totalSystemWeight ? "bg-green-600 h-2.5 rounded-full" : "bg-red-600 h-2.5 rounded-full"}
                    style={{ width: `${(totalActualWeight / totalSystemWeight) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Chênh lệch</span>
                  <span className={getDifferenceClass(weightDifferencePercentage)}>
                    {totalWeightDifference > 0 ? '+' : ''}{totalWeightDifference.toLocaleString('vi-VN')} kg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={totalWeightDifference >= 0 ? "bg-green-600 h-2.5 rounded-full" : "bg-red-600 h-2.5 rounded-full"}
                    style={{ 
                      width: `${Math.min(Math.abs(totalWeightDifference) / totalSystemWeight * 100, 100)}%`,
                      marginLeft: totalWeightDifference < 0 ? 'auto' : '0'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phân tích theo loại vải */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Phân tích theo loại vải</h3>
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chiều dài hệ thống (m)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chiều dài thực tế (m)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chênh lệch (m)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chênh lệch (%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysisByFabric.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.itemCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.systemLength.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.actualLength.toLocaleString('vi-VN')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getDifferenceClass(item.differencePercentage)}`}>
                    {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString('vi-VN')}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getDifferenceClass(item.differencePercentage)}`}>
                    {item.difference > 0 ? '+' : ''}{item.differencePercentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Danh sách các mục có chênh lệch cao */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 uppercase mb-4">Chi tiết cuộn vải có chênh lệch lớn</h3>
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã cuộn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên vải
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dài hệ thống (m)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dài thực tế (m)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chênh lệch (m)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryCheckItems
                .filter(item => item.length_difference && Math.abs(item.length_difference) >= 2)
                .sort((a, b) => {
                  const aDiff = a.length_difference || 0;
                  const bDiff = b.length_difference || 0;
                  return Math.abs(bDiff) - Math.abs(aDiff);
                })
                .map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.roll_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.fabric_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.system_length.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.actual_length?.toLocaleString('vi-VN') || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getItemDifferenceClass(item.length_difference)}`}>
                      {item.length_difference && item.length_difference > 0 ? '+' : ''}
                      {item.length_difference?.toLocaleString('vi-VN') || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryCheckReport; 