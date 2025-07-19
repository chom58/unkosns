import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabaseの環境変数が設定されていません。.env.localファイルを確認してください。'
    )
  }

  // プレースホルダーのチェック
  if (supabaseUrl === 'your_supabase_url' || supabaseAnonKey === 'your_supabase_anon_key') {
    throw new Error(
      'Supabaseの環境変数にプレースホルダーが設定されています。実際の値に置き換えてください。'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}