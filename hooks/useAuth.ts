'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { signInAnonymously, getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Supabaseクライアントの作成を試みる
        const supabase = createClient()
        
        // 現在のユーザーを確認
        let currentUser = await getCurrentUser()
        
        // ユーザーがいない場合は匿名でサインイン
        if (!currentUser) {
          currentUser = await signInAnonymously()
        }
        
        setUser(currentUser)

        // 認証状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('認証初期化エラー:', error)
        // エラーが発生してもloadingをfalseにする
        setLoading(false)
      }
    }

    // Supabaseが設定されていない場合はスキップ
    try {
      initAuth()
    } catch (error) {
      console.error('Supabase設定エラー:', error)
      setLoading(false)
    }
  }, [])

  return { user, loading }
}