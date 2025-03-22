'use client';

import React from 'react';
import { useAuth } from '@/providers/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Box, 
  Factory 
} from 'lucide-react';

// Mock data
const ordersData = [
  { name: 'T1', value: 40 },
  { name: 'T2', value: 30 },
  { name: 'T3', value: 45 },
  { name: 'T4', value: 50 },
  { name: 'T5', value: 35 },
  { name: 'T6', value: 55 },
  { name: 'T7', value: 60 },
  { name: 'T8', value: 70 },
  { name: 'T9', value: 65 },
  { name: 'T10', value: 80 },
  { name: 'T11', value: 75 },
  { name: 'T12', value: 90 },
];

const productionData = [
  { name: 'Áo sơ mi', value: 35 },
  { name: 'Quần jeans', value: 25 },
  { name: 'Áo khoác', value: 15 },
  { name: 'Đầm', value: 20 },
  { name: 'Khác', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">
          Xin chào, {user?.fullName || 'khách'}! Đây là tổng quan về doanh nghiệp của bạn.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">458</div>
            <p className="text-xs text-muted-foreground">
              +12.5% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 Tỷ VNĐ</div>
            <p className="text-xs text-muted-foreground">
              +8.2% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tồn kho</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345 sản phẩm</div>
            <p className="text-xs text-muted-foreground">
              23 sản phẩm gần hết hàng
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng sản xuất</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78 đơn</div>
            <p className="text-xs text-muted-foreground">
              12 đơn đang chờ xử lý
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Đơn hàng theo tháng</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ordersData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Danh mục sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Đơn hàng mới #12345</p>
                <p className="text-xs text-muted-foreground">Công ty TNHH ABC đã đặt 200 áo sơ mi nam</p>
                <p className="text-xs text-muted-foreground">10 phút trước</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Factory className="h-4 w-4 text-primary" />
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Đơn hàng sản xuất #PR7890</p>
                <p className="text-xs text-muted-foreground">Đã hoàn thành công đoạn cắt, chuyển sang may</p>
                <p className="text-xs text-muted-foreground">1 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Cảnh báo vật tư</p>
                <p className="text-xs text-muted-foreground">Vải cotton xanh đậm sắp hết hàng</p>
                <p className="text-xs text-muted-foreground">3 giờ trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 