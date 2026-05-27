import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(10,2,22,0.95)",
          border: `1px solid ${color}66`,
          padding: "8px 12px",
          borderRadius: "7px",
          color: "#fff",
          fontSize: "13px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          pointerEvents: "none",
        }}
      >
        <p style={{ color: "#aaa", margin: 0, marginBottom: 4, fontSize: 11 }}>{label}</p>
        <p style={{ color, margin: 0, fontWeight: 600 }}>
          ${payload[0].value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

const LineChart = ({ historicalData }) => {
  const data = useMemo(() => {
    if (!historicalData?.prices) return [];

    return historicalData.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price,
    }));
  }, [historicalData]);

  if (!data.length) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px", color: "#aaa" }}>
        Loading chart...
      </p>
    );
  }

  const isPositive = data[data.length - 1].price >= data[0].price;
  const color = isPositive ? "#00C087" : "#FF4747";
  const gradId = "modal-chart-grad";

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const padding = (maxPrice - minPrice) * 0.08;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="60%" stopColor={color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 6"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="transparent"
            tick={{ fill: "#666", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="transparent"
            tick={{ fill: "#666", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              v >= 1000
                ? `$${(v / 1000).toFixed(1)}k`
                : `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            }
            domain={[minPrice - padding, maxPrice + padding]}
            width={70}
          />

          <Tooltip
            content={<CustomTooltip color={color} />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: "#0b0120", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
