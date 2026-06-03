import React, { useContext } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CoinContextProvider, { CoinContext } from "./CoinContext";

const ContextProbe = () => {
  const { allCoins, coinError, isLoadingCoins } = useContext(CoinContext);

  return (
    <div>
      <p data-testid="coins-type">{Array.isArray(allCoins) ? "array" : typeof allCoins}</p>
      <p data-testid="loading-state">{isLoadingCoins ? "loading" : "loaded"}</p>
      <p data-testid="coin-error">{coinError}</p>
    </div>
  );
};

describe("CoinContextProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps allCoins as an array when CoinGecko returns an error object", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ error: "Invalid API key" }),
      }))
    );

    render(
      <CoinContextProvider>
        <ContextProbe />
      </CoinContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading-state")).toHaveTextContent("loaded");
    });

    expect(screen.getByTestId("coins-type")).toHaveTextContent("array");
    expect(screen.getByTestId("coin-error")).toHaveTextContent(
      "Unable to load crypto market data right now."
    );
  });
});
