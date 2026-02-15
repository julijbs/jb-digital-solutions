import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Palette, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultTemplates = [
  {
    id: "elegant-minimal",
    name: "Elegante Minimalista",
    emoji: "🎨",
    description: "Sofisticado, limpo e espaçoso. Tipografia serif (DM Serif Display) + Inter. Ideal para transmitir autoridade e confiança.",
    colors: ["#0A1128", "#C8A882", "#f8f9fa"],
    tags: ["Psicólogos", "Terapeutas", "Coaches"],
    popular: true,
    fonts: "DM Serif Display + Inter",
  },
  {
    id: "modern-clean",
    name: "Moderno Clean",
    emoji: "✨",
    description: "Contemporâneo e enérgico. Tipografia Poppins + Inter. Layout em grid, cantos arredondados, estilo tech-forward.",
    colors: ["#2D6A4F", "#40916C", "#f0fdf4"],
    tags: ["Nutricionistas", "Personal Trainers", "Wellness"],
    popular: false,
    fonts: "Poppins + Inter",
  },
  {
    id: "warm-soft",
    name: "Acolhedor Suave",
    emoji: "🌿",
    description: "Caloroso e empático. Tipografia Playfair Display + Open Sans. Formas orgânicas, bordas suaves, tons pastéis.",
    colors: ["#5A189A", "#9D4EDD", "#faf5ff"],
    tags: ["Terapeutas Holísticos", "Consteladores", "Coaches de Vida"],
    popular: true,
    fonts: "Playfair Display + Open Sans",
  },
];

const AdminTemplates = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            3 templates base para geração de sites com IA — cada um com personalidade visual distinta
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast({ title: "Em breve", description: "Criação de templates customizados será disponibilizada" })}
        >
          <Palette size={14} /> Criar Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {defaultTemplates.map((tmpl) => (
          <div key={tmpl.id} className="glass-card-hover rounded-xl overflow-hidden">
            {/* Color preview header */}
            <div className="h-36 relative" style={{
              background: `linear-gradient(135deg, ${tmpl.colors[0]} 0%, ${tmpl.colors[0]} 50%, ${tmpl.colors[1]} 100%)`
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">{tmpl.emoji}</span>
              </div>
              {tmpl.popular && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  <Star size={10} /> Popular
                </div>
              )}
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-serif text-lg text-foreground">{tmpl.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tmpl.description}</p>
              </div>

              {/* Color swatches */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Cores:</span>
                <div className="flex -space-x-1">
                  {tmpl.colors.map((c, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 rounded-full border-2 border-card"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Fontes:</span>
                <span className="text-[10px] text-foreground">{tmpl.fonts}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {tmpl.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 text-xs gap-1.5"
                  onClick={() => navigate(`/admin/site-generator`)}
                >
                  <Eye size={12} /> Usar no Gerador
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminTemplates;
