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
import { formatPrice } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label, color, currencySymbol }) => {
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
        <p style={{ color: "#aaa", margin: 0, marginBottom: 4, fontSize: 11 }}>
          {label}
        </p>
        <p style={{ color, margin: 0, fontWeight: 600 }}>
          {formatPrice(payload[0].value, currencySymbol)}
        </p>
      </div>
    );
  }
  return null;
};

const formatChartDate = (timestamp, days) => {
  const date = new Date(timestamp);
  if (days <= 1) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (days <= 90) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

const LineChart = ({ historicalData, currencySymbol = "$", days = 7 }) => {
  const data = useMemo(() => {
    if (!historicalData?.prices) return [];

    return historicalData.prices.map(([timestamp, price]) => ({
      date: formatChartDate(timestamp, days),
      price,
    }));
  }, [historicalData, days]);

  if (!data.length) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px", color: "#aaa" }}>
        Loading chart...
      </p>
    );
  }

  const isPositive = data[data.length - 1].price >= data[0].price;
  const color = isPositive ? "#00ff88" : "#ff3366";
  const gradId = `chart-grad-${days}`;

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const padding = (maxPrice - minPrice) * 0.08 || maxPrice * 0.01;

  const formatYAxis = (v) => {
    if (v >= 1000) {
      return `${currencySymbol}${(v / 1000).toFixed(1)}k`;
    }
    return formatPrice(v, currencySymbol);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
        >
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
            minTickGap={40}
          />

          <YAxis
            stroke="transparent"
            tick={{ fill: "#666", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            domain={[minPrice - padding, maxPrice + padding]}
            width={70}
          />

          <Tooltip
            content={
              <CustomTooltip color={color} currencySymbol={currencySymbol} />
            }
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
