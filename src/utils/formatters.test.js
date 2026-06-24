import { describe, expect, it } from "vitest";
import { formatLargeNumber, formatPercent, formatPrice } from "./formatters";

describe("formatters", () => {
  it("formats prices with currency symbol", () => {
    expect(formatPrice(42150.5, "$")).toBe("$42,150.50");
  });

  it("formats compact large values", () => {
    expect(formatPrice(1500000000, "$", { compact: true })).toBe("$1.50B");
  });

  it("formats small prices with more decimals", () => {
    expect(formatPrice(0.00001234, "$")).toBe("$0.000012");
  });

  it("formats percentages with sign", () => {
    expect(formatPercent(2.456)).toBe("+2.46%");
    expect(formatPercent(-1.2)).toBe("-1.2%");
  });

  it("formats large numbers", () => {
    expect(formatLargeNumber(21000000)).toBe("21.00M");
  });
});
