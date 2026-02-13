
ALTER TABLE public.projects ADD COLUMN github_repo text;
ALTER TABLE public.projects ADD COLUMN vercel_project_id text;

CREATE INDEX idx_projects_github_repo ON public.projects (github_repo);
CREATE INDEX idx_projects_vercel_project_id ON public.projects (vercel_project_id);
