import { getProfileByLinkedInId } from "@/lib/profiles";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { PageProps } from "@/types/next";
import { InquiryForm } from "@/components/InquiryForm";

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

  const connectionsLabel: Record<string, string> = {
    under_100: "〜100人",
    "100_500": "100〜500人",
    "500_1000": "500〜1,000人",
    over_1000: "1,000人以上",
  };

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

        {/* 所属・つながり数 */}
        {(profile.company || profile.role || profile.linkedin_connections) && (
          <div className="flex flex-wrap gap-2">
            {profile.company && (
              <span className="text-sm bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                🏢 {profile.company}
              </span>
            )}
            {profile.role && (
              <span className="text-sm bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                💼 {profile.role}
              </span>
            )}
            {profile.linkedin_connections && (
              <span className="text-sm bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                👥 {connectionsLabel[profile.linkedin_connections]}のつながり
              </span>
            )}
          </div>
        )}

        {/* 過去の所属会社 */}
        {profile.past_companies && profile.past_companies.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">経歴（自己申告）</p>
            <div className="flex flex-wrap gap-3">
              {profile.past_companies.map((c) => (
                <CompanyBadge key={c} name={c} />
              ))}
            </div>
            {profile.linkedin_url && (
              <p className="text-xs text-gray-400 mt-2">
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
                  プロフィールURLを確認する →
                </a>
              </p>
            )}
          </div>
        )}

        {/* 成果物メニュー */}
        {services.length > 0 && (
          <div className="space-y-6">
            {/* スポット成果物 */}
            {services.filter((s) => s.service_type !== "ongoing").length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  スポット成果物
                </h2>
                <div className="space-y-3">
                  {services.filter((s) => s.service_type !== "ongoing").map((s) => (
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

            {/* 継続サポート */}
            {services.filter((s) => s.service_type === "ongoing").length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
                  継続サポート
                </h2>
                <div className="space-y-3">
                  {services.filter((s) => s.service_type === "ongoing").map((s) => (
                    <div key={s.id} className="border border-purple-200 bg-purple-50 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{s.title}</h3>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">継続</span>
                          </div>
                          {s.frequency && (
                            <p className="text-xs text-purple-600 mb-1 font-medium">{s.frequency}</p>
                          )}
                          {s.description && (
                            <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-purple-700 font-bold">¥{s.price.toLocaleString()}<span className="text-xs font-normal">/月</span></div>
                          <div className="text-xs text-gray-400 mt-0.5">{s.days}ヶ月〜</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {services.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
            成果物メニューは準備中です
          </div>
        )}

        {/* 問い合わせフォーム */}
        <InquiryForm proLinkedInId={id} services={services} />
      </div>
    </div>
  );
}

function CompanyBadge({ name }: { name: string }) {
  const domain = name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <span className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2 rounded-xl shadow-sm">
      <span className="relative flex-shrink-0 w-5 h-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          width={20}
          height={20}
          className="rounded-sm object-contain w-5 h-5"
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = "none";
            const fb = el.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
        <span className="absolute inset-0 hidden items-center justify-center bg-gray-100 rounded-sm text-gray-500 font-bold text-xs">
          {initials}
        </span>
      </span>
      {name}
    </span>
  );
}
