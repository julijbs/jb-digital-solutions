import { supabase } from "../supabase/client";

// Google OAuth via Supabase nativo
export const auth = {
  signInWithOAuth: async (
    provider: "google" | "apple",
    opts?: { redirect_uri?: string; extraParams?: Record<string, string> }
  ) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: opts?.redirect_uri ?? window.location.origin,
        queryParams: opts?.extraParams,
      },
    });
    if (error) return { error };
    return { data };
  },
};
