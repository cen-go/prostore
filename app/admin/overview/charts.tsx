"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type ChartsProps = {
  data: {
    salesData: {
      month: string;
      totalSales: number;
    }[];
  };
};

export default function Charts({data}: ChartsProps) {

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data.salesData}>
        <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} />
        <YAxis
          stroke="#888"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="totalSales" fill="#0084d1" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}