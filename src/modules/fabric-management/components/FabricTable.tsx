import React from 'react';

interface Fabric {
  id: number;
  code: string;
  name: string;
  description: string | null;
  width: number;
  weight: number;
  color: string;
  pattern: string;
  composition: string;
  supplier_id: number | null;
  supplier_name?: string;
  unit: string;
  price: number;
  min_stock: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FabricTableProps {
  fabrics: Fabric[];
  onEdit: (fabric: Fabric) => void;
  onDelete: (id: number) => void;
  suppliers: { id: number; name: string }[];
}

const FabricTable: React.FC<FabricTableProps> = ({ fabrics, onEdit, onDelete, suppliers }) => {
  const getSupplierName = (supplierId: number | null) => {
    if (!supplierId) return '—';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : '—';
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: string) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'inactive':
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
        {status === 'active' ? 'Đang sử dụng' : status === 'inactive' ? 'Ngừng sử dụng' : status}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
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
              Khổ (cm)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Định lượng (g/m²)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Màu sắc
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhà cung cấp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Đơn vị
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fabrics.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            fabrics.map((fabric) => (
              <tr key={fabric.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fabric.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fabric.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fabric.width || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fabric.weight || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {fabric.color && (
                      <span
                        className="h-4 w-4 rounded-full mr-2"
                        style={{ backgroundColor: fabric.color }}
                      ></span>
                    )}
                    {fabric.color || '—'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fabric.supplier_name || getSupplierName(fabric.supplier_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fabric.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(fabric.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(fabric.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(fabric)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(fabric.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FabricTable; 