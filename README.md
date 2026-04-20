# Steam-Price

API simples para monitorar itens do Steam Market e enviar alertas para o Discord.

Este projeto foi feito para ser um MVP facil de manter:

- sem banco
- sem painel admin
- sem fila
- sem dependencia de cron interno
- com configuracao dos itens direto em codigo

Se voce souber editar um array em TypeScript e fazer `git push`, voce consegue manter este projeto sozinho.

## Objetivo

O fluxo da aplicacao e este:

1. Um cron externo chama `POST /api/check`
2. A API le os itens configurados em `lib/config.ts`
3. Para cada item, a API consulta o Steam Market
4. Ela compara o preco atual com o alvo configurado
5. Se a regra bater, envia um embed para o Discord via webhook
6. A API devolve um JSON com o resumo da execucao

## O que esta versao faz

- monitora varios itens
- suporta alerta de `compra` e `venda`
- aceita qualquer app id do Steam Market presente na URL
- envia alerta para Discord
- suporta thumbnail opcional no embed do Discord
- pode ser chamada por cron-job.org, Uptime Kuma, GitHub Actions ou qualquer scheduler

## O que esta versao nao faz

- nao salva historico
- nao evita alerta repetido entre uma execucao e outra
- nao tem autenticacao de usuario
- nao tem tela de cadastro dinamico de item
- nao armazena estado entre chamadas

Isso significa que, se um item continuar acima ou abaixo do alvo, o cron pode disparar outro alerta na proxima rodada.

## Estrutura do projeto

```txt
app/
  api/
    check/route.ts
    health/route.ts
  globals.css
  layout.tsx
  page.tsx
lib/
  checker.ts
  config.ts
  discord.ts
  steam.ts
.env.example
.eslintrc.json
next.config.js
package.json
tsconfig.json
README.md
```

## Arquivos importantes

### `lib/config.ts`

Este e o arquivo mais importante do projeto.

Aqui voce controla:

- os itens monitorados
- o preco alvo de cada item
- se a regra e de compra ou venda
- a URL do webhook do Discord
- tempos de timeout e delay
- imagem opcional de cada item

Exemplo:

```ts
export const MONITORED_ITEMS = [
  {
    id: "wizard-hat",
    name: "Wizard Hat",
    marketUrl: "https://steamcommunity.com/market/listings/590830/Wizard%20Hat",
    targetPrice: 250,
    triggerType: "venda",
    imageUrl: "https://cdn.seusite.com/wizard-hat.png",
  },
];
```

Explicacao dos campos:

- `id`: identificador interno. Deve ser unico.
- `name`: nome amigavel que aparece nos logs e no Discord.
- `marketUrl`: URL completa do item no Steam Market.
- `targetPrice`: preco que ativa a regra.
- `triggerType: "compra"`: alerta quando o preco atual for menor ou igual ao alvo.
- `triggerType: "venda"`: alerta quando o preco atual for maior ou igual ao alvo.
- `imageUrl`: imagem opcional que vira thumbnail no webhook.

Tambem existe o objeto `APP_CONFIG`:

```ts
export const APP_CONFIG = {
  currencyCode: 7,
  requestTimeoutMs: 20000,
  delayBetweenItemsMs: 1500,
  discordWebhookUrl: "COLE_AQUI_O_WEBHOOK_DO_DISCORD",
} as const;
```

Explicacao:

- `currencyCode`: moeda da API do Steam. `7` costuma retornar em BRL.
- `requestTimeoutMs`: timeout por item.
- `delayBetweenItemsMs`: espera entre um item e outro para evitar chamar tudo de uma vez.
- `discordWebhookUrl`: URL do webhook do Discord.

Se voce quiser mudar os itens monitorados, quase sempre e so este arquivo que voce vai editar.

## `lib/steam.ts`

Este arquivo conversa com o Steam Market.

Responsabilidades:

- extrair o `appId` e o nome do item a partir da `marketUrl`
- montar a URL da API `priceoverview`
- buscar o preco atual
- converter o valor retornado pelo Steam para numero
- dizer se o alvo foi atingido ou nao

Funcoes importantes:

### `extractMarketData(marketUrl)`

Le a URL e extrai:

- `appId`
- `marketHashName`

Exemplo:

```txt
https://steamcommunity.com/market/listings/590830/Wizard%20Hat
```

vira:

- `appId = 590830`
- `marketHashName = Wizard Hat`

Isso e importante porque antes o codigo estava preso ao app id `730`. Agora ele aceita o app id que vier na URL.

### `normalizeSteamPrice(value)`

Converte textos como:

- `R$ 2.049,08`
- `R$ 148,39`

para numero JavaScript:

- `2049.08`
- `148.39`

### `reachedTarget(currentPrice, targetPrice, triggerType)`

Aplica a regra:

- `compra`: `currentPrice <= targetPrice`
- `venda`: `currentPrice >= targetPrice`

### `fetchSteamSnapshot(item)`

Esta e a funcao principal do arquivo.

Ela recebe um item do config e devolve um snapshot com:

- nome
- app id
- preco atual numerico
- preco formatado
- alvo
- tipo da regra
- se bateu ou nao

## `lib/discord.ts`

Este arquivo monta e envia o embed do Discord.

Responsabilidades:

- validar se o webhook existe
- definir cor do embed
- definir titulo e campos
- enviar o POST para o Discord
- retornar sucesso ou erro

Campos enviados no embed:

- titulo
- descricao
- preco atual
- preco alvo
- regra
- link do item
- timestamp
- thumbnail opcional via `imageUrl`

Se quiser mudar o visual do alerta, e aqui que voce mexe.

Exemplos do que voce pode alterar facilmente:

- trocar `username`
- trocar texto do titulo
- trocar cor de compra e venda
- usar `embed.image` no lugar de `thumbnail`
- adicionar novos `fields`

## `lib/checker.ts`

Este arquivo e o orquestrador da execucao.

Pense nele como o "motor" do check.

Fluxo dele:

1. le `MONITORED_ITEMS`
2. percorre um item por vez
3. chama `fetchSteamSnapshot(item)`
4. se o alvo bateu, chama `sendDiscordAlert(...)`
5. acumula os resultados
6. devolve um JSON resumido no final

Pontos importantes:

- ele usa `sleep(...)` entre itens
- ele nao para tudo se um item falhar
- ele retorna `failedCount`
- ele retorna `alertCount`

Se voce quiser mudar a logica global da checagem, este e o arquivo.

## `app/api/check/route.ts`

Este e o endpoint principal da API.

URL:

```txt
POST /api/check
```

Responsabilidades:

- opcionalmente validar `CRON_SECRET`
- chamar `runPriceCheck()`
- devolver o JSON de resultado

Trecho importante:

```ts
const authHeader = request.headers.get("authorization");
if (authHeader === `Bearer ${configuredSecret}`) {
  return true;
}
```

Se voce configurar `CRON_SECRET`, seu cron precisa enviar:

```txt
Authorization: Bearer SEU_TOKEN
```

## `app/api/health/route.ts`

Endpoint simples para healthcheck.

URL:

```txt
GET /api/health
```

Ele serve para voce testar se o projeto esta no ar sem disparar verificacao de preco.

## `app/page.tsx`

Nao e o coracao da API. E apenas uma pagina informativa.

Ela mostra:

- quais endpoints existem
- quantos itens estao configurados
- valores de timeout e delay
- lista dos itens configurados

Se quiser remover a pagina e deixar so API, pode. Ela nao e necessaria para o cron.

## `app/layout.tsx` e `app/globals.css`

Esses arquivos cuidam do layout e estilo da pagina inicial.

Nao afetam a logica da API.

## Como atualizar itens monitorados

Na pratica, este e o procedimento do dia a dia:

1. abrir `lib/config.ts`
2. adicionar, remover ou editar itens em `MONITORED_ITEMS`
3. salvar
4. fazer commit
5. fazer push
6. esperar o redeploy da Vercel

### Adicionar um item novo

Copie um item existente e troque os dados:

```ts
{
  id: "meu-item",
  name: "Meu Item",
  marketUrl: "https://steamcommunity.com/market/listings/730/Meu%20Item",
  targetPrice: 100,
  triggerType: "compra",
  imageUrl: "",
}
```

### Remover um item

Apague o bloco correspondente do array.

### Alterar compra para venda

Troque:

```ts
triggerType: "compra"
```

por:

```ts
triggerType: "venda"
```

## Como funciona a regra de compra e venda

### Compra

Use quando voce quer ser avisado se o preco cair.

Exemplo:

```ts
targetPrice: 100,
triggerType: "compra"
```

Isso significa:

- alertar quando o preco atual for `100` ou menos

### Venda

Use quando voce quer ser avisado se o preco subir.

Exemplo:

```ts
targetPrice: 250,
triggerType: "venda"
```

Isso significa:

- alertar quando o preco atual for `250` ou mais

## Como colocar imagem no alerta do Discord

Agora cada item aceita:

```ts
imageUrl: "https://..."
```

Quando esse campo estiver preenchido, a API envia a URL como `thumbnail` do embed.

Se estiver vazio, o alerta sai sem imagem.

## Como colocar o webhook do Discord

Hoje o webhook fica em:

`lib/config.ts`

No objeto `APP_CONFIG`:

```ts
discordWebhookUrl: "https://discord.com/api/webhooks/SEU_ID/SEU_TOKEN"
```

Importante:

- se o repositorio for publico, isso expoe o webhook
- o ideal futuro e mover isso para variavel de ambiente

## Como proteger a rota `/api/check`

Crie a variavel de ambiente:

```env
CRON_SECRET="um-token-secreto"
```

Depois, seu cron precisa enviar:

```txt
Authorization: Bearer um-token-secreto
```

Se `CRON_SECRET` nao existir, a rota aceita chamada sem token.

## Como testar localmente

Instale as dependencias:

```bash
npm install
```

Rode em dev:

```bash
npm run dev
```

Abra:

- `http://localhost:3000/`
- `http://localhost:3000/api/health`

Para testar o check:

```bash
curl -X POST http://localhost:3000/api/check
```

No Windows:

```bash
curl.exe -X POST http://localhost:3000/api/check
```

## Como testar em producao

Se sua URL publica for:

`https://steam-price-5go5.vercel.app`

entao:

- health: `https://steam-price-5go5.vercel.app/api/health`
- check: `https://steam-price-5go5.vercel.app/api/check`

Exemplo:

```bash
curl.exe -X POST https://steam-price-5go5.vercel.app/api/check
```

## Exemplo de resposta da API

```json
{
  "ok": true,
  "startedAt": "2026-04-20T21:50:00.832Z",
  "checkedAt": "2026-04-20T21:50:07.382Z",
  "totalItems": 5,
  "alertCount": 0,
  "failedCount": 0,
  "results": [
    {
      "itemId": "wizard-hat",
      "name": "Wizard Hat",
      "currentPrice": 245.35,
      "displayPrice": "R$ 245,35",
      "targetPrice": 250,
      "triggerType": "venda",
      "targetReached": false,
      "discord": null
    }
  ]
}
```

## Como o deploy funciona

Este projeto foi pensado para Vercel.

Fluxo:

1. voce faz push no GitHub
2. a Vercel detecta o commit
3. roda `npm install`
4. roda `npm run build`
5. publica a nova versao

Tempo normal:

- geralmente alguns segundos para detectar o push
- normalmente 1 a 3 minutos para o deploy ficar pronto

## Como configurar cron-job.org

Configuracao recomendada:

- method: `POST`
- URL: `https://seu-projeto.vercel.app/api/check`
- intervalo: 15 minutos

Se usar `CRON_SECRET`, inclua o header:

- `Authorization: Bearer SEU_TOKEN`

## Mudancas comuns que voce vai fazer sozinho

### Trocar um alvo de preco

Edite apenas:

```ts
targetPrice: 250
```

### Trocar compra por venda

Edite apenas:

```ts
triggerType: "venda"
```

### Adicionar imagem no embed

Edite apenas:

```ts
imageUrl: "https://..."
```

### Trocar webhook

Edite apenas:

```ts
discordWebhookUrl: "https://discord.com/api/webhooks/..."
```

### Aumentar timeout

Edite:

```ts
requestTimeoutMs: 30000
```

### Reduzir velocidade entre itens

Edite:

```ts
delayBetweenItemsMs: 3000
```

## Quando mexer em qual arquivo

- quer mudar itens, webhook, timeout ou imagem: `lib/config.ts`
- quer mudar como a Steam e consultada: `lib/steam.ts`
- quer mudar a mensagem do Discord: `lib/discord.ts`
- quer mudar a logica geral do loop de verificacao: `lib/checker.ts`
- quer mudar autenticacao da API: `app/api/check/route.ts`
- quer mudar apenas a pagina informativa: `app/page.tsx`

## Melhorias futuras recomendadas

Se voce quiser evoluir o projeto depois, a ordem mais natural e:

1. mover o webhook para variavel de ambiente
2. guardar estado para evitar alertas repetidos
3. criar um JSON externo para os itens
4. criar um front HTML separado
5. adicionar historico dos checks

## Resumo rapido para manutencao

Seis coisas para lembrar:

1. quase tudo do dia a dia esta em `lib/config.ts`
2. o cron chama `POST /api/check`
3. `compra` = cai para o alvo ou menos
4. `venda` = sobe para o alvo ou mais
5. `imageUrl` adiciona thumbnail no Discord
6. push no GitHub = redeploy na Vercel

Se voce abrir esse projeto daqui a meses e esquecer tudo, comece por `lib/config.ts`, depois `lib/checker.ts`, e por ultimo `lib/steam.ts`.
