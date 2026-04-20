<<<<<<< HEAD
# CounterStrike Price API

MVP de API sem banco para monitorar itens do Steam Market e enviar alerta no Discord.

## O que esta versão faz

- Lê os itens em código.
- Busca o preço atual no Steam Market.
- Compara com o alvo configurado.
- Dispara um webhook do Discord quando a condição for atendida.
- Expõe um endpoint para cron externo chamar.

## O que esta versão não faz

- Não salva histórico.
- Não evita alertas repetidos entre execuções.
- Não possui painel admin.
- Não tem banco.

## Onde editar os itens e o webhook

Edite [lib/config.ts](./lib/config.ts).

Campos por item:

- `marketUrl`: link do item no Steam Market.
- `targetPrice`: preço alvo em reais.
- `triggerType: "compra"`: alerta quando cair para o alvo ou menos.
- `triggerType: "venda"`: alerta quando subir para o alvo ou mais.

Também é nesse arquivo que fica `discordWebhookUrl`.

## Segurança

Hoje o webhook está pensado para ficar hardcoded porque esse foi o MVP pedido.

Se você for subir o projeto em repositório público, troque o webhook hardcoded por variável de ambiente antes de publicar.

## Endpoints

### `GET /api/health`

Healthcheck simples.

### `POST /api/check`

Dispara a verificação de todos os itens configurados.

Se você definir `CRON_SECRET`, envie:

`Authorization: Bearer SEU_TOKEN`

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Deploy recomendado para o MVP

### Opção 1: Vercel

Boa quando você quer subir rápido essa API Next.js sem mexer muito.

Passos:

1. Crie um repositório novo com esta pasta.
2. Importe o projeto na Vercel.
3. Se usar proteção, cadastre `CRON_SECRET` nas environment variables.
4. Faça o deploy.
5. Pegue a URL final, por exemplo `https://seu-projeto.vercel.app/api/check`.

### Opção 2: Render

Boa se você quiser uma hospedagem mais tradicional para app web Node.

Passos:

1. Suba o projeto em um repositório GitHub.
2. Crie um Web Service no Render.
3. Build command: `npm install && npm run build`
4. Start command: `npm run start`
5. Configure `CRON_SECRET` se desejar.
6. Use a URL pública do serviço no cron.

## Cron externo

Você pode usar `cron-job.org` para chamar a API.

Configuração sugerida:

- Method: `POST`
- URL: `https://sua-api.com/api/check`
- Header: `Authorization: Bearer SEU_TOKEN` se usar `CRON_SECRET`
- Intervalo inicial sugerido: 15 minutos

## Próxima etapa sugerida

Depois da API estável, fazemos um front separado em HTML estático para subir no GitHub Pages. Esse front pode:

- listar os itens configurados
- mostrar nome, link e preço atual
- chamar a API hosteada para rodar a verificação manual
- futuramente trocar config hardcoded por um JSON estático versionado
=======
# Steam-Price
Repositorio para uma API de steam price
>>>>>>> b15217f61c86a7cfa3a4696d3097b9705da08a09
