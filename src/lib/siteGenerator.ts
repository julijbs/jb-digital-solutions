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

  return finalHTML;
}
