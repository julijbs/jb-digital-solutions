# Automação de Produção de Sites — Desenho de Arquitetura

## Contexto

O fluxo atual de produção de um site cliente exige Claude Code manual:
1. Criar `src/data/<slug>.ts` (dados do cliente: serviços, bairros, marca, copy)
2. Rodar `scripts/deploy-client.sh <slug> <subdomain>` (build Astro + deploy Cloudflare Pages)

O admin (`/admin`) já não tem o gerador morto (Pipeline A, Gemini→1 HTML). A automação abaixo
é o caminho para tornar a produção self-service sem abrir o Claude Code.

**Por que Edge Function não resolve:** Deno não executa `astro build` (requer Node.js e disco).
A solução correta é **GitHub Actions como runner**, acionado via `repository_dispatch`.

---

## Fase 1 — Encanamento (baixo esforço, valor imediato)

**O que habilita:** re-deploy de cliente já existente com 1 clique no admin. Não resolve a
criação de dados novos, mas já elimina o terminal para re-publicar atualizações.

### 1a. GitHub Actions workflow

Criar `.github/workflows/deploy-client.yml`:

```yaml
name: Deploy Client Site
on:
  repository_dispatch:
    types: [deploy-client]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Install site-engine deps
        run: npm ci
        working-directory: site-engine
      - name: Build & deploy
        env:
          CLIENT: ${{ github.event.client_payload.slug }}
          SITE_URL: ${{ github.event.client_payload.site_url }}
          CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
          CF_ZONE_ID: ${{ secrets.CF_ZONE_ID }}
        run: bash site-engine/scripts/deploy-client.sh \
               "$CLIENT" \
               "${{ github.event.client_payload.subdomain }}"
```

**Secrets do repo (GitHub → Settings → Secrets):**
- `CF_API_TOKEN` — token Cloudflare com Pages:Edit + DNS:Edit
- `CF_ACCOUNT_ID` — `7812618157602ea1684c84ce8ab42feb`
- `CF_ZONE_ID` — `6bc82e6b657fc2113c9a4c86f3636afc`

### 1b. Edge Function trigger no Supabase

Criar `supabase/functions/trigger-site-build/index.ts`:

```ts
// Dispara o GitHub Action via repository_dispatch.
// Requer secret GITHUB_TOKEN com permissão actions:write no repo julijbs/jb-digital-solutions.
const { slug, subdomain, siteUrl } = await req.json();
await fetch(
  "https://api.github.com/repos/julijbs/jb-digital-solutions/dispatches",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("GITHUB_DEPLOY_TOKEN")}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      event_type: "deploy-client",
      client_payload: { slug, subdomain, site_url: siteUrl },
    }),
  }
);
```

**Secrets Supabase:** `GITHUB_DEPLOY_TOKEN` (fine-grained PAT: `actions:write` em `jb-digital-solutions`).

### 1c. Botão no admin (futuro)

Um botão "Re-publicar site" na página do cliente (`/admin/clients/:id`) que chama
`supabase.functions.invoke("trigger-site-build", { body: { slug, subdomain, siteUrl } })`.

---

## Fase 2 — Geração de dados do cliente (esforço médio-alto)

**O que habilita:** criar um novo cliente sem escrever o `src/data/<slug>.ts` manualmente.

Esta é a parte difícil — reproduzir programaticamente o que o Claude Code faz hoje:

| Entrada | Saída |
|---------|-------|
| `client_intake` (Supabase) | `src/data/<slug>.ts` commitado no repo |
| Logo do cliente | Tokens de marca (via edge fn `extract-brand` já existente) |
| Especialidade + cidade | Matriz de bairros (API de busca ou base fixa por cidade) |
| Serviços do cliente | Copy por serviço×bairro (Claude API headless) |

**Abordagem sugerida:**
1. Edge fn `generate-client-data`: consome `client_intake`, chama `extract-brand` + Claude API,
   monta o objeto TypeScript e o commita via GitHub API (`PUT /repos/.../contents/site-engine/src/data/<slug>.ts`).
2. O commit aciona automaticamente o workflow da Fase 1.

**Gargalo real:** a qualidade do `<slug>.ts` manual é alta (copy revisado, bairros curados,
serviços com descrição completa). A automação via Claude API produzirá um resultado de primeira
iteração que ainda precisará de revisão — o ganho é em tempo, não em qualidade zero-shot.

---

## Fase 3 — UX no admin (após Fases 1+2)

Substituir o "Gerar Site com IA" removido por um painel "Publicar site":
- Lista de clientes com status de build (`projects.status`)
- Botão "Publicar" → Fase 1 (se dados já existem) ou "Gerar + Publicar" → Fase 2 + 1
- Polling de status via GitHub API (run status) ou webhook → `projects.status`

---

## Recomendação

**Começar pela Fase 1** num sprint isolado:
- Esforço: ~2-3h (workflow YAML + edge fn trigger + botão no admin)
- Valor: re-deploy de cliente existente sem terminal
- Custo zero de infra (GitHub Actions free tier cobre centenas de builds/mês)

A Fase 2 é um projeto próprio — vale avaliar se o ganho de tempo supera o custo de manter
a qualidade do `<slug>.ts` com geração automática versus continuando via Claude Code.
