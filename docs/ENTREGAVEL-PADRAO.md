# Padrão de Entregável — JB Digital System

> **Referência:** Site Marcela Barcellos (marcelabarcellos.jbdigitalsystem.com)  
> **Validado em:** 27/06/2026  
> **Status:** Padrão de produção aprovado

Este documento define o checklist completo de entrega para um cliente do JB Digital System,
baseado na primeira entrega real (Marcela Barcellos — psicóloga/neuropsicóloga, São José dos Campos).

---

## O que é entregue

### 1. Site one-page de alta performance

- **Engine:** Astro (geração estática), hospedagem Cloudflare Pages
- **Domínio:** `[slug].jbdigitalsystem.com` (incluso, sem custo extra ao cliente)
- **Design:** derivado da identidade visual da cliente (logo → paleta → componentes)
- **Fotos:** WebP otimizado, aspect-ratio 4/5 nos containers (garante cabeça nunca cortada)
- **Deploy:** automático via `scripts/deploy-client.sh`

### 2. SEO local completo (43 páginas indexadas)

| Componente | Detalhe |
|---|---|
| Home otimizada | Title, description, canonical, robots meta |
| Geo tags | Coordenadas exatas da cidade da cliente |
| 42 páginas locais | Combinação serviço × bairro (ex: "psicóloga Vila Adyana") |
| JSON-LD Psychologist | Schema estruturado com todos os campos do negócio |
| JSON-LD FAQPage | Perguntas e respostas da cliente |
| `sameAs[]` | Instagram + Google Business Profile (GBP) |
| Sitemap XML | `sitemap-index.xml` apontando para `sitemap-0.xml` |
| og:image | 1200×630 px com cores da marca, gerada com Pillow |

### 3. Google Business Profile (GBP)

- Badge "Ver avaliações no Google" (★★★★★) na seção de depoimentos
- Link direto ao perfil do Maps via CID do negócio
- GBP URL integrada ao schema `sameAs[]` para fortalecer entidade no Google

### 4. Google Search Console (GSC)

- Propriedade verificada via arquivo HTML deployado na raiz
- Sitemap submetido e processado no dia do lançamento
- Resultado Marcela: 43 páginas encontradas em < 1 hora

---

## Checklist de entrega (QA antes de comunicar ao cliente)

### Fotos e imagens
- [ ] Hero photo: WebP, mínimo 1200×1500px (3:4 ou 4:5)
- [ ] Sobre photo: WebP, mínimo 900×1125px
- [ ] og:image: 1200×630px com nome + especialidade + CTA
- [ ] Nomes de arquivo únicos (quebra cache de 30 dias do CDN)

### Dados do cliente (`src/data/[slug].ts`)
- [ ] `businessName`, `tagline`, `description`
- [ ] `lat`, `lng` (coordenadas corretas)
- [ ] `openingHours`
- [ ] `instagram` (sem @)
- [ ] `gbpUrl` (URL do Maps com CID)
- [ ] `ogImageSrc` preenchido
- [ ] `heroPhotoSrc` e `aboutPhotoSrc` apontando para WebP

### SEO e schema
- [ ] `<title>` e `<meta description>` únicos
- [ ] JSON-LD sem erros (validar no Rich Results Test)
- [ ] `sameAs[]` com Instagram e GBP
- [ ] Sitemap gerado e acessível

### Deploy e verificação
- [ ] `bash scripts/deploy-client.sh [slug] [cf-project]` rodou sem erro
- [ ] URL de produção abre corretamente
- [ ] `curl` no og:image retorna 200
- [ ] GSC: propriedade verificada
- [ ] GSC: sitemap processado ("O sitemap foi processado" + N páginas encontradas)

---

## Arquivos do engine envolvidos por entrega

```
src/data/[slug].ts                                      ← dados do cliente
src/lib/types.ts                                        ← tipagem (ClientData)
src/pages/index.astro                                   ← home + JSON-LD
src/pages/[servico]/[bairro].astro                      ← 42 páginas locais
src/components/blocks/hero/HeroEditorialSplit.astro     ← foto hero
src/components/blocks/about/AboutPortraitOffset.astro   ← foto sobre
src/components/blocks/testimonials/TestimonialsPullQuote.astro ← badge GBP
src/layouts/Layout.astro                                ← <head>, og:image
public/[slug]/marcela-hero.webp                         ← foto hero
public/[slug]/marcela-sobre.webp                        ← foto sobre
public/[slug]/og-image.jpg                              ← og:image
public/google[token].html                               ← verificação GSC
```

---

## Resultado de referência — Marcela Barcellos (27/06/2026)

- **Site:** https://marcelabarcellos.jbdigitalsystem.com
- **Cloudflare Pages project:** `jbds-marcelabarcellos`
- **GSC:** propriedade verificada, 43 páginas no sitemap, processado no mesmo dia
- **Schema:** Psychologist + FAQPage + sameAs [Instagram, Google Maps]
- **Tempo de entrega técnica:** 1 sessão (~3h)

---

## Deploy de um novo cliente

```bash
cd /Users/julianabarcellossilva/jb-digital-solutions/site-engine
bash scripts/deploy-client.sh [slug-cliente] [cf-project-name]
```

Exemplo (Marcela):
```bash
bash scripts/deploy-client.sh marcela-barcellos marcelabarcellos
```
