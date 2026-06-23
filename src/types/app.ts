export type AppRole = "admin_jb" | "client";

export type ServiceType = "site_gbp";

export type ProjectStatus =
  | "lead_created"
  | "onboarding_in_progress"
  | "content_ready"
  | "lovable_prompt_ready"
  | "lovable_site_generated"
  | "repo_created"
  | "vercel_deployed_preview"
  | "qa_passed"
  | "client_review"
  | "vercel_deployed_prod"
  | "handoff_ready"
  | "handoff_done"
  | "monthly_active";

export type Vertical = "psicologo" | "dentista" | "terapeuta" | "outro";
export type BillingType = "setup_50_50" | "monthly";
export type BillingStatus = "pending" | "paid_partial" | "paid_full" | "delinquent";
export type OnboardingStatus = "not_started" | "step_1" | "step_2" | "step_3" | "step_4" | "step_5" | "completed";

export type DomainStatus =
  | "not_configured"
  | "subdomain_active"
  | "searching"
  | "payment_pending"
  | "payment_processing"
  | "registering"
  | "dns_configuring"
  | "ssl_activating"
  | "domain_ready"
  | "renewal_pending"
  | "expired";

export type DomainOwnership = "client" | "jb_temp";
export type DomainRegistrar = "cloudflare" | "namecheap";

export interface DomainSearchResult {
  name: string;
  available: boolean;
  price: number;
  currency: string;
  extension: string;
}

export interface DomainTransaction {
  id: string;
  project_id: string;
  domain: string;
  transaction_type: "purchase" | "renewal";
  amount: number;
  payment_provider: "stripe";
  payment_id: string;
  status: "pending" | "paid" | "failed" | "refunded";
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
