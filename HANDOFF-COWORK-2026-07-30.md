# HANDOFF — Cowork → Claude Code · 2026-07-30

**Contexto:** Sessão Cowork (cloud) executou a fase 1 do plano de monetização. Este handoff lista o que o Claude Code (sessão local no Mac) precisa fazer para deixar as máquinas 100% testadas de ponta a ponta. Ordem de execução abaixo. Frase de retomada: **"Retomar HANDOFF-COWORK-2026-07-30.md"**.

## ✅ O que a sessão Cowork já fez (não refazer)

1. **Verificado:** commit `9066a10` (billing fix) JÁ está na `origin/main` — a pendência do handoff de 27/06 estava obsoleta.
2. **Bug de copy corrigido na fonte** (working tree, branch atual `chore/testenoclose-legal-pages`, **NÃO commitado**): FAQ hardcoded "psicoterapia" e footer com CVV 188 apareciam em TODOS os spec-sites (confirmado em produção no cvp-tijuca.jbdigitalsystem.com). Arquivos alterados em `site-engine/`:
   - `src/components/blocks/faq/FAQNativeDetails.astro` — novo prop `note` com default genérico
   - `src/components/blocks/footer/FooterSimpleColumns.astro` — novo prop `disclaimer` com default genérico
   - `src/pages/index.astro` — passa `client.copy.faqNote` e `client.copy.footerDisclaimer`
   - `src/lib/types.ts` — campos opcionais `faqNote` e `footerDisclaimer`
   - `src/data/dra-ana-mello.ts` e `src/data/marcela-barcellos.ts` — mantêm texto de psicologia + CVV explícitos
   - `src/data/dra-marina-costa.ts` — faqNote de nutrição (é nutricionista, não psicóloga)
3. **Extraído o pipeline comercial:** 10 prévias vet com telefones/deals → `KIT-ABORDAGEM-THAIS.md` (nesta pasta).
4. **Kiwify checkout testado:** ativo, MAS só cartão visível (sem PIX) e sem order bump. Havia aviso estranho de "lote esgotado" no checkout — verificar item 6.

## 🔧 Fila de execução do Claude Code

### 1. Commitar e propagar o fix de copy (PRIORITÁRIO — bloqueia a Thaís)
```bash
cd ~/jb-digital-solutions
git stash list  # conferir estado
git checkout -b fix/faq-footer-copy-generic
git add site-engine/src/components/blocks/faq/FAQNativeDetails.astro \
        site-engine/src/components/blocks/footer/FooterSimpleColumns.astro \
        site-engine/src/pages/index.astro site-engine/src/lib/types.ts \
        site-engine/src/data/dra-ana-mello.ts site-engine/src/data/marcela-barcellos.ts \
        site-engine/src/data/dra-marina-costa.ts
git commit -m "fix(site-engine): parametriza faq note e footer disclaimer (removia copy de psicologia dos sites vet)"
# merge na main + push
```
Depois: **rebuild + redeploy de TODOS os spec-sites publicados** (os 10 vet + dra-marina-costa se publicada) via pipeline publish-client/Cloudflare Pages. Validar no ar: FAQ do cvp-tijuca.jbdigitalsystem.com sem "psicoterapia" e footer sem CVV.

### 2. E2E de checkout do JB Digital System
Rodar o fluxo completo em Stripe test mode: signup → NewProject → billing (create-billing-checkout, agora v31) → verify-billing-payment. Testar também domain-create-checkout (é a função compatível com PIX). Gravar GIF de evidência como no E2E de 27/06.

### 3. Segurança (com a Juliana ao lado — precisa dos dashboards)
- Rotacionar chave Stripe `sk_live_51OGP…` (exposta em sessão de junho) → atualizar `supabase secrets set STRIPE_SECRET_KEY` no projeto `rqiacrclsmixmaqhgicc` + webhook secret se regenerado.
- Revogar/recriar token Cloudflare exposto.
- Rotacionar chaves da sessão de 30/07 do JB Local Platform (nota no MEMORY.md).
- Ativar PIX no Stripe dashboard (Settings → Payment methods) — `domain-create-checkout` já é compatível.

### 4. ianapratica.net — plugar no funil
O `index.html` é bundle compilado (7,5 MB, conteúdo comprimido — editar via fonte Dyad/Lovable ou cirurgicamente). Duas inserções:
- Bloco pós-CTA: convite à newsletter **"IA na Prática"** (captura de e-mail).
- Rodapé/seção final: ponte B2B — "Sua empresa precisa decidir onde usar IA? Conheça o JB AI Decision Sprint™ → decision.jbdigitalconsulting.com".
Commit + push na main = deploy automático Vercel.

### 5. Central de Objeções — decisão de preço (Juliana decide, Claude Code executa)
Registros 14 e 15 da tabela `objecoes_jb` (Supabase JB Digital System) citam "R$ 997, sem mensalidade" — conflita com a oferta vigente (R$ 1.497 + R$ 149/mês, `project_oferta_jb_2026_07.md`). Atualizar os 2 registros após confirmação.

### 6. Kiwify (via claude-in-chrome, Juliana logada)
- Ativar **PIX** no checkout do Kit Documentos Oficiais.
- Criar **order bump R$ 27** (copy pronta em `CALENDARIO-REELS-SERVIDORSEMTRAVA.md`, seção "Melhorias de funil").
- Investigar aviso "lote esgotado/redirecionando" que apareceu no checkout `pay.kiwify.com.br/T4mUG5E` — se houver limite de lote configurado, remover.
- ManyChat: no fluxo MODELO, adicionar captura de e-mail antes do link do Drive.

### 7. Tarefas manuais da Juliana (nenhuma IA resolve)
- KDP: corrigir sumário do "IA na Prática" no Pages (números reais de página) e re-subir o miolo.
- Aprovar textos default que a sessão Cowork escolheu para FAQ/footer genéricos (podem ser refinados por vertical).

## 📎 Artefatos desta sessão (na raiz de ~/jb-digital-solutions)
`KIT-ABORDAGEM-THAIS.md` · `CALENDARIO-REELS-SERVIDORSEMTRAVA.md` (copiar para o projeto do Instagram se preferir) · este handoff.
