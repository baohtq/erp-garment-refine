"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  {
    name: "T1",
    total: 5240,
  },
  {
    name: "T2",
    total: 7840,
  },
  {
    name: "T3",
    total: 8520,
  },
  {
    name: "T4",
    total: 6950,
  },
  {
    name: "T5",
    total: 10200,
  },
  {
    name: "T6",
    total: 9800,
  },
  {
    name: "T7",
    total: 11300,
  },
  {
    name: "T8",
    total: 10100,
  },
  {
    name: "T9",
    total: 12521,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()} lượt`, 'Lượt truy cập']}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
} 