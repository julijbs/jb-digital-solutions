# generate-site-brand — função recuperada

**Status: não revisada, não deployada.** Recuperada em 2026-07-30 de um clone obsoleto do repo
(`~/jb-digital-os`, último commit 2026-06-06) onde estava como arquivo *untracked* — nunca foi
commitada nem enviada ao GitHub. O clone foi apagado numa limpeza de disco; esta era a única cópia.

## O que é

Rota A ("premium") do pipeline de geração de sites, criada em 2026-04-22:

1. **Fase 1** — gera JSON de conteúdo com tom de copy por vertical (psicólogo, dentista, terapeuta, nutricionista)
2. **Fase 2** — Claude Sonnet gera HTML único a partir de um prompt de diretor de arte
   (ritmo visual por seção, hierarquia tipográfica dramática, bento grid em serviços, pull-quote nas dores)

Aceita `projectId` + `styleDirection` (`editorial-dark` | `minimal-cream` | `warm-gradient` | `bold-modern`)
e retorna `{ html, content, metadata }`.

## Por que foi recuperada

Nenhuma função ativa do repo cobre isso: `generate-site-ai` usa `gemini-2.5-flash`,
`generate-site-texts` usa `gemini-3-flash-preview`, e nenhuma implementa `styleDirection`
nem geração via Claude. A capacidade de Rota A está ausente do pipeline atual.

## Antes de usar — pendências conhecidas

- Referencia `LOVABLE_GATEWAY` (`ai.gateway.lovable.dev`) na fase de conteúdo. A plataforma
  migrou para fora do Lovable; essa chamada precisa ser reapontada
- Depende da tabela `client_brand_data`, que pode não existir no schema atual — verificar migration
- Depende do secret `ANTHROPIC_API_KEY` no projeto Supabase
- Nunca foi testada com um projeto real; a qualidade visual do output não foi avaliada
- Escrita antes do fluxo Spec-Site-Primeiro (julho) — pode conflitar com `trigger-site-build` / `publish-client`

Decidir se é para modernizar e integrar, ou arquivar de vez.
