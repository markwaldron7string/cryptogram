import React, { useContext, useMemo } from "react";
import { AreaChart, Area, Tooltip } from "recharts";
import { CoinContext } from "../../context/CoinContext";
import { formatPrice } from "../../utils/formatters";
import { buildSparklineData, isPositiveTrend } from "./sparklineData";

const SparkTooltip = ({ active, payload, color, currencySymbol }) => {
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
        {formatPrice(payload[0].value, currencySymbol)}
      </div>
    );
  }
  return null;
};

const Sparkline = ({ data, id = "coin" }) => {
  const { currency } = useContext(CoinContext);

  const { formattedData, isPositive } = useMemo(() => {
    if (!data || data.length === 0) {
      return { formattedData: [], isPositive: true };
    }

    const formattedData = buildSparklineData(data);

    return {
      formattedData,
      isPositive: isPositiveTrend(data),
    };
  }, [data]);

  if (formattedData.length === 0) {
    return <div style={{ width: 120, height: 40 }} />;
  }

  const color = isPositive ? "#00ff88" : "#ff3366";
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
          content={
            <SparkTooltip color={color} currencySymbol={currency.symbol} />
          }
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
