import Link from "next/link";
import type { Profile } from "@/lib/database.types";

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

export function ProfileCard({ profile }: { profile: Profile }) {
  const avail = availabilityLabel[profile.availability ?? ""] ?? null;

  return (
    <Link
      href={`/profile/${profile.linkedin_id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
          <PersonIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <LockIcon /> 名前は非公開
            </span>
            {profile.category && (
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {categoryLabel[profile.category]}
              </span>
            )}
            {avail && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${avail.color}`}>
                {avail.label}
              </span>
            )}
          </div>
          {profile.services && profile.services.length > 0 ? (
            <div className="mt-2 space-y-1.5">
              {profile.services.slice(0, 2).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-600 truncate">{s.title}</span>
                  <span className="text-xs font-semibold text-blue-700 flex-shrink-0">
                    ¥{s.price.toLocaleString()}
                  </span>
                </div>
              ))}
              {profile.services.length > 2 && (
                <p className="text-xs text-gray-400">他 {profile.services.length - 2} 件</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2">成果物メニュー準備中</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function PersonIcon() {
  return (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}
