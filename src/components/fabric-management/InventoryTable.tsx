import React from 'react';

interface FabricInventory {
  id: number;
  fabric_id: number;
  fabric_name?: string;
  lot_number: string;
  supplier_code: string;
  roll_id: string;
  length: number;
  width: number;
  weight: number;
  defect_notes: string | null;
  quality_grade: string;
  location: string;
  status: string;
  color_code: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface InventoryTableProps {
  inventory: FabricInventory[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory }) => {
  const getStatusBadge = (status: string) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'available':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'reserved':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'in_use':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'used':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
    }

    const statusText = () => {
      switch(status) {
        case 'available': return 'Khả dụng';
        case 'reserved': return 'Đã đặt';
        case 'in_use': return 'Đang sử dụng';
        case 'used': return 'Đã sử dụng';
        default: return status;
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {statusText()}
      </span>
    );
  };

  const getQualityBadge = (quality: string) => {
    let bgColor = '';
    let textColor = '';

    switch (quality) {
      case 'A':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'B':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'C':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {quality}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hình ảnh
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã sản xuất
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại vải
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Màu sắc
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số lô
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chiều dài
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khổ (cm)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trọng lượng (kg)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chất lượng
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vị trí
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày nhập
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.length === 0 ? (
            <tr>
              <td colSpan={12} className="px-6 py-4 text-center text-sm text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img 
                      src={item.image_url} 
                      alt={`Mẫu vải ${item.fabric_name}`} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.supplier_code}</div>
                  <div className="text-xs text-gray-500">Mã nội bộ: {item.roll_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fabric_name || `Vải #${item.fabric_id}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="h-6 w-6 rounded-full border border-gray-300" 
                      style={{ backgroundColor: item.color_code }}
                    ></div>
                    <span className="ml-2 text-sm text-gray-500">{item.color_code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lot_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.length} m</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.width}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.weight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getQualityBadge(item.quality_grade)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable; 