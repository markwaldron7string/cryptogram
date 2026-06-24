import { describe, expect, it } from "vitest";
import { CURRENCIES, PAGE_SIZE_OPTIONS, getCurrency } from "./currencies";

describe("currencies", () => {
  it("includes major fiat currencies", () => {
    const codes = CURRENCIES.map((c) => c.code);
    expect(codes).toContain("usd");
    expect(codes).toContain("eur");
    expect(codes).toContain("jpy");
    expect(codes.length).toBeGreaterThanOrEqual(20);
  });

  it("returns USD by default for unknown codes", () => {
    expect(getCurrency("unknown").code).toBe("usd");
  });

  it("exposes page size options", () => {
    expect(PAGE_SIZE_OPTIONS).toEqual([25, 50, 100]);
  });
});
