"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: {
    period: string;
    totalMl: number;
  }[];
};

export function TimeOfDayChart({
  data,
}: Props) {
  return (
    <div className="h-70 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            vertical={false}
            className="stroke-muted"
          />

          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `${Number(value) / 1000}L`
            }
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value) / 1000} L`,
              "Water",
            ]}
          />

          <Bar
            dataKey="totalMl"
            fill="hsl(188 86% 53%)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}