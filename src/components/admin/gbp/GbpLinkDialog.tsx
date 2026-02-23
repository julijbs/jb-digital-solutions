import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GbpLocation } from "./GbpLocationCard";

interface GbpLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: GbpLocation | null;
  projects: any[];
  onLinked: () => void;
}

const GbpLinkDialog = ({ open, onOpenChange, location, projects, onLinked }: GbpLinkDialogProps) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const linkGbpToProject = async (projectId: string) => {
    if (!location) return;
    setSaving(true);
    try {
      const gbpUrl = `https://business.google.com/dashboard/l/${location.name.split("/").pop()}`;
      const { error } = await supabase
        .from("projects")
        .update({ gbp_url: gbpUrl })
        .eq("id", projectId);
      if (error) throw error;
      toast({ title: "GBP vinculado!", description: `Perfil "${location.title}" vinculado ao projeto.` });
      onOpenChange(false);
      onLinked();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      toast({ title: "Erro ao vincular", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vincular "{location?.title}" a um projeto</DialogTitle>
          <DialogDescription>
            Selecione o projeto ao qual deseja vincular esta localização GBP.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {projects.map((p) => (
            <button
              key={p.id}
              className="w-full flex items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-accent/50 transition-colors"
              disabled={saving}
              onClick={() => linkGbpToProject(p.id)}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(p.clients as any)?.business_name}
                  {p.gbp_url && " • ⚠️ já tem GBP vinculado"}
                </p>
              </div>
              {saving && <Loader2 size={14} className="animate-spin" />}
            </button>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum projeto encontrado.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GbpLinkDialog;
