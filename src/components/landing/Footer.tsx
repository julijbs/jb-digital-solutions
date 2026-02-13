const links = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "O que entregamos", href: "#entregaveis" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient-bg">
              <span className="text-xs font-bold text-primary-foreground">JB</span>
            </div>
            <span className="font-serif text-foreground">JB Digital Consulting</span>
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

          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/60 md:items-end">
            <span>contato@jbdigital.com</span>
            <span>(11) 99999-9999</span>
          </div>
        </div>

        <div className="section-divider mx-auto my-8 max-w-full" />

        <p className="text-center text-xs leading-relaxed text-muted-foreground/50">
          A JB Digital Consulting não promete resultados garantidos — entregamos estrutura, processo e execução técnica.
        </p>
      </div>
    </footer>
  );
};
