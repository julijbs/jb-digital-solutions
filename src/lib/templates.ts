// ═══════════════════════════════════════════════════
// TEMPLATE 1: ELEGANTE MINIMALISTA
// Paleta: Azul escuro (#0A1128) + Dourado (#C8A882) + Branco
// Fonts: DM Serif Display + Inter
// ═══════════════════════════════════════════════════
export const elegantMinimalTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{BUSINESS_NAME}} | {{SPECIALTY}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "{{SCHEMA_TYPE}}",
    "name": "{{BUSINESS_NAME}}",
    "description": "{{META_DESCRIPTION}}",
    "address": { "@type": "PostalAddress", "addressLocality": "{{CITY}}", "addressRegion": "{{STATE}}" },
    "telephone": "{{PHONE}}"
  }
  <\/script>
  <style>
    * { scroll-behavior: smooth; }
    .font-serif { font-family: 'DM Serif Display', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeInUp 0.6s ease-out; }
  </style>
</head>
<body class="font-sans bg-white text-gray-800">

  <!-- Navbar -->
  <nav class="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <span class="font-serif text-xl" style="color:#0A1128;">{{BUSINESS_NAME}}</span>
      <div class="hidden md:flex items-center gap-8 text-sm">
        <a href="#sobre" class="hover:opacity-70 transition">Sobre</a>
        <a href="#servicos" class="hover:opacity-70 transition">Serviços</a>
        <a href="#como-funciona" class="hover:opacity-70 transition">Como Funciona</a>
        <a href="#contato" class="hover:opacity-70 transition">Contato</a>
      </div>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="text-sm font-medium px-5 py-2.5 rounded-full text-white transition hover:opacity-90" style="background-color:#C8A882;">Agendar Conversa</a>
    </div>
  </nav>

  <!-- Hero -->
  <section data-section="hero" class="pt-32 pb-20 px-6 fade-in" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style="color:#0A1128;">{{HERO_HEADLINE}}</h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">{{HERO_SUBHEADLINE}}</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="{{WHATSAPP_LINK}}" target="_blank" class="inline-flex items-center justify-center gap-2 text-white font-medium px-8 py-4 rounded-full text-lg transition hover:opacity-90" style="background-color:#0A1128;">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          Agendar Primeira Conversa
        </a>
        <a href="#sobre" class="inline-flex items-center justify-center font-medium px-8 py-4 rounded-full text-lg border-2 transition hover:bg-gray-50" style="border-color:#0A1128; color:#0A1128;">Saber Mais</a>
      </div>
      <div class="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
        <span>📍 {{CITY}}, {{STATE}}</span>
        <span>{{SPECIALTY}}</span>
      </div>
    </div>
  </section>

  <!-- Dores -->
  <section data-section="pain" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl text-center mb-12" style="color:#0A1128;">Você se identifica?</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color:#C8A882; color:white;">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p class="text-gray-700">{{PAIN_POINT_1}}</p>
        </div>
        <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color:#C8A882; color:white;">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p class="text-gray-700">{{PAIN_POINT_2}}</p>
        </div>
        <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color:#C8A882; color:white;">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p class="text-gray-700">{{PAIN_POINT_3}}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Sobre -->
  <section data-section="about" id="sobre" class="py-20 px-6" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl mb-8" style="color:#0A1128;">{{ABOUT_HEADLINE}}</h2>
      <p class="text-gray-600 leading-relaxed text-lg">{{ABOUT_TEXT}}</p>
    </div>
  </section>

  <!-- Serviços -->
  <section data-section="services" id="servicos" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl text-center mb-4" style="color:#0A1128;">{{SERVICES_HEADLINE}}</h2>
      <div class="grid md:grid-cols-3 gap-8 mt-12">
        <div class="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition text-center">
          <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color:#0A1128; color:#C8A882;">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <h3 class="font-serif text-xl mb-2" style="color:#0A1128;">{{SERVICE_1_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_1_DESC}}</p>
        </div>
        <div class="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition text-center">
          <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color:#0A1128; color:#C8A882;">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </div>
          <h3 class="font-serif text-xl mb-2" style="color:#0A1128;">{{SERVICE_2_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_2_DESC}}</p>
        </div>
        <div class="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition text-center">
          <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style="background-color:#0A1128; color:#C8A882;">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <h3 class="font-serif text-xl mb-2" style="color:#0A1128;">{{SERVICE_3_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_3_DESC}}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Como Funciona -->
  <section data-section="process" id="como-funciona" class="py-20 px-6" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl text-center mb-12" style="color:#0A1128;">{{PROCESS_HEADLINE}}</h2>
      <div class="space-y-8">
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#C8A882;">1</div>
          <div><p class="text-gray-700 text-lg">{{PROCESS_STEP_1}}</p></div>
        </div>
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#C8A882;">2</div>
          <div><p class="text-gray-700 text-lg">{{PROCESS_STEP_2}}</p></div>
        </div>
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#C8A882;">3</div>
          <div><p class="text-gray-700 text-lg">{{PROCESS_STEP_3}}</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Depoimentos -->
  <section data-section="testimonials" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl text-center mb-12" style="color:#0A1128;">O que dizem sobre o atendimento</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <svg class="w-8 h-8 mb-4" style="color:#C8A882;" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <p class="text-gray-700 italic mb-4">"{{TESTIMONIAL_1}}"</p>
        </div>
        <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <svg class="w-8 h-8 mb-4" style="color:#C8A882;" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <p class="text-gray-700 italic mb-4">"{{TESTIMONIAL_2}}"</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section data-section="faq" class="py-20 px-6" style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);">
    <div class="max-w-3xl mx-auto">
      <h2 class="font-serif text-3xl md:text-4xl text-center mb-12" style="color:#0A1128;">Perguntas Frequentes</h2>
      <div class="space-y-6">
        <details class="group border border-gray-200 rounded-xl p-6">
          <summary class="cursor-pointer font-medium text-gray-800 flex items-center justify-between">{{FAQ_QUESTION_1}}<span class="transition group-open:rotate-180">▼</span></summary>
          <p class="mt-4 text-gray-600">{{FAQ_ANSWER_1}}</p>
        </details>
        <details class="group border border-gray-200 rounded-xl p-6">
          <summary class="cursor-pointer font-medium text-gray-800 flex items-center justify-between">{{FAQ_QUESTION_2}}<span class="transition group-open:rotate-180">▼</span></summary>
          <p class="mt-4 text-gray-600">{{FAQ_ANSWER_2}}</p>
        </details>
        <details class="group border border-gray-200 rounded-xl p-6">
          <summary class="cursor-pointer font-medium text-gray-800 flex items-center justify-between">{{FAQ_QUESTION_3}}<span class="transition group-open:rotate-180">▼</span></summary>
          <p class="mt-4 text-gray-600">{{FAQ_ANSWER_3}}</p>
        </details>
      </div>
    </div>
  </section>

  <!-- CTA Final -->
  <section data-section="cta" id="contato" class="py-20 px-6" style="background-color:#0A1128;">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="font-serif text-3xl md:text-4xl text-white mb-4">{{CTA_HEADLINE}}</h2>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="inline-flex items-center gap-2 text-lg font-medium px-10 py-4 rounded-full transition hover:opacity-90 mt-6" style="background-color:#C8A882; color:#0A1128;">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        {{CTA_BUTTON_TEXT}}
      </a>
      <div class="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
        <span>✓ Resposta em até 24h</span>
        <span>✓ Sem compromisso</span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer data-section="footer" class="py-12 px-6 bg-gray-900 text-gray-400">
    <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
      <div>
        <p class="font-serif text-white text-lg mb-2">{{BUSINESS_NAME}}</p>
        <p class="text-sm">{{SPECIALTY}} em {{CITY}}, {{STATE}}</p>
      </div>
      <div>
        <p class="text-white font-medium mb-2">Contato</p>
        <p class="text-sm">📱 {{PHONE}}</p>
        <p class="text-sm">✉️ {{EMAIL}}</p>
        <p class="text-sm">📍 {{CITY}}, {{STATE}}</p>
      </div>
      <div>
        <p class="text-white font-medium mb-2">Redes Sociais</p>
        <a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" class="text-sm hover:text-white transition">Instagram</a>
      </div>
    </div>
    <div class="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-xs">
      <p>© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</p>
    </div>
  </footer>

  <!-- WhatsApp Flutuante -->
  <a href="{{WHATSAPP_LINK}}" target="_blank" class="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-110 transition" style="background-color:#25D366;">
    <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
  </a>

</body>
</html>`;

// ═══════════════════════════════════════════════════
// TEMPLATE 2: MODERNO CLEAN
// Paleta: Verde (#2D6A4F) + Cinza escuro (#1A1A1A) + Branco
// Fonts: Poppins + Inter
// ═══════════════════════════════════════════════════
export const modernCleanTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{BUSINESS_NAME}} | {{SPECIALTY}} em {{CITY}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "{{SCHEMA_TYPE}}",
    "name": "{{BUSINESS_NAME}}",
    "description": "{{META_DESCRIPTION}}",
    "address": { "@type": "PostalAddress", "addressLocality": "{{CITY}}", "addressRegion": "{{STATE}}" },
    "telephone": "{{PHONE}}"
  }
  <\/script>
  <style>
    * { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; }
    .font-heading { font-family: 'Poppins', sans-serif; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeInUp 0.5s ease-out; }
  </style>
</head>
<body class="bg-gray-50 text-gray-800">

  <nav class="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <span class="font-heading font-bold text-xl" style="color:#2D6A4F;">{{BUSINESS_NAME}}</span>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#sobre" class="hover:text-green-700 transition">Sobre</a>
        <a href="#servicos" class="hover:text-green-700 transition">Serviços</a>
        <a href="#contato" class="hover:text-green-700 transition">Contato</a>
      </div>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition hover:opacity-90" style="background-color:#2D6A4F;">Agendar</a>
    </div>
  </nav>

  <section data-section="hero" class="pt-32 pb-20 px-6 fade-in" style="background: linear-gradient(135deg, #dcfce7 0%, #ffffff 50%, #f0fdf4 100%);">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style="color:#1A1A1A;">{{HERO_HEADLINE}}</h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">{{HERO_SUBHEADLINE}}</p>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-lg transition hover:opacity-90" style="background-color:#2D6A4F;">Começar Agora</a>
      <p class="mt-4 text-sm text-gray-500">📍 {{CITY}}, {{STATE}} · {{SPECIALTY}}</p>
    </div>
  </section>

  <section data-section="pain" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-heading font-bold text-3xl text-center mb-12" style="color:#1A1A1A;">Você se identifica?</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-6 rounded-xl bg-green-50 border border-green-100 text-center"><p class="text-gray-700">{{PAIN_POINT_1}}</p></div>
        <div class="p-6 rounded-xl bg-green-50 border border-green-100 text-center"><p class="text-gray-700">{{PAIN_POINT_2}}</p></div>
        <div class="p-6 rounded-xl bg-green-50 border border-green-100 text-center"><p class="text-gray-700">{{PAIN_POINT_3}}</p></div>
      </div>
    </div>
  </section>

  <section data-section="about" id="sobre" class="py-20 px-6 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-heading font-bold text-3xl mb-8" style="color:#1A1A1A;">{{ABOUT_HEADLINE}}</h2>
      <p class="text-gray-600 leading-relaxed text-lg">{{ABOUT_TEXT}}</p>
    </div>
  </section>

  <section data-section="services" id="servicos" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-heading font-bold text-3xl text-center mb-12" style="color:#1A1A1A;">{{SERVICES_HEADLINE}}</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-8 rounded-xl border border-gray-200 hover:shadow-md transition">
          <h3 class="font-heading font-semibold text-xl mb-2" style="color:#2D6A4F;">{{SERVICE_1_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_1_DESC}}</p>
        </div>
        <div class="p-8 rounded-xl border border-gray-200 hover:shadow-md transition">
          <h3 class="font-heading font-semibold text-xl mb-2" style="color:#2D6A4F;">{{SERVICE_2_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_2_DESC}}</p>
        </div>
        <div class="p-8 rounded-xl border border-gray-200 hover:shadow-md transition">
          <h3 class="font-heading font-semibold text-xl mb-2" style="color:#2D6A4F;">{{SERVICE_3_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_3_DESC}}</p>
        </div>
      </div>
    </div>
  </section>

  <section data-section="process" class="py-20 px-6 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-heading font-bold text-3xl text-center mb-12" style="color:#1A1A1A;">{{PROCESS_HEADLINE}}</h2>
      <div class="space-y-6">
        <div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style="background-color:#2D6A4F;">1</div><p class="text-gray-700 text-lg pt-1.5">{{PROCESS_STEP_1}}</p></div>
        <div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style="background-color:#2D6A4F;">2</div><p class="text-gray-700 text-lg pt-1.5">{{PROCESS_STEP_2}}</p></div>
        <div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style="background-color:#2D6A4F;">3</div><p class="text-gray-700 text-lg pt-1.5">{{PROCESS_STEP_3}}</p></div>
      </div>
    </div>
  </section>

  <section data-section="testimonials" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-heading font-bold text-3xl text-center mb-12" style="color:#1A1A1A;">O que dizem</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="p-8 rounded-xl bg-green-50 border border-green-100"><p class="text-gray-700 italic">"{{TESTIMONIAL_1}}"</p></div>
        <div class="p-8 rounded-xl bg-green-50 border border-green-100"><p class="text-gray-700 italic">"{{TESTIMONIAL_2}}"</p></div>
      </div>
    </div>
  </section>

  <section data-section="faq" class="py-20 px-6 bg-gray-50">
    <div class="max-w-3xl mx-auto">
      <h2 class="font-heading font-bold text-3xl text-center mb-12" style="color:#1A1A1A;">Perguntas Frequentes</h2>
      <div class="space-y-4">
        <details class="group border border-gray-200 rounded-lg p-5 bg-white"><summary class="cursor-pointer font-medium flex justify-between">{{FAQ_QUESTION_1}} <span class="group-open:rotate-180 transition">▼</span></summary><p class="mt-3 text-gray-600">{{FAQ_ANSWER_1}}</p></details>
        <details class="group border border-gray-200 rounded-lg p-5 bg-white"><summary class="cursor-pointer font-medium flex justify-between">{{FAQ_QUESTION_2}} <span class="group-open:rotate-180 transition">▼</span></summary><p class="mt-3 text-gray-600">{{FAQ_ANSWER_2}}</p></details>
        <details class="group border border-gray-200 rounded-lg p-5 bg-white"><summary class="cursor-pointer font-medium flex justify-between">{{FAQ_QUESTION_3}} <span class="group-open:rotate-180 transition">▼</span></summary><p class="mt-3 text-gray-600">{{FAQ_ANSWER_3}}</p></details>
      </div>
    </div>
  </section>

  <section data-section="cta" id="contato" class="py-20 px-6" style="background-color:#2D6A4F;">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="font-heading font-bold text-3xl text-white mb-4">{{CTA_HEADLINE}}</h2>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="inline-flex items-center gap-2 text-lg font-semibold px-10 py-4 rounded-xl bg-white transition hover:bg-gray-100 mt-4" style="color:#2D6A4F;">{{CTA_BUTTON_TEXT}}</a>
    </div>
  </section>

  <footer data-section="footer" class="py-10 px-6 bg-gray-900 text-gray-400">
    <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
      <div><p class="text-white font-heading font-semibold mb-2">{{BUSINESS_NAME}}</p><p>{{SPECIALTY}} em {{CITY}}, {{STATE}}</p></div>
      <div><p class="text-white font-medium mb-2">Contato</p><p>📱 {{PHONE}}</p><p>✉️ {{EMAIL}}</p></div>
      <div><p class="text-white font-medium mb-2">Redes</p><a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" class="hover:text-white">Instagram</a></div>
    </div>
    <div class="max-w-5xl mx-auto mt-6 pt-4 border-t border-gray-800 text-center text-xs"><p>© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</p></div>
  </footer>

  <a href="{{WHATSAPP_LINK}}" target="_blank" class="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-110 transition" style="background-color:#25D366;">
    <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
  </a>

</body>
</html>`;

// ═══════════════════════════════════════════════════
// TEMPLATE 3: ACOLHEDOR SUAVE
// Paleta: Roxo (#5A189A) + Rosa (#F4E4F7) + Branco
// Fonts: Playfair Display + Open Sans
// ═══════════════════════════════════════════════════
export const warmWelcomingTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{BUSINESS_NAME}} | {{SPECIALTY}} em {{CITY}}</title>
  <meta name="description" content="{{META_DESCRIPTION}}">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "{{SCHEMA_TYPE}}",
    "name": "{{BUSINESS_NAME}}",
    "description": "{{META_DESCRIPTION}}",
    "address": { "@type": "PostalAddress", "addressLocality": "{{CITY}}", "addressRegion": "{{STATE}}" },
    "telephone": "{{PHONE}}"
  }
  <\/script>
  <style>
    * { scroll-behavior: smooth; }
    body { font-family: 'Open Sans', sans-serif; }
    .font-serif { font-family: 'Playfair Display', serif; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeInUp 0.6s ease-out; }
  </style>
</head>
<body class="bg-rose-50 text-gray-800">

  <nav class="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-purple-100 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <span class="font-serif text-xl" style="color:#5A189A;">{{BUSINESS_NAME}}</span>
      <div class="hidden md:flex items-center gap-8 text-sm">
        <a href="#sobre" class="hover:text-purple-700 transition">Sobre</a>
        <a href="#servicos" class="hover:text-purple-700 transition">Serviços</a>
        <a href="#contato" class="hover:text-purple-700 transition">Contato</a>
      </div>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="text-sm font-medium px-5 py-2.5 rounded-full text-white transition hover:opacity-90" style="background-color:#5A189A;">Agendar</a>
    </div>
  </nav>

  <section data-section="hero" class="pt-32 pb-20 px-6 fade-in" style="background: linear-gradient(135deg, #fae8ff 0%, #ffffff 50%, #fce7f3 100%);">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style="color:#5A189A;">{{HERO_HEADLINE}}</h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">{{HERO_SUBHEADLINE}}</p>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="inline-flex items-center gap-2 text-white font-medium px-8 py-4 rounded-full text-lg transition hover:opacity-90" style="background-color:#5A189A;">Começar Minha Transformação</a>
      <p class="mt-4 text-sm text-gray-500">📍 {{CITY}}, {{STATE}} · {{SPECIALTY}}</p>
    </div>
  </section>

  <section data-section="pain" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-serif text-3xl text-center mb-12" style="color:#5A189A;">Você se identifica?</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl border border-purple-100 text-center" style="background-color:#F4E4F7;"><p class="text-gray-700">{{PAIN_POINT_1}}</p></div>
        <div class="p-6 rounded-2xl border border-purple-100 text-center" style="background-color:#F4E4F7;"><p class="text-gray-700">{{PAIN_POINT_2}}</p></div>
        <div class="p-6 rounded-2xl border border-purple-100 text-center" style="background-color:#F4E4F7;"><p class="text-gray-700">{{PAIN_POINT_3}}</p></div>
      </div>
    </div>
  </section>

  <section data-section="about" id="sobre" class="py-20 px-6" style="background: linear-gradient(135deg, #faf5ff 0%, #ffffff 100%);">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-serif text-3xl mb-8" style="color:#5A189A;">{{ABOUT_HEADLINE}}</h2>
      <p class="text-gray-600 leading-relaxed text-lg">{{ABOUT_TEXT}}</p>
    </div>
  </section>

  <section data-section="services" id="servicos" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-serif text-3xl text-center mb-12" style="color:#5A189A;">{{SERVICES_HEADLINE}}</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition text-center">
          <h3 class="font-serif text-xl mb-2" style="color:#5A189A;">{{SERVICE_1_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_1_DESC}}</p>
        </div>
        <div class="p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition text-center">
          <h3 class="font-serif text-xl mb-2" style="color:#5A189A;">{{SERVICE_2_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_2_DESC}}</p>
        </div>
        <div class="p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition text-center">
          <h3 class="font-serif text-xl mb-2" style="color:#5A189A;">{{SERVICE_3_NAME}}</h3>
          <p class="text-gray-600 text-sm">{{SERVICE_3_DESC}}</p>
        </div>
      </div>
    </div>
  </section>

  <section data-section="process" class="py-20 px-6" style="background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%);">
    <div class="max-w-4xl mx-auto">
      <h2 class="font-serif text-3xl text-center mb-12" style="color:#5A189A;">{{PROCESS_HEADLINE}}</h2>
      <div class="space-y-6">
        <div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#9D4EDD;">1</div><p class="text-gray-700 text-lg pt-1.5">{{PROCESS_STEP_1}}</p></div>
        <div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#9D4EDD;">2</div><p class="text-gray-700 text-lg pt-1.5">{{PROCESS_STEP_2}}</p></div>
        <div class="flex items-start gap-4"><div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#9D4EDD;">3</div><p class="text-gray-700 text-lg pt-1.5">{{PROCESS_STEP_3}}</p></div>
      </div>
    </div>
  </section>

  <section data-section="testimonials" class="py-20 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h2 class="font-serif text-3xl text-center mb-12" style="color:#5A189A;">O que dizem sobre o atendimento</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="p-8 rounded-2xl border border-purple-100" style="background-color:#F4E4F7;"><p class="text-gray-700 italic">"{{TESTIMONIAL_1}}"</p></div>
        <div class="p-8 rounded-2xl border border-purple-100" style="background-color:#F4E4F7;"><p class="text-gray-700 italic">"{{TESTIMONIAL_2}}"</p></div>
      </div>
    </div>
  </section>

  <section data-section="faq" class="py-20 px-6" style="background-color:#faf5ff;">
    <div class="max-w-3xl mx-auto">
      <h2 class="font-serif text-3xl text-center mb-12" style="color:#5A189A;">Perguntas Frequentes</h2>
      <div class="space-y-4">
        <details class="group border border-purple-200 rounded-xl p-5 bg-white"><summary class="cursor-pointer font-medium flex justify-between">{{FAQ_QUESTION_1}} <span class="group-open:rotate-180 transition">▼</span></summary><p class="mt-3 text-gray-600">{{FAQ_ANSWER_1}}</p></details>
        <details class="group border border-purple-200 rounded-xl p-5 bg-white"><summary class="cursor-pointer font-medium flex justify-between">{{FAQ_QUESTION_2}} <span class="group-open:rotate-180 transition">▼</span></summary><p class="mt-3 text-gray-600">{{FAQ_ANSWER_2}}</p></details>
        <details class="group border border-purple-200 rounded-xl p-5 bg-white"><summary class="cursor-pointer font-medium flex justify-between">{{FAQ_QUESTION_3}} <span class="group-open:rotate-180 transition">▼</span></summary><p class="mt-3 text-gray-600">{{FAQ_ANSWER_3}}</p></details>
      </div>
    </div>
  </section>

  <section data-section="cta" id="contato" class="py-20 px-6" style="background-color:#5A189A;">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="font-serif text-3xl text-white mb-4">{{CTA_HEADLINE}}</h2>
      <a href="{{WHATSAPP_LINK}}" target="_blank" class="inline-flex items-center gap-2 text-lg font-medium px-10 py-4 rounded-full transition hover:opacity-90 mt-4" style="background-color:#F4E4F7; color:#5A189A;">{{CTA_BUTTON_TEXT}}</a>
    </div>
  </section>

  <footer data-section="footer" class="py-10 px-6 bg-gray-900 text-gray-400">
    <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
      <div><p class="text-white font-serif mb-2">{{BUSINESS_NAME}}</p><p>{{SPECIALTY}} em {{CITY}}, {{STATE}}</p></div>
      <div><p class="text-white font-medium mb-2">Contato</p><p>📱 {{PHONE}}</p><p>✉️ {{EMAIL}}</p></div>
      <div><p class="text-white font-medium mb-2">Redes</p><a href="https://instagram.com/{{INSTAGRAM}}" target="_blank" class="hover:text-white">Instagram</a></div>
    </div>
    <div class="max-w-5xl mx-auto mt-6 pt-4 border-t border-gray-800 text-center text-xs"><p>© {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Todos os direitos reservados.</p></div>
  </footer>

  <a href="{{WHATSAPP_LINK}}" target="_blank" class="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-110 transition" style="background-color:#25D366;">
    <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.687-1.228A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.838-6.313-2.236l-.44-.366-3.12.818.852-3.008-.388-.462A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
  </a>

</body>
</html>`;

export const templates = {
  "elegant-minimal": elegantMinimalTemplate,
  "modern-clean": modernCleanTemplate,
  "warm-soft": warmWelcomingTemplate,
} as const;
