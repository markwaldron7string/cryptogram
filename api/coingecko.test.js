import { describe, expect, it, vi } from "vitest";
import {
  mapCoinRankingDetailCoin,
  mapCoinRankingMarketCoin,
  mapSparklineToHistoricalData,
} from "./coingecko";

const coinRankingCoin = {
  uuid: "Qwsogvtv82FCd",
  symbol: "BTC",
  name: "Bitcoin",
  iconUrl: "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg",
  marketCap: "1316884516990",
  price: "65718.61129586463",
  change: "-3.11",
  rank: 1,
  sparkline: ["67000", "66500", "65718.61129586463"],
};

describe("CoinGecko proxy fallback mapping", () => {
  it("maps CoinRanking market data into the coin table shape", () => {
    expect(mapCoinRankingMarketCoin(coinRankingCoin)).toEqual({
      id: "Qwsogvtv82FCd",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg",
      current_price: 65718.61129586463,
      market_cap: 1316884516990,
      market_cap_rank: 1,
      price_change_percentage_24h: -3.11,
      sparkline_in_7d: {
        price: [67000, 66500, 65718.61129586463],
      },
    });
  });

  it("maps CoinRanking detail data into the coin detail shape", () => {
    const detail = mapCoinRankingDetailCoin(coinRankingCoin);

    expect(detail.image.large).toBe(coinRankingCoin.iconUrl);
    expect(detail.market_data.current_price.usd).toBe(65718.61129586463);
    expect(detail.market_data.market_cap.usd).toBe(1316884516990);
  });

  it("maps sparkline data into chart prices", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000);

    expect(mapSparklineToHistoricalData(["10", "20", "30"], 2)).toEqual({
      prices: [
        [1_000_000 - 2 * 24 * 60 * 60 * 1000, 10],
        [1_000_000 - 1 * 24 * 60 * 60 * 1000, 20],
        [1_000_000, 30],
      ],
    });
  });
});
