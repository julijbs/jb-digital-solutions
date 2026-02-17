import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import jbLogo from "@/assets/jb-logo.jpg";

const navItems = [
  { label: "Solução", href: "#solucao" },
  { label: "AEO + IA", href: "#aeo" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <a href="#" className="flex items-center gap-2">
          <img src={jbLogo} alt="JB Digital Consulting" className="h-9 w-auto rounded-lg" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="heroOutline" size="sm" onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}>Ver planos</Button>
          <Button variant="hero" size="sm" onClick={() => navigate("/signup")}>Começar agora</Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button variant="hero" className="mt-2 w-full" onClick={() => { setMobileOpen(false); navigate("/signup"); }}>Começar agora</Button>
          </div>
        </div>
      )}
    </header>
  );
};
