export type AppRole = "admin_jb" | "client";

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
