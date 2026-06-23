# DESIGN.md — JB Digital System · Site Engine

> Fonte de verdade de design. Leia antes de escrever qualquer linha de UI.
> Regra: **nunca use valores arbitrários** — sempre o token nomeado.

---

## Moods disponíveis

Cada "mood" é um conjunto de tokens + blocos preferidos.  
Ao compor um site novo, escolha 1 mood e importe os blocos correspondentes.

---

## 1. Calm Trust — psicólogo / saúde mental

_Sensação: editorial, quente, humano. Leitura calma. Autoridade sem distância._

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--ct-primary` | `#3E5C76` | Navy · headings, nav, footer bg, âncoras |
| `--ct-accent` | `#C08552` | Âmbar · único CTA âmbar, pull-quote bar, números |
| `--ct-surface` | `#F4F2ED` | Creme · background geral |
| `--ct-surface-alt` | `#EAE6DE` | Creme escuro · seções alternadas, navbar bg |
| `--ct-navy-break` | `#2A3F52` | Navy escuro · seção depoimento (contraste máximo) |
| `--ct-text` | `#1A1A1A` | Texto primário |
| `--ct-text-muted` | `#5A6475` | Credencial, caption, metadata (WCAG AA ≥ 4.5:1 em creme) |
| `--ct-border` | `#D4CFC8` | Bordas leves, dividers |
| `--ct-white` | `#FFFFFF` | Texto sobre navy break |

### Tipografia

| Token | Fonte | Fallback |
|-------|-------|---------|
| `--ct-font-display` | `'Fraunces'` (Google Fonts, wght 400/700, italic) | Georgia, serif |
| `--ct-font-body` | `'Inter'` (Google Fonts, wght 400/500/600) | system-ui, sans-serif |
| `--ct-font-mono` | — | não usado neste mood |

Hierarquia de tamanhos (mobile → desktop):
- **H1 display:** `clamp(2rem, 5vw, 3.5rem)` · Fraunces 700
- **H2 section:** `clamp(1.5rem, 3vw, 2.25rem)` · Fraunces 400
- **Lead / subheadline:** `1.125rem` · Inter 400
- **Body:** `1rem` · Inter 400 · `line-height: 1.75`
- **Caption / credential:** `0.8125rem` · Inter 500 · `letter-spacing: 0.02em`
- **Tag / badge:** `0.75rem` · Inter 600 · uppercase · `letter-spacing: 0.06em`

### Espaçamento

| Token | Valor |
|-------|-------|
| `--ct-section-py` | `5rem` (desktop) / `3rem` (mobile) |
| `--ct-container-max` | `1100px` |
| `--ct-container-px` | `1.25rem` (mobile) / `2rem` (desktop) |

### Border-radius

| Token | Valor |
|-------|-------|
| `--ct-radius-sm` | `4px` (badges, tags) |
| `--ct-radius-md` | `8px` (cards, imagens) |
| `--ct-radius-pill` | `999px` (botões CTA) |

### Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--ct-shadow-card` | `0 2px 12px rgba(0,0,0,.07)` | cards leves |
| `--ct-shadow-nav` | `0 1px 0 #D4CFC8` | nav border |

### Blocos preferidos (Calm Trust)

| Seção | Bloco | Arquivo |
|-------|-------|---------|
| Nav | Sticky minimal | `nav/NavStickyMinimal.astro` |
| Hero | Editorial split (foto dir, texto esq) | `hero/HeroEditorialSplit.astro` |
| Pain points | Numbered list (âmbar) | `painpoints/PainPointsNumbered.astro` |
| About | Portrait offset + pull quote | `about/AboutPortraitOffset.astro` |
| Services | Typographic list (numerado) | `services/ServicesTypoList.astro` |
| Process | Horizontal steps | `process/ProcessHorizontalSteps.astro` |
| Testimonials | Pull quote · navy break | `testimonials/TestimonialsPullQuote.astro` |
| FAQ | Native `<details>` grid | `faq/FAQNativeDetails.astro` |
| Final CTA | Centered editorial | `finalcta/FinalCTACenteredEditorial.astro` |
| Footer | Simple columns | `footer/FooterSimpleColumns.astro` |

---

## 2. Fresh Clinical — nutricionista / saúde preventiva

_Sensação: clínico, limpo, orgânico. Verde-sage confiável. Energia sem assepsia fria._

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `--fc-primary` | `#2D6A4F` | Verde floresta · headings, footer bg |
| `--fc-accent` | `#52B788` | Verde médio · CTA, highlights, numerais |
| `--fc-surface` | `#F7F9F7` | Off-white esverdeado · bg geral |
| `--fc-surface-alt` | `#EAF2EE` | Verde claro · seções alternadas |
| `--fc-green-break` | `#1B4332` | Verde escuro · seção depoimento |
| `--fc-text` | `#1A2318` | Texto primário |
| `--fc-text-muted` | `#4A6358` | Credencial, caption (WCAG AA em `#F7F9F7`) |
| `--fc-border` | `#C8DDD1` | Bordas leves |
| `--fc-white` | `#FFFFFF` | Texto sobre green break |

### Tipografia

| Token | Fonte | Fallback |
|-------|-------|---------|
| `--fc-font-display` | `'DM Serif Display'` (Google Fonts, wght 400) | Georgia, serif |
| `--fc-font-body` | `'DM Sans'` (Google Fonts, wght 400/500/600) | system-ui, sans-serif |

Hierarquia de tamanhos: igual ao Calm Trust (mesmos clamps, trocar fontes).

### Espaçamento / radius / sombras

Idênticos ao Calm Trust (tokens `--fc-*` com mesmos valores).

### Blocos preferidos (Fresh Clinical)

| Seção | Bloco | Arquivo |
|-------|-------|---------|
| Nav | Sticky minimal | `nav/NavStickyMinimal.astro` |
| Hero | **Centered statement** (texto centralizado, foto abaixo) | `hero/HeroCenteredStatement.astro` |
| Pain points | **Symptom cards** (3 cards com ícone SVG orgânico) | `painpoints/PainPointsSymptomCards.astro` |
| About | **Side by side** (foto esq, texto dir, sem pull quote) | `about/AboutSideBySide.astro` |
| Services | **Service grid** (2-col, ícone + texto) | `services/ServicesGrid.astro` |
| Process | **Vertical timeline** | `process/ProcessVerticalTimeline.astro` |
| Testimonials | **Card grid** (3 cards, sem navy break) | `testimonials/TestimonialsCardGrid.astro` |
| FAQ | Native `<details>` grid | `faq/FAQNativeDetails.astro` |
| Final CTA | **Split action** (texto esq + form dir) | `finalcta/FinalCTASplitAction.astro` |
| Footer | Simple columns | `footer/FooterSimpleColumns.astro` |

---

## Anti-"cara de IA" — regras de ouro

1. **Paleta:** nunca usar `#667EEA`/`#764BA2` (gradiente roxo default) nem qualquer mesh gradient.
2. **Hero:** sem glassmorphism, sem "card flutuante", sem fundo escuro com texto branco bold.
3. **Cards:** nunca 3 cards idênticos com ícone azul + título bold + texto cinza. Variar layout.
4. **CTA:** máximo 1 âmbar/verde por página. "Agendar" como texto — não "Comece agora".
5. **Fontes:** nunca Syne/Outfit/Nunito como display. Usar serifa editorial (Fraunces, DM Serif).
6. **Foto:** preferir foto real do cliente. Placeholder visível = produto inacabado — documentar.
7. **Espaçamento:** seções alternadas com fundo (não todas brancas, mas nunca todas escuras).
8. **Animação:** zero. Sem hover-scale, sem fade-in JS, sem intersection observer.

---

## Registro de blocos v2 (mapa completo)

```
src/components/blocks/
  nav/
    NavStickyMinimal.astro         ← A (ambos os moods)
  hero/
    HeroEditorialSplit.astro       ← A (Calm Trust)
    HeroCenteredStatement.astro    ← B (Fresh Clinical)
    HeroMinimalistText.astro       ← C (qualquer mood, sem foto)
  painpoints/
    PainPointsNumbered.astro       ← A (Calm Trust)
    PainPointsSymptomCards.astro   ← B (Fresh Clinical)
  about/
    AboutPortraitOffset.astro      ← A (Calm Trust)
    AboutSideBySide.astro          ← B (Fresh Clinical)
  services/
    ServicesTypoList.astro         ← A (Calm Trust)
    ServicesGrid.astro             ← B (Fresh Clinical)
  process/
    ProcessHorizontalSteps.astro   ← A (Calm Trust)
    ProcessVerticalTimeline.astro  ← B (Fresh Clinical)
  testimonials/
    TestimonialsPullQuote.astro    ← A (Calm Trust)
    TestimonialsCardGrid.astro     ← B (Fresh Clinical)
  faq/
    FAQNativeDetails.astro         ← A (ambos os moods)
  finalcta/
    FinalCTACenteredEditorial.astro ← A (Calm Trust)
    FinalCTASplitAction.astro       ← B (Fresh Clinical)
  footer/
    FooterSimpleColumns.astro      ← A (ambos os moods)
```
