import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Palette, Eye, Copy, Star } from "lucide-react";

const defaultTemplates = [
  {
    id: "elegant-minimal",
    name: "Elegante Minimalista",
    emoji: "🎨",
    description: "Estilo sofisticado com muito espaço em branco, tipografia serif refinada e layout limpo.",
    colors: ["#1a1a2e", "#e2c08d", "#f5f5f5"],
    tags: ["Psicólogos", "Terapeutas"],
    popular: true,
  },
  {
    id: "modern-clean",
    name: "Moderno Clean",
    emoji: "✨",
    description: "Linhas retas, cantos arredondados, ícones modernos. Aparência tech-forward mas acessível.",
    colors: ["#0f172a", "#3b82f6", "#f8fafc"],
    tags: ["Dentistas", "Médicos"],
    popular: false,
  },
  {
    id: "warm-soft",
    name: "Acolhedor Suave",
    emoji: "🌿",
    description: "Cores pastéis, formas orgânicas, fontes humanistas. Transmite calma e confiança.",
    colors: ["#1a3c34", "#22c55e", "#f0fdf4"],
    tags: ["Nutricionistas", "Terapeutas"],
    popular: true,
  },
];

const AdminTemplates = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Templates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Galeria de templates disponíveis para geração de sites
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
            <div className="h-32 relative" style={{
              background: `linear-gradient(135deg, ${tmpl.colors[0]} 0%, ${tmpl.colors[0]} 60%, ${tmpl.colors[1]} 100%)`
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{tmpl.emoji}</span>
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

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {tmpl.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => toast({ title: "Em breve", description: "Preview de template será implementado" })}
                >
                  <Eye size={12} /> Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => toast({ title: "Em breve", description: "Duplicação de template será implementada" })}
                >
                  <Copy size={12} /> Duplicar
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
