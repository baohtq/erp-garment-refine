"use client";

import React, { useState } from 'react';
import { useFabricData } from '../../context/FabricDataProvider';
import { Fabric } from '../../types';
import { Button } from '@/components/ui/button';
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';

const FabricContent: React.FC = () => {
  const { fabrics, addFabric, updateFabric, deleteFabric } = useFabricData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState<Partial<Fabric>>({
    code: '',
    name: '',
    type: '',
    color: '',
    width: 0,
    composition: '',
    weight: 0,
    supplier: '',
    price: 0,
    moq: 0,
    leadTime: 0,
    status: 'active',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'width' || name === 'weight' || name === 'price' || name === 'moq' || name === 'leadTime'
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFabric = () => {
    const newFabric: Fabric = {
      id: uuidv4(),
      ...formData as Omit<Fabric, 'id' | 'createdAt' | 'updatedAt'>,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Fabric;
    
    addFabric(newFabric);
    setFormData({
      code: '',
      name: '',
      type: '',
      color: '',
      width: 0,
      composition: '',
      weight: 0,
      supplier: '',
      price: 0,
      moq: 0,
      leadTime: 0,
      status: 'active',
    });
    setIsAddDialogOpen(false);
  };

  const handleEditFabric = () => {
    if (selectedFabric) {
      const updatedFabric: Fabric = {
        ...selectedFabric,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      updateFabric(selectedFabric.id, updatedFabric);
      setIsEditDialogOpen(false);
      setSelectedFabric(null);
    }
  };

  const handleDeleteFabric = () => {
    if (selectedFabric) {
      deleteFabric(selectedFabric.id);
      setIsDeleteDialogOpen(false);
      setSelectedFabric(null);
    }
  };

  const openEditDialog = (fabric: Fabric) => {
    setSelectedFabric(fabric);
    setFormData({
      code: fabric.code,
      name: fabric.name,
      type: fabric.type,
      color: fabric.color,
      width: fabric.width,
      composition: fabric.composition,
      weight: fabric.weight,
      supplier: fabric.supplier,
      price: fabric.price,
      moq: fabric.moq,
      leadTime: fabric.leadTime,
      status: fabric.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (fabric: Fabric) => {
    setSelectedFabric(fabric);
    setIsDeleteDialogOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Không hoạt động</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Quản lý vải</h2>
        <Button
          onClick={() => {
            setFormData({
              code: '',
              name: '',
              type: '',
              color: '',
              width: 0,
              composition: '',
              weight: 0,
              supplier: '',
              price: 0,
              moq: 0,
              leadTime: 0,
              status: 'active',
            });
            setIsAddDialogOpen(true);
          }}
        >
          Thêm vải mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vải</TableHead>
                  <TableHead>Tên vải</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Màu sắc</TableHead>
                  <TableHead>Khổ vải (cm)</TableHead>
                  <TableHead>Thành phần</TableHead>
                  <TableHead>Trọng lượng (g/m²)</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Giá (USD/m)</TableHead>
                  <TableHead>MOQ (m)</TableHead>
                  <TableHead>Lead time (ngày)</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fabrics.map((fabric) => (
                  <TableRow key={fabric.id}>
                    <TableCell>{fabric.code}</TableCell>
                    <TableCell>{fabric.name}</TableCell>
                    <TableCell>{fabric.type}</TableCell>
                    <TableCell>{fabric.color}</TableCell>
                    <TableCell>{fabric.width}</TableCell>
                    <TableCell>{fabric.composition}</TableCell>
                    <TableCell>{fabric.weight}</TableCell>
                    <TableCell>{fabric.supplier}</TableCell>
                    <TableCell>{fabric.price.toFixed(2)}</TableCell>
                    <TableCell>{fabric.moq}</TableCell>
                    <TableCell>{fabric.leadTime}</TableCell>
                    <TableCell>{renderStatusBadge(fabric.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(fabric)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(fabric)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Fabric Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm vải mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin vải mới vào hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã vải</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên vải</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại vải</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Màu sắc</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Khổ vải (cm)</Label>
              <Input
                id="width"
                name="width"
                type="number"
                value={formData.width?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="composition">Thành phần</Label>
              <Input
                id="composition"
                name="composition"
                value={formData.composition}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Trọng lượng (g/m²)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Nhà cung cấp</Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (USD/m)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moq">MOQ (m)</Label>
              <Input
                id="moq"
                name="moq"
                type="number"
                value={formData.moq?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead time (ngày)</Label>
              <Input
                id="leadTime"
                name="leadTime"
                type="number"
                value={formData.leadTime?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, 'status')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleAddFabric}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fabric Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin vải</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho vải {selectedFabric?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Mã vải</Label>
              <Input
                id="edit-code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên vải</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Loại vải</Label>
              <Input
                id="edit-type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Màu sắc</Label>
              <Input
                id="edit-color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-width">Khổ vải (cm)</Label>
              <Input
                id="edit-width"
                name="width"
                type="number"
                value={formData.width?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-composition">Thành phần</Label>
              <Input
                id="edit-composition"
                name="composition"
                value={formData.composition}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-weight">Trọng lượng (g/m²)</Label>
              <Input
                id="edit-weight"
                name="weight"
                type="number"
                value={formData.weight?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-supplier">Nhà cung cấp</Label>
              <Input
                id="edit-supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Giá (USD/m)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-moq">MOQ (m)</Label>
              <Input
                id="edit-moq"
                name="moq"
                type="number"
                value={formData.moq?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-leadTime">Lead time (ngày)</Label>
              <Input
                id="edit-leadTime"
                name="leadTime"
                type="number"
                value={formData.leadTime?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange(value, 'status')}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleEditFabric}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Fabric Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vải "{selectedFabric?.name}" không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="destructive" onClick={handleDeleteFabric}>
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FabricContent; 