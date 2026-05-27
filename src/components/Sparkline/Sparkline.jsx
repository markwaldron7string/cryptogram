import React, { useMemo } from "react";
import { AreaChart, Area, Tooltip } from "recharts";

const SparkTooltip = ({ active, payload, color }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(10,2,20,0.9)",
          border: `1px solid ${color}55`,
          padding: "4px 8px",
          borderRadius: "5px",
          color,
          fontSize: "11px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          pointerEvents: "none",
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

const Sparkline = ({ data, id = "coin" }) => {
  const { formattedData, isPositive } = useMemo(() => {
    if (!data || data.length === 0) return { formattedData: [], isPositive: true };

    // Downsample to ~30 points for a clean sparkline
    const step = Math.max(1, Math.floor(data.length / 30));
    const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);

    return {
      formattedData: sampled.map((price, index) => ({ price, index })),
      isPositive: data[data.length - 1] >= data[0],
    };
  }, [data]);

  if (formattedData.length === 0) {
    return <div style={{ width: 120, height: 40 }} />;
  }

  const color = isPositive ? "#00C087" : "#FF4747";
  const gradId = `spark-grad-${id}`;

  return (
    <div style={{ width: 120, height: 40 }}>
      <AreaChart
        width={120}
        height={40}
        data={formattedData}
        margin={{ top: 3, right: 3, bottom: 3, left: 3 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="80%" stopColor={color} stopOpacity={0.05} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <Tooltip
          content={<SparkTooltip color={color} />}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
          allowEscapeViewBox={{ x: true, y: true }}
        />

        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 2.5, fill: color, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  );
};

export default Sparkline;
