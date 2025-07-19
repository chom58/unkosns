export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          content: string
          created_at: string
          expires_at: string
          user_id: string
          reaction_count: number
        }
        Insert: {
          id?: string
          content: string
          created_at?: string
          expires_at: string
          user_id: string
          reaction_count?: number
        }
        Update: {
          id?: string
          content?: string
          created_at?: string
          expires_at?: string
          user_id?: string
          reaction_count?: number
        }
      }
      reactions: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}