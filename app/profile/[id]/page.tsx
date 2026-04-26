import { getProfileByLinkedInId } from "@/lib/profiles";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { PageProps } from "@/types/next";

const categoryLabel: Record<string, string> = {
  consultant: "コンサルタント",
  engineer: "エンジニア",
  designer: "デザイナー",
  other: "その他",
};

const availabilityLabel: Record<string, { label: string; color: string }> = {
  available: { label: "稼働可能", color: "bg-green-100 text-green-700" },
  "part-time": { label: "副業可", color: "bg-yellow-100 text-yellow-700" },
  busy: { label: "稼働不可", color: "bg-gray-100 text-gray-500" },
};

export default async function ProfilePage(props: PageProps<"/profile/[id]">) {
  const { id } = await props.params;

  let profile = null;
  try {
    profile = await getProfileByLinkedInId(id);
  } catch {
    // Supabase未設定時
  }

  if (!profile) notFound();

  const avail = availabilityLabel[profile.availability ?? ""] ?? null;
  const services = profile.services ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/browse" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← プロ一覧に戻る
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">

        {/* ヘッダー */}
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-2">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
              </svg>
              名前は依頼を承認した時点で公開されます
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.category && (
                <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                  {categoryLabel[profile.category]}
                </span>
              )}
              {avail && (
                <span className={`text-sm px-3 py-1 rounded-full ${avail.color}`}>
                  {avail.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* LinkedIn信頼バッジ */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <LinkedInIcon />
            <span className="font-semibold text-blue-800 text-sm">LinkedIn認証済みのプロ</span>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            このプロはLinkedInアカウントで本人確認済みです。
            職歴・スキル・つながり数はLinkedInプロフィールで直接ご確認ください。
          </p>
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <LinkedInIcon small />
              LinkedInプロフィールを確認する
            </a>
          )}
        </div>

        {/* 成果物メニュー */}
        {services.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              成果物メニュー
            </h2>
            <div className="space-y-3">
              {services.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      {s.description && (
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-blue-700 font-bold">¥{s.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.days}日以内</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {services.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
            成果物メニューは準備中です
          </div>
        )}

        {/* 発注ボタン */}
        {profile.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white py-4 rounded-xl font-medium hover:bg-blue-800 transition-colors text-base"
          >
            <LinkedInIcon />
            LinkedInで発注を相談する
          </a>
        )}
      </div>
    </div>
  );
}

function LinkedInIcon({ small }: { small?: boolean }) {
  return (
    <svg className={small ? "w-4 h-4" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
