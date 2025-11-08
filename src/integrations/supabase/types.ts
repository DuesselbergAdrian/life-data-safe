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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor: string
          created_at: string
          details: Json | null
          id: string
          scope: string
          user_id: string
        }
        Insert: {
          action: string
          actor?: string
          created_at?: string
          details?: Json | null
          id?: string
          scope: string
          user_id: string
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          details?: Json | null
          id?: string
          scope?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          blurb: string | null
          contributions_this_month: number
          created_at: string
          id: string
          member_count: number
          name: string
        }
        Insert: {
          blurb?: string | null
          contributions_this_month?: number
          created_at?: string
          id?: string
          member_count?: number
          name: string
        }
        Update: {
          blurb?: string | null
          contributions_this_month?: number
          created_at?: string
          id?: string
          member_count?: number
          name?: string
        }
        Relationships: []
      }
      consents: {
        Row: {
          accepted_privacy: boolean | null
          accepted_terms: boolean | null
          created_at: string | null
          id: string
          share_anonymized: boolean
          share_circle_connections: boolean | null
          share_communities: boolean
          share_community_memberships: boolean | null
          share_private_circle: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_privacy?: boolean | null
          accepted_terms?: boolean | null
          created_at?: string | null
          id?: string
          share_anonymized?: boolean
          share_circle_connections?: boolean | null
          share_communities?: boolean
          share_community_memberships?: boolean | null
          share_private_circle?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_privacy?: boolean | null
          accepted_terms?: boolean | null
          created_at?: string | null
          id?: string
          share_anonymized?: boolean
          share_circle_connections?: boolean | null
          share_communities?: boolean
          share_community_memberships?: boolean | null
          share_private_circle?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          can_see_ai_summary: boolean
          can_see_mood: boolean
          can_see_sleep: boolean
          can_see_steps: boolean
          created_at: string
          email: string
          id: string
          name: string
          relation: string | null
          user_id: string
        }
        Insert: {
          can_see_ai_summary?: boolean
          can_see_mood?: boolean
          can_see_sleep?: boolean
          can_see_steps?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          relation?: string | null
          user_id: string
        }
        Update: {
          can_see_ai_summary?: boolean
          can_see_mood?: boolean
          can_see_sleep?: boolean
          can_see_steps?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          relation?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      device_connections: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          last_sync_at: string | null
          metrics_json: Json | null
          provider: string
          status: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          metrics_json?: Json | null
          provider: string
          status?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          metrics_json?: Json | null
          provider?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          type: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          type: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "impact_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          community_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_year: number | null
          country: string | null
          created_at: string
          email: string
          height_cm: number | null
          id: string
          impact_points: number
          interests: string[] | null
          name: string | null
          onboarding_completed: boolean | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          birth_year?: number | null
          country?: string | null
          created_at?: string
          email: string
          height_cm?: number | null
          id: string
          impact_points?: number
          interests?: string[] | null
          name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          birth_year?: number | null
          country?: string | null
          created_at?: string
          email?: string
          height_cm?: number | null
          id?: string
          impact_points?: number
          interests?: string[] | null
          name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      project_consents: {
        Row: {
          consented_at: string | null
          data_shared: string[]
          id: string
          project_id: string
          revoked_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          consented_at?: string | null
          data_shared: string[]
          id?: string
          project_id: string
          revoked_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          consented_at?: string | null
          data_shared?: string[]
          id?: string
          project_id?: string
          revoked_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_consents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      research_projects: {
        Row: {
          benefits: string[]
          compensation_type: string | null
          compensation_value: string | null
          created_at: string | null
          data_requested: string[]
          description: string
          id: string
          institute: string
          name: string
          participant_count: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          benefits: string[]
          compensation_type?: string | null
          compensation_value?: string | null
          created_at?: string | null
          data_requested: string[]
          description: string
          id?: string
          institute: string
          name: string
          participant_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          benefits?: string[]
          compensation_type?: string | null
          compensation_value?: string | null
          created_at?: string | null
          data_requested?: string[]
          description?: string
          id?: string
          institute?: string
          name?: string
          participant_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      uploads: {
        Row: {
          ai_summary: Json | null
          created_at: string
          duration_seconds: number | null
          id: string
          mime_type: string
          size_bytes: number
          thumb_url: string | null
          title: string | null
          url: string
          user_id: string
        }
        Insert: {
          ai_summary?: Json | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mime_type: string
          size_bytes: number
          thumb_url?: string | null
          title?: string | null
          url: string
          user_id: string
        }
        Update: {
          ai_summary?: Json | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mime_type?: string
          size_bytes?: number
          thumb_url?: string | null
          title?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
