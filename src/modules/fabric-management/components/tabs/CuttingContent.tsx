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

const CuttingContent: React.FC = () => {
  const { cuttingOrders } = useFabricData();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500">Đã duyệt</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-500">Đang cắt</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-gray-500">Thấp</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500">Bình thường</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Cao</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500">Khẩn cấp</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Lệnh cắt</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lệnh</TableHead>
                  <TableHead>Mã vải</TableHead>
                  <TableHead>Tên vải</TableHead>
                  <TableHead>Số lượng (m)</TableHead>
                  <TableHead>Mã sản phẩm</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Người yêu cầu</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead>Ngày cắt dự kiến</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuttingOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.fabricCode}</TableCell>
                    <TableCell>{order.fabricName}</TableCell>
                    <TableCell>{order.quantity} {order.unit}</TableCell>
                    <TableCell>{order.styleNumber}</TableCell>
                    <TableCell>{order.styleName}</TableCell>
                    <TableCell>{order.requestedBy}</TableCell>
                    <TableCell>{new Date(order.requestedDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{new Date(order.plannedCutDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{renderPriorityBadge(order.priority)}</TableCell>
                    <TableCell>{renderStatusBadge(order.status)}</TableCell>
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

export default CuttingContent; 