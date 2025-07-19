export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          content: string
          created_at: string
          expires_at: string
          user_id: string
        }
        Insert: {
          id?: string
          content: string
          created_at?: string
          expires_at?: string
          user_id: string
        }
        Update: {
          id?: string
          content?: string
          created_at?: string
          expires_at?: string
          user_id?: string
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
  }
}