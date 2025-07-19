import { createClient } from './supabase'
import { Database } from '@/types/database'

type Post = Database['public']['Tables']['posts']['Row']
type InsertPost = Database['public']['Tables']['posts']['Insert']

// 投稿を作成
export const createPost = async (content: string, userId: string) => {
  const supabase = createClient()
  
  const now = new Date()
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24時間後
  
  const newPost: InsertPost = {
    content,
    user_id: userId,
    expires_at: expires.toISOString()
  }
  
  const { data, error } = await supabase
    .from('posts')
    .insert(newPost)
    .select()
    .single()
  
  if (error) {
    console.error('投稿作成エラー:', error)
    throw error
  }
  
  return data
}

// 投稿一覧を取得（期限内のもののみ）
export const getPosts = async () => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('投稿取得エラー:', error)
    throw error
  }
  
  return data || []
}

// ユーザーがリアクションした投稿IDを取得
export const getUserReactions = async (userId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('reactions')
    .select('post_id')
    .eq('user_id', userId)
  
  if (error) {
    console.error('リアクション取得エラー:', error)
    return []
  }
  
  return data?.map(r => r.post_id) || []
}