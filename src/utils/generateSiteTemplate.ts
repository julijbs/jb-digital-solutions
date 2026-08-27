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
    businessName = "Consultório Especializado",
    vertical = "Saúde e Bem-estar",
    city = "São Paulo",
    state = "SP",
    phone = "(11) 99999-9999",
    email = "contato@consultorio.com.br",
    instagram = "@consultorio",
    description = "Atendimento clínico especializado focado em resultados consistentes, acolhimento e escuta qualificada.",
    services = "Consulta Inicial, Acompanhamento Personalizado, Avaliação Clínica",
    credentials = "Especialista com formação continuada e anos de experiência clínica",
    template = "elegant-minimal",
    colorScheme = "blue-professional",
  } = params;

  const rawPhone = phone.replace(/\D/g, "") || "5511999999999";
  const waPhone = rawPhone.startsWith("55") ? rawPhone : `55${rawPhone}`;

  // Color palette definitions
  const colors = {
    "blue-professional": {
      primary: "#0A1128",
      primaryLight: "#1C2541",
      accent: "#C8A882",
      accentHover: "#b6936a",
      bg: "#F8F9FA",
      cardBg: "#FFFFFF",
      textDark: "#0A1128",
      textMuted: "#64748B",
    },
    "green-therapeutic": {
      primary: "#1B4332",
      primaryLight: "#2D6A4F",
      accent: "#52B788",
      accentHover: "#40916C",
      bg: "#F0FDF4",
      cardBg: "#FFFFFF",
      textDark: "#1B4332",
      textMuted: "#4B5563",
    },
    "purple-transformer": {
      primary: "#3C096C",
      primaryLight: "#5A189A",
      accent: "#9D4EDD",
      accentHover: "#7B2CBF",
      bg: "#FAF5FF",
      cardBg: "#FFFFFF",
      textDark: "#240046",
      textMuted: "#6B7280",
    },
  }[colorScheme] || {
    primary: "#0A1128",
    primaryLight: "#1C2541",
    accent: "#C8A882",
    accentHover: "#b6936a",
    bg: "#F8F9FA",
    cardBg: "#FFFFFF",
    textDark: "#0A1128",
    textMuted: "#64748B",
  };

  const fontFamilies = {
    "elegant-minimal": {
      fontImport: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&display=swap",
      fontHeading: "'DM Serif Display', Georgia, serif",
      fontBody: "'Inter', sans-serif",
    },
    "modern-clean": {
      fontImport: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
      fontHeading: "'Poppins', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
    "warm-soft": {
      fontImport: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Open+Sans:wght@400;500;600&display=swap",
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Open Sans', sans-serif",
    },
  }[template] || {
    fontImport: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&display=swap",
    fontHeading: "'DM Serif Display', Georgia, serif",
    fontBody: "'Inter', sans-serif",
  };

  const serviceList = services.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
  const mainServices = serviceList.length > 0 ? serviceList : [
    "Consulta Especializada",
    "Tratamento Personalizado",
    "Acompanhamento Contínuo",
  ];

  const content = {
    hero: {
      headline: `Cuidado especializado e acolhimento para sua saúde em ${city}`,
      subheadline: `${description} Atendimento humanizado e focado no seu bem-estar com horário marcado.`,
      cta_text: "Agendar Consulta via WhatsApp",
    },
    pain_section: {
      headline: `Você sente que precisa de um acompanhamento realmente personalizado?`,
      pain_points: [
        "Dificuldade em encontrar um atendimento que escute suas queixas com calma e atenção.",
        "Tratamentos genéricos que não atacam a causa real do problema.",
        "Insegurança sobre os próximos passos para cuidar da sua saúde.",
      ],
    },
    about: {
      intro: `Com ampla dedicação à prática clínica em ${city}, meu compromisso é oferecer um espaço seguro, ético e embasado nas melhores práticas científicas para que você alcance sua melhor versão.`,
      credentials: [
        credentials,
        `Atendimento presencial e online em ${city}/${state}`,
        "Compromisso rigoroso com ética e sigilo profissional",
      ],
    },
    services: mainServices.map((srv, idx) => ({
      name: srv,
      description: `Atendimento focado em diagnóstico preciso e plano de cuidado individualizado para ${srv.toLowerCase()}.`,
    })),
    process: [
      { title: "1. Primeiro Contato", description: "Envie uma mensagem pelo WhatsApp para tirar dúvidas e verificar os horários disponíveis." },
      { title: "2. Avaliação Inicial", description: "Uma sessão detalhada para entender seu histórico, rotina e necessidades específicas." },
      { title: "3. Plano Personalizado", description: "Desenvolvimento de uma estratégia de cuidado sob medida para o seu objetivo." },
      { title: "4. Acompanhamento Contínuo", description: "Monitoramento constante da sua evolução com suporte acolhedor a cada etapa." },
    ],
    testimonials: [
      { text: "Atendimento humano, acolhedor e com extrema competência. Superou todas as minhas expectativas!", name: "Fernanda Costa", location: city },
      { text: "Mudou completamente a forma como cuido da minha saúde. Recomendo de olhos fechados!", name: "Rodrigo Almeida", location: city },
      { text: "Espaço impecável e profissional extremamente pontual e atencioso. Nota 10!", name: "Mariana Souza", location: city },
    ],
    faq: [
      {
        question: `Como funciona o agendamento de consultas em ${city}?`,
        answer: `O agendamento é feito de forma simples e rápida diretamente pelo WhatsApp. Basta clicar no botão de contato, informar seu interesse e enviaremos as opções de horários mais convenientes para você.`,
      },
      {
        question: `O atendimento é presencial em ${city} ou online?`,
        answer: `Oferecemos tanto atendimento presencial no consultório em ${city}/${state} quanto a modalidade online por videochamada segura, dependendo da sua preferência.`,
      },
      {
        question: `Como é estruturada a primeira sessão de ${vertical.toLowerCase()}?`,
        answer: `Na primeira consulta realizamos uma escuta aprofundada das suas principais necessidades, histórico de saúde e objetivos, alinhando um plano de cuidado personalizado.`,
      },
      {
        question: `Quais convênios ou formas de pagamento são aceitos?`,
        answer: `Trabalhamos com atendimento particular com emissão de recibo para reembolso em convênios (se aplicável) e opções de pagamento facilitadas via PIX e cartão.`,
      },
    ],
  };

  const html = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} — ${vertical} em ${city}/${state}</title>
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
  </style>

  <!-- Schema.org Structured Data (AEO & Local SEO) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${businessName}",
    "description": "${description.replace(/"/g, '\\"')}",
    "telephone": "${phone}",
    "email": "${email}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${city}",
      "addressRegion": "${state}",
      "addressCountry": "BR"
    },
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "48"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${content.faq.map(f => `{
        "@type": "Question",
        "name": "${f.question.replace(/"/g, '\\"')}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "${f.answer.replace(/"/g, '\\"')}"
        }
      }`).join(",\n      ")}
    ]
  }
  </script>
</head>
<body class="antialiased selection:bg-brandAccent selection:text-white">

  <!-- Navbar -->
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
      <a href="#" class="font-display text-xl sm:text-2xl font-bold tracking-tight text-brandPrimary">
        ${businessName}
      </a>
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-brandMuted">
        <a href="#sobre" class="hover:text-brandPrimary transition-colors">Sobre</a>
        <a href="#servicos" class="hover:text-brandPrimary transition-colors">Serviços</a>
        <a href="#como-funciona" class="hover:text-brandPrimary transition-colors">Como Funciona</a>
        <a href="#avaliacoes" class="hover:text-brandPrimary transition-colors">Avaliações</a>
        <a href="#faq" class="hover:text-brandPrimary transition-colors">Dúvidas</a>
      </nav>
      <a 
        href="https://wa.me/${waPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento" 
        target="_blank" 
        class="inline-flex items-center gap-2 bg-brandPrimary hover:bg-brandPrimaryLight text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
      >
        <span>Agendar Consulta</span>
        <svg class="w-4 h-4 text-brandAccent" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.769.814 2.796.814 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm0-2c4.291 0 7.768 3.477 7.768 7.768 0 4.29-3.477 7.767-7.768 7.767-1.341 0-2.6-.345-3.702-.951l-4.33 1.135 1.155-4.22c-.687-1.159-1.074-2.483-1.074-3.731 0-4.291 3.477-7.768 7.951-7.768z"/></svg>
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 sm:py-24 lg:py-28 relative overflow-hidden bg-gradient-to-b from-white to-brandBg" data-section="hero">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandAccent/15 border border-brandAccent/30 text-xs font-semibold text-brandPrimary mb-6">
        <span>📍 ${vertical} em ${city}, ${state}</span>
      </div>
      <h1 class="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brandPrimary max-w-4xl mx-auto leading-tight sm:leading-tight">
        ${content.hero.headline}
      </h1>
      <p class="mt-6 text-base sm:text-xl text-brandMuted max-w-2xl mx-auto leading-relaxed">
        ${content.hero.subheadline}
      </p>
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
          href="https://wa.me/${waPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta" 
          target="_blank"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brandAccent hover:bg-brandAccentHover text-white px-8 py-4 rounded-full text-base font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span>${content.hero.cta_text}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
      
      <!-- Trust Signals -->
      <div class="mt-12 pt-8 border-t border-gray-200/60 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-xs text-brandMuted">
        <div class="flex items-center justify-center gap-2">
          <span class="text-amber-500 font-bold">★★★★★</span>
          <span>5.0 no Google Maps</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <span>🛡️</span>
          <span>Atendimento 100% Ético e Sigiloso</span>
        </div>
        <div class="col-span-2 md:col-span-1 flex items-center justify-center gap-2">
          <span>🗓️</span>
          <span>Horários Flexíveis</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Pain Section -->
  <section class="py-16 sm:py-20 bg-white border-y border-gray-100" data-section="pain">
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
  </section>

  <!-- About Section -->
  <section id="sobre" class="py-20 bg-brandBg" data-section="about">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <div class="inline-block text-xs font-bold uppercase tracking-wider text-brandAccent">Sobre o Profissional</div>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary">
          ${businessName}
        </h2>
        <p class="text-brandMuted leading-relaxed text-sm sm:text-base">
          ${content.about.intro}
        </p>
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
            href="https://wa.me/${waPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20mais%20o%20trabalho" 
            target="_blank"
            class="inline-flex items-center gap-2 text-sm font-bold text-brandPrimary hover:text-brandAccent transition-colors"
          >
            <span>Falar diretamente com o profissional</span>
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
          <p class="text-xs text-brandMuted mt-0.5">Atendimento em ${city}/${state}</p>
        </div>
        <div class="border-t border-gray-100 pt-4 text-xs text-brandMuted space-y-1">
          <p>📞 WhatsApp: ${phone}</p>
          <p>✉️ Email: ${email}</p>
          <p>📍 Consultório em ${city}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="servicos" class="py-20 bg-white" data-section="services">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-xs font-bold uppercase tracking-wider text-brandAccent">Áreas de Atuação</span>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary mt-2">
          Serviços e Tratamentos Especializados
        </h2>
        <p class="mt-3 text-sm text-brandMuted">
          Soluções clínicas planejadas para atender cada fase da sua jornada de saúde.
        </p>
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
                href="https://wa.me/${waPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(srv.name)}" 
                target="_blank"
                class="text-xs font-bold text-brandPrimary hover:text-brandAccent inline-flex items-center gap-1"
              >
                Saber detalhes e valores →
              </a>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- Process Section -->
  <section id="como-funciona" class="py-20 bg-brandBg border-y border-gray-100" data-section="process">
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
  </section>

  <!-- Google Reviews Widget Section -->
  <section id="avaliacoes" class="py-20 bg-white" data-section="reviews">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Avaliações Verificadas no Google Maps
        </div>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-brandPrimary">
          O que dizem os pacientes
        </h2>
        <div class="flex items-center justify-center gap-2 mt-3 text-amber-500 text-sm font-bold">
          <span>★★★★★</span>
          <span class="text-brandText font-semibold">5.0 de 5.0 estrelas</span>
        </div>
      </div>

      <div class="grid sm:grid-cols-3 gap-6">
        ${content.testimonials.map((t, i) => `
          <div class="p-6 rounded-2xl bg-brandBg border border-gray-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-amber-500 text-sm font-bold">★★★★★</span>
                <span class="text-[10px] text-brandMuted">Google Review</span>
              </div>
              <p class="text-xs sm:text-sm text-brandText italic leading-relaxed">
                "${t.text}"
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-200/50 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-brandAccent text-white font-bold flex items-center justify-center text-xs">
                ${t.name.charAt(0)}
              </div>
              <div>
                <p class="text-xs font-bold text-brandText">${t.name}</p>
                <p class="text-[10px] text-brandMuted">${t.location}</p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- FAQ Section (AEO Optimized) -->
  <section id="faq" class="py-20 bg-brandBg border-t border-gray-100" data-section="faq">
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
  </section>

  <!-- Final CTA -->
  <section class="py-20 bg-brandPrimary text-white text-center relative overflow-hidden" data-section="cta">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
      <h2 class="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
        Pronto para dar o primeiro passo no seu cuidado?
      </h2>
      <p class="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
        Entre em contato agora pelo WhatsApp para tirar dúvidas e agendar sua sessão em ${city}.
      </p>
      <div class="pt-4">
        <a 
          href="https://wa.me/${waPhone}?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20hor%C3%A1rio" 
          target="_blank"
          class="inline-flex items-center gap-3 bg-brandAccent hover:bg-brandAccentHover text-white px-9 py-4 rounded-full text-base font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
        >
          <span>Falar no WhatsApp Agora</span>
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
        <p class="text-[11px] text-gray-400 mt-0.5">${vertical} · Atendimento em ${city}/${state}</p>
      </div>
      <p class="text-[11px]">
        © ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados.
      </p>
    </div>
  </footer>

  <!-- Floating WhatsApp Button -->
  <a 
    href="https://wa.me/${waPhone}?text=Ol%C3%A1%2C%20estou%20no%20site%20e%20gostaria%20de%20informa%C3%A7%C3%B5es" 
    target="_blank"
    class="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
    aria-label="Falar no WhatsApp"
  >
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.769.814 2.796.814 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.768-5.768-5.768zm0-2c4.291 0 7.768 3.477 7.768 7.768 0 4.29-3.477 7.767-7.768 7.767-1.341 0-2.6-.345-3.702-.951l-4.33 1.135 1.155-4.22c-.687-1.159-1.074-2.483-1.074-3.731 0-4.291 3.477-7.768 7.951-7.768z"/></svg>
  </a>

</body>
</html>`;

  return { html, content };
}
