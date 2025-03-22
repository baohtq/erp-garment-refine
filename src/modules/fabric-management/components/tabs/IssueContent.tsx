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

const IssueContent: React.FC = () => {
  const { issueRecords } = useFabricData();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>;
      case 'issued':
        return <Badge className="bg-green-500">Đã xuất</Badge>;
      case 'returned':
        return <Badge className="bg-blue-500">Đã trả</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Phiếu xuất vải</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Mã vải</TableHead>
                  <TableHead>Tên vải</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Người xuất</TableHead>
                  <TableHead>Ngày xuất</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Bộ phận</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issueRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.issueNumber}</TableCell>
                    <TableCell>{record.fabricCode}</TableCell>
                    <TableCell>{record.fabricName}</TableCell>
                    <TableCell>{record.quantity} {record.unit}</TableCell>
                    <TableCell>{record.issuedTo}</TableCell>
                    <TableCell>{record.issuedBy}</TableCell>
                    <TableCell>{new Date(record.issuedDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{record.reason}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{renderStatusBadge(record.status)}</TableCell>
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

export default IssueContent; 