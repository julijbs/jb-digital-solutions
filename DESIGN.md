# DESIGN.md — JB Digital Solutions

> Fonte de verdade do design system. Qualquer novo componente de UI deve seguir estes tokens.
> Não usar valores hexadecimais arbitrários — sempre referenciar os tokens abaixo.

---

## Identidade Visual

**Modo:** Dark only  
**Fontes:** `DM Serif Display` (headings h1–h4) · `Inter` (body, UI)  
**Personalidade:** Sofisticado, confiável, executivo. Navy profundo + Gold sólido.

---

## Paleta de Cores

### Cores Base (CSS Variables em `src/index.css`)

| Token CSS | HSL | Hex aproximado | Uso |
|-----------|-----|----------------|-----|
| `--background` | `212 58% 10%` | `#0B1D2E` | Fundo global (navy escuro) |
| `--foreground` | `40 20% 95%` | `#F5F0E8` | Texto principal (cream) |
| `--card` | `212 45% 13%` | `#112236` | Fundo de cards |
| `--card-foreground` | `40 20% 95%` | `#F5F0E8` | Texto em cards |
| `--primary` | `43 53% 54%` | `#C8A44B` | Gold — cor de ação primária |
| `--primary-foreground` | `212 58% 10%` | `#0B1D2E` | Texto sobre botão primário |
| `--secondary` | `212 30% 17%` | `#1A2E40` | Fundo secundário |
| `--muted` | `212 20% 20%` | `#263545` | Fundo muted |
| `--muted-foreground` | `215 16% 62%` | `#8FA3B5` | Texto secundário/placeholder |
| `--accent` | `40 45% 62%` | `#D4B06A` | Gold claro — hover/detalhe |
| `--border` | `212 25% 18%` | `#1E3147` | Bordas |
| `--input` | `212 25% 22%` | `#233B52` | Fundo de inputs |
| `--ring` | `43 53% 54%` | `#C8A44B` | Focus ring |
| `--destructive` | `0 84% 60%` | `#F44` | Vermelho para erros/alertas |
| `--radius` | `0.75rem` | — | Border radius padrão |

### Gradientes e Utilitários (classes Tailwind em `src/index.css`)

| Classe | Uso |
|--------|-----|
| `.gold-gradient-text` | Texto com gradiente gold (use em headlines de destaque) |
| `.gold-gradient-bg` | Fundo com gradiente gold (botões CTA, badges premium) |
| `.glass-card` | Card com glassmorphism navy + borda gold sutil |
| `.glass-card-hover` | Idem com transição hover (borda gold mais forte) |
| `.section-divider` | Linha horizontal gold transparente entre seções |

---

## Tipografia

| Elemento | Fonte | Peso | Tailwind |
|----------|-------|------|---------|
| h1 | DM Serif Display | 400 | `text-4xl md:text-6xl` |
| h2 | DM Serif Display | 400 | `text-3xl md:text-4xl` |
| h3 | DM Serif Display | 400 | `text-2xl` |
| body | Inter | 400 | `text-base` |
| label / caption | Inter | 500–600 | `text-sm font-medium` |
| button | Inter | 600 | `text-sm font-semibold` |

---

## Spacing & Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius` | `0.75rem` | Todos os inputs, cards, badges |
| Seção padding | `py-16 md:py-24` | Entre seções da landing |
| Card padding | `p-6` | Cards internos |
| Container | `max-w-7xl mx-auto px-4 md:px-8` | Layout principal |

---

## Sombras

| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--card-glow` | `0 0 40px hsl(43 53% 54% / 0.05)` | Sombra sutil em cards |
| Glass hover | `0 0 60px hsl(43 53% 54% / 0.07)` | Hover com brilho gold |

---

## Regras de uso

1. **Nunca** usar hex direto no className (ex: `text-[#C8A44B]`) — usar `text-primary` ou `text-gold`.
2. **Nunca** usar `bg-white` ou `bg-black` — usar `bg-background`, `bg-card`, `bg-secondary`.
3. **Nunca** adicionar paleta própria a um componente sem documentar aqui primeiro.
4. Modo dark **único** — não implementar light mode sem decisão explícita.
5. Novos componentes de serviço (SEO Local, ARC Backend) devem usar exatamente esta paleta.

---

## Serviços e acento visual

Todos os 3 serviços compartilham a mesma paleta navy/gold. Diferenciação por ícone e copy, não por cor.

| Serviço | Ícone sugerido | Destaque |
|---------|---------------|---------|
| JB Digital System (Site + GBP) | `Globe` / `MapPin` | gold gradient |
| SEO Local | `Search` / `TrendingUp` | gold gradient |
| ARC™ Backend | `Mail` / `Zap` | gold gradient |
