import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Email templates
const templates: Record<string, { subject: string; html: (data: any) => string }> = {
  onboarding_step_1: {
    subject: "✅ Etapa 1 concluída — Dados do Negócio",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Olá, ${d.clientName}! 👋</h2>
        <p>Ótima notícia! A <strong>Etapa 1 (Dados do Negócio)</strong> do seu projeto <strong>${d.projectName}</strong> foi concluída.</p>
        <p>Próximo passo: preencher os dados de atendimento na Etapa 2.</p>
        <div style="margin:24px 0;padding:16px;background:#f0f4ff;border-radius:8px">
          <p style="margin:0;color:#4a5568">📊 Progresso: <strong>1 de 5 etapas</strong></p>
        </div>
        <a href="${d.dashboardUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Continuar Onboarding →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  onboarding_step_2: {
    subject: "✅ Etapa 2 concluída — Atendimento",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Progresso incrível, ${d.clientName}! 🚀</h2>
        <p>A <strong>Etapa 2 (Atendimento)</strong> está pronta. Faltam apenas 3 etapas.</p>
        <div style="margin:24px 0;padding:16px;background:#f0f4ff;border-radius:8px">
          <p style="margin:0;color:#4a5568">📊 Progresso: <strong>2 de 5 etapas</strong></p>
        </div>
        <a href="${d.dashboardUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Próxima Etapa →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  onboarding_step_3: {
    subject: "✅ Etapa 3 concluída — Serviços",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Metade do caminho, ${d.clientName}! 🎯</h2>
        <p>A <strong>Etapa 3 (Serviços)</strong> foi concluída. Restam apenas 2 etapas!</p>
        <div style="margin:24px 0;padding:16px;background:#f0f4ff;border-radius:8px">
          <p style="margin:0;color:#4a5568">📊 Progresso: <strong>3 de 5 etapas</strong></p>
        </div>
        <a href="${d.dashboardUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Enviar Fotos →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  onboarding_step_4: {
    subject: "✅ Etapa 4 concluída — Fotos",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Quase lá, ${d.clientName}! 📸</h2>
        <p>Fotos recebidas! Falta apenas a <strong>última etapa</strong>: Conexão Google.</p>
        <div style="margin:24px 0;padding:16px;background:#f0f4ff;border-radius:8px">
          <p style="margin:0;color:#4a5568">📊 Progresso: <strong>4 de 5 etapas</strong></p>
        </div>
        <a href="${d.dashboardUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Finalizar Onboarding →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  onboarding_complete: {
    subject: "🎉 Onboarding completo! Seu site está sendo criado",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Parabéns, ${d.clientName}! 🎉</h2>
        <p>Todas as 5 etapas foram concluídas. Nosso time já está trabalhando no seu projeto <strong>${d.projectName}</strong>.</p>
        <p>Você receberá um email quando o site estiver pronto para revisão.</p>
        <div style="margin:24px 0;padding:16px;background:#d4edda;border-radius:8px">
          <p style="margin:0;color:#155724">✅ Onboarding 100% completo</p>
        </div>
        <a href="${d.dashboardUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Ver Painel →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  site_ready_review: {
    subject: "👀 Seu site está pronto para revisão!",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">${d.clientName}, seu site ficou incrível! 🌟</h2>
        <p>O site do <strong>${d.projectName}</strong> está pronto e esperando sua aprovação.</p>
        ${d.siteUrl ? `<p>🔗 <a href="${d.siteUrl}">Ver preview do site</a></p>` : ''}
        <a href="${d.dashboardUrl}/review" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Revisar e Aprovar →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  site_approved: {
    subject: "🚀 Site aprovado! Deploy em andamento",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Excelente, ${d.clientName}! 🚀</h2>
        <p>Seu site foi aprovado e o deploy está em andamento. Em breve estará online!</p>
        <a href="${d.dashboardUrl}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Ver Painel →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  site_published: {
    subject: "🎉 Seu site está no ar!",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">Parabéns, ${d.clientName}! Seu site está online! 🌐</h2>
        <p>O projeto <strong>${d.projectName}</strong> foi publicado com sucesso.</p>
        ${d.publishedUrl ? `<p>🔗 <a href="${d.publishedUrl}">${d.publishedUrl}</a></p>` : ''}
        <div style="margin:24px 0;padding:16px;background:#fff3cd;border-radius:8px">
          <p style="margin:0;color:#856404">💡 <strong>Dica:</strong> Mantenha seu site sempre atualizado com nosso plano de Acompanhamento e Manutenção por apenas R$ 397/mês.</p>
        </div>
        <a href="${d.dashboardUrl}/review" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Ver Opções de Acompanhamento →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  nps_request: {
    subject: "Como foi sua experiência? (Leva 30 segundos)",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">${d.clientName}, queremos ouvir você! 💬</h2>
        <p>Seu projeto <strong>${d.projectName}</strong> foi entregue há alguns dias. Gostaríamos de saber como foi a experiência.</p>
        <p>De 0 a 10, o quanto você recomendaria nosso serviço?</p>
        <div style="margin:24px 0;text-align:center">
          ${[0,1,2,3,4,5,6,7,8,9,10].map(n => 
            `<a href="${d.feedbackUrl}?score=${n}" style="display:inline-block;width:36px;height:36px;line-height:36px;margin:2px;background:${n<=6?'#fee2e2':n<=8?'#fef3c7':'#d1fae5'};color:#1a1a2e;border-radius:8px;text-decoration:none;font-weight:600">${n}</a>`
          ).join('')}
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px">0 = Nada provável · 10 = Com certeza</p>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
  testimonial_request: {
    subject: "Pode nos deixar um depoimento? ⭐",
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a2e">${d.clientName}, obrigado pela nota ${d.npsScore}! ⭐</h2>
        <p>Ficamos muito felizes com o seu feedback. Seria demais se você pudesse deixar um depoimento rápido sobre sua experiência.</p>
        <a href="${d.feedbackUrl}?type=testimonial" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Deixar Depoimento →</a>
        <p style="margin-top:32px;color:#9ca3af;font-size:12px">JB Digital — Presença Google Essencial</p>
      </div>`,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { template, to_email, data, project_id, client_id } = await req.json();
    
    if (!template || !to_email) throw new Error("Missing template or to_email");
    
    const tmpl = templates[template];
    if (!tmpl) throw new Error(`Unknown template: ${template}`);

    const subject = tmpl.subject;
    const html = tmpl.html(data || {});

    // Send via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "JB Digital <noreply@jbdigital.com.br>",
        to: [to_email],
        subject,
        html,
      }),
    });

    const resendData = await resendRes.json();

    // Log the email
    await supabaseAdmin.from("email_logs").insert({
      project_id: project_id || null,
      client_id: client_id || null,
      to_email,
      template,
      subject,
      status: resendRes.ok ? "sent" : "failed",
      resend_id: resendData.id || null,
      metadata: { resend_response: resendData },
    });

    if (!resendRes.ok) {
      throw new Error(`Resend error: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
