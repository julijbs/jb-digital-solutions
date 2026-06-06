import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import jbLogo from "@/assets/jb-logo.jpg";

export interface NavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  navItems: NavItem[];
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

function NavLink({ item }: { item: NavItem }) {
  if (item.href.startsWith("#")) {
    return (
      <a
        href={item.href}
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {item.label}
      </a>
    );
  }
  if (item.href.startsWith("http")) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link
      to={item.href}
      className="text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      {item.label}
    </Link>
  );
}

function CtaButton({
  label,
  href,
  variant,
  size = "sm",
  className = "",
}: {
  label: string;
  href: string;
  variant: "hero" | "heroOutline";
  size?: "sm" | "default";
  className?: string;
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (href.startsWith("#")) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };
  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      {label}
    </Button>
  );
}

export const SiteHeader = ({ navItems, ctaPrimary, ctaSecondary }: SiteHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={jbLogo} alt="JB Digital Consulting" className="h-9 w-auto rounded-lg" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {ctaSecondary && (
            <CtaButton label={ctaSecondary.label} href={ctaSecondary.href} variant="heroOutline" />
          )}
          {ctaPrimary && (
            <CtaButton label={ctaPrimary.label} href={ctaPrimary.href} variant="hero" />
          )}
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
              <span key={item.href} onClick={() => setMobileOpen(false)}>
                <NavLink item={item} />
              </span>
            ))}
            {ctaPrimary && (
              <CtaButton
                label={ctaPrimary.label}
                href={ctaPrimary.href}
                variant="hero"
                size="default"
                className="mt-2 w-full"
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
};
