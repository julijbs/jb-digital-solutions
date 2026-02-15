import jbLogo from "@/assets/jb-logo.jpg";

const links = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <img src={jbLogo} alt="JB Digital Consulting" className="h-8 w-auto rounded-lg" />
            <span className="text-sm text-muted-foreground">
              Construindo presença digital ética e sustentável para profissionais liberais.
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
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
