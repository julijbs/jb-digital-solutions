# CLAUDE.md — JB Digital OS

## Identidade do Projeto
**JB Digital OS** é o painel operacional central e brand OS da JB Digital Consulting.
- Centraliza a identidade de marca, operações e extrai dados de brand
- Funciona como fonte da verdade para os demais produtos da empresa
- **Owner:** Juliana (JB Digital Consulting)
- **Stack:** Vite + React + TypeScript + Supabase + shadcn/ui + Tailwind CSS

## Stack
- React + TypeScript + Vite
- shadcn/ui + Tailwind CSS
- Supabase (auth + database)
- Bun (runtime)

## Comandos Essenciais
```bash
npm install    # ou: bun install
npm run dev    # http://localhost:5173
npm run build
```

## Estrutura do Projeto
```
src/         # app principal + brand extraction
supabase/    # migrations e config do banco
public/      # assets estáticos
docs/        # documentação interna
.env         # ATENÇÃO: verificar se há credenciais expostas (ver abaixo)
```

## ⚠️ ALERTA DE SEGURANÇA
O arquivo `.env` foi encontrado commitado no repositório (não apenas `.env.example`).
- **Ação obrigatória:** rotacionar todas as chaves expostas no Supabase dashboard
- Adicionar `.env` ao `.gitignore` imediatamente
- Nunca re-commitar credenciais reais

## Funcionalidades em Desenvolvimento
- **Brand extraction:** extração automática de dados de marca (integrado no `src/` e `supabase/`)
- Painel de operações da empresa
- Dashboard central de status dos produtos JB Digital

## Papél no Ecossistema JB Digital
Este repo é a **fonte da verdade operacional** da JB Digital Consulting. Os outros 3 produtos derivam identidade e contexto daqui:
- `decision-architect-ai` → produto B2B de decisão
- `mindflow-ai-your-inner-compass` (LucidIA) → SaaS B2C de bem-estar
- `arc-blueprint` → funil de aquisição ARC™

## MacBot — Integração com Orchestrator
Este repo é operado pelo **MacBot (@mac_ju_bot)** via Orchestrator (ClaudeClaw v1.1.0).

**Agent responsável:** `@ops` (operações da empresa, brand, status geral)
**Agent de suporte:** `@research` (inteligência de mercado, benchmarks de marca)

### Tasks automáticas via MacBot:
- Status geral dos 4 projetos da JB Digital → `@ops`
- Extracção e atualização de dados de brand → `@ops`
- Audit de segurança (verificar commits com credenciais) → `@ops`
- Research sobre posicionamento e concorrência → `@research`

### Como acionar via Telegram:
```
@ops qual o status atual dos projetos JB Digital?
@ops verifica se o .env do jb-digital-os ainda tem credenciais expostas
@research faz um benchmark de brand da JB Digital Consulting
```

## Avisos Importantes
- Repositório é **privado** — propriedade da JB Digital Consulting
- Commits do agente: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Brand extraction é feature sensível — não expor dados de clientes
