export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      billing: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          product_type: string
          project_id: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          product_type: string
          project_id: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          product_type?: string
          project_id?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_feedback: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          is_public: boolean
          nps_score: number | null
          project_id: string
          type: string
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          nps_score?: number | null
          project_id: string
          type: string
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          nps_score?: number | null
          project_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_health_scores: {
        Row: {
          ai_summary: string | null
          analyzed_at: string
          client_id: string
          created_at: string
          factors: Json
          id: string
          project_id: string
          recommended_actions: Json
          risk_level: string
          risk_score: number
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          analyzed_at?: string
          client_id: string
          created_at?: string
          factors?: Json
          id?: string
          project_id: string
          recommended_actions?: Json
          risk_level?: string
          risk_score?: number
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          analyzed_at?: string
          client_id?: string
          created_at?: string
          factors?: Json
          id?: string
          project_id?: string
          recommended_actions?: Json
          risk_level?: string
          risk_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_health_scores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_health_scores_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_intake: {
        Row: {
          business_data: Json | null
          completed: boolean
          created_at: string
          google_data: Json | null
          id: string
          photos_data: Json | null
          project_id: string
          schedule_data: Json | null
          services_data: Json | null
          step_current: number
          updated_at: string
        }
        Insert: {
          business_data?: Json | null
          completed?: boolean
          created_at?: string
          google_data?: Json | null
          id?: string
          photos_data?: Json | null
          project_id: string
          schedule_data?: Json | null
          services_data?: Json | null
          step_current?: number
          updated_at?: string
        }
        Update: {
          business_data?: Json | null
          completed?: boolean
          created_at?: string
          google_data?: Json | null
          id?: string
          photos_data?: Json | null
          project_id?: string
          schedule_data?: Json | null
          services_data?: Json | null
          step_current?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_intake_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_reviews: {
        Row: {
          approved_at: string | null
          created_at: string
          feedback: string | null
          id: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          business_name: string
          city: string | null
          created_at: string
          id: string
          state: string | null
          status: string
          updated_at: string
          user_id: string
          vertical: string | null
        }
        Insert: {
          business_name: string
          city?: string | null
          created_at?: string
          id?: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vertical?: string | null
        }
        Update: {
          business_name?: string
          city?: string | null
          created_at?: string
          id?: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vertical?: string | null
        }
        Relationships: []
      }
      domain_renewals: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          domain: string
          id: string
          notified: boolean | null
          project_id: string
          renewal_date: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          domain: string
          id?: string
          notified?: boolean | null
          project_id: string
          renewal_date: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          domain?: string
          id?: string
          notified?: boolean | null
          project_id?: string
          renewal_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_renewals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_transactions: {
        Row: {
          amount: number
          created_at: string
          domain: string
          id: string
          metadata: Json | null
          payment_id: string
          payment_provider: string
          project_id: string
          status: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          domain: string
          id?: string
          metadata?: Json | null
          payment_id: string
          payment_provider?: string
          project_id: string
          status: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          domain?: string
          id?: string
          metadata?: Json | null
          payment_id?: string
          payment_provider?: string
          project_id?: string
          status?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          project_id: string | null
          resend_id: string | null
          status: string
          subject: string
          template: string
          to_email: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          resend_id?: string | null
          status?: string
          subject: string
          template: string
          to_email: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          resend_id?: string | null
          status?: string
          subject?: string
          template?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_subscriptions: {
        Row: {
          canceled_at: string | null
          client_id: string
          created_at: string
          current_period_end: string | null
          id: string
          project_id: string
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          client_id: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          project_id: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          client_id?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          project_id?: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_subscriptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string
          cloudflare_zone_id: string | null
          created_at: string
          custom_domain: string | null
          domain_auto_renew: boolean | null
          domain_ownership: string | null
          domain_payment_id: string | null
          domain_registrar: string | null
          domain_renewal_date: string | null
          domain_status: string | null
          gbp_url: string | null
          github_repo: string | null
          id: string
          name: string
          plan: string
          published_url: string | null
          site_html_path: string | null
          site_url: string | null
          status: string
          updated_at: string
          vercel_project_id: string | null
        }
        Insert: {
          client_id: string
          cloudflare_zone_id?: string | null
          created_at?: string
          custom_domain?: string | null
          domain_auto_renew?: boolean | null
          domain_ownership?: string | null
          domain_payment_id?: string | null
          domain_registrar?: string | null
          domain_renewal_date?: string | null
          domain_status?: string | null
          gbp_url?: string | null
          github_repo?: string | null
          id?: string
          name: string
          plan?: string
          published_url?: string | null
          site_html_path?: string | null
          site_url?: string | null
          status?: string
          updated_at?: string
          vercel_project_id?: string | null
        }
        Update: {
          client_id?: string
          cloudflare_zone_id?: string | null
          created_at?: string
          custom_domain?: string | null
          domain_auto_renew?: boolean | null
          domain_ownership?: string | null
          domain_payment_id?: string | null
          domain_registrar?: string | null
          domain_renewal_date?: string | null
          domain_status?: string | null
          gbp_url?: string | null
          github_repo?: string | null
          id?: string
          name?: string
          plan?: string
          published_url?: string | null
          site_html_path?: string | null
          site_url?: string | null
          status?: string
          updated_at?: string
          vercel_project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_user_id: { Args: { _client_id: string }; Returns: string }
      get_project_user_id: { Args: { _project_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin_jb" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin_jb", "client"],
    },
  },
} as const
