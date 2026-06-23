import { Link } from "react-router-dom";
import jbLogo from "@/assets/jb-logo.jpg";

interface FooterLink {
  label: string;
  href: string;
}

interface SiteFooterProps {
  links?: FooterLink[];
  tagline?: string;
}

const defaultLinks: FooterLink[] = [
  { label: "Site + Google", href: "/servicos/site-gbp" },
  { label: "Entrar", href: "/login" },
];

export const SiteFooter = ({
  links = defaultLinks,
  tagline = "Site profissional e Google Business Profile para negócios brasileiros.",
}: SiteFooterProps) => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <img src={jbLogo} alt="JB Digital Consulting" className="h-8 w-auto rounded-lg" />
            <span className="max-w-xs text-sm text-muted-foreground">{tagline}</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) =>
              link.href.startsWith("#") || link.href.startsWith("http") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="section-divider mx-auto my-8 max-w-full" />

        <p className="text-center text-xs leading-relaxed text-muted-foreground/50">
          © 2026 JB Digital Consulting. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
