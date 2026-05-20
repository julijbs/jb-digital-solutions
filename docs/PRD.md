# PRD — JB Digital System (JB Digital Consulting)

> **Versão:** 1.0  
> **Data:** 2026-02-15  
> **Status:** MVP em desenvolvimento

---

## 1. Visão Geral

**JB Digital System** é um SaaS B2B que produtiza a criação de sites one-page de alta performance e a otimização de Google Business Profile (GBP) para profissionais liberais e negócios locais no Brasil.

### 1.1 Problema

Profissionais liberais (psicólogos, dentistas, terapeutas, nutricionistas) precisam de presença digital profissional mas não têm tempo, conhecimento técnico ou orçamento para agências tradicionais.

### 1.2 Solução

Plataforma que automatiza a geração de sites otimizados para SEO local + gestão de perfil no Google, entregues em dias (não semanas), com custo acessível e sem mensalidade de hospedagem.

### 1.3 Público-Alvo

| Segmento | Vertical | Prioridade |
|---|---|---|
| Psicólogos | `psicologo` | Alta |
| Dentistas | `dentista` | Alta |
| Terapeutas | `terapeuta` | Média |
| Nutricionistas | `nutricionista` | Média |
| Outros | `outro` | Baixa |

---

## 2. Arquitetura de Usuários

### 2.1 Perfis (Roles)

| Role | Código | Descrição |
|---|---|---|
| **Admin JB** | `admin_jb` | Gestor da plataforma. Acesso total a pipeline, geração de sites, financeiro e relatórios. |
| **Cliente** | `client` | Cliente final. Acessa onboarding, preview do site, relatórios de performance e billing. |

### 2.2 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) em todas as tabelas
- Multi-tenant: cada cliente acessa apenas seus próprios dados
- Perfis criados automaticamente via trigger no signup

---

## 3. Funcionalidades

### 3.1 Landing Page (`/`)

- Hero section com headline de conversão
- Seções: Pain Points, Solução, Como Funciona, Pricing, Depoimentos, FAQ, CTA Final
- Hospedagem gratuita permanente (sem mensalidade)

### 3.2 Autenticação (`/login`, `/signup`)

- Cadastro com email + senha
- Login com redirecionamento baseado em role:
  - `admin_jb` → `/admin`
  - `client` → `/dashboard`

### 3.3 Dashboard do Cliente

| Rota | Funcionalidade |
|---|---|
| `/dashboard` | Visão geral dos projetos |
| `/dashboard/projects` | Lista de projetos do cliente |
| `/dashboard/new-project` | Criar novo projeto |
| `/dashboard/onboarding/:projectId` | Formulário de onboarding (5 etapas) |
| `/dashboard/reports` | Relatórios de performance GBP |
| `/dashboard/billing` | Histórico financeiro |
| `/dashboard/review` | Revisar e aprovar site |
| `/dashboard/domain-success` | Confirmação de domínio configurado |

### 3.4 Painel Admin

| Rota | Funcionalidade |
|---|---|
| `/admin` | Dashboard com KPIs, gráficos de receita e distribuição |
| `/admin/clients` | Gestão de clientes |
| `/admin/pipeline` | Pipeline visual de projetos por status |
| `/admin/projects/:projectId` | Detalhes do projeto (timeline, links, intake, revisões) |
| `/admin/site-generator` | **Gerador de Sites com IA** |
| `/admin/templates` | Galeria de templates |
| `/admin/prompt-generator` | Gerador de prompts |
| `/admin/gbp` | Gestão de perfis do Google Business |
| `/admin/billing` | Gestão financeira |
| `/admin/reports` | Relatórios consolidados |
| `/admin/domains` | Gestão de domínios |
| `/admin/integrations` | Integrações (GitHub, Vercel, Cloudflare) |
| `/admin/settings` | Configurações do sistema |

---

## 4. Gerador de Sites com IA

### 4.1 Fluxo

```
Dados do Onboarding
       ↓
Edge Function (generate-site-texts)
       ↓
IA gera JSON com 31 campos de copywriting
       ↓
applyTextsToTemplate() substitui {{PLACEHOLDERS}}
       ↓
HTML final renderizado no preview
       ↓
Admin revisa → publica
```

### 4.2 Templates Disponíveis

| Template | Paleta | Fontes | Público Ideal |
|---|---|---|---|
| **Elegante Minimalista** | Azul escuro + Dourado | DM Serif Display + Inter | Psicólogos, terapeutas, coaches |
| **Moderno Clean** | Verde + Cinza | Poppins + Inter | Nutricionistas, personal trainers |
| **Acolhedor Suave** | Roxo + Rosa | Playfair Display + Open Sans | Terapeutas holísticos, consteladores |

### 4.3 Campos Gerados pela IA

31 campos de copywriting: headlines, pain points, sobre, serviços, processo, depoimentos, CTA e FAQ — gerados de forma coesa a partir dos dados do onboarding.

### 4.4 Refinamento por Seção

- Admin pode regerar seções individuais (hero, about, services, cta)
- Edge Function `regenerate-section` aceita instrução personalizada
- Mantém tom e estilo geral, aplicando ajustes pontuais

### 4.5 Troca de Template

- Após gerar textos, admin pode trocar template instantaneamente
- Mesmos textos são re-injetados no novo template sem chamar IA novamente

---

## 5. Pipeline de Projetos

### 5.1 Status (ordem obrigatória)

```
lead_created → onboarding_in_progress → content_ready
→ site_generated → repo_created → deployed_preview
→ qa_passed → client_review → deployed_prod
→ handoff_ready → handoff_done → monthly_active
```

### 5.2 Checklists de Qualidade

- **GBP Sprint:** Categorias, fotos, horários, posts no Google
- **Site Sprint:** SEO local (NAP, schema, metas), performance, conversão (WhatsApp/CTA)

---

## 6. Onboarding do Cliente

### 6.1 Etapas

| Step | Dados Coletados |
|---|---|
| 1 | Dados do negócio (nome, descrição, telefone, email, Instagram) |
| 2 | Serviços (categoria, tags, diferenciais, abordagem) |
| 3 | Agenda (cidade, estado, horários) |
| 4 | Fotos (logo, profissional, consultório) |
| 5 | Google (acesso ao GBP, URL) |

---

## 7. Domínios

### 7.1 Fluxo

```
not_configured → subdomain_active → searching → payment_pending
→ payment_processing → registering → dns_configuring
→ ssl_activating → domain_ready
```

### 7.2 Características

- Registro via Cloudflare
- Propriedade atribuída ao cliente final
- Renovação automática opcional

---

## 8. Relatórios GBP

### 8.1 Métricas

- Impressões (Busca vs. Mapas)
- Cliques no site
- Chamadas telefônicas
- Solicitações de rota

### 8.2 Fonte de Dados

- API do Google Business Profile
- Edge Function: `gbp-reports`
- Período: últimos 30 dias

---

## 9. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| State/Data | TanStack React Query |
| Auth + Database | Supabase |
| Edge Functions | Deno (Supabase Edge Functions) |
| IA | Gemini via AI Gateway |
| Domínios | Cloudflare Registrar |
| Deploy de sites | Vercel |
| Repositórios | GitHub |
| Animações | Framer Motion |
| Gráficos | Recharts |

---

## 10. Edge Functions

| Função | Finalidade |
|---|---|
| `generate-site-texts` | Gera JSON de copywriting via IA |
| `regenerate-section` | Refina seção específica do site |
| `generate-prompt` | Gera prompt estruturado |
| `gbp-reports` | Busca métricas do Google Business Profile |
| `domain-check` | Verifica disponibilidade de domínio |
| `domain-create-checkout` | Cria sessão de pagamento para domínio |
| `domain-register` | Registra domínio |
| `webhook-github` | Recebe webhooks do GitHub |
| `webhook-vercel` | Recebe webhooks do Vercel |

---

## 11. Integrações Externas

| Serviço | Uso |
|---|---|
| Google Business Profile | Relatórios de performance |
| Cloudflare | Registro de domínios |
| GitHub | Repositórios dos sites gerados |
| Vercel | Deploy dos sites |
| Stripe | Pagamentos |

> Todas as credenciais são gerenciadas como secrets no Supabase dashboard — nenhuma chave é armazenada no código.

---

## 12. Funcionalidades Implementadas (MVP)

- [x] Landing page de conversão
- [x] Autenticação e roles (admin / cliente)
- [x] Onboarding de clientes (5 etapas)
- [x] Pipeline de projetos com múltiplos status
- [x] Gerador de sites com IA (3 templates)
- [x] Refinamento de seções por IA
- [x] Dashboard admin com KPIs
- [x] Relatórios GBP
- [x] Gestão de domínios

---

*Documento interno — JB Digital Consulting.*
