import React, { useMemo } from "react";
import {
  LineChart as ReLineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, isPositive }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;

    return (
      <p
        style={{
          color: isPositive ? "#00ff9d" : "#ff4d4f",
          fontSize: "14px",
          fontWeight: "500",
          margin: 0,
        }}
      >
        ${value.toLocaleString()}
      </p>
    );
  }
  return null;
};

const LineChart = ({ historicalData }) => {
  const data = useMemo(() => {
    if (!historicalData?.prices) return [];

    return historicalData.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price,
    }));
  }, [historicalData]);

  if (!data.length) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Loading chart...
      </p>
    );
  }

  const first = data[0].price;
  const last = data[data.length - 1].price;
  const isPositive = last >= first;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <ReLineChart data={data}>
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff9d" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#00ff9d" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4d4f" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ff4d4f" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Axes */}
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip isPositive={isPositive} />}
            cursor={{
              stroke: isPositive ? "#00ff9d" : "#ff4d4f",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />

          {/* 🔥 Gradient Area */}
          <Area
            type="monotone"
            dataKey="price"
            stroke="none"
            fill={isPositive ? "url(#colorUp)" : "url(#colorDown)"}
          />

          {/* 📈 Main Line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#00ff9d" : "#ff4d4f"}
            strokeWidth={3}
            dot={false}
            isAnimationActive
            animationDuration={1200}
            animationEasing="ease-in-out"
            style={{
              filter: isPositive
                ? "drop-shadow(0 0 8px #00ff9d)"
                : "drop-shadow(0 0 8px #ff4d4f)",
            }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;