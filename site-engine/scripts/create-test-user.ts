/**
 * Script temporário: insere client_intake para o projeto de teste existente.
 * O projeto já existe no Supabase; só falta a linha de intake.
 * Deletar após uso.
 */
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

// Carrega .env.local da raiz do repo (mesmo padrão do onboard-client.ts)
const envPath = new URL("../../.env.local", import.meta.url).pathname;
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length && !k.startsWith("#")) {
      process.env[k.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente em .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// project_id do projeto "Clínica Teste JB" que já existe em projects
const ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const TEST_EMAIL = "clinica-teste@jbdigital.dev";
const TEST_PASSWORD = "TesteJB2026!";

// Decodifica o JWT para verificar o role
function jwtRole(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload.role ?? "desconhecido";
  } catch { return "erro ao decodificar"; }
}

async function main() {
  // Aceita user_id como argumento para pular criação de auth
  const userId = process.argv[2];
  if (!userId) {
    console.error("Uso: npx tsx scripts/create-test-user.ts <user_id>");
    console.error("\nCrie o usuário no Supabase dashboard:");
    console.error("  Authentication → Users → Add user");
    console.error(`  Email: ${TEST_EMAIL}  Senha: ${TEST_PASSWORD}  ✔ Auto Confirm`);
    console.error("  Copie o UUID e passe como argumento.");
    process.exit(1);
  }
  console.log(`✅ Auth user: ${userId}`);

  // 2. Criar clients (trigger cria profiles + user_roles, mas NÃO clients)
  const { data: client, error: clientErr } = await supabase
    .from("clients")
    .upsert({ user_id: userId, business_name: "Clínica Teste JB", vertical: "saude", city: "São Paulo", state: "SP" }, { onConflict: "user_id" })
    .select("id").single();
  if (clientErr || !client) { console.error("❌ Erro ao criar client:", clientErr?.message); process.exit(1); }
  console.log(`✅ Client: ${client.id}`);

  // 3. Criar project
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .insert({ client_id: client.id, name: "Clínica Teste JB", vertical: "saude", city: "São Paulo", state: "SP", plan: "premium", status: "onboarding" })
    .select("id").single();
  if (projectErr || !project) { console.error("❌ Erro ao criar project:", projectErr?.message); process.exit(1); }
  console.log(`✅ Project: ${project.id}`);

  // 4. Inserir client_intake com dados realistas de clínica
  const { error: intakeError } = await supabase.from("client_intake").insert({
    project_id: project.id,
    step_current: 5,
    completed: true,
    google_data: {
      has_gbp: false,
      gbp_url: "",
      google_connected: false,
    },
    business_data: {
      business_name: "Clínica Teste JB",
      site_url: "",
      description: "Clínica médica especializada em saúde da mulher, com foco em ginecologia e obstetrícia.",
      address: "Rua Augusta, 1200 — Consolação",
      city: "São Paulo",
      state: "SP",
      zip: "01304-001",
      phone: "(11) 3456-7890",
      whatsapp: "(11) 99876-5432",
      email: "contato@clinicatestejb.com.br",
      neighborhood: "Consolação",
    },
    schedule_data: {
      monday: "08:00 - 18:00",
      tuesday: "08:00 - 18:00",
      wednesday: "08:00 - 18:00",
      thursday: "08:00 - 18:00",
      friday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Fechado",
    },
    services_data: {
      category: "Médico - Ginecologista/Obstetra",
      services: "Ginecologia geral, pré-natal, ultrassonografia obstétrica, planejamento familiar, tratamento hormonal",
      target_audience: "Mulheres de 18 a 50 anos que buscam saúde ginecológica preventiva e cuidado na gestação",
      symptoms: "Irregularidade menstrual, dores pélvicas, gestação de risco, síndrome do ovário policístico, menopausa",
      differentials: "Atendimento humanizado, agenda online, consultas no mesmo dia, laboratório próprio",
      therapeutic_approach: "Medicina baseada em evidências com abordagem integrativa e acolhimento individual",
      credentials: "CRM-SP 123456 | Título de especialista em Ginecologia e Obstetrícia pela FEBRASGO",
      faqs: "Qual o valor da consulta? Aceita planos de saúde? Como agendar? Qual a localização?",
    },
    photos_data: { photos: [] },
    brand_data: {
      primary_color: "#4A7C8F",
      secondary_color: "#F5E6D3",
      font: "Inter",
      style: "moderno e acolhedor",
      logo_url: "",
    },
    existing_site_url: null,
  });

  if (intakeError) {
    console.error("❌ Erro ao inserir client_intake:", intakeError.message);
    process.exit(1);
  }

  console.log("✅ client_intake inserido com sucesso!");
  console.log("\n" + "─".repeat(50));
  console.log("🎉 USUÁRIO DE TESTE CRIADO COM SUCESSO!\n");
  console.log(`📧 E-mail:  ${TEST_EMAIL}`);
  console.log(`🔑 Senha:   ${TEST_PASSWORD}`);
  console.log(`🆔 project_id: ${project.id}`);
  console.log("─".repeat(50));
  console.log("\nPróximo passo:");
  console.log(`  cd site-engine && npm run onboard ${project.id}`);
}

main().catch(console.error);
