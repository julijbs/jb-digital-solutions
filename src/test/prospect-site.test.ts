import { describe, expect, it } from "vitest";
import {
  extractInstagramUsername,
  normalizeInstagramProfile,
  normalizeProspectSiteContent,
  renderProspectSiteHtml,
} from "../../supabase/functions/_shared/prospect-site";
import { generateSiteHtml } from "../utils/generateSiteTemplate";

describe("Instagram prospect preview data", () => {
  it("accepts profile URLs and rejects non-profile routes and other hosts", () => {
    expect(extractInstagramUsername("https://www.instagram.com/atelier.luz/"))
      .toBe("atelier.luz");
    expect(extractInstagramUsername("instagram.com/atelier_luz"))
      .toBe("atelier_luz");
    expect(() => extractInstagramUsername("https://instagram.com/p/abc123/"))
      .toThrow("link direto do perfil");
    expect(() => extractInstagramUsername("https://example.com/atelier"))
      .toThrow("URL de perfil");
    expect(() => extractInstagramUsername("https://instagram.com.example.com/atelier"))
      .toThrow("URL de perfil");
  });

  it("keeps only evidence-backed services, approved colors, and safe Instagram media", () => {
    const profile = normalizeInstagramProfile({
      username: "atelier.luz",
      name: "Ateliê Luz",
      biography: "Design de sobrancelhas e maquiagem profissional.",
      profile_picture_url: "javascript:alert(1)",
      website: "javascript:alert(1)",
      media: {
        data: [
          {
            id: "1",
            caption: "Design de sobrancelhas com atendimento personalizado.",
            media_type: "IMAGE",
            media_url: "https://scontent.cdninstagram.com/example.jpg",
            permalink: "https://www.instagram.com/p/example/",
          },
          {
            id: "2",
            caption: "Acesso de rastreamento",
            media_url: "https://tracker.example/image.jpg",
          },
        ],
      },
    }, "atelier.luz");

    const content = normalizeProspectSiteContent({
      services: [
        {
          name: "Design de sobrancelhas",
          evidence: "Design de sobrancelhas com atendimento personalizado.",
        },
        {
          name: "Tratamento garantido",
          evidence: "Design de sobrancelhas com atendimento personalizado.",
        },
        { name: "Procedimento avançado", evidence: "Não aparece nas fontes." },
      ],
      theme: {
        primary: "#153b35",
        accent: "url(javascript:alert(1))",
        background: "#f7f4ef",
      },
    }, profile);

    expect(content.services.map(({ name }) => name)).toEqual(["Design de sobrancelhas"]);
    expect(content.theme.accent).toBe("#8a5a33");
    expect(profile.profilePictureUrl).toBeNull();
    expect(profile.website).toBeNull();
    expect(profile.media[0].mediaUrl).toBe("https://scontent.cdninstagram.com/example.jpg");
    expect(profile.media[1].mediaUrl).toBeNull();

    const inaccessiblePalette = normalizeProspectSiteContent({
      services: [],
      theme: { primary: "#ffffff", accent: "#c27b55", background: "#000000" },
    }, profile);
    expect(inaccessiblePalette.theme.primary).toBe("#3e5c76");
    expect(inaccessiblePalette.theme.background).toBe("#f4f2ed");
  });

  it("uses only a headline phrase supported by an exact profile excerpt", () => {
    const profile = normalizeInstagramProfile({
      username: "atelier.luz",
      biography: "Cuidar da sua beleza com carinho e técnica.",
      media: { data: [] },
    }, "atelier.luz");

    const content = normalizeProspectSiteContent({
      headline: {
        text: "Cuidar da sua beleza",
        evidence: "Cuidar da sua beleza com carinho e técnica.",
      },
      services: [],
      theme: {},
    }, profile);
    const inventedHeadline = normalizeProspectSiteContent({
      headline: {
        text: "Beleza que transforma vidas",
        evidence: "Beleza que transforma vidas.",
      },
      services: [],
      theme: {},
    }, profile);

    expect(content.headline?.text).toBe("Cuidar da sua beleza");
    expect(inventedHeadline.headline).toBeNull();
  });

  it("renders escaped content, SEO metadata, and no fabricated social proof", () => {
    const profile = normalizeInstagramProfile({
      username: "atelier.luz",
      name: "</script><script>alert(1)</script>",
      biography: "Design de sobrancelhas.",
      media: { data: [] },
    }, "atelier.luz");
    const content = normalizeProspectSiteContent({
      services: [],
      theme: { primary: "#173b35", accent: "#c27b55", background: "#f7f4ef" },
    }, profile);

    const html = renderProspectSiteHtml(profile, content);
    expect(html).toContain('name="robots" content="noindex,nofollow,noarchive"');
    expect(html).toContain("&lt;/script&gt;");
    expect(html).toContain("\\u003c/script>");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("aggregateRating");
    expect(html).not.toContain("Google Review");
    expect(html).not.toContain("★★★★★");
    expect(html).toContain("@media (max-width: 420px) {\n      .hero-actions .button, .closing .button { width: 100%; }");
    expect(html).not.toContain("@media (max-width: 420px) {\n      .button { width: 100%; }");
  });
});

describe("legacy generated sites", () => {
  it.each([
    ["elegant-minimal", "Fraunces"],
    ["warm-soft", "DM Serif Display"],
    ["beauty-studio", "Cormorant Garamond"],
    ["modern-clean", "Poppins"],
    ["hospitality-warm", "Fraunces"],
  ])("renders the %s template with its own design", (template, font) => {
    const { html } = generateSiteHtml({
      businessName: "Ateliê Luz",
      vertical: "Beleza",
      city: "Curitiba",
      state: "PR",
      phone: "41999990000",
      template,
      colorScheme: template === "beauty-studio" ? "rose-editorial" : "blue-professional",
    });

    expect(html).toContain(`template-${template}`);
    expect(html).toContain(font.replaceAll(" ", "+"));
  });

  it("does not invent contact data, services, prices, process, or FAQs", () => {
    const { html } = generateSiteHtml({
      businessName: "Ateliê Luz",
      vertical: "Beleza",
      city: "",
      state: "",
      phone: "",
      email: "",
      description: "",
      services: "",
      credentials: "",
      template: "beauty-studio",
      colorScheme: "rose-editorial",
    });

    expect(html).not.toContain("5511999999999");
    expect(html).not.toContain("contato@consultorio.com.br");
    expect(html).not.toContain("Consulta Especializada");
    expect(html).not.toContain("priceRange");
    expect(html).not.toContain("data-section=\"process\"");
    expect(html).not.toContain("data-section=\"faq\"");
    expect(html).not.toContain("wa.me/");
  });

  it("does not publish fabricated reviews or a fabricated aggregate rating", () => {
    const { html } = generateSiteHtml({
      businessName: "Ateliê Luz",
      vertical: "Beleza",
      city: "Curitiba",
      state: "PR",
      phone: "41999990000",
      template: "modern-clean",
      colorScheme: "green-therapeutic",
    });

    expect(html).not.toContain("aggregateRating");
    expect(html).not.toContain("Google Review");
    expect(html).not.toContain("Fernanda Costa");
    expect(html).not.toContain("★★★★★");
  });
});
