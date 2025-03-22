"use client";

import React from 'react';
import { useFabricData } from '../../context/FabricDataProvider';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const InventoryContent: React.FC = () => {
  const { inventory } = useFabricData();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-500">Còn hàng</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-500">Sắp hết</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500">Hết hàng</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Kho vải</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vải</TableHead>
                  <TableHead>Tên vải</TableHead>
                  <TableHead>Tổng SL (m)</TableHead>
                  <TableHead>Sẵn có (m)</TableHead>
                  <TableHead>Đã cấp (m)</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Lô</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật lần cuối</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.fabricCode}</TableCell>
                    <TableCell>{item.fabricName}</TableCell>
                    <TableCell>{item.totalQuantity}</TableCell>
                    <TableCell>{item.availableQuantity}</TableCell>
                    <TableCell>{item.allocatedQuantity}</TableCell>
                    <TableCell>{item.warehouseName}</TableCell>
                    <TableCell>{item.locationName}</TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>{new Date(item.receiptDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString('vi-VN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryContent; 