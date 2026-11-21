import { useEffect, useState, type FormEvent } from "react";
import { Copy, ExternalLink, Instagram, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProspectPreview {
  id: string;
  slug: string;
  username: string;
  name: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

interface CreatedPreview {
  id: string;
  slug: string;
  expires_at: string;
  url: string;
  html: string;
  profile: {
    username: string;
    name: string;
    biography: string;
    services: string[];
  };
}

async function callPreviewAdmin(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("create-prospect-preview", { body });
  if (error) {
    if (error.context instanceof Response) {
      const responseBody = await error.context.clone().json().catch(() => null) as { error?: unknown } | null;
      if (typeof responseBody?.error === "string") throw new Error(responseBody.error);
    }
    throw new Error(error.message || "Falha na comunicação com o servidor.");
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

function expiryLabel(preview: ProspectPreview): { label: string; tone: string } {
  if (preview.revoked_at) return { label: "Revogada", tone: "text-destructive" };
  if (Date.parse(preview.expires_at) <= Date.now()) {
    return { label: "Expirada", tone: "text-amber-600" };
  }
  return { label: "Ativa", tone: "text-emerald-600" };
}

export default function AdminProspecting() {
  const { toast } = useToast();
  const [instagramUrl, setInstagramUrl] = useState("");
  const [previews, setPreviews] = useState<ProspectPreview[]>([]);
  const [created, setCreated] = useState<CreatedPreview | null>(null);
  const [renewedLinks, setRenewedLinks] = useState<Record<string, string>>({});
  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void callPreviewAdmin({ action: "list" }).then((data) => {
      if (!cancelled) setPreviews(data.previews ?? []);
    }).catch((error: unknown) => {
      if (!cancelled) {
        setLoadError(error instanceof Error ? error.message : "Não foi possível carregar as prévias.");
      }
    }).finally(() => {
      if (!cancelled) setLoadingList(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setLoadError(null);
    setCreated(null);
    try {
      const data = await callPreviewAdmin({ action: "create", instagramUrl });
      if (!data.preview?.html || !data.preview?.url) {
        throw new Error("O servidor não retornou uma prévia completa.");
      }
      setCreated(data.preview as CreatedPreview);
      setPreviews((current) => [{
        id: data.preview.id,
        slug: data.preview.slug,
        username: data.preview.profile.username,
        name: data.preview.profile.name,
        expires_at: data.preview.expires_at,
        revoked_at: null,
        created_at: new Date().toISOString(),
      }, ...current].slice(0, 100));
      setInstagramUrl("");
      toast({ title: "Prévia criada", description: "Revise o conceito antes de compartilhar o link." });
    } catch (error) {
      toast({
        title: "Não foi possível criar a prévia",
        description: error instanceof Error ? error.message : "Erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copiado" });
    } catch {
      toast({
        title: "Não foi possível copiar",
        description: "Copie o link manualmente pelo campo exibido.",
        variant: "destructive",
      });
    }
  };

  const handleRenew = async (id: string) => {
    setBusyId(id);
    try {
      const data = await callPreviewAdmin({ action: "renew", id });
      if (typeof data.url !== "string" || typeof data.expires_at !== "string") {
        throw new Error("O servidor não retornou o novo link completo.");
      }
      setRenewedLinks((links) => ({ ...links, [id]: data.url }));
      setPreviews((current) => current.map((preview) =>
        preview.id === id ? { ...preview, expires_at: data.expires_at } : preview
      ));
      toast({ title: "Link renovado", description: "O link anterior deixou de funcionar." });
    } catch (error) {
      toast({
        title: "Não foi possível renovar o link",
        description: error instanceof Error ? error.message : "Erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm("Revogar este link? A pessoa que recebeu perderá o acesso imediatamente.")) return;
    setBusyId(id);
    try {
      await callPreviewAdmin({ action: "revoke", id });
      setRenewedLinks((links) => {
        const next = { ...links };
        delete next[id];
        return next;
      });
      setPreviews((current) => current.map((preview) =>
        preview.id === id ? { ...preview, revoked_at: new Date().toISOString() } : preview
      ));
      toast({ title: "Link revogado" });
    } catch (error) {
      toast({
        title: "Não foi possível revogar o link",
        description: error instanceof Error ? error.message : "Erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-primary/10 p-2 text-primary"><Instagram size={22} /></span>
            <div>
              <p className="text-sm text-muted-foreground">Produção / Prospecção</p>
              <h1 className="text-2xl font-bold text-foreground">Prévia de site pelo Instagram</h1>
            </div>
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Gere um conceito de site usando dados acessíveis pela API oficial do Instagram, revise e compartilhe você mesma.
            Os links expiram em 30 dias e podem ser renovados ou revogados.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-7">
          <form onSubmit={handleCreate} className="space-y-4">
            <label htmlFor="instagram-url" className="block text-sm font-medium text-foreground">
              URL do perfil profissional do Instagram
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="instagram-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://www.instagram.com/perfil/"
                value={instagramUrl}
                onChange={(event) => setInstagramUrl(event.target.value)}
                required
              />
              <Button type="submit" disabled={creating || !instagramUrl.trim()} className="shrink-0 gap-2">
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Instagram size={16} />}
                {creating ? "Gerando..." : "Gerar prévia"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              São aceitos apenas perfis profissionais públicos acessíveis ao Business Discovery da Meta. Perfis privados ou pessoais não são coletados por scraping.
            </p>
          </form>
        </section>

        {created && (
          <section className="space-y-4 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Prévia gerada</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {created.profile.name || `@${created.profile.username}`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fonte: @{created.profile.username} · expira em {new Date(created.expires_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <ShieldCheck size={16} />
                <span>Sem avaliações ou depoimentos inventados</span>
              </div>
            </div>

            {created.profile.biography && (
              <div className="rounded-lg bg-background p-3 text-sm text-muted-foreground">
                <span className="mb-1 block text-xs font-medium text-foreground">Bio importada para conferência</span>
                {created.profile.biography}
              </div>
            )}
            {created.profile.services.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Serviços identificados: {created.profile.services.join(", ")}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input readOnly value={created.url} aria-label="Link público da prévia" />
              <Button type="button" variant="outline" onClick={() => handleCopy(created.url)} className="gap-2">
                <Copy size={15} /> Copiar link
              </Button>
              <Button type="button" variant="outline" asChild className="gap-2">
                <a href={created.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={15} /> Abrir link
                </a>
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <iframe
                srcDoc={created.html}
                title="Revisão da prévia gerada"
                className="h-[620px] w-full border-0"
                sandbox="allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Pré-vias criadas</h2>
              <p className="text-sm text-muted-foreground">Por segurança, o link completo não é armazenado em texto puro. Renove para emitir outro.</p>
            </div>
            {loadingList && <Loader2 size={18} className="animate-spin text-muted-foreground" />}
          </div>

          {loadError && <p role="alert" className="text-sm text-destructive">{loadError}</p>}

          {!loadingList && previews.length === 0 && !loadError && (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nenhuma prévia criada ainda.
            </p>
          )}

          <div className="space-y-3">
            {previews.map((preview) => {
              const status = expiryLabel(preview);
              const newLink = renewedLinks[preview.id];
              return (
                <article key={preview.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-foreground">
                        {preview.name || `@${preview.username}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{preview.username} · criada em {new Date(preview.created_at).toLocaleDateString("pt-BR")}
                      </p>
                      <p className={`mt-1 text-xs font-medium ${status.tone}`}>
                        {status.label} · {status.label === "Revogada" ? "acesso encerrado" : `expira em ${new Date(preview.expires_at).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {status.label !== "Revogada" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === preview.id}
                          onClick={() => handleRenew(preview.id)}
                          className="gap-1.5"
                        >
                          {busyId === preview.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                          Emitir link
                        </Button>
                      )}
                      {status.label === "Ativa" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === preview.id}
                          onClick={() => handleRevoke(preview.id)}
                          className="gap-1.5 text-destructive hover:text-destructive"
                        >
                          <XCircle size={14} /> Revogar
                        </Button>
                      )}
                    </div>
                  </div>
                  {newLink && (
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Input readOnly value={newLink} aria-label={`Novo link para @${preview.username}`} />
                      <Button type="button" variant="outline" size="sm" onClick={() => handleCopy(newLink)} className="gap-2">
                        <Copy size={14} /> Copiar
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
