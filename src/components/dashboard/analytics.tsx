"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Dữ liệu cho biểu đồ lượt truy cập theo thời gian
const visitData = [
  { name: "00:00", visitors: 123 },
  { name: "02:00", visitors: 85 },
  { name: "04:00", visitors: 42 },
  { name: "06:00", visitors: 73 },
  { name: "08:00", visitors: 245 },
  { name: "10:00", visitors: 368 },
  { name: "12:00", visitors: 412 },
  { name: "14:00", visitors: 378 },
  { name: "16:00", visitors: 401 },
  { name: "18:00", visitors: 387 },
  { name: "20:00", visitors: 310 },
  { name: "22:00", visitors: 212 },
];

// Dữ liệu cho biểu đồ nguồn truy cập
const sourceData = [
  { name: "Trực tiếp", value: 40 },
  { name: "Tìm kiếm", value: 30 },
  { name: "Mạng xã hội", value: 20 },
  { name: "Giới thiệu", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Dữ liệu cho biểu đồ thiết bị truy cập
const deviceData = [
  { name: "Di động", value: 65 },
  { name: "Máy tính", value: 30 },
  { name: "Máy tính bảng", value: 5 },
];

const DEVICE_COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// Dữ liệu cho biểu đồ tương tác người dùng
const interactionData = [
  { name: "Đọc bài viết", value: 45 },
  { name: "Xem sản phẩm", value: 35 },
  { name: "Gửi liên hệ", value: 10 },
  { name: "Xem tuyển dụng", value: 10 },
];

// Dữ liệu cho biểu đồ so sánh các tháng
const monthlyData = [
  {
    name: "T1",
    năm_trước: 4000,
    năm_nay: 5240,
  },
  {
    name: "T2",
    năm_trước: 5000,
    năm_nay: 7840,
  },
  {
    name: "T3",
    năm_trước: 6000,
    năm_nay: 8520,
  },
  {
    name: "T4", 
    năm_trước: 5500,
    năm_nay: 6950,
  },
  {
    name: "T5",
    năm_trước: 7000,
    năm_nay: 10200,
  },
  {
    name: "T6",
    năm_trước: 7500,
    năm_nay: 9800,
  },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tổng lượt truy cập</CardTitle>
            <CardDescription>24 giờ qua</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,156</div>
            <p className="text-xs text-muted-foreground">+12.5% so với hôm qua</p>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={visitData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} lượt truy cập`, 'Số lượt']} />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Nguồn truy cập</CardTitle>
            <CardDescription>Phân tích theo kênh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Thiết bị truy cập</CardTitle>
            <CardDescription>Phân tích theo loại thiết bị</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>So sánh với năm trước</CardTitle>
            <CardDescription>Lượt truy cập theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} lượt`, '']} />
                  <Legend />
                  <Bar dataKey="năm_trước" fill="#8884d8" name="Năm trước" />
                  <Bar dataKey="năm_nay" fill="#82ca9d" name="Năm nay" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tương tác người dùng</CardTitle>
            <CardDescription>Phân tích hành vi người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {interactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 