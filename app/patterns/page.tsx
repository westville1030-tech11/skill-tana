import Link from "next/link";

const recipes = [
  {
    goal: "上司への提案を通したい",
    steps: [
      { label: "AIで骨子作成", desc: "論点・構成をAIに叩き台として出させる" },
      { label: "プロが示唆を付与", desc: "業界経験者が「刺さる切り口」に磨き上げる" },
      { label: "赤ペン添削", desc: "実務者の目線で「この表現はNGだよ」を入れてもらう" },
    ],
    outcome: "説得力のある1枚スライドが完成",
    color: "blue",
  },
  {
    goal: "新規事業のタネを探したい",
    steps: [
      { label: "市場データをAIで整理", desc: "業界レポート・数字をAIに読み込ませて概観を作る" },
      { label: "複数プロに同じデータを渡す", desc: "「戦略」「データ分析」「現場知識」など異なる専門家3人に並行依頼" },
      { label: "視点を比較する", desc: "それぞれの切り口を並べて、重なる部分がチャンスの芽" },
    ],
    outcome: "一人では出ない多角的な示唆が集まる",
    color: "purple",
  },
  {
    goal: "自分のアウトプットの質を上げたい",
    steps: [
      { label: "自分でAIにドラフトを作らせる", desc: "まず自力でAIを使って成果物を作ってみる" },
      { label: "プロに赤ペンを入れてもらう", desc: "「どこが甘いか」をズバリ指摘してもらう" },
      { label: "プロンプトと思考ロジックも購入", desc: "どう考えて修正したかをセットで学ぶ" },
    ],
    outcome: "次回から自分で再現できるスキルが身につく",
    color: "emerald",
  },
];

const colorMap = {
  blue: {
    badge: "bg-blue-100 text-blue-700",
    step: "bg-blue-600",
    connector: "bg-blue-200",
    outcome: "bg-blue-50 border-blue-100 text-blue-800",
    border: "border-blue-100",
  },
  purple: {
    badge: "bg-purple-100 text-purple-700",
    step: "bg-purple-600",
    connector: "bg-purple-200",
    outcome: "bg-purple-50 border-purple-100 text-purple-800",
    border: "border-purple-100",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    step: "bg-emerald-600",
    connector: "bg-emerald-200",
    outcome: "bg-emerald-50 border-emerald-100 text-emerald-800",
    border: "border-emerald-100",
  },
};

const patterns = [
  {
    num: "01",
    name: "プレ・ワーク型",
    tag: "壁打ち",
    desc: "相談セッション前にAIで分析レポートを作っておき、それを持ってプロとの60分に臨む。「何を相談すればいいかわからない」を防ぎ、最初から深い議論ができる。",
  },
  {
    num: "02",
    name: "赤ペン先生型",
    tag: "添削",
    desc: "0から作るのではなく、手元の資料やAIの出力をプロに投げて磨いてもらう。安く、かつ自分のアウトプットの質が劇的に上がる。",
  },
  {
    num: "03",
    name: "スキル盗み型",
    tag: "学習",
    desc: "成果物だけでなく、プロが使ったプロンプトと修正の思考プロセスをセットで購入する。次回からは自分で再現できるようになる。",
  },
  {
    num: "04",
    name: "バトン型",
    tag: "リレー",
    desc: "戦略 → データ分析 → エンジニアリングと、異なる専門家を数珠つなぎにする。バラバラな「点」のスキルが同じプラットフォーム内で「線」になる。",
  },
  {
    num: "05",
    name: "競合・市場調査型",
    tag: "一次情報",
    desc: "AIドラフトを叩き台に「これ、現場の実態と合ってますか？」と業界経験者に聞く。ネットやAIが拾えない生々しい一次情報だけをピンポイントで手に入れられる。",
  },
];

export default function PatternsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">← トップに戻る</Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">発注の型（レシピ）</h1>
      <p className="text-center text-gray-400 mb-2">「何を頼むか」ではなく「どうなりたいか」から逆引きする</p>
      <p className="text-center text-sm text-gray-400 mb-14">目的を選んで、そのままプロへの依頼文に使えます</p>

      {/* レシピカード */}
      <div className="space-y-6 mb-16">
        {recipes.map((r) => {
          const c = colorMap[r.color as keyof typeof colorMap];
          return (
            <div key={r.goal} className={`bg-white border ${c.border} rounded-2xl p-7`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">こんな時</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${c.badge}`}>{r.goal}</span>
              </div>

              {/* ステップフロー */}
              <div className="space-y-3 mb-6">
                {r.steps.map((s, i) => (
                  <div key={s.label}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${c.step} text-white flex items-center justify-center text-xs font-black mt-0.5`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                    {i < r.steps.length - 1 && (
                      <div className={`ml-3 w-0.5 h-3 ${c.connector} mt-1`} />
                    )}
                  </div>
                ))}
              </div>

              {/* アウトカム */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${c.outcome}`}>
                <span className="text-sm font-black">→</span>
                <span className="text-sm font-semibold">{r.outcome}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 発注パターン一覧 */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">発注パターン 5種</p>
        <div className="space-y-3">
          {patterns.map((p) => (
            <div key={p.num} className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4">
              <div className="flex-shrink-0">
                <span className="num text-xs font-black text-gray-300">{p.num}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{p.tag}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/browse" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
          棚を見る →
        </Link>
      </div>
    </div>
  );
}
