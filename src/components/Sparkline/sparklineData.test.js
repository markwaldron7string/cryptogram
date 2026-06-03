import { buildSparklineData, isPositiveTrend } from './sparklineData'
import { describe, it, expect } from 'vitest'

describe('isPositiveTrend', () => {
  it('is positive when the last price is higher than the first', () => {
    expect(isPositiveTrend([100, 105, 110])).toBe(true)
  })

  it('is negative when the last price is lower than the first', () => {
    expect(isPositiveTrend([110, 90, 80])).toBe(false)
  })

  it('treats equal first and last as positive (>= boundary)', () => {
    // Boundary case: exactly equal counts as positive, per the >= rule.
    expect(isPositiveTrend([100, 50, 100])).toBe(true)
  })

  it('defaults to positive for empty data', () => {
    expect(isPositiveTrend([])).toBe(true)
  })
})

describe('buildSparklineData', () => {
  it('returns an empty array for empty input', () => {
    expect(buildSparklineData([])).toEqual([])
  })

  it('reshapes prices into {price, index} objects', () => {
    // Small array (under the target) is untouched except reshaping.
    expect(buildSparklineData([10, 20, 30])).toEqual([
      { price: 10, index: 0 },
      { price: 20, index: 1 },
      { price: 30, index: 2 },
    ])
  })

  it('downsamples a large array and always keeps the last point', () => {
    // 100 points, target 30 → step 3 → roughly a third, and the final
    // price must always survive the sampling.
    const prices = Array.from({ length: 100 }, (_, i) => i)
    const result = buildSparklineData(prices)
    expect(result.length).toBeLessThan(100)
    expect(result.length).toBeGreaterThan(20)
    expect(result[result.length - 1].price).toBe(99) // last point kept
  })
})