# うんこSNS - Vercelデプロイガイド

このガイドでは、うんこSNSをVercelにデプロイして世界中で使えるようにする手順を説明します。

## 📋 事前準備

### 1. 必要なアカウント
- [ ] GitHubアカウント
- [ ] Vercelアカウント（https://vercel.com）
- [ ] Supabaseプロジェクト（作成済み）

### 2. ローカル環境の準備
- [ ] Node.js 18以上がインストールされている
- [ ] Gitがインストールされている
- [ ] プロジェクトが正常に動作している

## 🚀 デプロイ手順

### ステップ1: GitHubリポジトリの作成

1. GitHubで新しいリポジトリを作成
   - リポジトリ名: `unkosns`（任意）
   - Public/Privateどちらでも可
   - READMEは追加しない（既にあるため）

2. ローカルプロジェクトをGitリポジトリとして初期化
   ```bash
   cd /path/to/unkosns
   git init
   git add .
   git commit -m "Initial commit: うんこSNS"
   ```

3. GitHubリポジトリと連携
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/unkosns.git
   git branch -M main
   git push -u origin main
   ```

### ステップ2: Vercelでプロジェクトをインポート

1. [Vercel](https://vercel.com)にログイン

2. 「New Project」をクリック

3. GitHubアカウントを連携（初回のみ）

4. 作成したリポジトリ（unkosns）を選択

5. プロジェクト設定
   - Framework Preset: `Next.js`（自動検出される）
   - Root Directory: そのまま
   - Build Command: そのまま（`npm run build`）
   - Output Directory: そのまま

### ステップ3: 環境変数の設定

Vercelのプロジェクト設定で環境変数を追加：

1. プロジェクトダッシュボード → Settings → Environment Variables

2. 以下の環境変数を追加：
   ```
   NEXT_PUBLIC_SUPABASE_URL = [あなたのSupabaseプロジェクトURL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [あなたのSupabase匿名キー]
   ```

3. 「Save」をクリック

### ステップ4: デプロイ実行

1. 「Deploy」ボタンをクリック

2. デプロイが完了するまで待つ（通常2-3分）

3. 完了したら、提供されたURLでアクセス可能に！
   例: `https://unkosns.vercel.app`

## 🎯 デプロイ後の確認事項

### 基本動作確認
- [ ] サイトにアクセスできる
- [ ] 投稿ができる
- [ ] リアクションができる
- [ ] リアルタイム同期が動作する

### Supabase設定確認
1. Supabaseダッシュボード → Authentication → URL Configuration
2. 「Site URL」にVercelのURLを追加
   ```
   https://your-app.vercel.app
   ```

### セキュリティ設定
1. Supabaseダッシュボード → Settings → API
2. 「Allowed Origins」にVercelのURLを追加

## 🌐 カスタムドメインの設定（オプション）

独自ドメインを使いたい場合：

1. Vercelプロジェクト → Settings → Domains
2. 「Add」をクリックしてドメインを入力
3. DNSレコードを設定（表示される指示に従う）

## 🔧 トラブルシューティング

### デプロイが失敗する場合
- Node.jsのバージョンを確認（package.jsonで指定可能）
- ビルドログを確認
- 環境変数が正しく設定されているか確認

### Supabaseとの接続エラー
- 環境変数が正しいか確認
- Supabaseの匿名認証が有効か確認
- CORSの設定を確認

### リアルタイム同期が動作しない
- Supabaseのリアルタイムが有効か確認
- WebSocketの接続を確認

## 📚 参考リンク
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

---

デプロイ完了後、世界中の人と「うんこ」を共有しましょう！ 💩