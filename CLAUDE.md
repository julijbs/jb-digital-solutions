# CLAUDE.md — JB Digital System

## Project Identity
**JB Digital System** is a B2B SaaS platform that automates the creation of high-performance local websites and Google Business Profile (GBP) optimization for independent professionals and local businesses in Brazil.

- **Owner:** JB Digital Consulting
- **Stack:** Vite + React + TypeScript + Supabase + shadcn/ui + Tailwind CSS

## Stack
- React + TypeScript + Vite
- shadcn/ui + Tailwind CSS
- Supabase (auth + database + edge functions)
- Bun (runtime)

## Essential Commands
```bash
npm install    # or: bun install
npm run dev    # http://localhost:5173
npm run build
npm run test
```

## Project Structure
```
src/           # React app (components, pages, hooks)
supabase/      # Edge functions + migrations
public/        # Static assets
docs/          # Product documentation
```

## Environment Variables
Copy `.env.example` to `.env` and fill in:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Architecture
- **Frontend:** SPA with role-based routing (`admin_jb` → `/admin`, `client` → `/dashboard`)
- **Auth:** Supabase Auth with automatic role assignment via DB trigger
- **API:** Supabase Edge Functions (Deno runtime) — secrets injected via Supabase dashboard
- **Data:** Row Level Security on all tables; multi-tenant

## Conventions
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Components: PascalCase; utilities: camelCase
- All API keys read from environment — never hardcoded
