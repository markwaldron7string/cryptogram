// Pure helpers for Sparkline — extracted so they can be tested in isolation.

// Downsample a price array to ~targetPoints, always keeping the last point,
// and reshape into the {price, index} objects recharts expects.
export function buildSparklineData(data, targetPoints = 30) {
  if (!data || data.length === 0) return [];
  const step = Math.max(1, Math.floor(data.length / targetPoints));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);
  return sampled.map((price, index) => ({ price, index }));
}

// A sparkline trends "positive" when its last price is >= its first.
// Empty/missing data defaults to positive (matches the component's behaviour).
export function isPositiveTrend(data) {
  if (!data || data.length === 0) return true;
  return data[data.length - 1] >= data[0];
}