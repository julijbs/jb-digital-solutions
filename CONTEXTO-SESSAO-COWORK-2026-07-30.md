# Contexto da Sessão — Cowork (cloud) · 2026-07-30

*Resumo completo para retomada em qualquer sessão futura (Claude Code, Cowork ou claude.ai). Complementa o MEMORY.md. Frase de retomada da execução técnica: "Retomar HANDOFF-COWORK-2026-07-30.md".*

## O pedido da Juliana

Analisar como lucrar de verdade com os ativos já prontos — 4 repos GitHub (decision-architect-ai, mindflow-ai-your-inner-compass, ianapratica-site, ebook-ianapratica), o ebook na Amazon (B0H175WFJ5), o produto na Kiwify (Kit Documentos Oficiais) e o Instagram @servidorsemtrava — cruzando com os arquivos do Mac e a memória (claude-mem + MEMORY.md). Depois: "quero que comece os ajustes 1 a 1 agora mesmo" e "máquinas prontas e testadas de ponta a ponta; o que não resolver, handoff pro Claude Code". Por fim, este contexto.

## Diagnóstico central (aprovado tacitamente pela Juliana ao pedir execução)

Não há problema de produto — há problema de **distribuição e fechamento**. Cinco máquinas prontas, todas paradas por falta de tráfego/abordagem. Priorização definida (dinheiro mais próximo primeiro):

1. **JB Digital System** (jbdigitalsystem.com) — converter as 10 prévias vet já publicadas. Oferta vigente: Site R$ 1.497 + Presença Ativa R$ 149/mês + add-on Google R$ 97/mês. Thaís (21 98099-0577) é a closer.
2. **Kit Documentos Oficiais R$ 37** (Kiwify, checkout pay.kiwify.com.br/T4mUG5E) — único funil 100% automatizado (ManyChat: MODELO = amostra, KIT = venda). Gargalo: audiência. Solução: aplicar a fábrica de vídeos do @testenoclose ao @servidorsemtrava, formato faceless (regra zero-exposição respeitada).
3. **JB AI Decision Sprint™ R$ 12.000** (decision.jbdigitalconsulting.com, repo decision-architect-ai) — maior prêmio, ciclo longo; alimentar via livro-funil (já aprovado) + LinkedIn (pronto) + ebook como isca.
4. **Ebook IA na Prática** (KDP + ianapratica.net/Eduzz) — vira porta de entrada do Sprint; pendências: sumário KDP + atualizar landing.
5. **LucidIA/MindFlow** (lucidia.pro) — estacionado conscientemente (Supabase já INACTIVE).

Metas 90 dias: conservador R$ 12 mil acumulado + R$ 900/mês recorrente; otimista R$ 40 mil + R$ 2,5 mil/mês.

## O que foi executado nesta sessão

1. **Pendência fantasma eliminada:** commit 9066a10 (billing fix) já estava na origin/main — handoff de 27/06 estava obsoleto nesse ponto.
2. **Bug de copy em produção encontrado e corrigido na fonte:** todos os spec-sites vet exibiam FAQ "psicoterapia" e footer com CVV 188 (hardcoded nos blocos compartilhados). Editados 7 arquivos em `~/jb-digital-solutions/site-engine/` (FAQNativeDetails.astro, FooterSimpleColumns.astro, index.astro, types.ts + data de dra-ana-mello, marcela-barcellos, dra-marina-costa — esta é nutricionista, recebeu nota de nutrição). **Não commitado** — Claude Code commita, rebuilda e redeploya. ⚠️ Thaís NÃO dispara abordagem antes do redeploy.
3. **Pipeline comercial extraído** (Supabase `seo_stage_0615`): 10 prévias vet = 7 conversas (Pet Care Morumbi+Tatuapé: decisor único Rodrigo Lacerda; Animal Clinic Bacacheri+Batel idem). Espaço Vet MK tem celular/WhatsApp direto — primeiro alvo.
4. **Checkout Kiwify testado:** ativo, só cartão (sem PIX), sem order bump, com aviso suspeito de "lote esgotado" a investigar.
5. **Entregáveis criados** (salvos na raiz de `~/jb-digital-solutions/`):
   - `KIT-ABORDAGEM-THAIS.md` — leads, roteiros WhatsApp, objeções adaptadas, cadência 5 dias
   - `CALENDARIO-REELS-SERVIDORSEMTRAVA.md` — 30 dias, semana 1 roteirizada, 4 pilares, melhorias de funil (PIX, order bump R$ 27, captura de e-mail, bio)
   - `HANDOFF-COWORK-2026-07-30.md` — fila de execução do Claude Code
   - `plano-monetizacao-juliana.md` e `CONTEXTO-SESSAO-COWORK-2026-07-30.md` (este arquivo)

## Decisões pendentes da Juliana

1. **Preço na Central de Objeções:** registros 14–15 de `objecoes_jb` citam "R$ 997 sem mensalidade" (oferta antiga) vs. oferta vigente R$ 1.497 + R$ 149/mês — decidir e atualizar.
2. Aprovar os textos default genéricos escolhidos para FAQ/footer.
3. Segurança (com dashboards): rotacionar chave Stripe live exposta + token Cloudflare; ativar PIX no Stripe.
4. KDP: corrigir sumário do miolo no Pages e re-subir.
5. Informar nº de seguidores do @servidorsemtrava para calibrar metas do Kit (vidIQ sem créditos nesta sessão).

## Fatos úteis descobertos (para não redescobrir)

- Supabase JB Digital System: projeto `rqiacrclsmixmaqhgicc` (ACTIVE_HEALTHY); LucidIA `hdwzfwehjrgegkagvept` (INACTIVE). `app_config` tem `build_shared_key` (loop build-first fechado). `domain-create-checkout` é a única função PIX-compatível; billing/maintenance são subscription (incompatíveis).
- Repos privados no GitHub (decision-architect-ai, mindflow, ebook-ianapratica) — analisar sempre pelos clones locais/memória; cloud não tem credenciais.
- ianapratica-site: `index.html` é bundle compilado de 7,5 MB (conteúdo comprimido) — editar pela fonte Dyad/Lovable, checkout é Eduzz.
- Memória local: `~/.claude-mem/claude-mem.db` (SQLite, FTS em observations/session_summaries) consultável via python3 no device; MEMORY.md em `~/.claude/projects/-Users-julianabarcellossilva/memory/`.
- ManyChat conta fb5293631; fluxos: MODELO (content20250423134755_303293) e KIT (content20250424093659_147100), ambos live desde 21–22/jul.
