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
# CF_API_TOKEN, CF_ACCOUNT_ID e CF_ZONE_ID são obrigatórios para publicar.
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

if [[ ! "$SLUG" =~ ^[a-z0-9][a-z0-9-]{0,59}$ ]]; then
  echo "Erro: slug inválido: ${SLUG}" >&2
  exit 1
fi

if [[ ! "$SUBDOMAIN" =~ ^[a-z0-9][a-z0-9-]{0,59}$ ]]; then
  echo "Erro: prefixo de subdomínio inválido: ${SUBDOMAIN}" >&2
  exit 1
fi

# Carrega variáveis do .env.local se existir (CF_API_TOKEN, CF_ACCOUNT_ID, CF_ZONE_ID)
if [ -f "$SITE_ENGINE/.env.local" ]; then
  set -a; . "$SITE_ENGINE/.env.local"; set +a
fi

if [ -z "${CF_API_TOKEN:-}" ] || [ -z "${CF_ZONE_ID:-}" ]; then
  echo "Erro: CF_API_TOKEN e CF_ZONE_ID são obrigatórios para atualizar o DNS." >&2
  exit 1
fi

if [ "${DNS_ONLY}" != "--dns-only" ] && [ -z "${CF_ACCOUNT_ID:-}" ]; then
  echo "Erro: CF_ACCOUNT_ID é obrigatório para publicar no Cloudflare Pages." >&2
  exit 1
fi

api_success() {
  python3 -c 'import json,sys; print(str(json.load(sys.stdin).get("success", False)).lower())' <<<"$1" 2>/dev/null || echo false
}

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
else
  echo "▶ 2/3  Deploy no Cloudflare Pages (projeto: ${PROJECT_NAME})..."

  # Garante que o projeto existe; falhas diferentes de duplicidade interrompem o deploy.
  CREATE_RESPONSE=$(curl -sS -X POST \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"name\":\"${PROJECT_NAME}\",\"production_branch\":\"main\"}") || {
      echo "Erro ao consultar/criar projeto Cloudflare Pages." >&2
      exit 1
    }

  if [ "$(api_success "$CREATE_RESPONSE")" != "true" ] && ! grep -qi "already exists" <<<"$CREATE_RESPONSE"; then
    echo "Erro ao criar projeto Cloudflare Pages:" >&2
    echo "$CREATE_RESPONSE" >&2
    exit 1
  fi

  # Deploy do conteúdo estático para produção (branch main = custom domain)
  cd "$SITE_ENGINE"
  npx wrangler@3 pages deploy "dist/${SLUG}" \
    --project-name "${PROJECT_NAME}" \
    --branch=main \
    --commit-dirty=true
  echo "       ✓ Deploy concluído → ${PAGES_DEV_URL}"

  # Registra domínio customizado no projeto — idempotente (ignora se já existe)
  echo "       → Registrando domínio customizado ${DOMAIN}..."
  DOMAIN_RESP=$(curl -sS -X POST \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"name\":\"${DOMAIN}\"}") || {
      echo "Erro ao registrar domínio ${DOMAIN}. O deploy está disponível em ${PAGES_DEV_URL}." >&2
      exit 1
    }
  if [ "$(api_success "$DOMAIN_RESP")" = "true" ]; then
    echo "       ✓ Domínio ${DOMAIN} registrado no projeto"
  else
    DOMAIN_LIST=$(curl -fsS \
      "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json") || {
        echo "Erro ao confirmar o domínio ${DOMAIN}. Deploy disponível em ${PAGES_DEV_URL}." >&2
        exit 1
      }
    DOMAIN_EXISTS=$(python3 -c 'import json,sys; print(str(any(d.get("name") == sys.argv[1] for d in json.load(sys.stdin).get("result", []))).lower())' "$DOMAIN" <<<"$DOMAIN_LIST" 2>/dev/null || echo false)
    if [ "$DOMAIN_EXISTS" = "true" ]; then
      echo "       ✓ Domínio ${DOMAIN} já está registrado neste projeto"
    else
      echo "Erro ao confirmar o domínio ${DOMAIN} no projeto:" >&2
      echo "$DOMAIN_RESP" >&2
      echo "O deploy está disponível em ${PAGES_DEV_URL}." >&2
      exit 1
    fi
  fi
fi

# ── 3. Cloudflare DNS — CNAME → pages.dev ─────────────────────────────
echo ""
echo "▶ 3/3  DNS Cloudflare..."

if [ -n "${CF_API_TOKEN:-}" ] && [ -n "${CF_ZONE_ID:-}" ]; then
  # Verifica se já existe um CNAME para este subdomínio
  EXISTING=$(curl -fsS \
    "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?type=CNAME&name=${DOMAIN}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json")
  if [ "$(api_success "$EXISTING")" != "true" ]; then
    echo "Erro ao consultar DNS Cloudflare:" >&2
    echo "$EXISTING" >&2
    exit 1
  fi
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
    RESPONSE=$(curl -fsS -X PUT \
      "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records/${EXISTING_ID}" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$CNAME_PAYLOAD")
    if [ "$(api_success "$RESPONSE")" = "true" ]; then
      echo "       ✓ CNAME ${SUBDOMAIN} → ${PROJECT_NAME}.pages.dev atualizado (proxied)"
    else
      echo "Erro ao atualizar CNAME:" >&2
      echo "$RESPONSE" >&2
      exit 1
    fi
  else
    # Cria novo registro
    RESPONSE=$(curl -fsS -X POST \
      "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$CNAME_PAYLOAD")
    if [ "$(api_success "$RESPONSE")" = "true" ]; then
      echo "       ✓ CNAME ${SUBDOMAIN} → ${PROJECT_NAME}.pages.dev criado (proxied)"
    else
      echo "Erro ao criar CNAME:" >&2
      echo "$RESPONSE" >&2
      exit 1
    fi
  fi
fi

echo ""
if [ "${DNS_ONLY}" = "--dns-only" ]; then
  echo "✅ DNS atualizado. O build e o deploy foram ignorados (--dns-only)."
  echo "   Destino: ${PROJECT_NAME}.pages.dev"
else
  echo "✅ Build e publicação concluídos!"
  echo "   URL prod:      ${SITE_URL}"
  echo "   Pages.dev URL: ${PAGES_DEV_URL}"
fi
echo ""
