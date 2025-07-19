'use client'

import { useState, useEffect } from 'react'

// ローカルストレージを使用したデモ版の型定義
type DemoPost = {
  id: string
  content: string
  created_at: string
  expires_at: string
  reaction_count: number
  user_reacted?: boolean
}

export default function DemoPage() {
  const [posts, setPosts] = useState<DemoPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(false)

  // 投稿を作成する関数
  const createPost = async () => {
    if (newPost.trim() === '' || loading) return

    setLoading(true)
    
    const now = new Date()
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const post: DemoPost = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: newPost,
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
      reaction_count: 0,
      user_reacted: false
    }

    const updatedPosts = [post, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem('demo_unkosns_posts', JSON.stringify(updatedPosts))
    setNewPost('')
    setLoading(false)
  }

  // リアクションを追加/削除する関数
  const toggleReaction = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          user_reacted: !post.user_reacted,
          reaction_count: post.user_reacted 
            ? post.reaction_count - 1 
            : post.reaction_count + 1
        }
      }
      return post
    })
    setPosts(updatedPosts)
    localStorage.setItem('demo_unkosns_posts', JSON.stringify(updatedPosts))
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
    const loadPosts = () => {
      const saved = localStorage.getItem('demo_unkosns_posts')
      if (saved) {
        const savedPosts = JSON.parse(saved) as DemoPost[]
        // 期限切れの投稿を除外
        const now = new Date()
        const validPosts = savedPosts.filter(post => {
          const expiresAt = new Date(post.expires_at)
          return expiresAt > now
        })
        setPosts(validPosts)
        if (validPosts.length !== savedPosts.length) {
          localStorage.setItem('demo_unkosns_posts', JSON.stringify(validPosts))
        }
      } else {
        // サンプルデータ
        const samplePosts: DemoPost[] = [
          {
            id: '1',
            content: 'うんこ',
            created_at: new Date(Date.now() - 5 * 60000).toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reaction_count: 3,
            user_reacted: false
          },
          {
            id: '2',
            content: 'カレー食べた',
            created_at: new Date(Date.now() - 30 * 60000).toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reaction_count: 5,
            user_reacted: true
          },
          {
            id: '3',
            content: '電車乗り過ごした',
            created_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reaction_count: 12,
            user_reacted: false
          }
        ]
        setPosts(samplePosts)
      }
    }
    
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* ヘッダー */}
      <header className="bg-yellow-600 p-3 sm:p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white">💩 うんこSNS（デモ版）</h1>
          <p className="text-yellow-100 text-xs sm:text-sm">くだらないことをつぶやいても許されるSNS</p>
          <p className="text-yellow-200 text-xs mt-1">※ローカルストレージ版（リアルタイム同期なし）</p>
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
            {posts.length === 0 ? (
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