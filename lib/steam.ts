import { APP_CONFIG, MonitoredItem } from "@/lib/config";

export interface SteamItemSnapshot {
  itemId: string;
  name: string;
  marketHashName: string;
  marketUrl: string;
  currentPrice: number;
  displayPrice: string;
  targetPrice: number;
  triggerType: MonitoredItem["triggerType"];
  targetReached: boolean;
}

function extractMarketHashName(marketUrl: string) {
  const match = marketUrl.match(/\/market\/listings\/730\/(.+)$/);
  if (!match?.[1]) {
    throw new Error(`Link inválido do Steam Market: ${marketUrl}`);
  }

  return decodeURIComponent(match[1]);
}

function normalizeSteamPrice(value: string) {
  const numeric = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(numeric);
  if (Number.isNaN(parsed)) {
    throw new Error(`Não foi possível converter o preço "${value}"`);
  }

  return parsed;
}

function reachedTarget(
  currentPrice: number,
  targetPrice: number,
  triggerType: MonitoredItem["triggerType"],
) {
  return triggerType === "compra"
    ? currentPrice <= targetPrice
    : currentPrice >= targetPrice;
}

export async function fetchSteamSnapshot(
  item: MonitoredItem,
): Promise<SteamItemSnapshot> {
  const marketHashName = extractMarketHashName(item.marketUrl);
  const apiUrl =
    "https://steamcommunity.com/market/priceoverview/" +
    `?appid=730&currency=${APP_CONFIG.currencyCode}` +
    `&market_hash_name=${encodeURIComponent(marketHashName)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    APP_CONFIG.requestTimeoutMs,
  );

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Steam respondeu HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      success?: boolean;
      lowest_price?: string;
      median_price?: string;
    };

    if (!data.success) {
      throw new Error(`Steam retornou success=false para ${item.name}`);
    }

    const displayPrice = data.lowest_price || data.median_price;
    if (!displayPrice) {
      throw new Error(`Steam não retornou preço para ${item.name}`);
    }

    const currentPrice = normalizeSteamPrice(displayPrice);

    return {
      itemId: item.id,
      name: item.name,
      marketHashName,
      marketUrl: item.marketUrl,
      currentPrice,
      displayPrice,
      targetPrice: item.targetPrice,
      triggerType: item.triggerType,
      targetReached: reachedTarget(
        currentPrice,
        item.targetPrice,
        item.triggerType,
      ),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
