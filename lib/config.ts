export type TriggerType = "compra" | "venda";

export interface MonitoredItem {
  id: string;
  name: string;
  marketUrl: string;
  targetPrice: number;
  triggerType: TriggerType;
  imageUrl?: string;
}

export const APP_CONFIG = {
  currencyCode: 7,
  requestTimeoutMs: 20000,
  delayBetweenItemsMs: 1500,
  discordWebhookUrl:
    "https://discord.com/api/webhooks/1431261278847897656/KE0FhOVNgA2iLx6bWOEf1mRWOm7Sm0Z8hgvquwVI5Mxrev7N5LTefUg9QjF7DqmaV195",
} as const;

export const MONITORED_ITEMS: MonitoredItem[] = [
  {
    id: "teste-butterfly-compra",
    name: "Teste de Status da API",
    marketUrl:
      "https://steamcommunity.com/market/listings/730/%E2%98%85%20Butterfly%20Knife%20|%20Freehand%20(Field-Tested)",
    targetPrice: 7000,
    triggerType: "compra",
    imageUrl: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2qvzO9ku-RtcDyjqkR3jDCAnobsLGWfP1QmD8R3ReUKuxi9w4LuYrnh51DaithEynn5iCJB6y0557oKVqt05OSJ2Fk282du/330x192?allow_animated=1",
  },
  {
    id: "wizard-beard",
    name: "Wizard Beard",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Wizard%20Beard",
    targetPrice: 200,
    triggerType: "venda",
    imageUrl: "https://community.akamai.steamstatic.com/economy/image/ev_QInFv2QSGCJrUcil4gJtKJmC--iK8V6noG26Bmdaik9vio1OJI8svZp2YwaYDKFaL3MlvPz_6PfLZnizhKArg7ulJeZzn5-k/330x192?allow_animated=1",
  },
  {
    id: "wizard-hat",
    name: "Wizard Hat",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Wizard%20Hat",
    targetPrice: 250,
    triggerType: "venda",
    imageUrl: "https://community.akamai.steamstatic.com/economy/image/ev_QInFv2QSGCJrUcil4gJtKJmC--iK8V6noG26JnNatlorh-FOKKpkoZp2Yx_4DKQHYjMloPzv4OvDUnX7pLA7g7ulJaQVeuM8/330x192?allow_animated=1",
  },
  {
    id: "swag-chain",
    name: "SWAG Chain",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/SWAG%20Chain",
    targetPrice: 150,
    triggerType: "venda",
    imageUrl: "https://community.akamai.steamstatic.com/economy/image/ev_QInFv2QSGCJrUcil4gJtKJmCq-T22QuKhSyeCnNL_wou88R6JI5krfpuYwPxPcALYjddvaW-rbbjYniPiKlqqpuQcwk3_YPRkVfYmiDgSRa5s/330x192?allow_animated=1",
  },
  {
    id: "bag",
    name: "Bag",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Bag",
    targetPrice: 40,
    triggerType: "venda",
    imageUrl: "https://community.akamai.steamstatic.com/economy/image/ev_QInFv2QSGCJrUcil4gJtKJmCq-T22QuKlQ3CGnNb4xd7moUSMIpx7Lc2awftIIFGKgtU6PTivOLjYminjLA74_ORNw0D1NaMxVfYmiLXZVcQC/330x192?allow_animated=1",
  },
  {
    id: "cardboard-king",
    name: "Cardboard King",
    marketUrl:
      "https://steamcommunity.com/market/listings/590830/Cardboard%20King",
    targetPrice: 2700,
    triggerType: "venda",
    imageUrl: "https://community.akamai.steamstatic.com/economy/image/ev_QInFv2QSGCJrUcil4gJtKJmCq-T22QuKlS3bSntD-loa1-UuPIJt_fJDJxq4fcwPej987OTz4briCzH_pJV_6ruUcx0z9ZaUxVfYmiL2C6Ixb/330x192?allow_animated=1",
  },
];