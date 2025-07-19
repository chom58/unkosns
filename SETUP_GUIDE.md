# うんこSNS セットアップガイド

## Supabaseプロジェクトの詳細設定手順

### 1. Supabaseアカウント作成
1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ（推奨）

### 2. 新規プロジェクト作成
1. 「New project」をクリック
2. プロジェクト情報を入力：
   - Project name: `unkosns` （任意）
   - Database Password: 安全なパスワードを生成
   - Region: `Northeast Asia (Tokyo)` を選択（日本から利用の場合）
3. 「Create new project」をクリック

### 3. 環境変数の取得
プロジェクトが作成されたら：
1. 左メニューの「Settings」→「API」
2. 以下をコピー：
   - `Project URL` → `.env.local`の`NEXT_PUBLIC_SUPABASE_URL`へ
   - `anon public` → `.env.local`の`NEXT_PUBLIC_SUPABASE_ANON_KEY`へ

### 4. データベースセットアップ
1. 左メニューの「SQL Editor」
2. 「New query」をクリック
3. `supabase/setup.sql`の内容を全てコピー＆ペースト
4. 「Run」をクリックして実行

### 5. 匿名認証の有効化
1. 左メニューの「Authentication」→「Settings」
2. 「User Signups」セクションで「Enable anonymous sign-ins」をON
3. 「Save」をクリック

### 6. リアルタイムの確認
1. 左メニューの「Database」→「Replication」
2. `posts`と`reactions`テーブルが「Source」に含まれていることを確認

### 7. 動作確認
1. ローカルで`npm run dev`を実行
2. ブラウザで http://localhost:3000 にアクセス
3. 投稿してみる
4. 別のブラウザ/シークレットウィンドウでも開いて、リアルタイム同期を確認

## トラブルシューティング

### 投稿できない場合
- `.env.local`の環境変数が正しく設定されているか確認
- Supabaseダッシュボードで匿名認証が有効になっているか確認
- ブラウザのコンソールでエラーを確認

### リアルタイム同期されない場合
- Supabaseダッシュボードでリアルタイムが有効になっているか確認
- ネットワーク接続を確認
- ブラウザの開発者ツールでWebSocket接続を確認

### その他の問題
- Supabaseのダッシュボードで「Logs」→「API logs」でエラーを確認
- RLSポリシーが正しく設定されているか確認