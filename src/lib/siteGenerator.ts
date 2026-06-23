export function applyTextsToTemplate(
  templateHTML: string,
  texts: Record<string, string>,
  projectData: {
    businessName: string;
    specialty: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    instagram: string;
    vertical: string;
    slug?: string;
    customDomain?: string;
  },
  brandData?: {
    primary_color?: string;
    accent_color?: string;
    background_color?: string;
    text_color?: string;
    font_display?: string;
    font_body?: string;
    logo_url?: string;
  }
): string {
  const schemaTypeMap: Record<string, string> = {
    psicologo: "ProfessionalService",
    dentista: "Dentist",
    terapeuta: "HealthAndBeautyBusiness",
    nutricionista: "HealthAndBeautyBusiness",
  };

  const phoneClean = (projectData.phone || "").replace(/\D/g, "");

  const replacements: Record<string, string> = {
    // Project data
    BUSINESS_NAME: projectData.businessName || "",
    SPECIALTY: projectData.specialty || "",
    CITY: projectData.city || "",
    STATE: projectData.state || "",
    PHONE: projectData.phone || "",
    PHONE_CLEAN: phoneClean,
    EMAIL: projectData.email || "",
    INSTAGRAM: projectData.instagram || "",
    SCHEMA_TYPE: schemaTypeMap[projectData.vertical] || "LocalBusiness",
    SITE_URL: projectData.customDomain || `${projectData.slug || "site"}.jbdigital.com.br`,
    WHATSAPP_LINK: `https://wa.me/55${phoneClean}`,
    CURRENT_YEAR: new Date().getFullYear().toString(),
    // Brand overrides
    BRAND_PRIMARY: brandData?.primary_color || "",
    BRAND_ACCENT: brandData?.accent_color || "",
    BRAND_BG: brandData?.background_color || "",
    BRAND_TEXT: brandData?.text_color || "",
    BRAND_FONT_DISPLAY: brandData?.font_display || "",
    BRAND_FONT_BODY: brandData?.font_body || "",
    LOGO_URL: brandData?.logo_url || "",

    // AI-generated texts
    META_DESCRIPTION: texts.meta_description || "",
    HERO_HEADLINE: texts.hero_headline || "",
    HERO_SUBHEADLINE: texts.hero_subheadline || "",
    PAIN_POINT_1: texts.pain_point_1 || "",
    PAIN_POINT_2: texts.pain_point_2 || "",
    PAIN_POINT_3: texts.pain_point_3 || "",
    ABOUT_HEADLINE: texts.about_headline || "",
    ABOUT_TEXT: texts.about_text || "",
    SERVICES_HEADLINE: texts.services_headline || "",
    SERVICE_1_NAME: texts.service_1_name || "",
    SERVICE_1_DESC: texts.service_1_desc || "",
    SERVICE_2_NAME: texts.service_2_name || "",
    SERVICE_2_DESC: texts.service_2_desc || "",
    SERVICE_3_NAME: texts.service_3_name || "",
    SERVICE_3_DESC: texts.service_3_desc || "",
    PROCESS_HEADLINE: texts.process_headline || "",
    PROCESS_STEP_1: texts.process_step_1 || "",
    PROCESS_STEP_2: texts.process_step_2 || "",
    PROCESS_STEP_3: texts.process_step_3 || "",
    TESTIMONIAL_1: texts.testimonial_1 || "",
    TESTIMONIAL_2: texts.testimonial_2 || "",
    CTA_HEADLINE: texts.cta_headline || "",
    CTA_BUTTON_TEXT: texts.cta_button_text || "",
    FAQ_QUESTION_1: texts.faq_question_1 || "",
    FAQ_ANSWER_1: texts.faq_answer_1 || "",
    FAQ_QUESTION_2: texts.faq_question_2 || "",
    FAQ_ANSWER_2: texts.faq_answer_2 || "",
    FAQ_QUESTION_3: texts.faq_question_3 || "",
    FAQ_ANSWER_3: texts.faq_answer_3 || "",
  };

  let finalHTML = templateHTML;

  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    finalHTML = finalHTML.replace(regex, value);
  });

  // Apply brand color overrides if provided
  if (brandData?.primary_color) {
    finalHTML = applyBrandColors(finalHTML, brandData);
  }

  // Replace logo text with image if logo URL provided
  if (brandData?.logo_url) {
    finalHTML = finalHTML.replace(
      /(<a[^>]*href="#hero"[^>]*>)([^<]+)(<\/a>)/gi,
      `$1<img src="${brandData.logo_url}" alt="${projectData.businessName}" style="height:36px;width:auto;" />$3`
    );
  }

  return finalHTML;
}

function applyBrandColors(html: string, brand: NonNullable<Parameters<typeof applyTextsToTemplate>[3]>): string {
  const p = brand.primary_color!;
  const a = brand.accent_color || p;
  const bg = brand.background_color || "#f8f9fa";
  const txt = brand.text_color || "#111827";

  // Replace template-specific hardcoded colors with brand colors
  // Elegant: #16233b -> primary, #c8a882 -> accent, #f6f2ea -> bg
  html = html.replace(/#16233b/gi, p).replace(/#0A1128/gi, p);
  html = html.replace(/#c8a882/gi, a);
  html = html.replace(/#f6f2ea/gi, bg).replace(/#f8f5ef/gi, bg);

  // Modern: #163a2d -> primary, #2d6a4f -> primary, #e8f5eb -> bg tint
  html = html.replace(/#163a2d/gi, p);
  html = html.replace(/#2d6a4f/gi, a);
  html = html.replace(/#f4f7f4/gi, bg).replace(/#e8f5eb/gi, bg);

  // Warm: #5b21b6 -> primary, #7c3aed -> accent, #fcf7fb -> bg
  html = html.replace(/#5b21b6/gi, p);
  html = html.replace(/#7c3aed/gi, a);
  html = html.replace(/#fcf7fb/gi, bg).replace(/#f7ecff/gi, bg);

  // Nutricionista Fresh: #4A7C59 -> primary, #C8A44B -> accent, #F7F5EF -> bg, #1F2A24 -> text
  html = html.replace(/#4A7C59/gi, p).replace(/#3a6347/gi, p);
  html = html.replace(/#C8A44B/gi, a);
  html = html.replace(/#F7F5EF/gi, bg).replace(/#EEECE5/gi, bg);
  html = html.replace(/#1F2A24/gi, txt);

  // Replace fonts if provided
  if (brand.font_display && brand.font_body) {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${brand.font_display.replace(/ /g, "+")}:wght@400;500;600;700;800&family=${brand.font_body.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;
    html = html.replace(
      /https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+/g,
      fontUrl
    );
    html = html.replace(
      /font-family:\s*'[^']+',\s*serif/g,
      `font-family: '${brand.font_display}', serif`
    );
    html = html.replace(
      /font-family:\s*'[^']+',\s*sans-serif/g,
      `font-family: '${brand.font_body}', sans-serif`
    );
  }

  return html;
}
