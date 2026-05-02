import Link from "next/link";
import { getProfiles } from "@/lib/profiles";
import type { Profile, Service } from "@/lib/database.types";

const categories = [
  { value: "all", label: "すべて" },
  { value: "consultant", label: "コンサルタント" },
  { value: "engineer", label: "エンジニア" },
  { value: "designer", label: "デザイナー" },
  { value: "other", label: "その他" },
];

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

type SearchParams = Promise<{ category?: string }>;

type ServiceCard = { service: Service; profile: Profile };

export default async function BrowsePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const category = searchParams.category ?? "all";

  let profiles: Profile[] = [];
  try {
    profiles = await getProfiles(category);
  } catch {
    profiles = [];
  }

  // プロフィール → サービス単位に展開
  const cards: ServiceCard[] = profiles.flatMap((profile) =>
    (profile.services ?? []).map((service) => ({ service, profile }))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">イチバの棚</h1>
      <p className="text-gray-500 text-sm mb-8">経験商品一覧</p>

      {/* カテゴリフィルター */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <a
            key={cat.value}
            href={`/browse?category=${cat.value}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.value
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">まだ登録がありません</p>
          <p className="text-sm">最初の一人になりませんか？</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map(({ service, profile }) => (
            <ServiceCardItem key={service.id} service={service} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceCardItem({ service, profile }: ServiceCard) {
  const avail = availabilityLabel[profile.availability ?? ""] ?? null;
  const company = profile.company_display ?? profile.company;

  return (
    <Link
      href={`/profile/${profile.linkedin_id}`}
      className="block bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all flex flex-col gap-4"
    >
      {/* バッジ行 */}
      <div className="flex items-center gap-2 flex-wrap">
        {profile.category && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-medium">
            {categoryLabel[profile.category]}
          </span>
        )}
        {avail && (
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${avail.color}`}>
            {avail.label}
          </span>
        )}
        {company && (
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">
            {company}
          </span>
        )}
      </div>

      {/* タイトル・説明 */}
      <div>
        <h2 className="font-bold text-gray-900 text-base leading-snug mb-1.5">
          {service.title}
        </h2>
        {service.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        )}
      </div>

      {/* 実体験 */}
      {service.experience_story && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-[11px] font-bold text-amber-700 mb-1.5">💬 実体験</p>
          <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
            「{service.experience_story}」
          </p>
        </div>
      )}

      {/* 価格・納期 */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-lg font-black text-blue-700">
          ¥{service.price.toLocaleString()}
        </span>
        <span className="text-xs text-gray-400">
          {service.service_type === "ongoing"
            ? `${service.days}ヶ月〜`
            : `${service.days}日以内`}
        </span>
      </div>
    </Link>
  );
}
