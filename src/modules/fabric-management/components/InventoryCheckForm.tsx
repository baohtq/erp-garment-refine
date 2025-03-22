"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { 
  Employee, 
  Fabric, 
  FabricInventory, 
  InventoryCheck, 
  InventoryCheckItem, 
  InventoryDiscrepancy 
} from '@/app/fabric-management/types';

interface InventoryCheckFormProps {
  inventory: FabricInventory[];
  fabrics: Fabric[];
  employees: Employee[];
  inventoryCheck?: InventoryCheck;
  onSave: (check: Partial<InventoryCheck>, items: Partial<InventoryCheckItem>[]) => void;
  onCancel: () => void;
}

const InventoryCheckForm: React.FC<InventoryCheckFormProps> = ({
  inventory,
  fabrics,
  employees,
  inventoryCheck,
  onSave,
  onCancel
}) => {
  const [check, setCheck] = useState<Partial<InventoryCheck>>(
    inventoryCheck || {
      checkNumber: `IC-${Date.now()}`,
      warehouseId: "1",
      warehouseName: 'Kho Chính',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'scheduled',
      discrepancies: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const [items, setItems] = useState<Partial<InventoryCheckItem>[]>(
    inventory.map(inv => ({
      fabricId: inv.fabricId,
      fabricCode: inv.fabricCode,
      fabricName: inv.fabricName,
      expectedQuantity: inv.totalQuantity,
      actualQuantity: inv.totalQuantity,
      unit: inv.unit,
      locationId: inv.locationId,
      locationName: inv.locationName,
      batch: inv.batchNumber,
      notes: ''
    }))
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheck({ ...check, [name]: value });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { 
      ...updatedItems[index], 
      [field]: field === 'actualQuantity' ? parseFloat(value) : value 
    };
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate discrepancies
    const discrepancies: InventoryDiscrepancy[] = [];
    let hasDiscrepancy = false;
    
    items.forEach((item, index) => {
      const expected = item.expectedQuantity || 0;
      const actual = item.actualQuantity || 0;
      const diff = actual - expected;
      
      if (diff !== 0) {
        hasDiscrepancy = true;
        discrepancies.push({
          id: (index + 1).toString(),
          fabricId: item.fabricId!,
          fabricCode: item.fabricCode!,
          fabricName: item.fabricName!,
          expectedQuantity: expected,
          actualQuantity: actual,
          discrepancyQuantity: diff,
          reason: '',
          actionTaken: '',
          status: 'pending'
        });
      }
    });
    
    const updatedCheck: Partial<InventoryCheck> = {
      ...check,
      discrepancies,
      status: hasDiscrepancy ? 'in-progress' : 'completed',
      actualDate: hasDiscrepancy ? undefined : new Date().toISOString()
    };
    
    onSave(updatedCheck, items);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{inventoryCheck ? 'Chỉnh sửa phiếu kiểm kê' : 'Tạo phiếu kiểm kê mới'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã phiếu kiểm kê</label>
                  <input
                    type="text"
                    name="checkNumber"
                    value={check.checkNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Kho</label>
                  <select
                    name="warehouseId"
                    value={check.warehouseId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="1">Kho Chính</option>
                    <option value="2">Kho Phụ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày lên lịch</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={check.scheduledDate?.toString().split('T')[0]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Người thực hiện</label>
                  <select
                    name="conductor"
                    value={check.conductor}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Người giám sát</label>
                  <select
                    name="supervisor"
                    value={check.supervisor}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <textarea
                    name="notes"
                    value={check.notes}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-medium">Danh sách vải kiểm kê</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vải</TableHead>
                  <TableHead>Tên vải</TableHead>
                  <TableHead>Lô</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>SL dự kiến</TableHead>
                  <TableHead>SL thực tế</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.fabricCode}</TableCell>
                    <TableCell>{item.fabricName}</TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>{item.locationName}</TableCell>
                    <TableCell>{item.expectedQuantity}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        value={item.actualQuantity}
                        onChange={(e) => handleItemChange(index, 'actualQuantity', e.target.value)}
                        className="w-24 p-1 border rounded-md"
                        step="0.01"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                        className="w-32 p-1 border rounded-md"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md mr-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Lưu phiếu kiểm kê
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryCheckForm; 