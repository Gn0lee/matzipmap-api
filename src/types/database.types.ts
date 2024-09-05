export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      "place-info": {
        Row: {
          created_at: string
          id: number
          main_photo_url: string | null
          score: number | null
          score_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          main_photo_url?: string | null
          score?: number | null
          score_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          main_photo_url?: string | null
          score?: number | null
          score_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "review-reactions": {
        Row: {
          created_at: string
          id: number
          reaction_type: string | null
          review_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          reaction_type?: string | null
          review_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          reaction_type?: string | null
          review_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review-reactions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review-reactions_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          group_id: string | null
          id: number
          place_id: number | null
          text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: number
          place_id?: number | null
          text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: number
          place_id?: number | null
          text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "place-info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "user-group-memberships": {
        Row: {
          group_id: string | null
          id: number
          joined_at: string
          role: Database["public"]["Enums"]["MEMBERSHIP_ROLE"]
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: number
          joined_at?: string
          role?: Database["public"]["Enums"]["MEMBERSHIP_ROLE"]
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: number
          joined_at?: string
          role?: Database["public"]["Enums"]["MEMBERSHIP_ROLE"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user-group-memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user-group-memberships_user_id_fkey2"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "user-membership-limits": {
        Row: {
          created_at: string
          id: number
          max_groups: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          max_groups?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          max_groups?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user-membership-limits_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      MEMBERSHIP_ROLE: "MEMBER" | "OWNER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
