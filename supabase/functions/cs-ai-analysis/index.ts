import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Gather all client data for analysis
    const [
      { data: clients },
      { data: projects },
      { data: subscriptions },
      { data: feedback },
      { data: emailLogs },
      { data: reviews },
      { data: intake },
    ] = await Promise.all([
      supabaseAdmin.from("clients").select("*"),
      supabaseAdmin.from("projects").select("*"),
      supabaseAdmin.from("maintenance_subscriptions").select("*"),
      supabaseAdmin.from("client_feedback").select("*"),
      supabaseAdmin.from("email_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabaseAdmin.from("client_reviews").select("*"),
      supabaseAdmin.from("client_intake").select("*"),
    ]);

    if (!clients || clients.length === 0) {
      return new Response(JSON.stringify({ analyzed: 0, message: "No clients to analyze" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build context per client
    const clientAnalyses = [];

    for (const client of clients) {
      const clientProjects = (projects || []).filter((p) => p.client_id === client.id);
      const clientSubs = (subscriptions || []).filter((s) => s.client_id === client.id);
      const clientFeedback = (feedback || []).filter((f) => f.client_id === client.id);
      const clientEmails = (emailLogs || []).filter((e) => e.client_id === client.id);
      const clientReviews = (reviews || []).filter((r) => clientProjects.some((p) => p.id === r.project_id));
      const clientIntake = (intake || []).filter((i) => clientProjects.some((p) => p.id === i.project_id));

      for (const project of clientProjects) {
        const projectSub = clientSubs.find((s) => s.project_id === project.id);
        const projectFeedback = clientFeedback.filter((f) => f.project_id === project.id);
        const projectReviews = clientReviews.filter((r) => r.project_id === project.id);
        const projectIntake = clientIntake.find((i) => i.project_id === project.id);
        const projectEmails = clientEmails.filter((e) => e.project_id === project.id);

        const npsScore = projectFeedback.find((f) => f.type === "nps")?.nps_score;
        const daysSinceCreation = Math.floor((Date.now() - new Date(project.created_at).getTime()) / 86400000);
        const daysSinceUpdate = Math.floor((Date.now() - new Date(project.updated_at).getTime()) / 86400000);

        const context = {
          clientId: client.id,
          projectId: project.id,
          businessName: client.business_name,
          vertical: client.vertical,
          projectStatus: project.status,
          projectName: project.name,
          daysSinceCreation,
          daysSinceUpdate,
          hasSubscription: !!projectSub,
          subscriptionStatus: projectSub?.status || "none",
          canceledAt: projectSub?.canceled_at,
          cancelAtPeriodEnd: projectSub?.current_period_end,
          npsScore: npsScore ?? null,
          hasTestimonial: projectFeedback.some((f) => f.type === "testimonial"),
          intakeCompleted: projectIntake?.completed || false,
          intakeStep: projectIntake?.step_current || 0,
          reviewStatus: projectReviews[0]?.status || "none",
          emailsSent: projectEmails.length,
          failedEmails: projectEmails.filter((e) => e.status === "failed").length,
          hasDomain: !!project.custom_domain,
          isPublished: !!project.published_url,
        };

        clientAnalyses.push(context);
      }
    }

    if (clientAnalyses.length === 0) {
      return new Response(JSON.stringify({ analyzed: 0, message: "No projects to analyze" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send to AI for analysis
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Você é um analista de Customer Success especializado em agências digitais brasileiras. 
Analise os dados dos clientes e retorne uma avaliação de risco de churn para cada par cliente-projeto.

Critérios de risco:
- NPS baixo (<=6) = risco alto
- Assinatura cancelada ou sem assinatura após publicação = risco crítico
- Intake incompleto após muitos dias = risco médio
- Projeto parado no mesmo status por muito tempo = risco médio
- Sem interação recente (poucos emails, sem reviews) = risco alto
- NPS alto (>=9) + depoimento + assinatura ativa = saudável

Para cada cliente-projeto, retorne EXATAMENTE um objeto JSON no array.`,
          },
          {
            role: "user",
            content: `Analise estes dados de clientes e projetos e retorne o resultado:\n\n${JSON.stringify(clientAnalyses, null, 2)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_health_scores",
              description: "Submit health analysis for all client-projects",
              parameters: {
                type: "object",
                properties: {
                  analyses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        clientId: { type: "string" },
                        projectId: { type: "string" },
                        riskLevel: { type: "string", enum: ["low", "medium", "high", "critical"] },
                        riskScore: { type: "number", description: "0-100, higher = more risk" },
                        factors: {
                          type: "array",
                          items: { type: "string" },
                          description: "List of risk factors identified",
                        },
                        recommendedActions: {
                          type: "array",
                          items: { type: "string" },
                          description: "List of recommended CS actions in Portuguese",
                        },
                        summary: { type: "string", description: "Brief summary in Portuguese" },
                      },
                      required: ["clientId", "projectId", "riskLevel", "riskScore", "factors", "recommendedActions", "summary"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["analyses"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_health_scores" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required for AI credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const { analyses } = JSON.parse(toolCall.function.arguments);

    // Upsert health scores
    let saved = 0;
    for (const analysis of analyses) {
      const { error } = await supabaseAdmin.from("client_health_scores").upsert(
        {
          client_id: analysis.clientId,
          project_id: analysis.projectId,
          risk_level: analysis.riskLevel,
          risk_score: analysis.riskScore,
          factors: analysis.factors,
          recommended_actions: analysis.recommendedActions,
          ai_summary: analysis.summary,
          analyzed_at: new Date().toISOString(),
        },
        { onConflict: "client_id,project_id" }
      );
      if (!error) saved++;
    }

    return new Response(JSON.stringify({ analyzed: saved, total: analyses.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CS analysis error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
