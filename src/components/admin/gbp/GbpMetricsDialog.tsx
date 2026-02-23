import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { GbpMetrics, sumMetricValues } from "./GbpLocationCard";

interface GbpMetricsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: GbpMetrics | null;
}

const GbpMetricsDialog = ({ open, onOpenChange, metrics }: GbpMetricsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Métricas — {metrics?.location?.title}</DialogTitle>
          <DialogDescription>Últimos 30 dias</DialogDescription>
        </DialogHeader>
        {metrics?.metrics?.length ? (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {metrics.metrics.map((m: any, i: number) => {
              const metric = m?.dailyMetricTimeSeries;
              const label = metric?.dailyMetric?.replace(/_/g, " ") || `Métrica ${i + 1}`;
              const values = metric?.timeSeries?.datedValues || [];
              const total = sumMetricValues(values);
              return (
                <div key={i} className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{label.toLowerCase()}</p>
                  <p className="text-lg font-semibold text-foreground mt-1">{total.toLocaleString("pt-BR")}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Sem métricas disponíveis.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GbpMetricsDialog;
