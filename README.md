# JB Digital System

> B2B SaaS platform that automates the creation of high-performance local websites and Google Business Profile optimization for independent professionals in Brazil.

**Live:** [jbdigitalsystem.com](https://jbdigitalsystem.com)

---

## What it does

JB Digital System lets agencies and consultants deliver complete digital presence packages to local businesses — a conversion-optimized one-page website plus a fully optimized Google Business Profile — in days instead of weeks.

- **AI-powered site generation:** client fills a 5-step onboarding form; AI generates all copy across 31 fields; admin reviews and publishes
- **Free site templates:** five original, responsive styles for editorial professionals, health, beauty, local services, and food businesses; the initial style and palette are suggested from the business category
- **GBP management:** connects to Google Business Profile API to track impressions, calls, and route requests
- **Project pipeline:** 12-stage status flow from lead creation to monthly active client
- **Domain registration:** automated flow from subdomain to custom domain via Cloudflare
- **Instagram prospect previews:** admin can create a 30-day, noindex site concept from a professional Instagram profile and share the link manually
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

### Site templates

The site generator includes five original styles: Editorial de Confiança, Clínica Serena, Beleza & Estética, Serviço Local, and Gastronomia Acolhedora. All are available without paid image or template dependencies. The generator only uses supplied business details for contact information, services, credentials, prices, hours, and FAQs; missing details should be omitted rather than replaced with examples.

### Instagram prospect previews

The admin route `/admin/prospecting` imports profile details and up to six posts through Meta's official Business Discovery API using Composio. It does not scrape Instagram. Preview links are public, noindex, expire after 30 days, and can be renewed or revoked; the token is stored only as a hash. The admin reviews and shares the link manually; no prospect message is sent automatically.

Configure `COMPOSIO_API_KEY` and `GEMINI_API_KEY` as Supabase Edge Function secrets, not `VITE_` variables. Composio must have an Instagram professional account connected under the same user ID as the authenticated Supabase administrator, with Business Discovery access. `INSTAGRAM_GRAPH_API_VERSION` is optional and defaults to `v24.0`. If Meta does not grant access to a personal, private, or otherwise unavailable profile, preview creation fails rather than falling back to scraping.

Apply the migration and deploy the functions before enabling the admin route:

```bash
supabase db push
supabase functions deploy create-prospect-preview
supabase functions deploy get-prospect-preview --no-verify-jwt
```

---

Built by [JB Digital Consulting](https://jbdigitalsystem.com)
