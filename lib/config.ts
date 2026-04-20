export type TriggerType = "compra" | "venda";

export interface MonitoredItem {
  id: string;
  name: string;
  marketUrl: string;
  targetPrice: number;
  triggerType: TriggerType;
}

export const APP_CONFIG = {
  currencyCode: 7,
  requestTimeoutMs: 20000,
  delayBetweenItemsMs: 1500,
  discordWebhookUrl:
    "COLE_AQUI_O_WEBHOOK_DO_DISCORD",
} as const;

export const MONITORED_ITEMS: MonitoredItem[] = [
  {
    id: "wizard-beard",
    name: "Wizard Beard",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Wizard%20Beard",
    targetPrice: 200,
    triggerType: "venda",
  },
  {
    id: "wizard-hat",
    name: "Wizard Hat",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Wizard%20Hat",
    targetPrice: 250,
    triggerType: "venda",
  },
  {
    id: "swag-chain",
    name: "SWAG Chain",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/SWAG%20Chain",
    targetPrice: 150,
    triggerType: "venda",
  },
  {
    id: "bag",
    name: "Bag",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Bag",
    targetPrice: 40,
    triggerType: "venda",
  },
  {
    id: "cardboard-king",
    name: "Cardboard King",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Cardboard%20King",
    targetPrice: 2700,
    triggerType: "venda",
  },
];
