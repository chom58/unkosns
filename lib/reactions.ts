import { createClient } from './supabase'
import { Database } from '@/types/database'

type Reaction = Database['public']['Tables']['reactions']['Row']
type InsertReaction = Database['public']['Tables']['reactions']['Insert']

// リアクションを追加
export const addReaction = async (postId: string, userId: string) => {
  const supabase = createClient()
  
  const newReaction: InsertReaction = {
    post_id: postId,
    user_id: userId
  }
  
  const { data, error } = await supabase
    .from('reactions')
    .insert(newReaction)
    .select()
    .single()
  
  if (error) {
    // すでにリアクションしている場合はエラーになるが、それは正常
    if (error.code === '23505') { // unique constraint violation
      console.log('すでにリアクションしています')
      return null
    }
    console.error('リアクション追加エラー:', error)
    throw error
  }
  
  return data
}

// リアクションを削除
export const removeReaction = async (postId: string, userId: string) => {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId)
  
  if (error) {
    console.error('リアクション削除エラー:', error)
    throw error
  }
  
  return true
}

// リアクションをトグル（追加/削除）
export const toggleReaction = async (postId: string, userId: string, currentlyReacted: boolean) => {
  if (currentlyReacted) {
    await removeReaction(postId, userId)
    return false
  } else {
    await addReaction(postId, userId)
    return true
  }
}