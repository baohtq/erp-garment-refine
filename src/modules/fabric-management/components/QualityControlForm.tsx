import React, { useState, useEffect } from 'react';
import { QualityControlRecord, FabricDefect, Fabric, Employee } from '@/app/fabric-management/types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface QualityControlFormProps {
  record?: QualityControlRecord;
  fabrics: Fabric[];
  employees: Employee[];
  onSave: (record: QualityControlRecord) => void;
  onCancel: () => void;
}

const QualityControlForm: React.FC<QualityControlFormProps> = ({
  record,
  fabrics,
  employees,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<QualityControlRecord>(
    record || {
      id: uuidv4(),
      inspectionNumber: `QC-${Date.now()}`,
      fabricId: fabrics.length > 0 ? fabrics[0].id : '',
      fabricCode: fabrics.length > 0 ? fabrics[0].code : '',
      fabricName: fabrics.length > 0 ? fabrics[0].name : '',
      batchNumber: '',
      inspectionDate: new Date().toISOString().split('T')[0],
      inspector: employees.length > 0 ? employees[0].name : '',
      inspectionType: 'receiving',
      sampleSize: 0,
      defectRate: 0,
      passFailCriteria: 'AQL 2.5',
      result: 'pass',
      defects: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'sampleSize' || name === 'defectRate') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === 'fabricId') {
      // Find the fabric to get its name and code
      const selectedFabric = fabrics.find(f => f.id === value);
      if (selectedFabric) {
        setFormData({ 
          ...formData, 
          fabricId: value,
          fabricCode: selectedFabric.code,
          fabricName: selectedFabric.name
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDefectChange = (index: number, field: string, value: any) => {
    const updatedDefects = [...formData.defects];
    updatedDefects[index] = { 
      ...updatedDefects[index], 
      [field]: field === 'quantity' ? parseFloat(value) || 0 : value 
    };
    setFormData({ ...formData, defects: updatedDefects });
  };

  const addDefect = () => {
    const newDefect: FabricDefect = {
      id: uuidv4(),
      type: '',
      description: '',
      severity: 'minor',
      location: '',
      quantity: 1
    };
    setFormData({ ...formData, defects: [...formData.defects, newDefect] });
  };

  const removeDefect = (index: number) => {
    const updatedDefects = [...formData.defects];
    updatedDefects.splice(index, 1);
    setFormData({ ...formData, defects: updatedDefects });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate defect rate if needed
    let calculatedDefectRate = formData.defectRate;
    if (formData.sampleSize > 0 && formData.defects.length > 0) {
      const totalDefects = formData.defects.reduce((sum, defect) => sum + defect.quantity, 0);
      calculatedDefectRate = (totalDefects / formData.sampleSize) * 100;
    }
    
    const updatedRecord: QualityControlRecord = {
      ...formData,
      defectRate: calculatedDefectRate,
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedRecord);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{record ? 'Chỉnh sửa phiếu kiểm tra' : 'Tạo phiếu kiểm tra mới'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã phiếu kiểm tra</label>
              <input
                type="text"
                name="inspectionNumber"
                value={formData.inspectionNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Loại kiểm tra</label>
              <select
                name="inspectionType"
                value={formData.inspectionType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="receiving">Nhập vải</option>
                <option value="in-process">Trong quá trình</option>
                <option value="pre-cutting">Trước cắt</option>
                <option value="final">Cuối cùng</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Loại vải</label>
              <select
                name="fabricId"
                value={formData.fabricId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Chọn loại vải</option>
                {fabrics.map(fabric => (
                  <option key={fabric.id} value={fabric.id}>
                    {fabric.name} ({fabric.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mã lô</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kiểm tra</label>
              <input
                type="date"
                name="inspectionDate"
                value={formData.inspectionDate.split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Người kiểm tra</label>
              <select
                name="inspector"
                value={formData.inspector}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Chọn người kiểm tra</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cỡ mẫu</label>
              <input
                type="number"
                name="sampleSize"
                value={formData.sampleSize}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tỷ lệ lỗi (%)</label>
              <input
                type="number"
                name="defectRate"
                value={formData.defectRate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu chuẩn</label>
              <input
                type="text"
                name="passFailCriteria"
                value={formData.passFailCriteria}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Kết quả</label>
              <select
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="pass">Đạt</option>
                <option value="fail">Không đạt</option>
                <option value="conditional">Có điều kiện</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows={2}
              />
            </div>
          </div>
          
          <div className="mt-6 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Danh sách lỗi</h3>
              <Button type="button" onClick={addDefect} variant="outline">Thêm lỗi</Button>
            </div>
            
            {formData.defects.length > 0 ? (
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại lỗi</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>SL</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.defects.map((defect, index) => (
                    <TableRow key={defect.id || index}>
                      <TableCell>
                        <input
                          type="text"
                          value={defect.type}
                          onChange={(e) => handleDefectChange(index, 'type', e.target.value)}
                          className="w-full p-1 border rounded-md"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={defect.description}
                          onChange={(e) => handleDefectChange(index, 'description', e.target.value)}
                          className="w-full p-1 border rounded-md"
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={defect.severity}
                          onChange={(e) => handleDefectChange(index, 'severity', e.target.value)}
                          className="w-full p-1 border rounded-md"
                        >
                          <option value="minor">Nhẹ</option>
                          <option value="major">Nặng</option>
                          <option value="critical">Nghiêm trọng</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={defect.location}
                          onChange={(e) => handleDefectChange(index, 'location', e.target.value)}
                          className="w-full p-1 border rounded-md"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          value={defect.quantity}
                          onChange={(e) => handleDefectChange(index, 'quantity', e.target.value)}
                          className="w-24 p-1 border rounded-md"
                          min="1"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          onClick={() => removeDefect(index)}
                          variant="ghost"
                          size="sm"
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 mt-2">Chưa có lỗi nào được thêm</p>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QualityControlForm; 