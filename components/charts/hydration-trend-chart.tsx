"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  date: string;
  intake: number;
  goal: number;
};

type Props = {
  data: ChartPoint[];
};

export function HydrationTrendChart({
  data,
}: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="hydrationFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="hsl(188 86% 53%)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="hsl(188 86% 53%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-muted"
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              `${Number(value) / 1000}L`
            }
          />

          <Tooltip
            formatter={(value, name) => [
              `${Number(value) / 1000} L`,
              name === "intake"
                ? "Intake"
                : "Goal",
            ]}
          />

          <Area
            type="monotone"
            dataKey="goal"
            stroke="hsl(215 16% 60%)"
            fill="transparent"
            strokeDasharray="5 5"
          />

          <Area
            type="monotone"
            dataKey="intake"
            stroke="hsl(188 86% 53%)"
            fill="url(#hydrationFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}