import { APP_CONFIG, MONITORED_ITEMS } from "@/lib/config";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "48px 20px 80px",
      }}
    >
      <div
        style={{
          padding: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          background: "rgba(10, 14, 20, 0.72)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p style={{ color: "#ff9f43", margin: 0, fontWeight: 700 }}>MVP API</p>
        <h1 style={{ marginTop: 12, fontSize: 38, lineHeight: 1.1 }}>
          CounterStrike Price API
        </h1>
        <p style={{ color: "rgba(255,255,255,0.74)", maxWidth: 720 }}>
          Esta versão foi feita para rodar sem banco. Os itens monitorados, o alvo
          de preço, o tipo de disparo e o webhook do Discord ficam em código.
        </p>

        <div style={{ marginTop: 28 }}>
          <h2>Endpoints</h2>
          <ul>
            <li>
              <code>GET /api/health</code> para healthcheck
            </li>
            <li>
              <code>POST /api/check</code> para o cron disparar a verificação
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2>Configuração atual</h2>
          <ul>
            <li>
              Itens monitorados: <strong>{MONITORED_ITEMS.length}</strong>
            </li>
            <li>
              Timeout por item: <strong>{APP_CONFIG.requestTimeoutMs}ms</strong>
            </li>
            <li>
              Delay entre itens: <strong>{APP_CONFIG.delayBetweenItemsMs}ms</strong>
            </li>
            <li>
              Webhook hardcoded:{" "}
              <strong>{APP_CONFIG.discordWebhookUrl ? "sim" : "não"}</strong>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2>Itens</h2>
          <div style={{ display: "grid", gap: 16 }}>
            {MONITORED_ITEMS.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <strong>{item.name}</strong>
                <p style={{ margin: "8px 0", color: "rgba(255,255,255,0.74)" }}>
                  {item.triggerType === "compra"
                    ? "Alerta quando cair para o alvo ou menos."
                    : "Alerta quando subir para o alvo ou mais."}
                </p>
                <p style={{ margin: "8px 0" }}>
                  Alvo: <strong>R$ {item.targetPrice.toFixed(2)}</strong>
                </p>
                <a href={item.marketUrl} target="_blank" rel="noreferrer">
                  Abrir item no Steam Market
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
