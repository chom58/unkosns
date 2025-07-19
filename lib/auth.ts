import { createClient } from './supabase'

// 匿名ユーザーとしてサインイン
export const signInAnonymously = async () => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInAnonymously()
    
    if (error) {
      console.error('匿名サインインエラー:', error)
      throw error
    }
    
    return data.user
  } catch (error) {
    console.error('認証エラー:', error)
    throw error
  }
}

// 現在のユーザーを取得
export const getCurrentUser = async () => {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('ユーザー取得エラー:', error)
    return null
  }
  
  return user
}

// ユーザーセッションを取得
export const getSession = async () => {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('セッション取得エラー:', error)
    return null
  }
  
  return session
}