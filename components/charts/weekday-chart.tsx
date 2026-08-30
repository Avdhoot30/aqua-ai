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
    weekday: string;
    averagePercentage: number;
  }[];
};

export function WeekdayChart({
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
            dataKey="weekday"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `${value}%`
            }
          />

          <Tooltip
            formatter={(value) => [
              `${value}%`,
              "Goal completion",
            ]}
          />

          <Bar
            dataKey="averagePercentage"
            fill="hsl(188 86% 53%)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}