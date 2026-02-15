# PRD — JB Local Platform (JB Digital Consulting)

> **Versão:** 1.0  
> **Data:** 2026-02-15  
> **Status:** MVP em desenvolvimento

---

## 1. Visão Geral

**JB Local Platform** é um SaaS B2B que produtiza a criação de sites one-page de alta performance e a otimização de Google Business Profile (GBP) para profissionais liberais e negócios locais no Brasil.

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

- Autenticação via Lovable Cloud (Supabase Auth)
- Row Level Security (RLS) em todas as tabelas
- Multi-tenant: cada cliente acessa apenas seus próprios dados
- Perfis criados automaticamente via trigger no signup

---

## 3. Funcionalidades

### 3.1 Landing Page (`/`)

- Hero section com headline de conversão
- Seções: Pain Points, Solução, Como Funciona, Pricing, Depoimentos, FAQ, CTA Final
- Pacotes: Site Profissional (R$ 597), Perfil Google (R$ 597), Pacote Completo (R$ 997)
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
| `/admin/prompt-generator` | Gerador de prompts para Lovable |
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
| **Elegante Minimalista** | Azul escuro (#0A1128) + Dourado (#C8A882) | DM Serif Display + Inter | Psicólogos, terapeutas, coaches |
| **Moderno Clean** | Verde (#2D6A4F) + Cinza (#1A1A1A) | Poppins + Inter | Nutricionistas, personal trainers |
| **Acolhedor Suave** | Roxo (#5A189A) + Rosa (#F4E4F7) | Playfair Display + Open Sans | Terapeutas holísticos, consteladores |

### 4.3 Campos Gerados pela IA

```
meta_description, hero_headline, hero_subheadline,
pain_point_1..3, about_headline, about_text,
services_headline, service_1..3_name, service_1..3_desc,
process_headline, process_step_1..3,
testimonial_1..2, cta_headline, cta_button_text,
faq_question_1..3, faq_answer_1..3
```

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
lead_created
  → onboarding_in_progress
    → content_ready
      → lovable_prompt_ready
        → lovable_site_generated
          → repo_created
            → vercel_deployed_preview
              → qa_passed
                → client_review
                  → vercel_deployed_prod
                    → handoff_ready
                      → handoff_done
                        → monthly_active
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

### 6.2 Status de Onboarding

`not_started` → `step_1` → `step_2` → `step_3` → `step_4` → `step_5` → `completed`

---

## 7. Domínios

### 7.1 Fluxo

```
not_configured → subdomain_active → searching → payment_pending
→ payment_processing → registering → dns_configuring
→ ssl_activating → domain_ready
```

### 7.2 Características

- Registrar via Cloudflare (crédito mínimo $10)
- Propriedade atribuída ao cliente final
- Renovação automática opcional
- Transações rastreadas em `domain_transactions`

---

## 8. Relatórios GBP

### 8.1 Métricas

- Impressões (Busca vs. Mapas)
- Cliques no site
- Chamadas telefônicas
- Solicitações de rota

### 8.2 Fonte de Dados

- API do Google Business Profile
- Secret: `GOOGLE_REFRESH_TOKEN`
- Edge Function: `gbp-reports`
- Período: últimos 30 dias

---

## 9. Modelo de Precificação

| Pacote | Preço | Inclui |
|---|---|---|
| Site Profissional | R$ 597 | Site one-page + hospedagem gratuita |
| Perfil no Google | R$ 597 | Otimização completa do GBP |
| Pacote Completo | R$ 997 | Site + GBP + desconto |

- Pagamento: PIX ou cartão (Stripe/Asaas)
- Modelo: `setup_50_50` (50% entrada + 50% entrega) ou `monthly`
- Garantia de satisfação via processo de revisão em etapas

---

## 10. Banco de Dados

### 10.1 Tabelas Principais

| Tabela | Finalidade |
|---|---|
| `profiles` | Dados adicionais do usuário |
| `user_roles` | Mapeamento user → role (`admin_jb` / `client`) |
| `clients` | Cadastro de clientes (business_name, vertical, city) |
| `projects` | Projetos com status, domínio, integrações |
| `client_intake` | Dados de onboarding (5 etapas, JSON por step) |
| `client_reviews` | Ciclo de revisão e aprovação do site |
| `notifications` | Sistema de notificações in-app |
| `domain_transactions` | Transações de compra/renovação de domínio |
| `domain_renewals` | Controle de renovação automática |

### 10.2 Funções do Banco

| Função | Retorno |
|---|---|
| `get_client_user_id(client_id)` | `user_id` do cliente |
| `get_project_user_id(project_id)` | `user_id` do projeto |
| `has_role(role, user_id)` | `boolean` |

---

## 11. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| State/Data | TanStack React Query |
| Backend | Lovable Cloud (Supabase) |
| Auth | Lovable Cloud Auth |
| Edge Functions | Deno (Supabase Edge Functions) |
| IA | Lovable AI Gateway (Gemini 2.5 Flash) |
| Domínios | Cloudflare Registrar |
| Deploy de sites | Vercel |
| Repositórios | GitHub |
| Animações | Framer Motion |
| Gráficos | Recharts |

---

## 12. Edge Functions

| Função | Finalidade |
|---|---|
| `generate-site-texts` | Gera JSON de copywriting via IA |
| `generate-site-ai` | Geração completa do site (legacy) |
| `regenerate-section` | Refina seção específica do site |
| `generate-prompt` | Gera prompt estruturado para Lovable |
| `gbp-reports` | Busca métricas do Google Business Profile |
| `domain-check` | Verifica disponibilidade de domínio |
| `domain-create-checkout` | Cria sessão de pagamento para domínio |
| `domain-register` | Registra domínio no Cloudflare |
| `webhook-github` | Recebe webhooks do GitHub |
| `webhook-vercel` | Recebe webhooks do Vercel |

---

## 13. Integrações Externas

| Serviço | Uso | Secrets Necessários |
|---|---|---|
| Google Business Profile | Relatórios de performance | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` |
| Cloudflare | Registro de domínios | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| GitHub | Repositórios dos sites | `GITHUB_TOKEN`, `GITHUB_WEBHOOK_SECRET` |
| Vercel | Deploy dos sites | `VERCEL_TOKEN`, `VERCEL_WEBHOOK_SECRET` |
| Stripe/Asaas | Pagamentos | Configurar conforme necessário |

---

## 14. Roadmap

### MVP (Atual)
- [x] Landing page de conversão
- [x] Autenticação e roles
- [x] Onboarding de clientes (5 etapas)
- [x] Pipeline de projetos (13 status)
- [x] Gerador de sites com IA (3 templates)
- [x] Refinamento de seções por IA
- [x] Dashboard admin com KPIs
- [x] Relatórios GBP
- [x] Gestão de domínios

### Próximas Iterações
- [ ] Publicação automática (HTML → Storage → Domínio)
- [ ] Webhooks GitHub/Vercel funcionais
- [ ] Pagamentos integrados (Stripe)
- [ ] Notificações por email
- [ ] Editor visual de sites (drag & drop)
- [ ] Multi-idioma
- [ ] App mobile para clientes

---

## 15. Métricas de Sucesso

| Métrica | Meta |
|---|---|
| Tempo de geração de site | < 60 segundos |
| Taxa de aprovação na 1ª revisão | > 70% |
| NPS dos clientes | > 8 |
| Sites publicados/mês | > 20 |
| Churn mensal | < 5% |

---

*Documento gerado automaticamente a partir do codebase JB Local Platform.*
