# WithCrew デプロイ手順

## 全体の流れ（所要時間：約1時間）

1. GitHubアカウント作成・コードアップロード
2. Supabaseデータベース作成
3. LinkedIn OAuth設定
4. Vercelデプロイ

---

## ① GitHubアカウント作成

1. https://github.com にアクセス
2. 「Sign up」→ メールアドレスで登録
3. 新しいリポジトリを作成
   - Repository name: `withcrew`
   - Public or Private: どちらでも可
   - 「Create repository」をクリック

4. このフォルダをGitHubにアップロード
   - 表示されたコマンドをターミナルで実行：
   ```
   git remote add origin https://github.com/[あなたのユーザー名]/withcrew.git
   git branch -M main
   git push -u origin main
   ```

---

## ② Supabaseデータベース作成（無料）

1. https://supabase.com にアクセス → 「Start your project」
2. GitHubでサインアップ
3. 「New project」→ プロジェクト名: `withcrew`、パスワード設定、リージョン: `Northeast Asia (Tokyo)`
4. プロジェクト作成後、左メニュー「SQL Editor」をクリック
5. `supabase-schema.sql` の内容を貼り付けて「Run」実行

6. 設定値を取得：
   - 「Project Settings」→「API」
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`（⚠️ 公開しない）

---

## ③ LinkedIn OAuth設定

1. https://www.linkedin.com/developers/ にアクセス
2. 「My Apps」→「Create App」
3. 入力内容：
   - App name: `WithCrew`
   - LinkedIn Page: 自分のLinkedInページURL
   - App logo: 任意
4. 「Auth」タブ → OAuth 2.0 settings
5. Authorized redirect URLs に追加：
   ```
   https://[あなたのVercelドメイン].vercel.app/api/auth/callback/linkedin
   ```
6. 「Products」タブ → `Sign In with LinkedIn using OpenID Connect` をリクエスト・承認

7. 設定値を取得：
   - `Client ID` → `LINKEDIN_CLIENT_ID`
   - `Client Secret` → `LINKEDIN_CLIENT_SECRET`

---

## ④ Vercelデプロイ（無料）

1. https://vercel.com にアクセス → GitHubでサインアップ
2. 「New Project」→ GitHubのwithcrewリポジトリを選択
3. 「Environment Variables」に以下を設定：

| 変数名 | 値 |
|--------|-----|
| `NEXTAUTH_URL` | `https://[あなたのドメイン].vercel.app` |
| `NEXTAUTH_SECRET` | ランダム文字列（後述） |
| `LINKEDIN_CLIENT_ID` | LinkedInのClient ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedInのClient Secret |
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのProject URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseのanon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseのservice_role key |

4. `NEXTAUTH_SECRET` の生成方法（ターミナルで）：
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. 「Deploy」をクリック → 数分で完了

---

## ⑤ ドメイン設定（任意）

- お名前.comやムームードメインでドメイン取得（年1,500円〜）
- Vercelの「Domains」設定で紐づけ

---

## 完成後の確認チェックリスト

- [ ] トップページが表示される
- [ ] 「LinkedInでログイン」ボタンが機能する
- [ ] プロフィール編集・保存ができる
- [ ] 「プロを探す」ページに自分が表示される

---

## トラブル時の連絡先

LinkedIn: https://www.linkedin.com/in/kimikatsu-nishimura
