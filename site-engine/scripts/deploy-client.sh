#!/usr/bin/env bash
# deploy-client.sh — Build + deploy Cloudflare Pages + DNS para um cliente
#
# Uso:
#   ./scripts/deploy-client.sh <slug> <subdomain-prefix> [--dns-only]
#
# Exemplos:
#   ./scripts/deploy-client.sh marcela-barcellos marcelabarcellos
#   ./scripts/deploy-client.sh dra-ana-mello anamello
#
# Pré-requisitos (em site-engine/.env.local):
#   CF_API_TOKEN   — permissões: User:User Details:Read
#                                Account:Cloudflare Pages:Edit
#                                Zone:DNS:Edit
#   CF_ACCOUNT_ID  — Account ID da conta Cloudflare (painel → lado direito)
#   CF_ZONE_ID     — Zone ID de jbdigitalsystem.com (painel → Overview → direita)
#
# Sem CF_API_TOKEN/CF_ACCOUNT_ID o passo 2 (deploy) é pulado com aviso.
# Sem CF_API_TOKEN/CF_ZONE_ID o passo 3 (DNS) imprime instruções manuais.
# --dns-only pula os passos 1 (build) e 2 (deploy); só executa o DNS.

set -euo pipefail

SLUG="${1:?Uso: $0 <slug> <subdomain-prefix> [--dns-only]}"
SUBDOMAIN="${2:?Uso: $0 <slug> <subdomain-prefix> [--dns-only]}"
DNS_ONLY="${3:-}"
DOMAIN="${SUBDOMAIN}.jbdigitalsystem.com"
SITE_URL="https://${DOMAIN}"
PROJECT_NAME="jbds-${SUBDOMAIN}"
PAGES_DEV_URL="https://${PROJECT_NAME}.pages.dev"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ENGINE="$(dirname "$SCRIPT_DIR")"

# Carrega variáveis do .env.local se existir (CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID)
if [ -f "$SITE_ENGINE/.env.local" ]; then
  set -a; . "$SITE_ENGINE/.env.local"; set +a
fi

# Exporta para o wrangler reconhecer automaticamente
export CLOUDFLARE_API_TOKEN="${CF_API_TOKEN:-}"
export CLOUDFLARE_ACCOUNT_ID="${CF_ACCOUNT_ID:-}"

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│  JB Digital — Deploy Cliente (Cloudflare Pages)     │"
echo "│  Slug:    ${SLUG}"
echo "│  Domínio: ${DOMAIN}"
echo "│  Project: ${PROJECT_NAME}"
echo "└─────────────────────────────────────────────────────┘"
echo ""

# ── 1. Build ─────────────────────────────────────────────────────────
if [ "${DNS_ONLY}" = "--dns-only" ]; then
  echo "▶ 1/3  Build — skipped (--dns-only)"
else
  echo "▶ 1/3  Build do site..."
  cd "$SITE_ENGINE"
  CLIENT="${SLUG}" SITE_URL="${SITE_URL}" npx astro build --outDir "dist/${SLUG}" --quiet
  echo "       ✓ dist/${SLUG}/ gerado"
fi

# ── 2. Cloudflare Pages deploy ────────────────────────────────────────
echo ""
if [ "${DNS_ONLY}" = "--dns-only" ]; then
  echo "▶ 2/3  Deploy — skipped (--dns-only)"
elif [ -z "${CF_API_TOKEN:-}" ] || [ -z "${CF_ACCOUNT_ID:-}" ]; then
  echo "▶ 2/3  Deploy — ⚠️  CF_API_TOKEN / CF_ACCOUNT_ID não definidos em site-engine/.env.local"
  echo "       Crie o arquivo com as 3 variáveis (CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID)"
  echo "       e re-execute sem --dns-only."
else
  echo "▶ 2/3  Deploy no Cloudflare Pages (projeto: ${PROJECT_NAME})..."

  # Garante que o projeto existe — idempotente (ignora erro "already exists")
  curl -s -X POST \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"name\":\"${PROJECT_NAME}\",\"production_branch\":\"main\"}" \
    > /dev/null

  # Deploy do conteúdo estático para produção (branch main = custom domain)
  cd "$SITE_ENGINE"
  npx wrangler@3 pages deploy "dist/${SLUG}" \
    --project-name "${PROJECT_NAME}" \
    --branch=main \
    --commit-dirty=true
  echo "       ✓ Deploy concluído → ${PAGES_DEV_URL}"

  # Registra domínio customizado no projeto — idempotente (ignora se já existe)
  echo "       → Registrando domínio customizado ${DOMAIN}..."
  DOMAIN_RESP=$(curl -s -X POST \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"name\":\"${DOMAIN}\"}")
  DOMAIN_OK=$(echo "$DOMAIN_RESP" | grep -o '"success":true' || true)
  if [ -n "$DOMAIN_OK" ]; then
    echo "       ✓ Domínio ${DOMAIN} registrado no projeto"
  else
    echo "       ↩  Domínio já registrado (ok)"
  fi
fi

# ── 3. Cloudflare DNS — CNAME → pages.dev ─────────────────────────────
echo ""
echo "▶ 3/3  DNS Cloudflare..."

if [ -n "${CF_API_TOKEN:-}" ] && [ -n "${CF_ZONE_ID:-}" ]; then
  # Verifica se já existe um CNAME para este subdomínio
  EXISTING=$(curl -s \
    "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?type=CNAME&name=${DOMAIN}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json")
  EXISTING_ID=$(echo "$EXISTING" | python3 -c \
    "import sys,json; r=json.load(sys.stdin); print(r['result'][0]['id'] if r.get('result') else '')" \
    2>/dev/null || true)

  CNAME_PAYLOAD="{
    \"type\": \"CNAME\",
    \"name\": \"${SUBDOMAIN}\",
    \"content\": \"${PROJECT_NAME}.pages.dev\",
    \"proxied\": true,
    \"ttl\": 1
  }"

  if [ -n "$EXISTING_ID" ]; then
    # Atualiza o registro existente (idempotente)
    RESPONSE=$(curl -s -X PUT \
      "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records/${EXISTING_ID}" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$CNAME_PAYLOAD")
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' || true)
    if [ -n "$SUCCESS" ]; then
      echo "       ✓ CNAME ${SUBDOMAIN} → ${PROJECT_NAME}.pages.dev atualizado (proxied)"
    else
      echo "       ⚠️  Erro ao atualizar CNAME:"
      echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    fi
  else
    # Cria novo registro
    RESPONSE=$(curl -s -X POST \
      "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$CNAME_PAYLOAD")
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' || true)
    if [ -n "$SUCCESS" ]; then
      echo "       ✓ CNAME ${SUBDOMAIN} → ${PROJECT_NAME}.pages.dev criado (proxied)"
    else
      echo "       ⚠️  Erro ao criar CNAME:"
      echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    fi
  fi
else
  echo "       ⚠️  CF_API_TOKEN / CF_ZONE_ID não definidos."
  echo ""
  echo "       Adicione manualmente no Cloudflare (painel → DNS):"
  echo "       ┌────────────────────────────────────────────────────────────┐"
  echo "       │ Tipo:    CNAME                                            │"
  echo "       │ Nome:    ${SUBDOMAIN}"
  echo "       │ Destino: ${PROJECT_NAME}.pages.dev                        │"
  echo "       │ Proxy:   ✅ Ligado (laranja)                               │"
  echo "       └────────────────────────────────────────────────────────────┘"
fi

echo ""
echo "✅ Concluído!"
echo "   URL prod:      ${SITE_URL}"
echo "   Pages.dev URL: ${PAGES_DEV_URL}"
echo ""
