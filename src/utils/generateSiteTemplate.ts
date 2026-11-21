// src/utils/generateSiteTemplate.ts
// Robust, high-converting one-page site generator with AEO, Schema.org and Tailwind CSS

export interface GenerateSiteParams {
  businessName: string;
  vertical: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  instagram?: string;
  description?: string;
  services?: string;
  credentials?: string;
  differentials?: string;
  template: "elegant-minimal" | "modern-clean" | "warm-soft" | string;
  colorScheme: "blue-professional" | "green-therapeutic" | "purple-transformer" | string;
}

export function generateSiteHtml(params: GenerateSiteParams): { html: string; content: Record<string, unknown> } {
  const {
    businessName = "Negócio local",
    vertical = "Negócio local",
    city = "",
    state = "",
    phone = "",
    email = "",
    description = "",
    services = "",
    credentials = "",
    template = "elegant-minimal",
    colorScheme = "blue-professional",
  } = params;

  const rawPhone = phone.replace(/\D/g, "");
  const waPhone = rawPhone
    ? rawPhone.startsWith("55") ? rawPhone : `55${rawPhone}`
    : "";
  const contactHref = (message: string) => waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
    : email
    ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Contato sobre ${businessName}`)}`
    : "#servicos";

  // Color palette definitions
  const colors = {
    "blue-professional": {
      primary: "#3E5C76",
      primaryLight: "#2F4A60",
      accent: "#8A5A33",
      accentHover: "#714627",
      bg: "#F4F2ED",
      cardBg: "#FFFFFF",
      textDark: "#1E2733",
      textMuted: "#5A6475",
    },
    "green-therapeutic": {
      primary: "#1B4332",
      primaryLight: "#2D6A4F",
      accent: "#2F6F52",
      accentHover: "#24573F",
      bg: "#F0FDF4",
      cardBg: "#FFFFFF",
      textDark: "#1B4332",
      textMuted: "#4B5563",
    },
    "purple-transformer": {
      primary: "#3C096C",
      primaryLight: "#5A189A",
      accent: "#7B2CBF",
      accentHover: "#7B2CBF",
      bg: "#FAF5FF",
      cardBg: "#FFFFFF",
      textDark: "#240046",
      textMuted: "#6B7280",
    },
    "rose-editorial": {
      primary: "#6E3447",
      primaryLight: "#572738",
      accent: "#8A4750",
      accentHover: "#713842",
      bg: "#FBF5F2",
      cardBg: "#FFFFFF",
      textDark: "#2D2023",
      textMuted: "#6D5B5D",
    },
    "terracotta-hospitality": {
      primary: "#7A3F2B",
      primaryLight: "#643321",
      accent: "#843E25",
      accentHover: "#6C321D",
      bg: "#FFF7EE",
      cardBg: "#FFFFFF",
      textDark: "#30231E",
      textMuted: "#6C5B52",
    },
  }[colorScheme] || {
    primary: "#3E5C76",
    primaryLight: "#2F4A60",
    accent: "#8A5A33",
    accentHover: "#714627",
    bg: "#F4F2ED",
    cardBg: "#FFFFFF",
    textDark: "#1E2733",
    textMuted: "#5A6475",
  };

  const templateDesigns: Record<string, {
    fontImport: string;
    fontHeading: string;
    fontBody: string;
    styles: string;
  }> = {
    "elegant-minimal": {
      fontImport: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      fontHeading: "'Fraunces', Georgia, serif",
      fontBody: "'Inter', sans-serif",
      styles: `
        .template-elegant-minimal [data-section="hero"] { background: linear-gradient(180deg, #fff 0%, ${colors.bg} 100%); }
        .template-elegant-minimal .rounded-2xl { border-radius: .65rem; }
        .template-elegant-minimal [data-section="services"] .rounded-2xl { border-color: ${colors.primary}30; box-shadow: none; }
        .template-elegant-minimal [data-section="cta"] { background: ${colors.primary}; }
      `,
    },
    "modern-clean": {
      fontImport: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
      fontHeading: "'Poppins', sans-serif",
      fontBody: "'Inter', sans-serif",
      styles: `
        .template-modern-clean [data-section="hero"] { background: linear-gradient(135deg, #fff 0%, #eef5f8 100%); }
        .template-modern-clean .rounded-2xl { border-radius: .8rem; }
        .template-modern-clean [data-section="services"] .rounded-2xl { box-shadow: 0 8px 24px rgba(30, 55, 75, .06); }
      `,
    },
    "warm-soft": {
      fontImport: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap",
      fontHeading: "'DM Serif Display', Georgia, serif",
      fontBody: "'Inter', sans-serif",
      styles: `
        .template-warm-soft [data-section="hero"] { background: linear-gradient(180deg, #fff 0%, ${colors.bg} 100%); }
        .template-warm-soft .rounded-2xl { border-radius: 1.15rem; }
        .template-warm-soft [data-section="about"] { background: ${colors.bg}; }
        .template-warm-soft [data-section="pain"] { display: none; }
      `,
    },
    "beauty-studio": {
      fontImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap",
      fontHeading: "'Cormorant Garamond', Georgia, serif",
      fontBody: "'DM Sans', sans-serif",
      styles: `
        .template-beauty-studio [data-section="hero"] { background: linear-gradient(135deg, #fff 0%, ${colors.bg} 65%, ${colors.accent}22 100%); }
        .template-beauty-studio [data-section="hero"] h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); }
        .template-beauty-studio .rounded-2xl { border-radius: 1rem; }
        .template-beauty-studio [data-section="services"] .rounded-2xl { border-color: ${colors.accent}40; }
      `,
    },
    "hospitality-warm": {
      fontImport: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap",
      fontHeading: "'Fraunces', Georgia, serif",
      fontBody: "'DM Sans', sans-serif",
      styles: `
        .template-hospitality-warm [data-section="hero"] { background: linear-gradient(135deg, #fff 0%, ${colors.bg} 60%, ${colors.accent}22 100%); }
        .template-hospitality-warm [data-section="services"] { background: ${colors.bg}; }
        .template-hospitality-warm .rounded-2xl { border-radius: .75rem; }
      `,
    },
  };
  const selectedTemplate = templateDesigns[template] ? template : "elegant-minimal";
  const fontFamilies = templateDesigns[selectedTemplate];

  const serviceList = services.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
  const mainServices = serviceList;

  const content = {
    hero: {
      headline: vertical && city ? `${vertical} em ${city}` : `Conheça ${businessName}`,
      subheadline: description || "Confira as informações e serviços disponíveis.",
      cta_text: waPhone ? "Falar no WhatsApp" : email ? "Enviar e-mail" : "Ver serviços",
    },
    pain_section: {
      headline: "",
      pain_points: [],
    },
    about: {
      intro: description,
      credentials: credentials ? [credentials] : [],
    },
    services: mainServices.map((srv) => ({
      name: srv,
      description: `Entre em contato para saber mais sobre ${srv}.`,
    })),
    process: [],
    faq: [],
  };
  const businessSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    ...(description ? { description } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(city || state
      ? {
        address: {
          "@type": "PostalAddress",
          ...(city ? { addressLocality: city } : {}),
          ...(state ? { addressRegion: state } : {}),
          addressCountry: "BR",
        },
      }
      : {}),
  }).replace(/</g, "\\u003c");
  const pageTitle = [businessName, vertical, city, state].filter(Boolean).join(" | ");
  const locationLabel = [city, state].filter(Boolean).join("/");
  const businessTypeLabel = [vertical, locationLabel].filter(Boolean).join(" · ");

  const html = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${content.hero.subheadline.slice(0, 155)}">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontFamilies.fontImport}" rel="stylesheet">
  
  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandPrimary: '${colors.primary}',
            brandPrimaryLight: '${colors.primaryLight}',
            brandAccent: '${colors.accent}',
            brandAccentHover: '${colors.accentHover}',
            brandBg: '${colors.bg}',
            brandText: '${colors.textDark}',
            brandMuted: '${colors.textMuted}',
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: ${fontFamilies.fontBody};
      background-color: ${colors.bg};
      color: ${colors.textDark};
    }
    .font-display {
      font-family: ${fontFamilies.fontHeading};
    }
    details summary::-webkit-details-marker { display: none; }
    details[open] summary svg { transform: rotate(180deg); }
    ${fontFamilies.styles}
  </style>

  <!-- Schema.org Structured Data (AEO & Local SEO) -->
  <script type="application/ld+json">${businessSchema}</script>
</head>
<body class="antialiased selection:bg-brandAccent selection:text-white template-${selectedTemplate}">

  <!-- Navbar -->
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      <a href="#" class="font-display text-xl sm:text-2xl font-bold tracking-tight text-brandPrimary">
        ${businessName}
      </a>
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-brandMuted">
        <a href="#sobre" class="hover:text-brandPrimary transition-colors">Sobre</a>
        ${content.services.length ? '<a href="#servicos" class="hover:text-brandPrimary transition-colors">Serviços</a>' : ""}
      </nav>
      <a
        href="${contactHref(`Olá, gostaria de informações sobre ${businessName}`)}"
        target="_blank" 
        class="inline-flex items-center gap-2 bg-brandPrimary hover:bg-brandPrimaryLight text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
      >
        <span>${waPhone ? "Falar no WhatsApp" : email ? "Enviar e-mail" : "Ver serviços"}</span>
        <svg class="w-4 h-4 text-brandAccent" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.769.814 2.796.814 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm0-2c4.291 0 7.768 3.477 7.768 7.768 0 4.29-3.477 7.767-7.768 7.767-1.341 0-2.6-.345-3.702-.951l-4.33 1.135 1.155-4.22c-.687-1.159-1.074-2.483-1.074-3.731 0-4.291 3.477-7.768 7.951-7.768z"/></svg>
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 sm:py-24 lg:py-28 relative overflow-hidden bg-gradient-to-b from-white to-brandBg" data-section="hero">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
      ${businessTypeLabel ? `<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandAccent/15 border border-brandAccent/30 text-xs font-semibold text-brandPrimary mb-6">
        <span>${businessTypeLabel}</span>
      </div>` : ""}
      <h1 class="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brandPrimary max-w-4xl mx-auto leading-tight sm:leading-tight">
        ${content.hero.headline}
      </h1>
      <p class="mt-6 text-base sm:text-xl text-brandMuted max-w-2xl mx-auto leading-relaxed">
        ${content.hero.subheadline}
      </p>
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="${contactHref(`Olá, gostaria de informações sobre ${businessName}`)}"
          target="_blank"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brandPrimary hover:bg-brandPrimaryLight text-white px-8 py-4 rounded-full text-base font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span>${content.hero.cta_text}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </div>
  </section>

  ${content.pain_section.pain_points.length ? `<section class="py-16 sm:py-20 bg-white border-y border-gray-100" data-section="pain">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="font-display text-2xl sm:text-4xl font-bold text-brandPrimary">
          ${content.pain_section.headline}
        </h2>
      </div>
      <div class="grid sm:grid-cols-3 gap-6">
        ${content.pain_section.pain_points.map((point, i) => `
          <div class="p-6 rounded-2xl bg-brandBg border border-gray-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm mb-4">
                ${i + 1}
              </div>
              <p class="text-sm sm:text-base text-brandText leading-relaxed">
                ${point}
              </p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- About Section -->
  ${description || credentials || phone || email || locationLabel ? `<section id="sobre" class="py-20 bg-brandBg" data-section="about">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <div class="inline-block text-xs font-bold uppercase tracking-wider text-brandAccent">Sobre o negócio</div>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary">
          ${businessName}
        </h2>
        ${content.about.intro ? `<p class="text-brandMuted leading-relaxed text-sm sm:text-base">${content.about.intro}</p>` : ""}
        <ul class="space-y-3 pt-2">
          ${content.about.credentials.map(cred => `
            <li class="flex items-start gap-3 text-sm text-brandText">
              <span class="text-emerald-600 font-bold mt-0.5">✓</span>
              <span>${cred}</span>
            </li>
          `).join("")}
        </ul>
        <div class="pt-4">
          <a
            href="${contactHref(`Olá, gostaria de conhecer mais sobre ${businessName}`)}"
            target="_blank"
            class="inline-flex items-center gap-2 text-sm font-bold text-brandPrimary hover:text-brandAccent transition-colors"
          >
            <span>Solicitar informações</span>
            <span>→</span>
          </a>
        </div>
      </div>
      <div class="rounded-3xl p-8 bg-white border border-gray-200/80 shadow-xl space-y-6 text-center">
        <div class="w-24 h-24 mx-auto rounded-full bg-brandAccent/20 flex items-center justify-center text-3xl font-display text-brandPrimary font-bold">
          ${businessName.charAt(0)}
        </div>
        <div>
          <h3 class="font-display text-xl font-bold text-brandPrimary">${businessName}</h3>
          <p class="text-xs text-brandAccent font-semibold mt-1">${vertical}</p>
          ${locationLabel ? `<p class="text-xs text-brandMuted mt-0.5">Atendimento em ${locationLabel}</p>` : ""}
        </div>
        <div class="border-t border-gray-100 pt-4 text-xs text-brandMuted space-y-1">
          ${phone ? `<p>WhatsApp: ${phone}</p>` : ""}
          ${email ? `<p>Email: ${email}</p>` : ""}
          ${city ? `<p>Atendimento em ${city}</p>` : ""}
        </div>
      </div>
    </div>
  </section>` : ""}

  <!-- Services Section -->
  ${content.services.length ? `<section id="servicos" class="py-20 bg-white" data-section="services">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-xs font-bold uppercase tracking-wider text-brandAccent">Áreas de Atuação</span>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary mt-2">
          Serviços de ${businessName}
        </h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${content.services.map(srv => `
          <div class="p-8 rounded-2xl bg-brandBg border border-gray-200/60 hover:border-brandAccent transition-all shadow-sm hover:shadow-md group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brandAccent mb-5 shadow-sm group-hover:bg-brandAccent group-hover:text-white transition-all">
                ✦
              </div>
              <h3 class="font-display text-lg font-bold text-brandPrimary group-hover:text-brandAccent transition-colors">
                ${srv.name}
              </h3>
              <p class="mt-2.5 text-xs sm:text-sm text-brandMuted leading-relaxed">
                ${srv.description}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-200/40">
              <a
                href="${contactHref(`Olá, gostaria de saber mais sobre ${srv.name}`)}"
                target="_blank"
                class="text-xs font-bold text-brandPrimary hover:text-brandAccent inline-flex items-center gap-1"
              >
                Solicitar informações →
              </a>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- Process Section -->
  ${content.process.length ? `<section id="como-funciona" class="py-20 bg-brandBg border-y border-gray-100" data-section="process">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-xs font-bold uppercase tracking-wider text-brandAccent">Passo a Passo</span>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary mt-2">
          Como funciona o atendimento?
        </h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${content.process.map((step, idx) => `
          <div class="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm relative">
            <span class="text-3xl font-display font-bold text-brandAccent/30 absolute top-4 right-4">
              0${idx + 1}
            </span>
            <h3 class="font-display text-base font-bold text-brandPrimary pr-8 mb-2">
              ${step.title}
            </h3>
            <p class="text-xs text-brandMuted leading-relaxed">
              ${step.description}
            </p>
          </div>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- FAQ Section (AEO Optimized) -->
  ${content.faq.length ? `<section id="faq" class="py-20 bg-brandBg border-t border-gray-100" data-section="faq">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-wider text-brandAccent">Perguntas Frequentes</span>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary mt-2">
          Dúvidas Comuns
        </h2>
        <p class="mt-2 text-sm text-brandMuted">
          Respostas diretas sobre o funcionamento das consultas e atendimento.
        </p>
      </div>

      <div class="space-y-4">
        ${content.faq.map(f => `
          <details class="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm transition-all">
            <summary class="flex items-center justify-between font-semibold text-sm sm:text-base text-brandPrimary cursor-pointer list-none gap-4">
              <span>${f.question}</span>
              <span class="text-brandAccent group-open:rotate-180 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </span>
            </summary>
            <p class="mt-3.5 text-xs sm:text-sm text-brandMuted leading-relaxed border-t border-gray-100 pt-3">
              ${f.answer}
            </p>
          </details>
        `).join("")}
      </div>
    </div>
  </section>` : ""}

  <!-- Final CTA -->
  <section class="py-20 bg-brandPrimary text-white text-center relative overflow-hidden" data-section="cta">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
      <h2 class="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
        Entre em contato com ${businessName}
      </h2>
      <p class="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
        ${waPhone || email ? "Use um dos canais de contato para solicitar mais informações." : "Confira os serviços apresentados nesta página."}
      </p>
      <div class="pt-4">
        <a
          href="${contactHref(`Olá, gostaria de informações sobre ${businessName}`)}"
          target="_blank"
          class="inline-flex items-center gap-3 bg-white hover:bg-brandBg text-brandPrimary px-9 py-4 rounded-full text-base font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
        >
          <span>${waPhone ? "Falar no WhatsApp" : email ? "Enviar e-mail" : "Ver serviços"}</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.769.814 2.796.814 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm0-2c4.291 0 7.768 3.477 7.768 7.768 0 4.29-3.477 7.767-7.768 7.767-1.341 0-2.6-.345-3.702-.951l-4.33 1.135 1.155-4.22c-.687-1.159-1.074-2.483-1.074-3.731 0-4.291 3.477-7.768 7.951-7.768z"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-10 bg-gray-950 text-gray-400 text-xs border-t border-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div>
        <p class="font-bold text-white font-display text-sm">${businessName}</p>
        <p class="text-[11px] text-gray-400 mt-0.5">${businessTypeLabel}</p>
      </div>
      <p class="text-[11px]">
        © ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados.
      </p>
    </div>
  </footer>

  ${waPhone ? `<a
    href="${contactHref(`Olá, estou no site de ${businessName} e gostaria de informações`)}"
    target="_blank"
    class="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
    aria-label="Falar no WhatsApp"
  >
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.769.814 2.796.814 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm0-2c4.291 0 7.768 3.477 7.768 7.768 0 4.29-3.477 7.767-7.768 7.767-1.341 0-2.6-.345-3.702-.951l-4.33 1.135 1.155-4.22c-.687-1.159-1.074-2.483-1.074-3.731 0-4.291 3.477-7.768 7.951-7.768z"/></svg>
  </a>` : ""}

</body>
</html>`;

  return { html, content };
}
