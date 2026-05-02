import { getProfiles } from "@/lib/profiles";
import { ProfileCard } from "@/components/ProfileCard";

const categories = [
  { value: "all", label: "すべて" },
  { value: "consultant", label: "コンサルタント" },
  { value: "engineer", label: "エンジニア" },
  { value: "designer", label: "デザイナー" },
  { value: "other", label: "その他" },
];

type SearchParams = Promise<{ category?: string }>;

export default async function BrowsePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const category = searchParams.category ?? "all";

  let profiles = [];
  try {
    profiles = await getProfiles(category);
  } catch {
    // Supabase未設定時はサンプルデータを表示
    profiles = sampleProfiles;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">イチバの棚</h1>
      <p className="text-gray-600 mb-8">
        経験商品一覧
      </p>

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

      {profiles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">まだ登録者がいません</p>
          <p className="text-sm">最初の一人になりませんか？</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}

// Supabase未設定時のサンプル表示用
const sampleProfiles = [
  {
    id: "1",
    linkedin_id: "sample1",
    name: "",
    email: null,
    image: null,
    headline: "元大手コンサル10年 → Claude活用で独立。戦略策定から実行支援まで一人で完結。",
    bio: null,
    skills: ["戦略策定", "DX推進", "組織変革"],
    ai_tools: ["Claude", "GPT-4", "Perplexity"],
    category: "consultant" as const,
    linkedin_url: null,
    hourly_rate: "相談ベース",
    availability: "available" as const,
    services: null,
    company: null,
    role: null,
    linkedin_connections: null,
    past_companies: ["McKinsey", "Accenture"],
    linkedin_verified: true,
    corporate_email_verified: null,
    corporate_email_domain: null,
    card_verified: null,
    card_company: null,
    card_role: null,
    password_hash: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    linkedin_id: "sample2",
    name: "",
    email: null,
    image: null,
    headline: "フルスタックエンジニア。Claude Codeでプロダクト開発速度3倍。MVP開発を専門とする。",
    bio: null,
    skills: ["Next.js", "TypeScript", "AWS"],
    ai_tools: ["Claude Code", "GitHub Copilot"],
    category: "engineer" as const,
    linkedin_url: null,
    hourly_rate: "¥15,000/h",
    availability: "part-time" as const,
    services: null,
    company: null,
    role: null,
    linkedin_connections: null,
    past_companies: null,
    linkedin_verified: false,
    corporate_email_verified: null,
    corporate_email_domain: null,
    card_verified: null,
    card_company: null,
    card_role: null,
    password_hash: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
