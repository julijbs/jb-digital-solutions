export interface InstagramMedia {
  id: string;
  caption: string;
  mediaUrl: string | null;
  permalink: string | null;
}

export interface InstagramProfile {
  username: string;
  name: string;
  biography: string;
  website: string | null;
  profilePictureUrl: string | null;
  media: InstagramMedia[];
}

export interface ProspectService {
  name: string;
  evidence: string;
}

export interface ProspectSiteContent {
  headline: {
    text: string;
    evidence: string;
  } | null;
  services: ProspectService[];
  theme: {
    primary: string;
    accent: string;
    background: string;
  };
}

const FALLBACK_THEME = {
  primary: "#3e5c76",
  accent: "#8a5a33",
  background: "#f4f2ed",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function safeInstagramImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isMetaCdn =
      host.endsWith(".cdninstagram.com") ||
      host === "cdninstagram.com" ||
      host.endsWith(".fbcdn.net") ||
      host === "fbcdn.net";
    return url.protocol === "https:" && isMetaCdn ? url.toString() : null;
  } catch {
    return null;
  }
}

function safeInstagramPermalink(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["instagram.com", "www.instagram.com"].includes(url.hostname.toLowerCase())
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function safeWebsiteUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function extractInstagramUsername(input: string): string {
  let url: URL;
  try {
    url = new URL(input.includes("://") ? input : `https://${input}`);
  } catch {
    throw new Error("Informe uma URL válida de perfil do Instagram.");
  }

  if (!["instagram.com", "www.instagram.com"].includes(url.hostname.toLowerCase())) {
    throw new Error("Use uma URL de perfil do Instagram.");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const username = segments[0] ?? "";
  if (
    segments.length !== 1 ||
    !/^[a-zA-Z0-9._]{1,30}$/.test(username) ||
    ["p", "reel", "reels", "stories", "explore", "accounts"].includes(username.toLowerCase())
  ) {
    throw new Error("Informe o link direto do perfil, não de uma publicação.");
  }

  return username.toLowerCase();
}

export function normalizeInstagramProfile(
  account: unknown,
  requestedUsername: string,
): InstagramProfile {
  if (!isRecord(account)) {
    throw new Error("O Instagram não retornou um perfil profissional acessível.");
  }

  const username = text(account.username, 30) || requestedUsername;
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
    throw new Error("O Instagram retornou um nome de usuário inválido.");
  }

  const mediaField = isRecord(account.media) ? account.media : {};
  const mediaItems = Array.isArray(mediaField.data) ? mediaField.data.slice(0, 6) : [];
  const media = mediaItems.filter(isRecord).map((item, index) => ({
    id: text(item.id, 100) || `post-${index + 1}`,
    caption: text(item.caption, 2000),
    mediaUrl: safeInstagramImageUrl(item.media_url) ??
      safeInstagramImageUrl(item.thumbnail_url),
    permalink: safeInstagramPermalink(item.permalink),
  }));

  return {
    username: username.toLowerCase(),
    name: text(account.name, 120),
    biography: text(account.biography, 2200),
    website: safeWebsiteUrl(account.website),
    profilePictureUrl: safeInstagramImageUrl(account.profile_picture_url),
    media,
  };
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)!.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first: string, second: string): number {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function safeHexColor(
  value: unknown,
  fallback: string,
  isSuitable?: (luminance: number) => boolean,
): string {
  if (typeof value !== "string" || !/^#[\da-f]{6}$/i.test(value)) return fallback;
  const color = value.toLowerCase();
  return !isSuitable || isSuitable(luminance(color)) ? color : fallback;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

function readableAccent(accent: string, background: string): string {
  const channels = accent.slice(1).match(/.{2}/g)!.map((channel) =>
    Number.parseInt(channel, 16)
  );
  for (let amount = 0; amount <= 0.9; amount += 0.05) {
    const candidate = `#${channels.map((channel) =>
      Math.round(channel * (1 - amount)).toString(16).padStart(2, "0")
    ).join("")}`;
    if (contrastRatio(candidate, background) >= 4.5) return candidate;
  }
  return "#8a5a33";
}

function contrastColor(hex: string): string {
  return contrastRatio(hex, "#ffffff") >= contrastRatio(hex, "#1b1b19")
    ? "#ffffff"
    : "#1b1b19";
}

function jsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function normalizeProspectSiteContent(
  value: unknown,
  profile: InstagramProfile,
): ProspectSiteContent {
  if (!isRecord(value) || !Array.isArray(value.services) || !isRecord(value.theme)) {
    throw new Error("A IA retornou conteúdo incompleto para a prévia.");
  }

  const source = normalizeText(
    [profile.biography, ...profile.media.map((item) => item.caption)].join(" "),
  );
  const headlineRecord = isRecord(value.headline) ? value.headline : null;
  const headlineText = headlineRecord ? text(headlineRecord.text, 110) : "";
  const headlineEvidence = headlineRecord ? text(headlineRecord.evidence, 300) : "";
  const normalizedHeadline = normalizeText(headlineText);
  const normalizedHeadlineEvidence = normalizeText(headlineEvidence);
  const headline =
    normalizedHeadline.length >= 8 &&
      normalizedHeadlineEvidence.length >= 12 &&
      source.includes(normalizedHeadlineEvidence) &&
      normalizedHeadlineEvidence.includes(normalizedHeadline)
      ? { text: headlineText, evidence: headlineEvidence }
      : null;

  const services = value.services
    .filter(isRecord)
    .map((item) => ({
      name: text(item.name, 80),
      evidence: text(item.evidence, 240),
    }))
    .filter(({ name, evidence }) => {
      const normalizedName = normalizeText(name);
      const normalizedEvidence = normalizeText(evidence);
      return (
        normalizedName.length >= 3 &&
        normalizedEvidence.length >= 8 &&
        source.includes(normalizedEvidence) &&
        normalizedEvidence.includes(normalizedName)
      );
    })
    .filter((service, index, list) =>
      list.findIndex((candidate) =>
        normalizeText(candidate.name) === normalizeText(service.name)
      ) === index
    )
    .slice(0, 6);

  const background = safeHexColor(
    value.theme.background,
    FALLBACK_THEME.background,
    (colorLuminance) => colorLuminance > 0.78,
  );
  const candidatePrimary = safeHexColor(
    value.theme.primary,
    FALLBACK_THEME.primary,
    (colorLuminance) => colorLuminance < 0.3,
  );
  const primary = contrastRatio(candidatePrimary, background) >= 4.5
    ? candidatePrimary
    : FALLBACK_THEME.primary;
  const accent = safeHexColor(value.theme.accent, FALLBACK_THEME.accent);

  return {
    headline,
    services,
    theme: { primary, accent, background },
  };
}

export function renderProspectSiteHtml(
  profile: InstagramProfile,
  content: ProspectSiteContent,
): string {
  const rawName = profile.name || `@${profile.username}`;
  const businessName = escapeHtml(rawName);
  const username = escapeHtml(profile.username);
  const bio = escapeHtml(profile.biography);
  const instagramUrl = `https://www.instagram.com/${encodeURIComponent(profile.username)}/`;
  const safeBackground = content.theme.background;
  const safeAccent = readableAccent(content.theme.accent, safeBackground);
  const heroHeading = escapeHtml(
    content.headline?.text || content.services[0]?.name || rawName,
  );
  const heroSummary = content.services.length
    ? `O perfil apresenta ${content.services.map(({ name }) => escapeHtml(name)).join(", ")}.`
    : "";
  const photoItems = profile.media.filter((item) => item.mediaUrl);
  const heroMedia = photoItems[0] ?? null;
  const heroImageUrl = heroMedia?.mediaUrl ?? profile.profilePictureUrl;
  const remainingMedia = photoItems.filter((item) =>
    item.mediaUrl !== heroMedia?.mediaUrl
  );
  const aboutMedia = bio ? remainingMedia[0] ?? null : null;
  const galleryMedia = aboutMedia ? remainingMedia.slice(1) : remainingMedia;
  const heroFigure = heroImageUrl
    ? `<figure class="hero-figure">
        <img src="${escapeHtml(heroImageUrl)}"
          alt="${escapeHtml(heroMedia?.caption.slice(0, 120) || `Imagem compartilhada por @${profile.username}`)}"
          fetchpriority="high">
      </figure>`
    : "";
  const aboutFigure = aboutMedia?.mediaUrl
    ? `<figure class="about-figure">
        <img src="${escapeHtml(aboutMedia.mediaUrl)}"
          alt="${escapeHtml(aboutMedia.caption.slice(0, 120) || `Publicação de @${profile.username}`)}"
          loading="lazy">
      </figure>`
    : "";
  const serviceRows = content.services.map(({ name, evidence }, index) => `
    <article class="service-row">
      <span class="service-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(evidence)}</p>
      </div>
    </article>`).join("");
  const gallery = galleryMedia.length
    ? `<section class="section gallery" id="publicacoes">
        <div class="section-wrap">
          <div class="section-heading">
            <p class="eyebrow">Instagram · @${username}</p>
            <h2>Publicações recentes</h2>
          </div>
          <div class="gallery-grid">
            ${galleryMedia.map((item) => {
              const image = `<img src="${escapeHtml(item.mediaUrl!)}"
                alt="${escapeHtml(item.caption.slice(0, 120) || `Publicação de @${profile.username}`)}"
                loading="lazy">`;
              return item.permalink
                ? `<a class="gallery-item" href="${escapeHtml(item.permalink)}" target="_blank" rel="noopener noreferrer">${image}</a>`
                : `<div class="gallery-item">${image}</div>`;
            }).join("")}
          </div>
        </div>
      </section>`
    : "";
  const servicesSection = content.services.length
    ? `<section class="section services" id="servicos">
        <div class="section-wrap">
          <div class="section-heading">
            <p class="eyebrow">Serviços apresentados no perfil</p>
            <h2>Como posso ajudar</h2>
          </div>
          <div class="services-list">${serviceRows}</div>
        </div>
      </section>`
    : "";
  const aboutSection = bio
    ? `<section class="section about" id="sobre">
        <div class="section-wrap about-grid">
          ${aboutFigure}
          <div class="about-copy">
            <p class="eyebrow">Sobre</p>
            <h2>${businessName}</h2>
            <p>${bio}</p>
            <a class="text-link" href="${instagramUrl}" target="_blank" rel="noopener noreferrer">Ver perfil no Instagram <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>`
    : "";
  const faq = content.services.length
    ? `<section class="section faq" id="duvidas">
        <div class="section-wrap faq-wrap">
          <div>
            <p class="eyebrow">Informações</p>
            <h2>O que aparece neste perfil?</h2>
          </div>
          <details>
            <summary>Quais serviços são apresentados?</summary>
            <p>O perfil apresenta: ${content.services.map(({ name }) => escapeHtml(name)).join(", ")}.</p>
          </details>
        </div>
      </section>`
    : "";
  const sourceDescription = profile.biography ||
    (content.services.length
      ? content.services.map(({ name }) => name).join(", ")
      : `Perfil profissional no Instagram: @${profile.username}`);
  const description = escapeHtml(sourceDescription.slice(0, 155));
  const jsonLd = jsonForHtml({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: rawName,
    description: sourceDescription,
    url: instagramUrl,
    ...(heroImageUrl ? { image: heroImageUrl } : {}),
    sameAs: [instagramUrl],
  });
  const faqJsonLd = content.services.length
    ? jsonForHtml({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{
        "@type": "Question",
        name: `Quais serviços aparecem no perfil de ${rawName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `O perfil apresenta: ${content.services.map(({ name }) => name).join(", ")}.`,
        },
      }],
    })
    : "";

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="description" content="${description}">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https://*.cdninstagram.com https://cdninstagram.com https://*.fbcdn.net https://fbcdn.net; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'">
  <title>${businessName} | Prévia de site</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">${jsonLd}</script>
  ${faqJsonLd ? `<script type="application/ld+json">${faqJsonLd}</script>` : ""}
  <style>
    :root {
      --primary: ${content.theme.primary};
      --accent: ${content.theme.accent};
      --accent-ink: ${safeAccent};
      --paper: ${safeBackground};
      --ink: #1e2733;
      --muted: #5a6475;
      --line: color-mix(in srgb, var(--primary) 18%, transparent);
      --display: "Fraunces", Georgia, serif;
      --body: "Inter", system-ui, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: var(--body); line-height: 1.65; }
    a { color: inherit; }
    img { display: block; max-width: 100%; }
    .skip-link { position: absolute; top: -100%; left: 1rem; z-index: 20; padding: .6rem 1rem; background: var(--primary); color: #fff; }
    .skip-link:focus { top: 1rem; }
    .site-header { position: relative; z-index: 2; border-bottom: 1px solid var(--line); }
    .header-inner, .section-wrap { width: min(100% - 3rem, 1120px); margin-inline: auto; }
    .header-inner { min-height: 80px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .wordmark { color: var(--primary); font: 600 1.3rem/1.1 var(--display); text-decoration: none; }
    .nav-links { display: flex; align-items: center; gap: 1.8rem; }
    .nav-links a, .text-link { color: var(--primary); font-size: .88rem; font-weight: 600; text-decoration: none; }
    .nav-links a:hover, .text-link:hover { color: var(--accent-ink); }
    .button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: .55rem; padding: .7rem 1.2rem; border: 1px solid var(--primary); border-radius: 6px; background: var(--primary); color: ${contrastColor(content.theme.primary)}; font-size: .9rem; font-weight: 600; text-decoration: none; transition: transform .2s, background .2s; }
    .button:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--primary) 88%, #fff); }
    .button-secondary { background: transparent; color: var(--primary); }
    .button-secondary:hover { color: var(--primary); background: color-mix(in srgb, var(--primary) 7%, transparent); }
    .hero { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(260px, .92fr); align-items: center; gap: clamp(2.5rem, 6vw, 5.5rem); padding-block: clamp(4rem, 8vw, 7rem); }
    .concept-note { display: inline-flex; margin: 0 0 1.2rem; padding: .32rem .65rem; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: .68rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
    .eyebrow { margin: 0 0 .85rem; color: var(--accent-ink); font-size: .74rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    h1, h2, h3 { margin-top: 0; color: var(--primary); font-family: var(--display); font-weight: 500; line-height: 1.12; }
    h1 { max-width: 680px; margin-bottom: 1.2rem; font-size: clamp(2.6rem, 5.2vw, 4.8rem); letter-spacing: -.035em; }
    h2 { margin-bottom: 1rem; font-size: clamp(2rem, 3.8vw, 3.25rem); letter-spacing: -.025em; }
    h3 { margin-bottom: .35rem; font-size: clamp(1.25rem, 2vw, 1.65rem); }
    .hero-summary { max-width: 600px; margin: 0; color: var(--muted); font-size: clamp(1rem, 1.5vw, 1.13rem); }
    .hero-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 2rem; }
    .hero-meta { margin: 1.3rem 0 0; color: var(--muted); font-size: .78rem; }
    .hero-figure { position: relative; margin: 0; padding: 0 0 1.1rem 1.1rem; }
    .hero-figure::before { position: absolute; inset: 12% 0 0 12%; border: 1px solid var(--accent); content: ""; }
    .hero-figure img { position: relative; width: 100%; max-height: 610px; aspect-ratio: 4 / 5; object-fit: cover; object-position: center; }
    .section { padding-block: clamp(4rem, 8vw, 6.5rem); }
    .section-heading { max-width: 740px; margin-bottom: 2.5rem; }
    .services { background: color-mix(in srgb, #fff 62%, var(--paper)); }
    .services-list { border-top: 1px solid var(--line); }
    .service-row { display: grid; grid-template-columns: 3.5rem minmax(0, 1fr); gap: 1.2rem; padding: 1.6rem 0; border-bottom: 1px solid var(--line); }
    .service-number { padding-top: .2rem; color: var(--accent-ink); font-size: .9rem; font-weight: 600; }
    .service-row p { max-width: 780px; margin: .4rem 0 0; color: var(--muted); font-size: .96rem; }
    .about { background: #fff; }
    .about-grid { display: grid; grid-template-columns: minmax(220px, .8fr) minmax(0, 1.2fr); align-items: center; gap: clamp(2rem, 7vw, 6rem); }
    .about-figure { margin: 0; }
    .about-figure img { width: 100%; max-height: 520px; aspect-ratio: 4 / 5; object-fit: cover; }
    .about-copy p:not(.eyebrow) { max-width: 640px; color: var(--muted); white-space: pre-line; }
    .text-link { display: inline-flex; gap: .5rem; margin-top: .7rem; }
    .gallery { background: #fff; }
    .gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .9rem; }
    .gallery-item { display: block; overflow: hidden; aspect-ratio: 1; background: color-mix(in srgb, var(--primary) 8%, white); }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s; }
    .gallery-item:hover img { transform: scale(1.035); }
    .faq { border-top: 1px solid var(--line); }
    .faq-wrap { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 3rem; align-items: start; }
    .faq details { padding: 1rem 0; border-top: 1px solid var(--line); }
    .faq summary { color: var(--primary); cursor: pointer; font-weight: 600; }
    .faq details p { margin-bottom: 0; color: var(--muted); }
    .closing { padding-block: clamp(3.5rem, 7vw, 5.5rem); background: var(--primary); color: ${contrastColor(content.theme.primary)}; }
    .closing-inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .closing h2 { max-width: 680px; margin-bottom: 0; color: inherit; }
    .closing .eyebrow { color: color-mix(in srgb, var(--paper) 78%, white); }
    .closing .button { flex: 0 0 auto; border-color: #fff; background: #fff; color: var(--primary); }
    footer { padding-block: 1.5rem; color: var(--muted); font-size: .74rem; }
    .footer-inner { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .footer-inner p { margin: 0; }
    @media (max-width: 760px) {
      .header-inner, .section-wrap { width: min(100% - 2rem, 1120px); }
      .header-inner { min-height: 68px; }
      .nav-links { display: none; }
      .hero { grid-template-columns: 1fr; gap: 2.2rem; padding-block: 3.5rem 4rem; }
      .hero-figure { width: min(100%, 520px); margin-inline: auto; }
      .about-grid, .faq-wrap { grid-template-columns: 1fr; gap: 2rem; }
      .about-figure { width: min(100%, 420px); }
      .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .closing-inner, .footer-inner { align-items: flex-start; flex-direction: column; }
    }
    @media (max-width: 420px) {
      .hero-actions .button, .closing .button { width: 100%; }
      .service-row { grid-template-columns: 2.5rem minmax(0, 1fr); gap: .6rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main">Pular para o conteúdo</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="wordmark" href="#inicio">${businessName}</a>
      <nav class="nav-links" aria-label="Navegação principal">
        ${content.services.length ? '<a href="#servicos">Serviços</a>' : ""}
        ${bio ? '<a href="#sobre">Sobre</a>' : ""}
        ${gallery ? '<a href="#publicacoes">Publicações</a>' : ""}
      </nav>
      <a class="button" href="${instagramUrl}" target="_blank" rel="noopener noreferrer">Entrar em contato</a>
    </div>
  </header>
  <main id="main">
    <section class="hero section-wrap" id="inicio">
      <div class="hero-copy">
        <p class="concept-note">Prévia de conceito de site</p>
        <p class="eyebrow">${content.services.slice(0, 2).map(({ name }) => escapeHtml(name)).join(" · ") || `Instagram · @${username}`}</p>
        <h1>${heroHeading}</h1>
        ${heroSummary ? `<p class="hero-summary">${heroSummary}</p>` : ""}
        <div class="hero-actions">
          <a class="button" href="${instagramUrl}" target="_blank" rel="noopener noreferrer">Conversar pelo Instagram <span aria-hidden="true">↗</span></a>
          ${profile.website ? `<a class="button button-secondary" href="${escapeHtml(profile.website)}" target="_blank" rel="noopener noreferrer">Ver site atual</a>` : ""}
        </div>
        <p class="hero-meta">Perfil profissional · @${username}</p>
      </div>
      ${heroFigure}
    </section>
    ${servicesSection}
    ${aboutSection}
    ${gallery}
    ${faq}
    <section class="closing">
      <div class="section-wrap closing-inner">
        <div>
          <p class="eyebrow">Próximo passo</p>
          <h2>Conheça mais sobre ${businessName}</h2>
        </div>
        <a class="button" href="${instagramUrl}" target="_blank" rel="noopener noreferrer">Acessar Instagram <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </main>
  <footer>
    <div class="section-wrap footer-inner">
      <p>${businessName} · @${username}</p>
      <p>Prévia de conceito baseada nas informações públicas do Instagram; não representa um site oficial ou parceria confirmada.</p>
    </div>
  </footer>
</body>
</html>`;
}
