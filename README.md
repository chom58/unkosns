# うんこSNS

くだらないことをつぶやいても許されるSNS - リアルタイム同期対応版

## 🚀 主な機能

- 💩 140文字以内の「くだらない」投稿
- 🚽 ランダムタイムライン（トイレ）
- 💩 リアクション機能
- 🌊 「流す」でタイムラインをシャッフル
- 24時間で投稿が自動消滅
- **リアルタイム同期（全ユーザーが同じタイムラインを共有）**
- 匿名投稿（ログイン不要）

## 開発環境のセットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com)でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとanon keyを取得

### 3. 環境変数の設定
`.env.local`ファイルを編集して、Supabaseの認証情報を追加：
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. データベースのセットアップ
Supabaseのダッシュボードで `supabase/setup.sql` の内容を実行してください。

主な設定内容：
- 投稿（posts）テーブル
- リアクション（reactions）テーブル
- RLSポリシー（セキュリティ設定）
- リアルタイム同期の有効化
- 自動リアクション数更新トリガー

### 5. 認証設定
Supabaseダッシュボードで：
1. Authentication → Settings
2. 「Enable anonymous sign-ins」をONにする

### 6. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 技術スタック
- **フロントエンド**: Next.js 15, TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + リアルタイム)
- **認証**: Supabase Auth (匿名認証)
- **ホスティング**: Vercel（推奨）

## 今後の実装予定
- [ ] 24時間自動削除のサーバーサイド実装（Supabase Edge Functions）
- [ ] うんこプレミアム（有料プラン）
- [ ] PWA対応
- [ ] ダークモード