import React, { useMemo } from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  const isPositive = data[data.length - 1].price > data[0].price;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <ReLineChart data={data}>
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#00ff9d" : "#ff4d4f"}
            strokeWidth={3}
            dot={false}
            isAnimationActive
            animationDuration={800}
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