import { APP_CONFIG, TriggerType } from "@/lib/config";

interface DiscordAlertInput {
  name: string;
  marketUrl: string;
  currentPrice: number;
  displayPrice: string;
  targetPrice: number;
  triggerType: TriggerType;
  imageUrl?: string;
}

export async function sendDiscordAlert(input: DiscordAlertInput) {
  const webhookUrl = APP_CONFIG.discordWebhookUrl.trim();

  if (!webhookUrl || webhookUrl === "COLE_AQUI_O_WEBHOOK_DO_DISCORD") {
    return {
      success: false,
      skipped: true,
      error: "Webhook do Discord nao configurado no codigo.",
    };
  }

  const triggerLabel =
    input.triggerType === "compra"
      ? "Compra: caiu para o alvo"
      : "Venda: subiu para o alvo";

  const color = input.triggerType === "compra" ? 0x2ecc71 : 0xe74c3c;
  const directionEmoji = input.triggerType === "compra" ? "Baixa" : "Alta";

  const embed: Record<string, unknown> = {
    title: `${directionEmoji} ${input.name}`,
    description:
      "A condicao configurada foi atingida para este item do Steam Market.",
    color,
    fields: [
      {
        name: "Preco atual",
        value: input.displayPrice,
        inline: true,
      },
      {
        name: "Preco alvo",
        value: `R$ ${input.targetPrice.toFixed(2)}`,
        inline: true,
      },
      {
        name: "Regra",
        value: triggerLabel,
        inline: false,
      },
      {
        name: "Link",
        value: input.marketUrl,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  if (input.imageUrl?.trim()) {
    embed.thumbnail = {
      url: input.imageUrl.trim(),
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "CS Price Alert",
      embeds: [embed],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return {
      success: false,
      skipped: false,
      error: `Discord respondeu HTTP ${response.status}: ${errorBody}`,
    };
  }

  return {
    success: true,
    skipped: false,
  };
}