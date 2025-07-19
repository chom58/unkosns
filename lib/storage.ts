// ローカルストレージのキー
const STORAGE_KEY = 'unkosns_posts'
const USER_ID_KEY = 'unkosns_user_id'

// 投稿の型
export type Post = {
  id: string
  content: string
  created_at: string
  reaction_count: number
  user_reacted?: boolean
  expires_at: string
}

// ユーザーIDを取得（なければ生成）
export const getUserId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

// 投稿を保存
export const savePosts = (posts: Post[]) => {
  if (typeof window === 'undefined') return
  
  // 24時間以内の投稿のみを保存
  const now = new Date()
  const validPosts = posts.filter(post => {
    const expiresAt = new Date(post.expires_at)
    return expiresAt > now
  })
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validPosts))
}

// 投稿を読み込み
export const loadPosts = (): Post[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const posts = JSON.parse(stored) as Post[]
    
    // 期限切れの投稿を除外
    const now = new Date()
    const validPosts = posts.filter(post => {
      const expiresAt = new Date(post.expires_at)
      return expiresAt > now
    })
    
    // 期限切れがあった場合は保存し直す
    if (validPosts.length !== posts.length) {
      savePosts(validPosts)
    }
    
    return validPosts
  } catch (error) {
    console.error('Failed to load posts:', error)
    return []
  }
}

// 新しい投稿を作成
export const createNewPost = (content: string): Post => {
  const now = new Date()
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24時間後
  
  return {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    reaction_count: 0,
    user_reacted: false
  }
}