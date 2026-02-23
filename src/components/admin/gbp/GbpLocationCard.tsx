import { Button } from "@/components/ui/button";
import { MapPin, Globe, Phone, Link2, BarChart3, ImageIcon, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface GbpLocation {
  name: string;
  title: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
  };
  websiteUri?: string;
  phoneNumbers?: { primaryPhone?: string };
}

export interface GbpMetrics {
  location: GbpLocation;
  metrics: any[];
  error?: string;
}

interface GbpLocationCardProps {
  loc: GbpMetrics;
  linkedProject?: { id: string; name: string } | null;
  showLinkAction?: boolean;
  onLink?: (location: GbpLocation) => void;
  onMetrics?: (loc: GbpMetrics) => void;
}

export const sumMetricValues = (series: any[]) => {
  if (!series?.length) return 0;
  return series.reduce((acc: number, point: any) => {
    return acc + (parseInt(point?.value || "0", 10));
  }, 0);
};

const GbpLocationCard = ({ loc, linkedProject, showLinkAction = true, onLink, onMetrics }: GbpLocationCardProps) => {
  const { toast } = useToast();
  const l = loc.location;
  const addr = l.storefrontAddress;

  const totalImpressions = loc.metrics?.reduce((sum: number, m: any) => {
    const series = m?.dailyMetricTimeSeries?.timeSeries?.datedValues || [];
    return sum + sumMetricValues(series);
  }, 0) || 0;

  return (
    <div className="glass-card-hover rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{l.title}</h3>
          {addr && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              <MapPin size={10} className="inline mr-1" />
              {addr.addressLines?.join(", ")} {addr.locality && `— ${addr.locality}/${addr.administrativeArea}`}
            </p>
          )}
        </div>
        {linkedProject ? (
          <span className="shrink-0 ml-2 rounded-full px-2 py-0.5 text-xs bg-primary/10 text-primary">
            Vinculado
          </span>
        ) : (
          <span className="shrink-0 ml-2 rounded-full px-2 py-0.5 text-xs bg-secondary text-muted-foreground">
            Avulso
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        {l.websiteUri && (
          <div className="flex items-center gap-1.5 truncate">
            <Globe size={11} /> <span className="truncate">{l.websiteUri}</span>
          </div>
        )}
        {l.phoneNumbers?.primaryPhone && (
          <div className="flex items-center gap-1.5">
            <Phone size={11} /> {l.phoneNumbers.primaryPhone}
          </div>
        )}
        {linkedProject && (
          <div className="flex items-center gap-1.5 text-primary">
            <Link2 size={11} /> Projeto: {linkedProject.name}
          </div>
        )}
      </div>

      {totalImpressions > 0 && (
        <div className="rounded-lg bg-accent/30 p-3">
          <p className="text-xs text-muted-foreground mb-1">Últimos 30 dias</p>
          <p className="text-lg font-semibold text-foreground">
            {totalImpressions.toLocaleString("pt-BR")}{" "}
            <span className="text-xs font-normal text-muted-foreground">impressões</span>
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        {totalImpressions > 0 && onMetrics && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onMetrics(loc)}>
            <BarChart3 size={12} className="mr-1" /> Métricas
          </Button>
        )}
        {showLinkAction && onLink && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onLink(l)}>
            <Link2 size={12} className="mr-1" /> {linkedProject ? "Revincular" : "Vincular projeto"}
          </Button>
        )}
        <Button
          variant="ghost" size="sm" className="h-7 text-xs"
          onClick={() => toast({ title: "Em breve", description: "Gestão de fotos via API GBP" })}
        >
          <ImageIcon size={12} className="mr-1" /> Fotos
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 text-xs"
          onClick={() => toast({ title: "Em breve", description: "Gestão de avaliações via API GBP" })}
        >
          <Star size={12} className="mr-1" /> Reviews
        </Button>
      </div>
    </div>
  );
};

export default GbpLocationCard;
