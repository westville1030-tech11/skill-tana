import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 経験イチバ",
};

const sections = [
  {
    title: "1. 収集する情報",
    body: `本サービスでは、以下の情報を収集します。\n\n【アカウント情報】\n・LINEアカウント連携時に取得するプロフィール情報（表示名・プロフィール画像・LINEユーザーID）\n・任意で入力する法人メールアドレス（法人認証用）\n・プロフィールに登録した職歴・経験・成果物情報\n\n【利用情報】\n・問い合わせ・メッセージの内容\n・AIとの対話内容（成果物ドラフト生成時）\n・アクセスログ（IPアドレス・ブラウザ情報・閲覧ページ）`,
  },
  {
    title: "2. 利用目的",
    body: `収集した情報は以下の目的で利用します。\n\n・本サービスの提供・運営・改善\n・ユーザー認証・本人確認\n・出品者と発注者のマッチング支援\n・AI機能（商品化提案・要件整理・品質確認）の提供\n・不正利用の検知・防止\n・サービスに関する重要なお知らせの送信\n・利用統計の集計・分析（個人を特定しない形）`,
  },
  {
    title: "3. 第三者への提供",
    body: `運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。\n\n・ユーザー本人の同意がある場合\n・法令に基づき開示が必要な場合\n・人の生命・身体・財産の保護のために必要な場合\n\n【業務委託先への提供】\nサービス運営のため、以下のサービスに情報を提供することがあります。\n・Supabase（データベース・認証）：米国\n・Vercel（ホスティング）：米国\n・Anthropic（AI機能）：米国\n・Resend（メール配信）：米国\n\nいずれも適切なデータ保護措置を講じている事業者です。`,
  },
  {
    title: "4. データの保管・セキュリティ",
    body: `収集した個人情報は、Supabaseのセキュアなデータベースに保管します。アクセス制御・暗号化通信（HTTPS）を実施し、不正アクセス防止に努めます。ただし、インターネット上の完全なセキュリティを保証することはできません。`,
  },
  {
    title: "5. Cookieおよびアクセス解析",
    body: `本サービスは、セッション管理のためにCookieを使用します。また、サービス改善のためGoogle Analytics等のアクセス解析ツールを使用することがあります。ブラウザの設定によりCookieを無効にできますが、その場合一部機能が利用できなくなる場合があります。`,
  },
  {
    title: "6. AIへの情報提供",
    body: `成果物の商品化提案・要件整理・品質確認など、AI機能を利用する際、入力内容がAnthropicのAPIに送信されます。機密性の高い個人情報・企業秘密等をAIチャットに入力しないことを推奨します。AI処理されたデータの取り扱いは、Anthropicのプライバシーポリシーにも準じます。`,
  },
  {
    title: "7. 開示・訂正・削除の請求",
    body: `ユーザーは、自身の個人情報について開示・訂正・削除を請求できます。請求はプロフィール設定画面から、または下記お問い合わせ先からご連絡ください。本人確認のうえ、合理的な期間内に対応します。`,
  },
  {
    title: "8. 未成年者の利用",
    body: `本サービスは18歳以上を対象としています。18歳未満の方が利用する場合は、保護者の同意が必要です。`,
  },
  {
    title: "9. プライバシーポリシーの変更",
    body: `本ポリシーは、法令の改正・サービスの変更等に応じて改訂することがあります。重要な変更の場合は、サービス内でお知らせします。変更後も本サービスを継続利用した場合、変更後のポリシーに同意したものとみなします。`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <Link href="/" className="text-sm text-teal-600 hover:underline">← トップへ戻る</Link>
        <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-gray-400">最終更新日：2025年5月</p>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-10">
        経験イチバ運営事務局（以下「運営者」）は、本サービスにおけるユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
      </p>

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-bold text-gray-900 mb-3">{s.title}</h2>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.body}</div>
          </section>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-400">
        <p className="font-bold text-gray-600 mb-1">お問い合わせ先</p>
        <p>経験イチバ運営事務局</p>
        <p>メール：<a href="mailto:info@keiken-ichiba.com" className="text-teal-600 hover:underline">info@keiken-ichiba.com</a></p>
      </div>
    </div>
  );
}
