#!/usr/bin/env bash
# deploy-client.sh — Build + deploy Vercel + DNS Cloudflare para um cliente
#
# Uso:
#   ./scripts/deploy-client.sh <slug> <subdomain-prefix>
#
# Exemplos:
#   ./scripts/deploy-client.sh marcela-barcellos marcelabarcellos
#   ./scripts/deploy-client.sh dra-ana-mello anamello
#
# Pré-requisitos:
#   - Vercel CLI autenticado (vercel whoami)
#   - CF_API_TOKEN + CF_ZONE_ID no ambiente (para DNS automático)
#     Sem essas vars, o script imprime o CNAME a adicionar manualmente.
#
# CF_ZONE_ID = ID da zona jbdigitalsystem.com no Cloudflare (painel → Overview → direita)
# CF_API_TOKEN = API Token com permissão Zone:DNS:Edit

set -euo pipefail

SLUG="${1:?Uso: $0 <slug> <subdomain-prefix>}"
SUBDOMAIN="${2:?Uso: $0 <slug> <subdomain-prefix>}"
DOMAIN="${SUBDOMAIN}.jbdigitalsystem.com"
SITE_URL="https://${DOMAIN}"
PROJECT_NAME="${SUBDOMAIN}-jbds"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ENGINE="$(dirname "$SCRIPT_DIR")"

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│  JB Digital — Deploy Cliente                        │"
echo "│  Slug:    ${SLUG}"
echo "│  Domínio: ${DOMAIN}"
echo "└─────────────────────────────────────────────────────┘"
echo ""

# ── 1. Build ─────────────────────────────────────────────────────────
echo "▶ 1/3  Build do site..."
cd "$SITE_ENGINE"
CLIENT="${SLUG}" SITE_URL="${SITE_URL}" npx astro build --outDir "dist/${SLUG}" --quiet
echo "       ✓ dist/${SLUG}/ gerado"

# ── 2. Vercel deploy ──────────────────────────────────────────────────
echo ""
echo "▶ 2/3  Deploy no Vercel (projeto: ${PROJECT_NAME})..."

# --prebuilt porque já buildamos com Astro; --yes pula confirmações
DEPLOY_URL=$(vercel deploy "dist/${SLUG}" \
  --name "${PROJECT_NAME}" \
  --prod \
  --yes \
  --no-git \
  2>&1 | grep -E "^https://" | tail -1)

if [ -z "$DEPLOY_URL" ]; then
  echo "       ❌ Não consegui capturar a URL do deploy. Verifique 'vercel ls'."
  exit 1
fi

echo "       ✓ Deploy prod: ${DEPLOY_URL}"

# Adicionar domínio customizado ao projeto
echo "       → Adicionando domínio customizado ${DOMAIN}..."
vercel domains add "${DOMAIN}" "${PROJECT_NAME}" --scope juliana-s-projects-0d2db273 2>&1 | grep -v "^$" || true
echo "       ✓ Domínio configurado no Vercel"

# ── 3. Cloudflare DNS ─────────────────────────────────────────────────
echo ""
echo "▶ 3/3  DNS Cloudflare..."

if [ -n "${CF_API_TOKEN:-}" ] && [ -n "${CF_ZONE_ID:-}" ]; then
  RESPONSE=$(curl -s -X POST \
    "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{
      \"type\": \"A\",
      \"name\": \"${SUBDOMAIN}\",
      \"content\": \"76.76.21.21\",
      \"proxied\": true,
      \"ttl\": 1
    }")
  SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' || true)
  if [ -n "$SUCCESS" ]; then
    echo "       ✓ CNAME ${SUBDOMAIN} → cname.vercel-dns.com (proxied) criado"
  else
    echo "       ⚠️  Cloudflare retornou erro:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
  fi
else
  echo "       ⚠️  CF_API_TOKEN / CF_ZONE_ID não definidos."
  echo ""
  echo "       Adicione manualmente no Cloudflare (painel → DNS):"
  echo "       ┌──────────────────────────────────────────────────────┐"
  echo "       │ Tipo:    A                                          │"
  echo "       │ Nome:    ${SUBDOMAIN}"
  echo "       │ IP:      76.76.21.21                                 │"
  echo "       │ Proxy:   ✅ Ligado (laranja)                         │"
  echo "       └──────────────────────────────────────────────────────┘"
  echo ""
  echo "       Ou configure as variáveis e reexecute só o passo 3:"
  echo "       CF_API_TOKEN=xxx CF_ZONE_ID=yyy \\"
  echo "         curl -X POST 'https://api.cloudflare.com/client/v4/zones/\${CF_ZONE_ID}/dns_records' \\"
  echo "         -H 'Authorization: Bearer \${CF_API_TOKEN}' \\"
  echo "         -H 'Content-Type: application/json' \\"
  echo "         --data '{\"type\":\"CNAME\",\"name\":\"${SUBDOMAIN}\",\"content\":\"cname.vercel-dns.com\",\"proxied\":true}'"
fi

echo ""
echo "✅ Deploy completo!"
echo "   URL prod:  ${SITE_URL}"
echo "   Vercel:    ${DEPLOY_URL}"
echo ""
