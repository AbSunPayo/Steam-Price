import { APP_CONFIG, MONITORED_ITEMS } from "@/lib/config";
import { sendDiscordAlert } from "@/lib/discord";
import { fetchSteamSnapshot } from "@/lib/steam";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runPriceCheck() {
  const startedAt = new Date().toISOString();
  const results: Array<Record<string, unknown>> = [];
  let alertCount = 0;

  for (let index = 0; index < MONITORED_ITEMS.length; index += 1) {
    const item = MONITORED_ITEMS[index];

    try {
      const snapshot = await fetchSteamSnapshot(item);
      let discord = null;

      if (snapshot.targetReached) {
        discord = await sendDiscordAlert({
          name: snapshot.name,
          marketUrl: snapshot.marketUrl,
          currentPrice: snapshot.currentPrice,
          displayPrice: snapshot.displayPrice,
          targetPrice: snapshot.targetPrice,
          triggerType: snapshot.triggerType,
          imageUrl: item.imageUrl,
        });

        if (discord.success) {
          alertCount += 1;
        }
      }

      results.push({
        itemId: snapshot.itemId,
        name: snapshot.name,
        currentPrice: snapshot.currentPrice,
        displayPrice: snapshot.displayPrice,
        targetPrice: snapshot.targetPrice,
        triggerType: snapshot.triggerType,
        targetReached: snapshot.targetReached,
        discord,
      });
    } catch (error) {
      results.push({
        itemId: item.id,
        name: item.name,
        targetPrice: item.targetPrice,
        triggerType: item.triggerType,
        targetReached: false,
        error: error instanceof Error ? error.message : "Falha inesperada",
      });
    }

    if (index < MONITORED_ITEMS.length - 1) {
      await sleep(APP_CONFIG.delayBetweenItemsMs);
    }
  }

  const failed = results.filter((result) => "error" in result).length;

  return {
    ok: failed === 0,
    startedAt,
    checkedAt: new Date().toISOString(),
    totalItems: MONITORED_ITEMS.length,
    alertCount,
    failedCount: failed,
    note:
      "Sem banco, a API não memoriza estado entre execuções. Se a condição continuar verdadeira, o cron pode alertar de novo.",
    results,
  };
}