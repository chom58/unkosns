'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkConfig = async () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        env: {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'
        }
      }

      try {
        // Supabaseクライアント作成テスト
        const supabase = createClient()
        info.supabaseClient = 'OK'

        // 匿名認証テスト
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          info.authError = {
            message: error.message,
            status: error.status,
            name: error.name
          }
        } else {
          info.authSuccess = {
            userId: data.user?.id,
            email: data.user?.email || '匿名ユーザー'
          }
        }

        // データベース接続テスト
        const { data: testData, error: dbError } = await supabase
          .from('posts')
          .select('count')
          .limit(1)
        
        if (dbError) {
          info.dbError = {
            message: dbError.message,
            code: dbError.code,
            details: dbError.details
          }
        } else {
          info.dbConnection = 'OK'
        }

      } catch (e: any) {
        info.error = {
          message: e.message,
          stack: e.stack
        }
        setError(e.message)
      }

      setDebugInfo(info)
    }

    checkConfig()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">うんこSNS デバッグ情報</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-lg font-semibold mb-2">環境変数</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(debugInfo.env, null, 2)}
          </pre>
        </div>

        {debugInfo.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-red-700 mb-2">エラー</h2>
            <pre className="text-sm text-red-600 overflow-x-auto">
              {JSON.stringify(debugInfo.error, null, 2)}
            </pre>
          </div>
        )}

        {debugInfo.authError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">認証エラー</h2>
            <pre className="text-sm text-yellow-600 overflow-x-auto">
              {JSON.stringify(debugInfo.authError, null, 2)}
            </pre>
          </div>
        )}

        {debugInfo.authSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-green-700 mb-2">認証成功</h2>
            <pre className="text-sm text-green-600 overflow-x-auto">
              {JSON.stringify(debugInfo.authSuccess, null, 2)}
            </pre>
          </div>
        )}

        {debugInfo.dbError && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-orange-700 mb-2">データベースエラー</h2>
            <pre className="text-sm text-orange-600 overflow-x-auto">
              {JSON.stringify(debugInfo.dbError, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">全体のデバッグ情報</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="mt-6 space-y-2">
          <a href="/" className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            ホームに戻る
          </a>
          <a href="/demo" className="block text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            デモ版を試す
          </a>
        </div>
      </div>
    </div>
  )
}