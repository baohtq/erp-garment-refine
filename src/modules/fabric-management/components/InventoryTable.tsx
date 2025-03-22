import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { FabricInventory } from '@/types/fabric-management';
import Image from 'next/image';

interface InventoryTableProps {
  data: FabricInventory[];
  isLoading: boolean;
  edit: (id: string | number) => void;
  show: (id: string | number) => void;
  handlePrefetch?: (id: string | number) => void;
  onEdit: (inventory: FabricInventory) => void;
  onDelete: (id: number) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  isLoading,
  edit,
  show,
  handlePrefetch,
  onEdit,
  onDelete
}) => {
  // Cấu hình các cột trong bảng
  const columns = useMemo<ColumnDef<FabricInventory>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        cell: info => <span className="text-sm font-medium">{info.getValue() as string}</span>,
      },
      {
        header: 'Mã vải',
        accessorKey: 'fabric_code',
        cell: info => <span className="text-sm font-medium">{info.getValue() as string}</span>,
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'image_url',
        cell: info => (
          <div className="w-12 h-12 relative">
            {info.getValue() ? (
              <Image
                src={info.getValue() as string}
                alt="Fabric"
                className="rounded-md object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-xs text-gray-500">No image</span>
              </div>
            )}
          </div>
        ),
      },
      {
        header: 'Tên vải',
        accessorKey: 'fabric_name',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.fabric_name}</p>
            <p className="text-xs text-gray-500">
              {(row.original as any).color || 'N/A'} / {(row.original as any).pattern || 'N/A'}
            </p>
          </div>
        ),
      },
      {
        header: 'Lô',
        accessorKey: 'lot_number',
        cell: info => <span className="text-sm">{info.getValue() as string}</span>,
      },
      {
        header: 'Số lượng',
        accessorKey: 'quantity',
        cell: info => (
          <span className="text-sm">
            {(info.getValue() ? (info.getValue() as number).toLocaleString('vi-VN') : '0')} m
          </span>
        ),
      },
      {
        header: 'Vị trí',
        accessorKey: 'storage_location',
        cell: info => <span className="text-sm">{info.getValue() as string}</span>,
      },
      {
        header: 'Ngày nhập',
        accessorKey: 'created_at',
        cell: info => (
          <span className="text-sm">
            {format(new Date(info.getValue() as string), 'dd/MM/yyyy')}
          </span>
        ),
      },
      {
        header: 'Trạng thái',
        accessorKey: 'status',
        cell: info => {
          const status = info.getValue() as string;
          let statusClass = '';
          
          switch (status) {
            case 'available':
              statusClass = 'bg-green-100 text-green-800';
              break;
            case 'reserved':
              statusClass = 'bg-yellow-100 text-yellow-800';
              break;
            case 'out_of_stock':
              statusClass = 'bg-red-100 text-red-800';
              break;
            default:
              statusClass = 'bg-gray-100 text-gray-800';
          }
          
          return (
            <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
              {status === 'available' && 'Có sẵn'}
              {status === 'reserved' && 'Đã đặt'}
              {status === 'out_of_stock' && 'Hết hàng'}
              {!['available', 'reserved', 'out_of_stock'].includes(status) && status}
            </span>
          );
        },
      },
      {
        header: 'Thao tác',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex space-x-1">
            <button 
              onClick={() => show(row.original.id)} 
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
            >
              Xem
            </button>
            <button 
              onClick={() => onEdit(row.original)} 
              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium"
            >
              Sửa
            </button>
            <button 
              onClick={() => onDelete(row.original.id)} 
              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
            >
              Xóa
            </button>
          </div>
        ),
      },
    ],
    [edit, show, handlePrefetch, onEdit, onDelete]
  );

  // Table implementation simplified for clarity
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  if (isLoading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 