"use client";

import React, { useState } from 'react';
import { useFabricData } from '../../context/FabricDataProvider';
import { QualityControlRecord } from '@/app/fabric-management/types';
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
import { Button } from '@/components/ui/button';
import QualityControlForm from '@/components/fabric-management/QualityControlForm';

const QualityControlContent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<QualityControlRecord | null>(null);
  
  const { 
    qualityControlRecords, 
    fabrics, 
    inventory,
    employees,
    addQualityControlRecord,
    updateQualityControlRecord,
  } = useFabricData();

  const handleOpenForm = () => {
    setShowForm(true);
    setSelectedRecord(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRecord(null);
  };

  const handleEditRecord = (record: QualityControlRecord) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleSaveRecord = (record: QualityControlRecord) => {
    try {
      if (record.id) {
        updateQualityControlRecord(record.id, record);
      } else {
        addQualityControlRecord(record);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving quality control record:', error);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderResultBadge = (result: string) => {
    switch (result) {
      case 'pass':
        return <Badge className="bg-green-500">Đạt</Badge>;
      case 'fail':
        return <Badge className="bg-red-500">Không đạt</Badge>;
      case 'conditional':
        return <Badge className="bg-yellow-500">Có điều kiện</Badge>;
      default:
        return <Badge>{result}</Badge>;
    }
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'minor':
        return <Badge className="bg-yellow-500">Nhẹ</Badge>;
      case 'major':
        return <Badge className="bg-orange-500">Nặng</Badge>;
      case 'critical':
        return <Badge className="bg-red-500">Nghiêm trọng</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Kiểm soát chất lượng</h2>
        <Button 
          variant="default" 
          onClick={handleOpenForm}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Tạo phiếu kiểm tra mới
        </Button>
      </div>

      <div className="space-y-4">
        {qualityControlRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <span>Phiếu kiểm tra: {record.inspectionNumber}</span>
                  <div className="flex space-x-2 items-center">
                    <span>Loại: {record.inspectionType}</span>
                    <span className="mx-2">|</span>
                    <span>Kết quả: {renderResultBadge(record.result)}</span>
                    <span className="mx-2">|</span>
                    <span>Trạng thái: {renderStatusBadge(record.status)}</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Mã vải</p>
                  <p>{record.fabricCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tên vải</p>
                  <p>{record.fabricName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lô</p>
                  <p>{record.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày kiểm tra</p>
                  <p>{new Date(record.inspectionDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Người kiểm tra</p>
                  <p>{record.inspector}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tỷ lệ lỗi</p>
                  <p>{record.defectRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cỡ mẫu</p>
                  <p>{record.sampleSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tiêu chuẩn</p>
                  <p>{record.passFailCriteria}</p>
                </div>
                {record.approvedBy && (
                  <div>
                    <p className="text-sm text-gray-500">Người duyệt</p>
                    <p>{record.approvedBy}</p>
                  </div>
                )}
                {record.approvalDate && (
                  <div>
                    <p className="text-sm text-gray-500">Ngày duyệt</p>
                    <p>{new Date(record.approvalDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
                {record.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Ghi chú</p>
                    <p>{record.notes}</p>
                  </div>
                )}
              </div>

              {record.defects.length > 0 && (
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="defects">
                    <AccordionTrigger>
                      Danh sách lỗi ({record.defects.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Loại lỗi</TableHead>
                              <TableHead>Mô tả</TableHead>
                              <TableHead>Mức độ</TableHead>
                              <TableHead>Vị trí</TableHead>
                              <TableHead>Số lượng</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {record.defects.map((defect) => (
                              <TableRow key={defect.id}>
                                <TableCell>{defect.type}</TableCell>
                                <TableCell>{defect.description}</TableCell>
                                <TableCell>{renderSeverityBadge(defect.severity)}</TableCell>
                                <TableCell>{defect.location}</TableCell>
                                <TableCell>{defect.quantity}</TableCell>
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
                <Button 
                  variant="outline" 
                  onClick={() => handleEditRecord(record)}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <QualityControlForm
          fabrics={fabrics}
          employees={employees}
          record={selectedRecord || undefined}
          onSave={handleSaveRecord}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default QualityControlContent; 