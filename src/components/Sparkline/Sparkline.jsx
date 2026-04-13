import React, { useEffect, useState } from "react";
import { LineChart, Line, Tooltip } from "recharts";

// ✅ Move this OUTSIDE the component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#1f0333",
          border: "1px solid #444",
          padding: "6px 10px",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        ${payload[0].value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    );
  }
  return null;
};

const Sparkline = ({ data }) => {
  const [liveData, setLiveData] = useState(data || []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const interval = setInterval(() => {
      setLiveData((prev) => {
        if (!prev || prev.length === 0) return prev;

        const last = prev[prev.length - 1];
        const newPoint = last + (Math.random() - 0.5) * 50;

        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  if (!liveData || liveData.length === 0) return null;

  const formattedData = liveData.map((price, index) => ({
    price,
    index,
  }));

  const isPositive = liveData[liveData.length - 1] > liveData[0];

  return (
    <div style={{ width: "120px", height: "50px" }}>
      <LineChart width={120} height={50} data={formattedData}>
        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="price"
          stroke={isPositive ? "#00ff9d" : "#ff4d4f"}
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={800}
          animationEasing="ease-in-out"
          style={{
            filter: isPositive
              ? "drop-shadow(0 0 6px #00ff9d)"
              : "drop-shadow(0 0 6px #ff4d4f)",
          }}
        />
      </LineChart>
    </div>
  );
};

export default Sparkline;