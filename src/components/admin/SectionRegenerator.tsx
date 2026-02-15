import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero / Headline",
  pain_section: "Seção de Dores",
  about: "Sobre",
  services: "Serviços",
  process: "Como Funciona",
  testimonials: "Depoimentos",
  cta_final: "CTA Final",
};

interface SectionRegeneratorProps {
  section: string;
  currentContent: any;
  onRegenerate: (section: string, newContent: any) => void;
  onClose: () => void;
}

export function SectionRegenerator({
  section,
  currentContent,
  onRegenerate,
  onClose,
}: SectionRegeneratorProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("regenerate-section", {
        body: { section, currentContent, customPrompt },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      onRegenerate(section, data.newContent);
      toast({ title: "Seção refinada com sucesso!" });
      onClose();
    } catch (err: any) {
      toast({
        title: "Erro ao refinar",
        description: err.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            Refinar: {SECTION_LABELS[section] || section}
          </span>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {section}
        </Badge>
      </div>

      <div className="rounded-md bg-muted/50 p-2.5 max-h-24 overflow-auto">
        <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap">
          {JSON.stringify(currentContent, null, 2)}
        </pre>
      </div>

      <Textarea
        placeholder="Descreva o que deseja mudar... (ex: 'Tornar mais emocional', 'Focar mais em ansiedade')"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        rows={2}
        className="text-sm"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleRegenerate}
          disabled={regenerating}
          size="sm"
          className="flex-1 gap-1.5"
        >
          {regenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Regerando…
            </>
          ) : (
            <>
              <RotateCcw size={14} />
              Regerar Seção
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={regenerating}>
          Cancelar
        </Button>
      </div>
    </Card>
  );
}
