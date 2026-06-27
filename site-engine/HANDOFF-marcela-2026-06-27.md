# Handoff — Site Marcela Barcellos · 2026-06-27

## O que foi feito nesta sessão

### 1. Fotos novas (sem cabeça cortada)
- **Hero:** `marcela-hero.webp` 1200×1600 (3:4)
- **Sobre:** `marcela-sobre.webp` 900×1200 (3:4)
- **Fix do corte:** containers mudados de `aspect-ratio: 3/4` → `4/5` — com `object-fit: cover` + `object-position: top center`, o fundo cinza do estúdio é cortado pelo fundo; a cabeça nunca é tocada
- Arquivo antigo `marcela-perfil.jpg` deletado; nomes novos quebram cache de 30 dias

### 2. og:image para redes sociais
- `og-image.jpg` 1200×630 gerada com cores da marca
- Foto à direita, nome + especialidade + CTA à esquerda
- Vai aparecer corretamente no WhatsApp, LinkedIn e Facebook ao compartilhar o link

### 3. Badge "Ver avaliações no Google"
- Na seção de depoimentos: logo Google + ★★★★★ + link direto para o perfil dela no Maps
- CID do GBP: `0x719f9ba8027de60f`
- GBP URL: `https://www.google.com/maps/place/Marcela+Barcellos+Psicologia/data=!4m2!3m1!1s0x0:0x719f9ba8027de60f`

### 4. Google Search Console — verificação
- Arquivo `googleeefbdf2ece9c030b.html` deployado na raiz do site
- Cloudflare faz 308 redirect (`.html` → sem extensão), mas GSC segue o redirect

---

## Ação pendente — VOCÊ precisa fazer

### A. Verificar no GSC
1. Abre [search.google.com/search-console](https://search.google.com/search-console)
2. Adiciona propriedade: `marcelabarcellos.jbdigitalsystem.com`
3. Escolhe método **"Arquivo HTML"** → já está deployado → clica **Verificar**

### B. Submeter o sitemap
Após verificação:
- Vai em **Sitemaps** → adiciona: `https://marcelabarcellos.jbdigitalsystem.com/sitemap-index.xml`

---

## Estado SEO atual

| Item | Status |
|------|--------|
| Title + description | ✅ |
| Canonical + robots meta | ✅ |
| Geo tags (coordenadas SJC) | ✅ |
| JSON-LD Psychologist + FAQ | ✅ |
| Sitemap 43 páginas | ✅ |
| og:image 1200×630 | ✅ |
| GBP badge nos depoimentos | ✅ |
| GSC verificação | ⏳ pendente |
| Sitemap submetido no GSC | ⏳ pendente |
| GBP URL no schema sameAs | ⏳ próxima sessão |

---

## Pendências próxima sessão

1. **GSC confirmado?** Checar status da verificação e se o sitemap foi indexado
2. **sameAs no schema** — adicionar GBP URL ao array `sameAs[]` no JSON-LD (hoje só tem Instagram)
3. **jbdigitalsystem.com** — Juliana perguntou "como falar no meu site o que vou entregar pros clientes" — não foi respondido, ficou pendente

---

## Como deployar

```bash
cd /Users/julianabarcellossilva/jb-digital-solutions/site-engine
bash scripts/deploy-client.sh marcela-barcellos marcelabarcellos
```

## Arquivos modificados

```
src/data/marcela-barcellos.ts          — heroPhotoSrc, aboutPhotoSrc, ogImageSrc, gbpUrl
src/lib/types.ts                       — ogImageSrc?, gbpUrl? em ClientData
src/pages/index.astro                  — props ogImage e gbpUrl
src/components/blocks/hero/HeroEditorialSplit.astro      — aspect-ratio 4/5
src/components/blocks/about/AboutPortraitOffset.astro    — aspect-ratio 4/5
src/components/blocks/testimonials/TestimonialsPullQuote.astro — gbpUrl + Google badge
public/marcela-barcellos/marcela-hero.webp               — NOVO
public/marcela-barcellos/marcela-sobre.webp              — NOVO
public/marcela-barcellos/og-image.jpg                    — NOVO
public/googleeefbdf2ece9c030b.html                       — NOVO (GSC)
```
