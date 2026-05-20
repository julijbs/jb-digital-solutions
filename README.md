# JB Digital System

> B2B SaaS platform that automates the creation of high-performance local websites and Google Business Profile optimization for independent professionals in Brazil.

**Live:** [jbdigitalsystem.com](https://jbdigitalsystem.com)

---

## What it does

JB Digital System lets agencies and consultants deliver complete digital presence packages to local businesses — a conversion-optimized one-page website plus a fully optimized Google Business Profile — in days instead of weeks.

- **AI-powered site generation:** client fills a 5-step onboarding form; AI generates all copy across 31 fields; admin reviews and publishes
- **GBP management:** connects to Google Business Profile API to track impressions, calls, and route requests
- **Project pipeline:** 12-stage status flow from lead creation to monthly active client
- **Domain registration:** automated flow from subdomain to custom domain via Cloudflare
- **Role-based access:** admin dashboard for the agency, client portal for the end customer

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| UI | shadcn/ui + Tailwind CSS + Radix UI |
| Data fetching | TanStack React Query |
| Auth + Database | Supabase |
| Edge Functions | Deno (Supabase Edge Functions) |
| AI | Gemini via AI Gateway |
| Domains | Cloudflare Registrar |
| Deployments | Vercel |
| Animations | Framer Motion |
| Charts | Recharts |

---

## Local development

```bash
# Install dependencies
npm install

# Copy env file and fill in your Supabase credentials
cp .env.example .env

# Start dev server
npm run dev   # http://localhost:5173

# Run tests
npm run test
```

---

## Project structure

```
src/
  components/      # UI components (admin/, client/, landing/, ui/)
  pages/           # Route-level page components
  hooks/           # Custom React hooks
  integrations/    # Supabase client setup
supabase/
  functions/       # Edge Functions (Deno)
  migrations/      # Database migrations
docs/
  PRD.md           # Product requirements document
```

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

All other secrets (Stripe, Google, Cloudflare, GitHub, Vercel) are configured as Supabase Edge Function secrets — never stored in code or `.env`.

---

Built by [JB Digital Consulting](https://jbdigitalsystem.com)
