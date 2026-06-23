const buildStructuredData = () => `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "{{SCHEMA_TYPE}}",
        "name": "{{BUSINESS_NAME}}",
        "description": "{{META_DESCRIPTION}}",
        "url": "https://{{SITE_URL}}",
        "telephone": "{{PHONE}}",
        "email": "{{EMAIL}}",
        "areaServed": "{{CITY}}, {{STATE}}",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "{{CITY}}",
          "addressRegion": "{{STATE}}",
          "addressCountry": "BR"
        },
        "sameAs": ["https://instagram.com/{{INSTAGRAM}}"]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "{{FAQ_QUESTION_1}}",
            "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_ANSWER_1}}" }
          },
          {
            "@type": "Question",
            "name": "{{FAQ_QUESTION_2}}",
            "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_ANSWER_2}}" }
          },
          {
            "@type": "Question",
            "name": "{{FAQ_QUESTION_3}}",
            "acceptedAnswer": { "@type": "Answer", "text": "{{FAQ_ANSWER_3}}" }
          }
        ]
      }
    ]
  }
  <\/script>`;

const buildHead = ({ title, description, fonts, styles }: { title: string; description: string; fonts: string; styles: string }) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://{{SITE_URL}}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://{{SITE_URL}}">
  <meta name="twitter:card" content="summary_large_image">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fonts}" rel="stylesheet">
  ${buildStructuredData()}
  <style>
    * { box-sizing: border-box; scroll-behavior: smooth; }
    body { margin: 0; }
    a { text-decoration: none; }
    .text-balance { text-wrap: balance; }
    .shadow-soft { box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); }
    .shadow-panel { box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12); }
    .noise::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
      background-size: 18px 18px;
      opacity: .35;
      pointer-events: none;
    }
    .section-shell { position: relative; overflow: hidden; }
    ${styles}
  </style>
</head>`;

// Static builder — NO Tailwind CDN (for B2 templates targeting Lighthouse ≥ 90)
const buildHeadStatic = ({ title, description, fonts, styles }: { title: string; description: string; fonts: string; styles: string }) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://{{SITE_URL}}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://{{SITE_URL}}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fonts}" rel="stylesheet">
  ${buildStructuredData()}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; line-height: 1.6; }
    a { text-decoration: none; color: inherit; }
    img { max-width: 100%; height: auto; display: block; }
    ${styles}
  </style>
</head>`;

export const elegantMinimalTemplate = `${buildHead({
  title: "{{BUSINESS_NAME}} | {{SPECIALTY}} em {{CITY}}",
  description: "{{META_DESCRIPTION}}",
  fonts: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap",
  styles: `
    body { font-family: 'Manrope', sans-serif; background: #f6f2ea; color: #111827; }
    .font-display { font-family: 'DM Serif Display', serif; }
  `,
})}
<body>
  <nav class="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#f6f2ea]/85 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <a href="#hero" class="font-display text-2xl tracking-wide text-[#16233b]">{{BUSINESS_NAME}}</a>
      <div class="hidden items-center gap-8 text-sm text-slate-700 md:flex">
        <a href="#sobre">Sobre</a>
        <a href="#servicos">Serviços</a>
        <a href="#processo">Como funciona</a>
        <a href="#faq">FAQ</a>
      </div>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="rounded-full bg-[#16233b] px-5 py-3 text-sm font-semibold text-white">Agendar conversa</a>
    </div>
  </nav>

  <main>
    <section id="hero" data-section="hero" class="section-shell px-6 pb-20 pt-32">
      <div class="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c8a882]/40 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#16233b] shadow-soft">{{SPECIALTY}} em {{CITY}}, {{STATE}}</div>
          <h1 class="font-display text-balance text-5xl leading-none text-[#16233b] md:text-7xl">{{HERO_HEADLINE}}</h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{{HERO_SUBHEADLINE}}</p>
          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="{{WHATSAPP_LINK}}" target="_blank" class="rounded-full bg-[#16233b] px-8 py-4 text-center text-base font-semibold text-white shadow-panel">{{CTA_BUTTON_TEXT}}</a>
            <a href="#sobre" class="rounded-full border border-[#16233b]/15 bg-white px-8 py-4 text-center text-base font-semibold text-[#16233b]">Entender como funciona</a>
          </div>
          <div class="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
            <span>Atendimento online</span>
            <span>Resposta em até 24h úteis</span>
            <span>Segunda a sexta</span>
          </div>
        </div>
        <div class="section-shell noise rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,#16233b_0%,#243b63_60%,#c8a882_160%)] p-8 text-white shadow-panel">
          <div class="relative z-10">
            <p class="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Cuidado com direção</p>
            <h2 class="mt-4 font-display text-3xl leading-tight md:text-4xl">Quando as emoções pesam, clareza faz diferença.</h2>
            <p class="mt-4 text-base leading-7 text-white/80">Um espaço de escuta qualificada, método e presença para acolher o sofrimento e transformar confusão em caminho possível.</p>
            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p class="text-xs uppercase tracking-[0.2em] text-white/60">Contato</p>
                <p class="mt-2 text-lg font-semibold">{{PHONE}}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p class="text-xs uppercase tracking-[0.2em] text-white/60">Instagram</p>
                <p class="mt-2 text-lg font-semibold">@{{INSTAGRAM}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section data-section="pain" class="px-6 py-20">
      <div class="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-soft md:p-12">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#c8a882]">Reconhecimento</p>
          <h2 class="mt-3 font-display text-4xl text-[#16233b] md:text-5xl">Quando emoções viram peso, a vida fica menor.</h2>
          <p class="mt-5 text-lg leading-8 text-slate-600">Você não precisa sustentar tudo sozinho. O objetivo não é endurecer emoções, mas compreendê-las com mais consciência, estabilidade e autonomia.</p>
        </div>
        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <article class="rounded-[1.5rem] border border-slate-200 bg-[#f8f5ef] p-6"><div class="mb-4 h-1.5 w-12 rounded-full bg-[#c8a882]"></div><p class="text-lg leading-8 text-slate-700">{{PAIN_POINT_1}}</p></article>
          <article class="rounded-[1.5rem] border border-slate-200 bg-[#f8f5ef] p-6"><div class="mb-4 h-1.5 w-12 rounded-full bg-[#c8a882]"></div><p class="text-lg leading-8 text-slate-700">{{PAIN_POINT_2}}</p></article>
          <article class="rounded-[1.5rem] border border-slate-200 bg-[#f8f5ef] p-6"><div class="mb-4 h-1.5 w-12 rounded-full bg-[#c8a882]"></div><p class="text-lg leading-8 text-slate-700">{{PAIN_POINT_3}}</p></article>
        </div>
      </div>
    </section>

    <section id="sobre" data-section="about" class="px-6 py-20">
      <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_.8fr]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#c8a882]">Sobre</p>
          <h2 class="mt-3 font-display text-4xl text-[#16233b] md:text-5xl">{{ABOUT_HEADLINE}}</h2>
          <p class="mt-6 text-lg leading-9 text-slate-600">{{ABOUT_TEXT}}</p>
        </div>
        <aside class="rounded-[2rem] border border-[#16233b]/10 bg-[#16233b] p-8 text-white shadow-panel">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Atendimento</p>
          <div class="mt-5 space-y-5 text-base leading-7 text-white/85">
            <p>Base técnica e olhar humano para acolher, organizar e avançar com clareza.</p>
            <p>Atendimento online com estrutura, escuta qualificada e condução respeitosa do seu ritmo.</p>
            <p class="border-t border-white/10 pt-5 text-sm text-white/65">{{EMAIL}}</p>
          </div>
        </aside>
      </div>
    </section>

    <section id="servicos" data-section="services" class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#c8a882]">Serviços</p>
            <h2 class="mt-3 font-display text-4xl text-[#16233b] md:text-5xl">{{SERVICES_HEADLINE}}</h2>
          </div>
        </div>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <article class="rounded-[2rem] bg-white p-8 shadow-soft"><p class="text-sm uppercase tracking-[0.2em] text-[#c8a882]">01</p><h3 class="mt-4 font-display text-3xl text-[#16233b]">{{SERVICE_1_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_1_DESC}}</p></article>
          <article class="rounded-[2rem] bg-[#16233b] p-8 text-white shadow-panel"><p class="text-sm uppercase tracking-[0.2em] text-[#c8a882]">02</p><h3 class="mt-4 font-display text-3xl">{{SERVICE_2_NAME}}</h3><p class="mt-4 text-base leading-8 text-white/75">{{SERVICE_2_DESC}}</p></article>
          <article class="rounded-[2rem] bg-white p-8 shadow-soft"><p class="text-sm uppercase tracking-[0.2em] text-[#c8a882]">03</p><h3 class="mt-4 font-display text-3xl text-[#16233b]">{{SERVICE_3_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_3_DESC}}</p></article>
        </div>
      </div>
    </section>

    <section id="processo" data-section="process" class="px-6 py-20">
      <div class="mx-auto max-w-6xl rounded-[2rem] bg-[linear-gradient(135deg,#fff_0%,#f3ede3_100%)] p-8 shadow-soft md:p-12">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#c8a882]">Processo</p>
          <h2 class="mt-3 font-display text-4xl text-[#16233b] md:text-5xl">{{PROCESS_HEADLINE}}</h2>
        </div>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6"><div class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#16233b] text-lg font-bold text-white">1</div><p class="text-lg leading-8 text-slate-700">{{PROCESS_STEP_1}}</p></div>
          <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6"><div class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#16233b] text-lg font-bold text-white">2</div><p class="text-lg leading-8 text-slate-700">{{PROCESS_STEP_2}}</p></div>
          <div class="rounded-[1.5rem] border border-slate-200 bg-white p-6"><div class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#16233b] text-lg font-bold text-white">3</div><p class="text-lg leading-8 text-slate-700">{{PROCESS_STEP_3}}</p></div>
        </div>
      </div>
    </section>

    <section data-section="testimonials" class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="font-display text-center text-4xl text-[#16233b] md:text-5xl">O que dizem sobre o atendimento</h2>
        <div class="mt-10 grid gap-6 md:grid-cols-2">
          <article class="rounded-[2rem] bg-white p-8 shadow-soft"><p class="text-5xl leading-none text-[#c8a882]">“</p><p class="mt-4 text-lg leading-8 text-slate-700">{{TESTIMONIAL_1}}</p><p class="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Paciente</p></article>
          <article class="rounded-[2rem] bg-[#f8f5ef] p-8 shadow-soft"><p class="text-5xl leading-none text-[#c8a882]">“</p><p class="mt-4 text-lg leading-8 text-slate-700">{{TESTIMONIAL_2}}</p><p class="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Paciente</p></article>
        </div>
      </div>
    </section>

    <section id="faq" data-section="faq" class="px-6 py-20">
      <div class="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-soft md:p-12">
        <h2 class="font-display text-center text-4xl text-[#16233b] md:text-5xl">Perguntas frequentes</h2>
        <div class="mt-10 space-y-4">
          <details class="group rounded-[1.25rem] border border-slate-200 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[#16233b]">{{FAQ_QUESTION_1}}<span class="text-[#c8a882] transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-slate-600">{{FAQ_ANSWER_1}}</p></details>
          <details class="group rounded-[1.25rem] border border-slate-200 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[#16233b]">{{FAQ_QUESTION_2}}<span class="text-[#c8a882] transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-slate-600">{{FAQ_ANSWER_2}}</p></details>
          <details class="group rounded-[1.25rem] border border-slate-200 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[#16233b]">{{FAQ_QUESTION_3}}<span class="text-[#c8a882] transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-slate-600">{{FAQ_ANSWER_3}}</p></details>
        </div>
      </div>
    </section>

    <section id="contato" data-section="cta" class="px-6 pb-20 pt-10">
      <div class="mx-auto max-w-5xl rounded-[2.5rem] bg-[#16233b] px-8 py-14 text-center text-white shadow-panel md:px-12">
        <h2 class="font-display text-balance text-4xl md:text-6xl">{{CTA_HEADLINE}}</h2>
        <a href="{{WHATSAPP_LINK}}" target="_blank" class="mt-8 inline-flex rounded-full bg-[#c8a882] px-8 py-4 text-lg font-semibold text-[#16233b]">{{CTA_BUTTON_TEXT}}</a>
      </div>
    </section>
  </main>

  <footer data-section="footer" class="bg-[#0f172a] px-6 py-12 text-slate-400">
    <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
      <div><p class="font-display text-2xl text-white">{{BUSINESS_NAME}}</p><p class="mt-3 text-sm leading-7">{{SPECIALTY}} em {{CITY}}, {{STATE}}</p></div>
      <div><p class="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Contato</p><p class="mt-3 text-sm">{{PHONE}}</p><p class="mt-2 text-sm">{{EMAIL}}</p></div>
      <div><p class="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Redes</p><a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" class="mt-3 inline-block text-sm">Instagram</a></div>
    </div>
    <div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-xs">© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</div>
  </footer>

  <a href="{{WHATSAPP_LINK}}" target="_blank" class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-panel">
    <svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
  </a>
</body>
</html>`;

export const modernCleanTemplate = `${buildHead({
  title: "{{BUSINESS_NAME}} | {{SPECIALTY}} em {{CITY}}",
  description: "{{META_DESCRIPTION}}",
  fonts: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Instrument+Sans:wght@400;500;600;700&display=swap",
  styles: `
    body { font-family: 'Instrument Sans', sans-serif; background: #f4f7f4; color: #111827; }
    .font-display { font-family: 'Sora', sans-serif; }
  `,
})}
<body>
  <nav class="fixed inset-x-0 top-0 z-50 border-b border-emerald-950/5 bg-white/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <a href="#hero" class="font-display text-xl font-bold text-[#163a2d]">{{BUSINESS_NAME}}</a>
      <div class="hidden gap-8 text-sm text-slate-700 md:flex"><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a><a href="#faq">FAQ</a></div>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="rounded-2xl bg-[#2d6a4f] px-5 py-3 text-sm font-semibold text-white">Agendar</a>
    </div>
  </nav>
  <main>
    <section id="hero" data-section="hero" class="section-shell overflow-hidden px-6 pb-20 pt-32">
      <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div class="rounded-[2.25rem] bg-[linear-gradient(135deg,#dcfce7_0%,#f4f7f4_55%,#ffffff_100%)] p-8 shadow-soft md:p-12">
          <div class="inline-flex rounded-full border border-[#2d6a4f]/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2d6a4f]">Atendimento com clareza e método</div>
          <h1 class="font-display text-balance mt-6 text-5xl font-extrabold leading-[0.95] text-[#163a2d] md:text-7xl">{{HERO_HEADLINE}}</h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{{HERO_SUBHEADLINE}}</p>
          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="{{WHATSAPP_LINK}}" target="_blank" class="rounded-2xl bg-[#2d6a4f] px-8 py-4 text-center text-base font-semibold text-white">{{CTA_BUTTON_TEXT}}</a>
            <a href="#processo" class="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-center text-base font-semibold text-slate-700">Ver processo</a>
          </div>
        </div>
        <div class="rounded-[2.25rem] bg-[#163a2d] p-8 text-white shadow-panel md:p-12">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Visão geral</p>
          <div class="mt-6 grid gap-4">
            <div class="rounded-[1.5rem] bg-white/10 p-5"><p class="text-sm text-white/60">Local</p><p class="mt-2 font-display text-2xl">{{CITY}}, {{STATE}}</p></div>
            <div class="rounded-[1.5rem] bg-white/10 p-5"><p class="text-sm text-white/60">Especialidade</p><p class="mt-2 text-lg font-semibold">{{SPECIALTY}}</p></div>
            <div class="rounded-[1.5rem] bg-white/10 p-5"><p class="text-sm text-white/60">Contato</p><p class="mt-2 text-lg font-semibold">{{PHONE}}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section data-section="pain" class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="max-w-3xl"><p class="text-sm font-bold uppercase tracking-[0.18em] text-[#2d6a4f]">Dores</p><h2 class="font-display mt-3 text-4xl font-bold text-[#163a2d] md:text-5xl">Você se reconhece em algum desses sinais?</h2></div>
        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <article class="rounded-[1.75rem] bg-white p-7 shadow-soft"><p class="text-base leading-8 text-slate-700">{{PAIN_POINT_1}}</p></article>
          <article class="rounded-[1.75rem] bg-[#e8f5eb] p-7 shadow-soft"><p class="text-base leading-8 text-slate-700">{{PAIN_POINT_2}}</p></article>
          <article class="rounded-[1.75rem] bg-white p-7 shadow-soft"><p class="text-base leading-8 text-slate-700">{{PAIN_POINT_3}}</p></article>
        </div>
      </div>
    </section>

    <section id="sobre" data-section="about" class="px-6 py-20">
      <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div class="rounded-[2rem] bg-[#2d6a4f] p-8 text-white shadow-panel"><p class="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200/70">Abordagem</p><h2 class="font-display mt-4 text-4xl font-bold">{{ABOUT_HEADLINE}}</h2></div>
        <div class="rounded-[2rem] bg-white p-8 shadow-soft"><p class="text-lg leading-9 text-slate-600">{{ABOUT_TEXT}}</p></div>
      </div>
    </section>

    <section id="servicos" data-section="services" class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="font-display text-4xl font-bold text-[#163a2d] md:text-5xl">{{SERVICES_HEADLINE}}</h2>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <article class="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-soft"><h3 class="font-display text-2xl font-bold text-[#163a2d]">{{SERVICE_1_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_1_DESC}}</p></article>
          <article class="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-soft"><h3 class="font-display text-2xl font-bold text-[#163a2d]">{{SERVICE_2_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_2_DESC}}</p></article>
          <article class="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-soft"><h3 class="font-display text-2xl font-bold text-[#163a2d]">{{SERVICE_3_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_3_DESC}}</p></article>
        </div>
      </div>
    </section>

    <section id="processo" data-section="process" class="px-6 py-20">
      <div class="mx-auto max-w-6xl rounded-[2rem] bg-white p-8 shadow-soft md:p-12">
        <h2 class="font-display text-4xl font-bold text-[#163a2d] md:text-5xl">{{PROCESS_HEADLINE}}</h2>
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <div class="rounded-[1.5rem] bg-[#e8f5eb] p-6"><div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d6a4f] font-bold text-white">1</div><p class="text-base leading-8 text-slate-700">{{PROCESS_STEP_1}}</p></div>
          <div class="rounded-[1.5rem] bg-[#f4f7f4] p-6"><div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d6a4f] font-bold text-white">2</div><p class="text-base leading-8 text-slate-700">{{PROCESS_STEP_2}}</p></div>
          <div class="rounded-[1.5rem] bg-[#e8f5eb] p-6"><div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d6a4f] font-bold text-white">3</div><p class="text-base leading-8 text-slate-700">{{PROCESS_STEP_3}}</p></div>
        </div>
      </div>
    </section>

    <section data-section="testimonials" class="px-6 py-20"><div class="mx-auto max-w-6xl"><h2 class="font-display text-center text-4xl font-bold text-[#163a2d] md:text-5xl">Relatos de quem já passou por aqui</h2><div class="mt-10 grid gap-6 md:grid-cols-2"><article class="rounded-[2rem] bg-white p-8 shadow-soft"><p class="text-lg leading-8 text-slate-700">{{TESTIMONIAL_1}}</p></article><article class="rounded-[2rem] bg-[#e8f5eb] p-8 shadow-soft"><p class="text-lg leading-8 text-slate-700">{{TESTIMONIAL_2}}</p></article></div></div></section>

    <section id="faq" data-section="faq" class="px-6 py-20"><div class="mx-auto max-w-4xl rounded-[2rem] bg-[#163a2d] p-8 text-white shadow-panel md:p-12"><h2 class="font-display text-center text-4xl font-bold md:text-5xl">Perguntas frequentes</h2><div class="mt-10 space-y-4"><details class="group rounded-[1.25rem] bg-white/10 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold">{{FAQ_QUESTION_1}}<span class="transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-white/75">{{FAQ_ANSWER_1}}</p></details><details class="group rounded-[1.25rem] bg-white/10 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold">{{FAQ_QUESTION_2}}<span class="transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-white/75">{{FAQ_ANSWER_2}}</p></details><details class="group rounded-[1.25rem] bg-white/10 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold">{{FAQ_QUESTION_3}}<span class="transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-white/75">{{FAQ_ANSWER_3}}</p></details></div></div></section>

    <section id="contato" data-section="cta" class="px-6 pb-20 pt-10"><div class="mx-auto max-w-5xl rounded-[2.25rem] bg-[linear-gradient(135deg,#2d6a4f_0%,#163a2d_100%)] px-8 py-14 text-center text-white shadow-panel"><h2 class="font-display text-balance text-4xl font-bold md:text-6xl">{{CTA_HEADLINE}}</h2><a href="{{WHATSAPP_LINK}}" target="_blank" class="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#163a2d]">{{CTA_BUTTON_TEXT}}</a></div></section>
  </main>
  <footer data-section="footer" class="bg-[#0f172a] px-6 py-12 text-slate-400"><div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-3"><div><p class="font-display text-xl font-bold text-white">{{BUSINESS_NAME}}</p><p class="mt-3 text-sm">{{SPECIALTY}} em {{CITY}}, {{STATE}}</p></div><div><p class="text-sm font-bold uppercase tracking-[0.18em] text-white/70">Contato</p><p class="mt-3 text-sm">{{PHONE}}</p><p class="mt-2 text-sm">{{EMAIL}}</p></div><div><p class="text-sm font-bold uppercase tracking-[0.18em] text-white/70">Instagram</p><a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" class="mt-3 inline-block text-sm">@{{INSTAGRAM}}</a></div></div><div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-xs">© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</div></footer>
  <a href="{{WHATSAPP_LINK}}" target="_blank" class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-panel"><svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg></a>
</body>
</html>`;

export const warmWelcomingTemplate = `${buildHead({
  title: "{{BUSINESS_NAME}} | {{SPECIALTY}} em {{CITY}}",
  description: "{{META_DESCRIPTION}}",
  fonts: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
  styles: `
    body { font-family: 'Manrope', sans-serif; background: #fcf7fb; color: #1f2937; }
    .font-display { font-family: 'Playfair Display', serif; }
  `,
})}
<body>
  <nav class="fixed inset-x-0 top-0 z-50 border-b border-violet-950/5 bg-white/88 backdrop-blur-xl"><div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><a href="#hero" class="font-display text-2xl text-[#5b21b6]">{{BUSINESS_NAME}}</a><div class="hidden gap-8 text-sm text-slate-700 md:flex"><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a><a href="#faq">FAQ</a></div><a href="{{WHATSAPP_LINK}}" target="_blank" class="rounded-full bg-[#5b21b6] px-5 py-3 text-sm font-semibold text-white">Agendar</a></div></nav>
  <main>
    <section id="hero" data-section="hero" class="section-shell px-6 pb-20 pt-32"><div class="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_.9fr]"><div><div class="inline-flex rounded-full border border-[#7c3aed]/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">Acolhimento com direção prática</div><h1 class="font-display text-balance mt-6 text-5xl leading-[0.95] text-[#5b21b6] md:text-7xl">{{HERO_HEADLINE}}</h1><p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{{HERO_SUBHEADLINE}}</p><div class="mt-8 flex flex-col gap-4 sm:flex-row"><a href="{{WHATSAPP_LINK}}" target="_blank" class="rounded-full bg-[#5b21b6] px-8 py-4 text-center text-base font-semibold text-white shadow-panel">{{CTA_BUTTON_TEXT}}</a><a href="#sobre" class="rounded-full border border-violet-200 bg-white px-8 py-4 text-center text-base font-semibold text-[#5b21b6]">Conhecer a abordagem</a></div></div><div class="section-shell noise rounded-[2.25rem] bg-[linear-gradient(145deg,#5b21b6_0%,#7c3aed_55%,#e9d5ff_160%)] p-8 text-white shadow-panel md:p-10"><div class="relative z-10"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Para quem busca leveza com consistência</p><h2 class="font-display mt-4 text-4xl leading-tight">Um espaço seguro para compreender o que você sente e construir respostas mais úteis.</h2><div class="mt-8 space-y-3 text-base leading-8 text-white/80"><p>{{CITY}}, {{STATE}}</p><p>{{SPECIALTY}}</p><p>{{EMAIL}}</p></div></div></div></div></section>

    <section data-section="pain" class="px-6 py-20"><div class="mx-auto max-w-6xl"><h2 class="font-display text-center text-4xl text-[#5b21b6] md:text-5xl">Você se identifica?</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="rounded-[1.75rem] border border-violet-100 bg-white p-7 shadow-soft"><p class="text-base leading-8 text-slate-700">{{PAIN_POINT_1}}</p></article><article class="rounded-[1.75rem] border border-violet-100 bg-[#f7ecff] p-7 shadow-soft"><p class="text-base leading-8 text-slate-700">{{PAIN_POINT_2}}</p></article><article class="rounded-[1.75rem] border border-violet-100 bg-white p-7 shadow-soft"><p class="text-base leading-8 text-slate-700">{{PAIN_POINT_3}}</p></article></div></div></section>

    <section id="sobre" data-section="about" class="px-6 py-20"><div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_.85fr]"><div class="rounded-[2rem] bg-white p-8 shadow-soft md:p-10"><p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">Sobre</p><h2 class="font-display mt-3 text-4xl text-[#5b21b6] md:text-5xl">{{ABOUT_HEADLINE}}</h2><p class="mt-6 text-lg leading-9 text-slate-600">{{ABOUT_TEXT}}</p></div><aside class="rounded-[2rem] bg-[#f7ecff] p-8 shadow-soft md:p-10"><p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">Presença e método</p><p class="mt-5 text-base leading-8 text-slate-700">Cuidado ético, escuta qualificada e estratégias práticas para que o processo terapêutico tenha acolhimento, clareza e continuidade.</p></aside></div></section>

    <section id="servicos" data-section="services" class="px-6 py-20"><div class="mx-auto max-w-6xl"><h2 class="font-display text-4xl text-[#5b21b6] md:text-5xl">{{SERVICES_HEADLINE}}</h2><div class="mt-10 grid gap-6 md:grid-cols-3"><article class="rounded-[2rem] border border-violet-100 bg-white p-8 shadow-soft"><h3 class="font-display text-3xl text-[#5b21b6]">{{SERVICE_1_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_1_DESC}}</p></article><article class="rounded-[2rem] border border-violet-100 bg-[#f7ecff] p-8 shadow-soft"><h3 class="font-display text-3xl text-[#5b21b6]">{{SERVICE_2_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_2_DESC}}</p></article><article class="rounded-[2rem] border border-violet-100 bg-white p-8 shadow-soft"><h3 class="font-display text-3xl text-[#5b21b6]">{{SERVICE_3_NAME}}</h3><p class="mt-4 text-base leading-8 text-slate-600">{{SERVICE_3_DESC}}</p></article></div></div></section>

    <section id="processo" data-section="process" class="px-6 py-20"><div class="mx-auto max-w-6xl rounded-[2rem] bg-[linear-gradient(135deg,#ffffff_0%,#f7ecff_100%)] p-8 shadow-soft md:p-12"><h2 class="font-display text-center text-4xl text-[#5b21b6] md:text-5xl">{{PROCESS_HEADLINE}}</h2><div class="mt-10 space-y-5"><div class="flex gap-4 rounded-[1.5rem] bg-white p-5 shadow-soft"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] font-bold text-white">1</div><p class="pt-2 text-base leading-8 text-slate-700">{{PROCESS_STEP_1}}</p></div><div class="flex gap-4 rounded-[1.5rem] bg-white p-5 shadow-soft"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] font-bold text-white">2</div><p class="pt-2 text-base leading-8 text-slate-700">{{PROCESS_STEP_2}}</p></div><div class="flex gap-4 rounded-[1.5rem] bg-white p-5 shadow-soft"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] font-bold text-white">3</div><p class="pt-2 text-base leading-8 text-slate-700">{{PROCESS_STEP_3}}</p></div></div></div></section>

    <section data-section="testimonials" class="px-6 py-20"><div class="mx-auto max-w-6xl"><h2 class="font-display text-center text-4xl text-[#5b21b6] md:text-5xl">O que dizem sobre o atendimento</h2><div class="mt-10 grid gap-6 md:grid-cols-2"><article class="rounded-[2rem] border border-violet-100 bg-white p-8 shadow-soft"><p class="text-lg leading-8 text-slate-700">{{TESTIMONIAL_1}}</p></article><article class="rounded-[2rem] border border-violet-100 bg-[#f7ecff] p-8 shadow-soft"><p class="text-lg leading-8 text-slate-700">{{TESTIMONIAL_2}}</p></article></div></div></section>

    <section id="faq" data-section="faq" class="px-6 py-20"><div class="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-soft md:p-12"><h2 class="font-display text-center text-4xl text-[#5b21b6] md:text-5xl">Perguntas frequentes</h2><div class="mt-10 space-y-4"><details class="group rounded-[1.25rem] border border-violet-100 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[#5b21b6]">{{FAQ_QUESTION_1}}<span class="transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-slate-600">{{FAQ_ANSWER_1}}</p></details><details class="group rounded-[1.25rem] border border-violet-100 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[#5b21b6]">{{FAQ_QUESTION_2}}<span class="transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-slate-600">{{FAQ_ANSWER_2}}</p></details><details class="group rounded-[1.25rem] border border-violet-100 px-6 py-5"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-[#5b21b6]">{{FAQ_QUESTION_3}}<span class="transition group-open:rotate-45">+</span></summary><p class="mt-4 text-base leading-8 text-slate-600">{{FAQ_ANSWER_3}}</p></details></div></div></section>

    <section id="contato" data-section="cta" class="px-6 pb-20 pt-10"><div class="mx-auto max-w-5xl rounded-[2.25rem] bg-[#5b21b6] px-8 py-14 text-center text-white shadow-panel"><h2 class="font-display text-balance text-4xl md:text-6xl">{{CTA_HEADLINE}}</h2><a href="{{WHATSAPP_LINK}}" target="_blank" class="mt-8 inline-flex rounded-full bg-[#f7ecff] px-8 py-4 text-lg font-semibold text-[#5b21b6]">{{CTA_BUTTON_TEXT}}</a></div></section>
  </main>
  <footer data-section="footer" class="bg-[#111827] px-6 py-12 text-slate-400"><div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-3"><div><p class="font-display text-2xl text-white">{{BUSINESS_NAME}}</p><p class="mt-3 text-sm">{{SPECIALTY}} em {{CITY}}, {{STATE}}</p></div><div><p class="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Contato</p><p class="mt-3 text-sm">{{PHONE}}</p><p class="mt-2 text-sm">{{EMAIL}}</p></div><div><p class="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Redes</p><a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" class="mt-3 inline-block text-sm">@{{INSTAGRAM}}</a></div></div><div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-xs">© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</div></footer>
  <a href="{{WHATSAPP_LINK}}" target="_blank" class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-panel"><svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg></a>
</body>
</html>`;

// ─── B2 SPIKE: Nutricionista — Fresh Clinical ────────────────────────────────
// Hand-authored CSS only (no Tailwind CDN) → target Lighthouse ≥ 90
// Palette: sage #4A7C59 · cream #F7F5EF · gold #C8A44B · text #1F2A24
// Fonts: Fraunces (display) + Inter (body)
export const nutricionistaFreshTemplate = `${buildHeadStatic({
  title: "{{BUSINESS_NAME}} | Nutricionista em {{CITY}}",
  description: "{{META_DESCRIPTION}}",
  fonts: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600;700&display=swap",
  styles: `
    :root{--bg:#F7F5EF;--text:#1F2A24;--primary:#4A7C59;--primary-d:#3a6347;--accent:#C8A44B;--accent-dark:#8B6418;--surface:#EEECE5;--border:rgba(31,42,36,.09);--r:14px;--max:1100px}
    body{background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
    .container{max-width:var(--max);margin:0 auto;padding:0 1.25rem}
    /* NAV */
    .nav{position:fixed;inset-x:0;top:0;z-index:50;background:rgba(247,245,239,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
    .nav-inner{max-width:var(--max);margin:0 auto;padding:0 1.25rem;display:flex;align-items:center;justify-content:space-between;height:62px}
    .nav-logo{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:600;color:var(--text)}
    .nav-links{display:none;gap:2rem}
    @media(min-width:768px){.nav-links{display:flex}}
    .nav-links a{font-size:.875rem;color:rgba(31,42,36,.65);font-weight:500;transition:color .15s}
    .nav-links a:hover{color:var(--primary)}
    .btn-nav{display:inline-flex;align-items:center;background:var(--primary);color:#fff;padding:.6rem 1.25rem;border-radius:9999px;font-size:.8125rem;font-weight:600;transition:background .15s}
    .btn-nav:hover{background:var(--primary-d)}
    /* HERO */
    .hero{padding:7.5rem 1.25rem 4rem;min-height:100svh;display:flex;align-items:center}
    .hero-grid{max-width:var(--max);margin:0 auto;display:grid;gap:3rem;align-items:center;width:100%}
    @media(min-width:768px){.hero-grid{grid-template-columns:1.1fr .9fr}}
    .hero-tag{display:inline-block;background:rgba(74,124,89,.12);color:var(--primary-d);font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;padding:.3rem .875rem;border-radius:9999px;margin-bottom:1.25rem}
    .hero-h1{font-family:'Fraunces',serif;font-size:clamp(2.1rem,5vw,3.5rem);line-height:1.1;color:var(--text);margin-bottom:1.25rem;font-weight:600}
    .hero-sub{font-size:1.0625rem;color:rgba(31,42,36,.65);line-height:1.7;margin-bottom:2.25rem;max-width:440px}
    .btn-hero{display:inline-flex;align-items:center;gap:.5rem;background:var(--primary);color:#fff;padding:.875rem 1.75rem;border-radius:9999px;font-size:.9375rem;font-weight:600;transition:background .15s}
    .btn-hero:hover{background:var(--primary-d)}
    .hero-visual{border-radius:var(--r);background:linear-gradient(145deg,var(--primary) 0%,rgba(74,124,89,.55) 100%);aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .hero-visual-inner{width:80%;height:80%;border-radius:calc(var(--r) - 4px);background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center}
    .hero-icon{width:5rem;height:5rem;opacity:.6}
    /* SECTIONS */
    .section{padding:5rem 1.25rem}
    .section-alt{background:var(--surface)}
    .section-top{text-align:center;margin-bottom:3rem}
    .section-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent-dark);margin-bottom:.75rem}
    .section-h2{font-family:'Fraunces',serif;font-size:clamp(1.6rem,3.5vw,2.5rem);color:var(--text);font-weight:600;line-height:1.2}
    /* PAIN */
    .grid-3{max-width:var(--max);margin:0 auto;display:grid;gap:1.25rem}
    @media(min-width:640px){.grid-3{grid-template-columns:repeat(3,1fr)}}
    .pain-card{background:#fff;border-radius:var(--r);padding:1.75rem;border:1px solid var(--border)}
    .pain-icon{width:2.75rem;height:2.75rem;border-radius:50%;background:rgba(74,124,89,.1);display:flex;align-items:center;justify-content:center;margin-bottom:1rem}
    .pain-icon svg{width:1.25rem;height:1.25rem;stroke:var(--primary);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .pain-card p{font-size:.9375rem;line-height:1.7;color:rgba(31,42,36,.75)}
    /* ABOUT */
    .about-grid{max-width:var(--max);margin:0 auto;display:grid;gap:3rem;align-items:center}
    @media(min-width:768px){.about-grid{grid-template-columns:.85fr 1.15fr}}
    .about-visual{border-radius:var(--r);background:linear-gradient(160deg,rgba(74,124,89,.12) 0%,rgba(200,164,75,.1) 100%);aspect-ratio:3/4;display:flex;align-items:flex-end;padding:1.5rem}
    .about-visual-badge{background:var(--primary);color:#fff;border-radius:calc(var(--r) - 4px);padding:.875rem 1.25rem;font-size:.875rem;font-weight:600}
    .section-h2-left{font-family:'Fraunces',serif;font-size:clamp(1.6rem,3vw,2.25rem);color:var(--text);font-weight:600;margin-bottom:1.25rem;line-height:1.25}
    .body-text{font-size:.9375rem;line-height:1.8;color:rgba(31,42,36,.72)}
    /* SERVICES */
    .service-card{background:#fff;border-radius:var(--r);padding:2rem;border:1px solid var(--border);transition:box-shadow .2s}
    .service-card:hover{box-shadow:0 6px 24px rgba(31,42,36,.07)}
    .svc-num{font-family:'Fraunces',serif;font-size:2rem;color:var(--accent-dark);margin-bottom:1rem;font-weight:600}
    .svc-name{font-size:1rem;font-weight:700;margin-bottom:.5rem;color:var(--text)}
    .svc-desc{font-size:.875rem;line-height:1.7;color:rgba(31,42,36,.72)}
    /* PROCESS */
    .process-grid{max-width:var(--max);margin:0 auto;display:grid;gap:2.5rem}
    @media(min-width:768px){.process-grid{grid-template-columns:repeat(3,1fr)}}
    .step{display:flex;flex-direction:column;gap:1rem}
    .step-num{width:3rem;height:3rem;border-radius:50%;background:var(--primary);color:#fff;font-family:'Fraunces',serif;font-size:1.125rem;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .step-text{font-size:.9375rem;line-height:1.7;color:rgba(31,42,36,.75)}
    /* TESTIMONIALS */
    .testi-grid{max-width:var(--max);margin:0 auto;display:grid;gap:1.25rem}
    @media(min-width:640px){.testi-grid{grid-template-columns:repeat(2,1fr)}}
    .testi-card{background:#fff;border-radius:var(--r);padding:2rem;border:1px solid var(--border)}
    .stars{color:var(--accent);font-size:1rem;margin-bottom:1rem;letter-spacing:.1em}
    .testi-text{font-size:.9375rem;font-style:italic;line-height:1.75;color:rgba(31,42,36,.75);margin-bottom:1.25rem}
    .testi-author{font-size:.8125rem;font-weight:700;color:var(--primary)}
    /* FAQ */
    .faq-wrap{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:.75rem}
    details.faq{background:#fff;border-radius:var(--r);border:1px solid var(--border);overflow:hidden}
    details.faq summary{list-style:none;padding:1.25rem 1.5rem;font-weight:600;font-size:.9375rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:1rem;color:var(--text)}
    details.faq summary::-webkit-details-marker{display:none}
    details.faq summary::after{content:"+";color:var(--primary);font-size:1.375rem;font-weight:300;flex-shrink:0;line-height:1}
    details.faq[open] summary::after{content:"−"}
    .faq-body{padding:0 1.5rem 1.25rem;font-size:.9375rem;line-height:1.75;color:rgba(31,42,36,.68)}
    /* CTA */
    .cta-section{background:var(--primary);color:#fff;padding:5.5rem 1.25rem;text-align:center}
    .cta-h2{font-family:'Fraunces',serif;font-size:clamp(1.75rem,4vw,2.875rem);margin-bottom:1.5rem;font-weight:600;line-height:1.2}
    .cta-sub{font-size:1rem;opacity:.82;margin-bottom:2.25rem}
    .btn-cta{display:inline-flex;align-items:center;gap:.625rem;background:#fff;color:var(--primary);padding:1rem 2rem;border-radius:9999px;font-size:1rem;font-weight:700;transition:opacity .15s}
    .btn-cta:hover{opacity:.92}
    /* FOOTER */
    .footer{background:#161c19;color:rgba(255,255,255,.5);padding:3.5rem 1.25rem;font-size:.875rem}
    .footer-grid{max-width:var(--max);margin:0 auto;display:grid;gap:2rem}
    @media(min-width:768px){.footer-grid{grid-template-columns:repeat(3,1fr)}}
    .footer-logo{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:600;color:#fff;margin-bottom:.5rem}
    .footer-copy{max-width:var(--max);margin:2rem auto 0;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.08);font-size:.75rem;text-align:center}
    /* FAB */
    .fab{position:fixed;bottom:1.5rem;right:1.5rem;z-index:50;width:3.5rem;height:3.5rem;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.4)}
  `,
})}
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="#hero" class="nav-logo">{{BUSINESS_NAME}}</a>
      <div class="nav-links">
        <a href="#sobre">Sobre</a>
        <a href="#servicos">Serviços</a>
        <a href="#processo">Como funciona</a>
        <a href="#faq">FAQ</a>
      </div>
      <a href="{{WHATSAPP_LINK}}" target="_blank" rel="noopener" class="btn-nav">Agendar consulta</a>
    </div>
  </nav>
  <main>
    <section id="hero" data-section="hero" class="hero">
      <div class="hero-grid">
        <div>
          <span class="hero-tag">Nutrição Clínica · {{CITY}}</span>
          <h1 class="hero-h1">{{HERO_HEADLINE}}</h1>
          <p class="hero-sub">{{HERO_SUBHEADLINE}}</p>
          <a href="{{WHATSAPP_LINK}}" target="_blank" rel="noopener" class="btn-hero"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>{{CTA_BUTTON_TEXT}}</a>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="hero-visual-inner">
            <svg class="hero-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="28" r="16" stroke="rgba(255,255,255,.7)" stroke-width="2"/><path d="M14 68c0-14.36 11.64-26 26-26h0c14.36 0 26 11.64 26 26" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
        </div>
      </div>
    </section>
    <section id="dores" data-section="pain_section" class="section section-alt">
      <div class="section-top">
        <div class="section-label">Você se reconhece aqui?</div>
        <h2 class="section-h2">O que te impede de ter a saúde que você quer</h2>
      </div>
      <div class="grid-3">
        <div class="pain-card"><div class="pain-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><p>{{PAIN_POINT_1}}</p></div>
        <div class="pain-card"><div class="pain-icon"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><p>{{PAIN_POINT_2}}</p></div>
        <div class="pain-card"><div class="pain-icon"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div><p>{{PAIN_POINT_3}}</p></div>
      </div>
    </section>
    <section id="sobre" data-section="about" class="section">
      <div class="about-grid">
        <div class="about-visual" aria-hidden="true"><div class="about-visual-badge">{{SPECIALTY}} · {{CITY}}</div></div>
        <div>
          <div class="section-label">Sobre</div>
          <h2 class="section-h2-left">{{ABOUT_HEADLINE}}</h2>
          <p class="body-text">{{ABOUT_TEXT}}</p>
        </div>
      </div>
    </section>
    <section id="servicos" data-section="services" class="section section-alt">
      <div class="section-top">
        <div class="section-label">Serviços</div>
        <h2 class="section-h2">{{SERVICES_HEADLINE}}</h2>
      </div>
      <div class="grid-3">
        <div class="service-card"><div class="svc-num">01</div><div class="svc-name">{{SERVICE_1_NAME}}</div><div class="svc-desc">{{SERVICE_1_DESC}}</div></div>
        <div class="service-card"><div class="svc-num">02</div><div class="svc-name">{{SERVICE_2_NAME}}</div><div class="svc-desc">{{SERVICE_2_DESC}}</div></div>
        <div class="service-card"><div class="svc-num">03</div><div class="svc-name">{{SERVICE_3_NAME}}</div><div class="svc-desc">{{SERVICE_3_DESC}}</div></div>
      </div>
    </section>
    <section id="processo" data-section="process" class="section">
      <div class="section-top">
        <div class="section-label">Como funciona</div>
        <h2 class="section-h2">{{PROCESS_HEADLINE}}</h2>
      </div>
      <div class="process-grid">
        <div class="step"><div class="step-num">1</div><p class="step-text">{{PROCESS_STEP_1}}</p></div>
        <div class="step"><div class="step-num">2</div><p class="step-text">{{PROCESS_STEP_2}}</p></div>
        <div class="step"><div class="step-num">3</div><p class="step-text">{{PROCESS_STEP_3}}</p></div>
      </div>
    </section>
    <section id="depoimentos" data-section="testimonials" class="section section-alt">
      <div class="section-top">
        <div class="section-label">Depoimentos</div>
        <h2 class="section-h2">Resultados reais de pessoas reais</h2>
      </div>
      <div class="testi-grid">
        <div class="testi-card"><div class="stars">★★★★★</div><p class="testi-text">{{TESTIMONIAL_1}}</p><div class="testi-author">Paciente</div></div>
        <div class="testi-card"><div class="stars">★★★★★</div><p class="testi-text">{{TESTIMONIAL_2}}</p><div class="testi-author">Paciente</div></div>
      </div>
    </section>
    <section id="faq" data-section="faq" class="section">
      <div class="section-top">
        <div class="section-label">Perguntas frequentes</div>
        <h2 class="section-h2">Tire suas dúvidas</h2>
      </div>
      <div class="faq-wrap">
        <details class="faq"><summary>{{FAQ_QUESTION_1}}</summary><div class="faq-body">{{FAQ_ANSWER_1}}</div></details>
        <details class="faq"><summary>{{FAQ_QUESTION_2}}</summary><div class="faq-body">{{FAQ_ANSWER_2}}</div></details>
        <details class="faq"><summary>{{FAQ_QUESTION_3}}</summary><div class="faq-body">{{FAQ_ANSWER_3}}</div></details>
      </div>
    </section>
    <section id="contato" data-section="cta" class="cta-section">
      <div class="container">
        <h2 class="cta-h2">{{CTA_HEADLINE}}</h2>
        <p class="cta-sub">{{SPECIALTY}} em {{CITY}} — atendimento presencial</p>
        <a href="{{WHATSAPP_LINK}}" target="_blank" rel="noopener" class="btn-cta"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>{{CTA_BUTTON_TEXT}}</a>
      </div>
    </section>
  </main>
  <footer data-section="footer" class="footer">
    <div class="footer-grid">
      <div><div class="footer-logo">{{BUSINESS_NAME}}</div><p>{{SPECIALTY}} em {{CITY}}, {{STATE}}</p></div>
      <div><p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.35);margin-bottom:.75rem">Contato</p><p>{{PHONE}}</p><p style="margin-top:.5rem">{{EMAIL}}</p></div>
      <div><p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.35);margin-bottom:.75rem">Redes</p><a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" rel="noopener">@{{INSTAGRAM}}</a></div>
    </div>
    <div class="footer-copy">© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</div>
  </footer>
  <a href="{{WHATSAPP_LINK}}" target="_blank" rel="noopener" class="fab" aria-label="Falar no WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg></a>
</body>
</html>`;

export const templates: Record<string, string> = {
  "elegant-minimal": elegantMinimalTemplate,
  "modern-clean": modernCleanTemplate,
  "warm-soft": warmWelcomingTemplate,
  "nutricionista-fresh": nutricionistaFreshTemplate,
};