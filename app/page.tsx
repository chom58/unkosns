'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { getPosts, getUserReactions, createPost as createSupabasePost } from '@/lib/posts'
import { toggleReaction as toggleSupabaseReaction } from '@/lib/reactions'
import { Database } from '@/types/database'

type Post = Database['public']['Tables']['posts']['Row'] & {
  user_reacted?: boolean
}

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(true)

  // 投稿を取得
  const fetchPosts = async () => {
    if (!user) return
    
    try {
      const [allPosts, userReactions] = await Promise.all([
        getPosts(),
        getUserReactions(user.id)
      ])
      
      // ユーザーのリアクション情報を付加
      const postsWithReactions = allPosts.map(post => ({
        ...post,
        user_reacted: userReactions.includes(post.id)
      }))
      
      setPosts(postsWithReactions)
    } catch (error) {
      console.error('投稿取得エラー:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  // 投稿を作成する関数
  const createPost = async () => {
    if (newPost.trim() === '' || loading || !user) return

    setLoading(true)
    
    try {
      const newPostData = await createSupabasePost(newPost, user.id)
      
      // 新しい投稿を追加
      setPosts([{ ...newPostData, user_reacted: false }, ...posts])
      setNewPost('')
    } catch (error) {
      console.error('投稿作成エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // リアクションを追加/削除する関数
  const toggleReaction = async (postId: string) => {
    if (!user) return
    
    const post = posts.find(p => p.id === postId)
    if (!post) return
    
    try {
      await toggleSupabaseReaction(postId, user.id, post.user_reacted || false)
      
      // UIを更新
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            user_reacted: !p.user_reacted,
            reaction_count: p.user_reacted 
              ? p.reaction_count - 1 
              : p.reaction_count + 1
          }
        }
        return p
      }))
    } catch (error) {
      console.error('リアクション更新エラー:', error)
    }
  }

  // タイムラインをリフレッシュ（流す）
  const refreshTimeline = () => {
    setPosts([...posts].sort(() => Math.random() - 0.5))
  }

  // 時間を相対的に表示する関数
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'たった今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}時間前`
    return `${Math.floor(diffMins / 1440)}日前`
  }

  // 初期データを読み込み
  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  // リアルタイム購読を設定
  useEffect(() => {
    if (!user) return
    
    const supabase = createClient()
    
    // 投稿の変更を監視
    const postsSubscription = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          console.log('投稿変更:', payload)
          
          if (payload.eventType === 'INSERT') {
            // 新しい投稿を追加
            const newPost = payload.new as Post
            setPosts(prev => [{
              ...newPost,
              user_reacted: false
            }, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            // 投稿を更新（リアクション数の変更など）
            const updatedPost = payload.new as Post
            setPosts(prev => prev.map(post => 
              post.id === updatedPost.id 
                ? { ...updatedPost, user_reacted: post.user_reacted }
                : post
            ))
          } else if (payload.eventType === 'DELETE') {
            // 投稿を削除
            setPosts(prev => prev.filter(post => post.id !== payload.old.id))
          }
        }
      )
      .subscribe()
    
    // リアクションの変更を監視
    const reactionsSubscription = supabase
      .channel('reactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('リアクション変更:', payload)
          
          if (payload.eventType === 'INSERT') {
            // 自分のリアクションが追加された
            setPosts(prev => prev.map(post => 
              post.id === payload.new.post_id 
                ? { ...post, user_reacted: true }
                : post
            ))
          } else if (payload.eventType === 'DELETE') {
            // 自分のリアクションが削除された
            setPosts(prev => prev.map(post => 
              post.id === payload.old.post_id 
                ? { ...post, user_reacted: false }
                : post
            ))
          }
        }
      )
      .subscribe()
    
    return () => {
      postsSubscription.unsubscribe()
      reactionsSubscription.unsubscribe()
    }
  }, [user])

  // Supabaseが設定されていない場合のエラー処理
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">💩</div>
          <h2 className="text-xl font-bold mb-4">Supabaseの設定が必要です</h2>
          <p className="text-gray-600 mb-6">
            リアルタイム同期機能を使用するには、Supabaseプロジェクトを作成し、
            環境変数を設定してください。
          </p>
          <div className="space-y-4">
            <a
              href="/demo"
              className="block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              デモ版を試す（ローカルストレージ版）
            </a>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-400 hover:border-gray-600 text-gray-700 font-medium py-3 px-6 rounded-full transition-colors"
            >
              Supabaseを設定する
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            詳細は SETUP_GUIDE.md を参照してください
          </p>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💩</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* ヘッダー */}
      <header className="bg-yellow-600 p-3 sm:p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white">💩 うんこSNS</h1>
          <p className="text-yellow-100 text-xs sm:text-sm">くだらないことをつぶやいても許されるSNS</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto p-4">
        {/* 投稿フォーム */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                createPost()
              }
            }}
            placeholder="なんでもつぶやいてみて..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-yellow-400"
            rows={3}
            maxLength={140}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">{newPost.length}/140</span>
            <button
              onClick={createPost}
              disabled={loading || newPost.trim() === ''}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition-colors text-sm sm:text-base"
            >
              {loading ? '投稿中...' : 'うんこする'}
            </button>
          </div>
        </div>

        {/* タイムライン（トイレ） */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold">🚽 トイレ</h2>
            <button
              onClick={refreshTimeline}
              className="text-blue-500 hover:text-blue-600 font-medium text-sm sm:text-base"
            >
              流す 🌊
            </button>
          </div>

          {/* 投稿一覧 */}
          <div className="space-y-3">
            {postsLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">💩</div>
                <p>投稿を読み込み中...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだ誰もうんこしてません
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <p className="text-gray-800 mb-2 whitespace-pre-wrap break-all text-sm sm:text-base">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(post.created_at)}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button 
                        onClick={() => toggleReaction(post.id)}
                        className={`text-xl sm:text-2xl hover:scale-110 transition-transform ${
                          post.user_reacted ? 'scale-110' : ''
                        }`}
                      >
                        💩
                      </button>
                      {post.reaction_count > 0 && (
                        <span className="text-xs sm:text-sm text-gray-600">
                          {post.reaction_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}