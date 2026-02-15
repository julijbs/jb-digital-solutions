import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Check, Loader2, CreditCard, Globe, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DomainSearchResult } from "@/types/app";

interface DomainPurchaseFlowProps {
  projectId: string;
  onComplete?: (domain: string) => void;
}

export function DomainPurchaseFlow({ projectId, onComplete }: DomainPurchaseFlowProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<DomainSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<DomainSearchResult[]>([]);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAvailability = async () => {
    if (!searchTerm.trim()) {
      toast({ title: "Digite um domínio", variant: "destructive" });
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("domain-check", {
        body: { domain: searchTerm.trim().toLowerCase() },
      });

      if (error) throw error;
      if (data.success) {
        setResults(data.domains);
        setSuggestions(data.suggestions || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Erro ao buscar domínio", description: err.message, variant: "destructive" });
    }
    setSearching(false);
  };

  const handlePurchase = async (domain: string, price: number) => {
    setPurchasing(domain);
    try {
      const { data, error } = await supabase.functions.invoke("domain-create-checkout", {
        body: { domain, price, projectId },
      });

      if (error) throw error;
      if (data.success && data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Erro ao processar pagamento", description: err.message, variant: "destructive" });
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            <CardTitle className="text-lg">Registrar Domínio Personalizado</CardTitle>
          </div>
          <CardDescription>
            Busque e registre um domínio diretamente pela plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="meudominio"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAvailability()}
              className="flex-1"
            />
            <Button onClick={checkAvailability} disabled={searching} variant="hero" size="sm">
              {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Buscar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Buscaremos automaticamente .com, .net, .org e .co
          </p>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Domínios encontrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.map((result) => {
              const priceInBRL = Math.ceil(result.price * 5);
              const totalPrice = priceInBRL + 50;

              return (
                <div
                  key={result.name}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    result.available
                      ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                      : "border-border bg-muted/30 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.available ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-destructive" />
                    )}
                    <span className="font-medium text-foreground">{result.name}</span>
                  </div>

                  {result.available ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">R$ {totalPrice}</p>
                        <p className="text-xs text-muted-foreground">
                          Renovação: R$ {priceInBRL}/ano
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="hero"
                        disabled={purchasing !== null}
                        onClick={() => handlePurchase(result.name, result.price)}
                      >
                        {purchasing === result.name ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CreditCard size={14} />
                        )}
                        Comprar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Indisponível</span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search size={18} className="text-primary" />
              <CardTitle className="text-base">Sugestões disponíveis</CardTitle>
            </div>
            <CardDescription>
              O domínio buscado não está disponível. Veja alternativas semelhantes:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((result) => {
              const priceInBRL = Math.ceil(result.price * 5);
              const totalPrice = priceInBRL + 50;
              return (
                <div
                  key={result.name}
                  className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 hover:border-primary/40 p-3 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span className="font-medium text-foreground">{result.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">R$ {totalPrice}</p>
                      <p className="text-xs text-muted-foreground">Renovação: R$ {priceInBRL}/ano</p>
                    </div>
                    <Button
                      size="sm"
                      variant="hero"
                      disabled={purchasing !== null}
                      onClick={() => handlePurchase(result.name, result.price)}
                    >
                      {purchasing === result.name ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CreditCard size={14} />
                      )}
                      Comprar
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
