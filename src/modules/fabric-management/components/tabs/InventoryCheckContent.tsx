"use client";

import React, { useState } from 'react';
import { useFabricData } from '../../context/FabricDataProvider';
import { InventoryCheck, InventoryCheckItem } from '@/app/fabric-management/types';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import InventoryCheckForm from '@/components/fabric-management/InventoryCheckForm';

const InventoryCheckContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<InventoryCheck | null>(null);
  
  const { 
    inventoryChecks, 
    inventory, 
    fabrics, 
    employees,
    addInventoryCheck,
    updateInventoryCheck
  } = useFabricData();

  const handleOpenForm = () => {
    setShowForm(true);
    setSelectedCheck(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleViewDetail = (check: InventoryCheck) => {
    setSelectedCheck(check);
  };

  const handleCloseDetail = () => {
    setSelectedCheck(null);
  };

  const handleSave = async (check: Partial<InventoryCheck>, items: Partial<InventoryCheckItem>[]) => {
    try {
      if (check.id) {
        updateInventoryCheck(check.id, check);
      } else if (check as InventoryCheck) {
        addInventoryCheck(check as InventoryCheck);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving inventory check:', error);
      // Show error notification
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // We don't have a deleteInventoryCheck in the context, so we would need to implement it
      // For now, we can update the status to 'cancelled'
      updateInventoryCheck(id, { status: 'cancelled' });
    } catch (error) {
      console.error('Error deleting inventory check:', error);
      // Show error notification
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Lên lịch</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">Đang thực hiện</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderDiscrepancyStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Đã xử lý</Badge>;
      case 'investigating':
        return <Badge className="bg-purple-500">Đang điều tra</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Kiểm kê vải</h2>
        <button
          onClick={handleOpenForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Tạo phiếu kiểm kê mới
        </button>
      </div>

      <div className="space-y-4">
        {inventoryChecks.map((check) => (
          <Card key={check.id}>
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <span>Phiếu kiểm kê: {check.checkNumber}</span>
                  <div className="flex space-x-2 items-center">
                    <span>Kho: {check.warehouseName}</span>
                    <span className="mx-2">|</span>
                    <span>Trạng thái: {renderStatusBadge(check.status)}</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Ngày lên lịch</p>
                  <p>{new Date(check.scheduledDate).toLocaleDateString('vi-VN')}</p>
                </div>
                {check.actualDate && (
                  <div>
                    <p className="text-sm text-gray-500">Ngày thực hiện</p>
                    <p>{new Date(check.actualDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Người thực hiện</p>
                  <p>{check.conductor}</p>
                </div>
                {check.supervisor && (
                  <div>
                    <p className="text-sm text-gray-500">Người giám sát</p>
                    <p>{check.supervisor}</p>
                  </div>
                )}
                {check.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Ghi chú</p>
                    <p>{check.notes}</p>
                  </div>
                )}
              </div>

              {check.discrepancies.length > 0 && (
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="discrepancies">
                    <AccordionTrigger>
                      Danh sách sai lệch ({check.discrepancies.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Mã vải</TableHead>
                              <TableHead>Tên vải</TableHead>
                              <TableHead>SL kỳ vọng</TableHead>
                              <TableHead>SL thực tế</TableHead>
                              <TableHead>Chênh lệch</TableHead>
                              <TableHead>Lý do</TableHead>
                              <TableHead>Hành động</TableHead>
                              <TableHead>Trạng thái</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {check.discrepancies.map((discrepancy) => (
                              <TableRow key={discrepancy.id}>
                                <TableCell>{discrepancy.fabricCode}</TableCell>
                                <TableCell>{discrepancy.fabricName}</TableCell>
                                <TableCell>{discrepancy.expectedQuantity}</TableCell>
                                <TableCell>{discrepancy.actualQuantity}</TableCell>
                                <TableCell 
                                  className={
                                    discrepancy.discrepancyQuantity < 0 
                                      ? 'text-red-500' 
                                      : 'text-green-500'
                                  }
                                >
                                  {discrepancy.discrepancyQuantity > 0 ? '+' : ''}
                                  {discrepancy.discrepancyQuantity}
                                </TableCell>
                                <TableCell>{discrepancy.reason || '-'}</TableCell>
                                <TableCell>{discrepancy.actionTaken || '-'}</TableCell>
                                <TableCell>{renderDiscrepancyStatusBadge(discrepancy.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleViewDetail(check)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md"
                >
                  Chi tiết
                </button>
                <button
                  onClick={() => handleDelete(check.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Hủy phiếu
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <InventoryCheckForm
          inventory={inventory}
          fabrics={fabrics}
          employees={employees}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default InventoryCheckContent; 