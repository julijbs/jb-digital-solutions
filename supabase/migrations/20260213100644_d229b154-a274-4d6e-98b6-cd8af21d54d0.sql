
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin_jb', 'client');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'client',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  vertical TEXT,
  city TEXT,
  state TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own data"
  ON public.clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Clients can update own data"
  ON public.clients FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Clients can insert own data"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all clients"
  ON public.clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'intake',
  plan TEXT NOT NULL DEFAULT 'starter',
  site_url TEXT,
  gbp_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Helper: get user_id from client
CREATE OR REPLACE FUNCTION public.get_client_user_id(_client_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.clients WHERE id = _client_id
$$;

CREATE POLICY "Clients can view own projects"
  ON public.projects FOR SELECT TO authenticated
  USING (public.get_client_user_id(client_id) = auth.uid());

CREATE POLICY "Clients can insert own projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.get_client_user_id(client_id) = auth.uid());

CREATE POLICY "Admins can manage all projects"
  ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Client intake (onboarding data)
CREATE TABLE public.client_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  step_current INT NOT NULL DEFAULT 1,
  business_data JSONB DEFAULT '{}',
  services_data JSONB DEFAULT '{}',
  schedule_data JSONB DEFAULT '{}',
  photos_data JSONB DEFAULT '{}',
  google_data JSONB DEFAULT '{}',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_intake ENABLE ROW LEVEL SECURITY;

-- Helper: get user_id from project
CREATE OR REPLACE FUNCTION public.get_project_user_id(_project_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.user_id FROM public.clients c
  JOIN public.projects p ON p.client_id = c.id
  WHERE p.id = _project_id
$$;

CREATE POLICY "Clients can manage own intake"
  ON public.client_intake FOR ALL TO authenticated
  USING (public.get_project_user_id(project_id) = auth.uid());

CREATE POLICY "Admins can manage all intake"
  ON public.client_intake FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin_jb'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_intake_updated_at BEFORE UPDATE ON public.client_intake FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
