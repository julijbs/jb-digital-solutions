import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const unavailableMessage = "Esta prévia expirou ou não está mais disponível.";

export default function ProspectPreview() {
  const { previewKey = "" } = useParams();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setLoading(true);
    setUnavailable(false);
    const separator = previewKey.lastIndexOf("-");
    const slug = previewKey.slice(0, separator);
    const token = previewKey.slice(separator + 1);

    if (!slug || !/^[0-9a-f]{64}$/.test(token)) {
      setLoading(false);
      setUnavailable(true);
      return () => {
        cancelled = true;
      };
    }

    void supabase.functions.invoke("get-prospect-preview", {
      body: { slug, token },
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (error || typeof data?.html !== "string") {
        setUnavailable(true);
      } else {
        setHtml(data.html);
      }
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setUnavailable(true);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [previewKey]);

  return (
    <>
      <Helmet>
        <title>Prévia de site | JB Digital System</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {html ? (
        <iframe
          srcDoc={html}
          title="Prévia de conceito de site"
          className="fixed inset-0 h-full w-full border-0 bg-white"
          sandbox="allow-popups allow-popups-to-escape-sandbox"
        />
      ) : (
        <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
          <div className="max-w-md space-y-3">
            {loading ? (
              <>
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Carregando prévia...</p>
              </>
            ) : unavailable ? (
              <>
                <h1 className="text-xl font-semibold text-foreground">Prévia indisponível</h1>
                <p className="text-sm text-muted-foreground">{unavailableMessage}</p>
              </>
            ) : null}
          </div>
        </main>
      )}
    </>
  );
}
