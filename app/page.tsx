import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start gap-2 mb-8">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-sm font-medium px-5 py-2 rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block flex-shrink-0" />
                  当サイトは、AIが運営・設計の大半を担っているため、発注・受注者側の当サイト利用に伴う費用負担は一切ありません
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5 tracking-tight">
                あなたの経験を、<br />
                <span className="text-blue-300">誰かの答えに。</span>
              </h1>
              <p className="text-slate-300 mb-4 leading-relaxed text-lg">
                現役もOBも、定年後も。積み上げてきた経験は<br className="hidden md:block" />
                次の世代にとって、何よりの教科書になる。
              </p>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                AIが商品化を手伝うから、ゼロから考えなくていい。
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* 経験者 */}
                <div className="bg-white/8 border border-white/15 rounded-2xl p-5 flex flex-col gap-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    「自分の経験が商品化できるなんて、考えたこともなかった…」
                  </p>
                  <Link href="/try"
                    className="mt-auto block text-center bg-gradient-to-r from-amber-500 to-amber-400 text-white py-3 px-4 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-amber-900/30">
                    AIに相談して商品化提案を受けてみる →
                  </Link>
                </div>
                {/* 発注者 */}
                <div className="bg-white/8 border border-white/15 rounded-2xl p-5 flex flex-col gap-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    「課題をどう伝えて発注するか、不安…」
                  </p>
                  <Link href="/request"
                    className="mt-auto block text-center bg-white/15 border border-white/25 text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors">
                    曖昧なままAIに伝え、壁打ちの上で発注提案を受けてみる →
                  </Link>
                </div>
              </div>
              <div className="text-center lg:text-left mb-12">
                <Link href="/browse" className="text-slate-400 text-sm hover:text-white transition-colors">
                  まずイチバの棚を見てみる →
                </Link>
              </div>

              {/* 統計 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/8 border border-white/10 rounded-xl px-4 py-4 text-center">
                    <div className="num text-2xl font-black text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: abstract graphic */}
            <div className="flex-shrink-0 w-full lg:w-96 xl:w-[440px] opacity-80">
              <HeroGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* 全部ゼロ */}
      <section className="py-5 px-4 bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {zeroItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <span className="num text-emerald-600 font-black">¥0</span>
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 仕組み図 */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">利用料ゼロの仕組</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[600px]">
              <ConceptDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* 固定価格の考え方 */}
      <section className="py-28 px-4 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">固定価格とAIの話</h2>
          <p className="text-center text-gray-400 mb-12">時間を売るか、経験を届けるか。それがAI時代の分岐点。</p>
          <FixedPriceDiagram />
        </div>
      </section>

      {/* 競合比較 */}
      <section className="py-28 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">他のサービスとの違い</h2>
          <p className="text-center text-gray-400 mb-14">経験イチバが「成果物×固定価格×AI」にこだわる理由</p>
          <ComparisonTable />
        </div>
      </section>

      {/* AIが伴走する両側設計 */}
      <section className="py-28 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">まず、AIに話しかけてみてください</h2>
          <p className="text-center text-gray-400 mb-14">発注も、出品も、最初の一歩はAIと一緒に。</p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* 経験者として登録したい人 */}
            <div className="bg-white rounded-2xl border border-amber-100 p-7 flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">経験者として登録したい人へ</span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 leading-snug">「自分の経験が商品化できるなんて、考えたこともなかった…」</h3>
                <p className="text-sm text-gray-500 leading-relaxed">まずはAIに経験を話してみてください。あなたの経験をもとに、商品提案を受けられます。</p>
              </div>
              <div className="space-y-2">
                {[
                  { step: "1", label: "経験を話す or 仕事に関係するファイルをアップ" },
                  { step: "2", label: "AIが商品タイトル・価格・実体験を生成" },
                  { step: "3", label: "確認してイチバに出品" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{s.step}</span>
                    <span className="text-sm text-gray-700">{s.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/try" className="mt-auto block text-center bg-amber-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors">
                AIに経験を話してみる →
              </Link>
            </div>

            {/* 発注したい人 */}
            <div className="bg-white rounded-2xl border border-blue-100 p-7 flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">発注したい人へ</span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 leading-snug">「課題をどう伝えて発注するか、不安…」</h3>
                <p className="text-sm text-gray-500 leading-relaxed">まずはAIに発注相談をしてみてください。何を頼めばいいか整理できていなくても大丈夫です。</p>
              </div>
              <div className="space-y-2">
                {[
                  { step: "1", label: "課題を自由に入力" },
                  { step: "2", label: "AIが3回、深掘り質問" },
                  { step: "3", label: "整理された依頼で経験者を探す" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{s.step}</span>
                    <span className="text-sm text-gray-700">{s.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/request" className="mt-auto block text-center bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                AIに発注相談してみる →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 発注から納品までのフロー */}
      <section className="py-28 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">発注から納品まで</h2>
          <p className="text-center text-gray-400 mb-14">AIが両側の精度を上げ、経験者の知見が価値を生む</p>

          <div className="flex flex-col md:flex-row items-start">
            {deliveryFlow.map((step, i) => (
              <div key={step.title} className="flex md:flex-col flex-row items-start md:items-center flex-1">
                <div className="flex md:flex-col flex-row items-start md:items-center gap-4 md:gap-3 md:text-center w-full">
                  <div className="num flex-shrink-0 w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 pb-8 md:pb-0 md:px-3">
                    {step.badge && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 bg-blue-100 text-blue-700">
                        {step.badge}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{step.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                    <span className="num text-xs text-blue-500 font-bold">{step.time}</span>
                  </div>
                </div>
                {i < deliveryFlow.length - 1 && (
                  <div className="md:hidden flex-shrink-0 w-0.5 h-6 bg-gray-200 ml-5" />
                )}
                {i < deliveryFlow.length - 1 && (
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center pt-5 px-1 text-gray-200 text-sm">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 修正1回保証 */}
      <section className="py-5 px-4 bg-blue-50 border-y border-blue-100">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
          <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full flex-shrink-0">プラットフォーム保証</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            経験イチバのすべての取引には、<span className="text-blue-600 font-medium">修正1回が標準で含まれます。</span>
            着手前に要件を確認した上で進めるため、納品後の認識ズレを最小化します。
          </p>
        </div>
      </section>

      {/* 経験→商品化 事例 */}
      <section className="py-28 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">こんな経験が、商品になります</h2>
          <p className="text-center text-gray-400 mb-14">AIが実体験を整理して、誰かに届く形に変えます</p>

          <div className="space-y-8">
            {commercializationCases.map((c) => (
              <div key={c.role} className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                {/* 左：実体験 */}
                <div className="bg-amber-50 p-6 flex flex-col gap-3">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full self-start">{c.role}</span>
                  <p className="text-xs font-semibold text-amber-800 mb-1">経験者が語った事実</p>
                  <blockquote className="text-sm text-gray-700 leading-relaxed border-l-2 border-amber-300 pl-3 italic">
                    「{c.experience}」
                  </blockquote>
                </div>
                {/* 右：商品化案 */}
                <div className="bg-white p-6 flex flex-col gap-3 border-l border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">AIの商品化案</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm leading-snug">{c.productTitle}</p>
                  <ul className="space-y-1.5">
                    {c.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                        <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="num text-blue-700 font-black text-base">{c.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 登録方法 */}
      <section className="py-28 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">登録方法</h2>
          <p className="text-center text-gray-400 mb-12">スキルをイチバの棚に並べるまで30秒</p>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-blue-100 transition-colors">
                <div className="num w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black mb-5">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">今すぐイチバの棚に並べる</h2>
          <p className="text-slate-300 mb-6">メールアドレスがあれば30秒で登録完了。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/try"
              className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-10 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/50">
              スキルを登録
            </Link>
            <Link href="/browse"
              className="border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
              イチバの棚を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- ヒーロー抽象グラフィック ---- */
function HeroGraphic() {
  return (
    <svg viewBox="0 0 480 360" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="240" cy="180" r="200" fill="url(#bg)" />

      {/* グリッド */}
      {[60, 120, 180, 240, 300].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="480" y2={y} stroke="#60a5fa" strokeWidth="0.5" strokeOpacity="0.12" />
      ))}
      {[80, 160, 240, 320, 400].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="360" stroke="#60a5fa" strokeWidth="0.5" strokeOpacity="0.12" />
      ))}

      {/* エッジ */}
      <line x1="110" y1="80" x2="240" y2="180" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.45" />
      <line x1="370" y1="80" x2="240" y2="180" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.45" />
      <line x1="240" y1="180" x2="150" y2="285" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.45" />
      <line x1="240" y1="180" x2="370" y2="285" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.45" />
      <line x1="60" y1="195" x2="240" y2="180" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="430" y1="195" x2="240" y2="180" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="110" y1="80" x2="60" y2="195" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.2" />
      <line x1="370" y1="80" x2="430" y2="195" stroke="#60a5fa" strokeWidth="0.8" strokeOpacity="0.2" />

      {/* 外側ノード */}
      <circle cx="110" cy="80" r="7" fill="url(#ng)" />
      <circle cx="110" cy="80" r="16" fill="#60a5fa" fillOpacity="0.1" />
      <circle cx="370" cy="80" r="7" fill="url(#ng)" />
      <circle cx="370" cy="80" r="16" fill="#60a5fa" fillOpacity="0.1" />
      <circle cx="60" cy="195" r="5" fill="url(#ng)" />
      <circle cx="60" cy="195" r="12" fill="#60a5fa" fillOpacity="0.08" />
      <circle cx="430" cy="195" r="5" fill="url(#ng)" />
      <circle cx="430" cy="195" r="12" fill="#60a5fa" fillOpacity="0.08" />
      <circle cx="150" cy="285" r="6" fill="url(#ng)" />
      <circle cx="150" cy="285" r="14" fill="#818cf8" fillOpacity="0.1" />
      <circle cx="370" cy="285" r="6" fill="url(#ng)" />
      <circle cx="370" cy="285" r="14" fill="#818cf8" fillOpacity="0.1" />

      {/* 中心ノード */}
      <circle cx="240" cy="180" r="18" fill="url(#ng)" />
      <circle cx="240" cy="180" r="36" fill="#3b82f6" fillOpacity="0.12" />
      <circle cx="240" cy="180" r="54" fill="#3b82f6" fillOpacity="0.06" />

      {/* ラベル */}
      <rect x="88" y="50" width="44" height="18" rx="5" fill="#1e3a8a" fillOpacity="0.65" />
      <text x="110" y="63" fontSize="8.5" fill="#93c5fd" textAnchor="middle" fontFamily="monospace" fontWeight="bold">DATA</text>
      <rect x="348" y="50" width="44" height="18" rx="5" fill="#1e3a8a" fillOpacity="0.65" />
      <text x="370" y="63" fontSize="8.5" fill="#93c5fd" textAnchor="middle" fontFamily="monospace" fontWeight="bold">SKILL</text>
      <rect x="216" y="190" width="48" height="18" rx="5" fill="#1e3a8a" fillOpacity="0.75" />
      <text x="240" y="203" fontSize="8.5" fill="#c4b5fd" textAnchor="middle" fontFamily="monospace" fontWeight="bold">MATCH</text>
    </svg>
  );
}

/* ---- 競合比較表 ---- */
function ComparisonTable() {
  const rows = [
    {
      label: "取引の単位",
      spot:   "時間（1h単位）",
      skill:  "スキル・作業単位",
      ours:   "成果物・経験パッケージ",
    },
    {
      label: "価格モデル",
      spot:   "時間給",
      skill:  "時間給 or 見積もり",
      ours:   "固定価格",
    },
    {
      label: "手数料",
      spot:   "〜30%",
      skill:  "〜20%",
      ours:   "¥0",
    },
    {
      label: "手元に残るもの",
      spot:   "会話・メモのみ",
      skill:  "△ サービス次第",
      ours:   "テンプレ・レポート等",
    },
    {
      label: "出品のしやすさ",
      spot:   "△ 準備が大変",
      skill:  "△ 文章力が必要",
      ours:   "◎ AIが一緒に作る",
    },
    {
      label: "発注の整理",
      spot:   "△ 自分で準備",
      skill:  "△ 仕様書が必要",
      ours:   "◎ AIと壁打ち",
    },
  ];

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="min-w-[600px]">
        {/* ヘッダー */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div />
          <div className="bg-gray-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs font-bold text-gray-500">スポットコンサル型</p>
            <p className="text-[10px] text-gray-400 mt-0.5">話す・1時間単位</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs font-bold text-amber-700">スキルマーケット型</p>
            <p className="text-[10px] text-amber-500 mt-0.5">作業・スキル単位</p>
          </div>
          <div className="bg-blue-600 rounded-2xl px-4 py-3 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">おすすめ</span>
            </div>
            <p className="text-xs font-bold text-white">経験イチバ</p>
            <p className="text-[10px] text-blue-200 mt-0.5">成果物・固定価格</p>
          </div>
        </div>

        {/* 行 */}
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-4 gap-3 items-center">
              <div className="text-xs font-semibold text-gray-600 text-right pr-2">{row.label}</div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-gray-500">{row.spot}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-amber-700">{row.skill}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs font-bold text-blue-700">{row.ours}</p>
              </div>
            </div>
          ))}
        </div>

        {/* まとめ一言 */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          <div />
          <div className="bg-gray-100 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[11px] text-gray-500 leading-snug">話して終わり。<br/>成果物が残らない。</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[11px] text-amber-700 leading-snug">手数料が高く、<br/>出品に文章力が要る。</p>
          </div>
          <div className="bg-blue-600 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[11px] text-white font-bold leading-snug">AIが出品・発注を<br/>両側からサポート。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- 固定価格 vs 時間給 比較 ---- */
function FixedPriceDiagram() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">

        {/* 時間給モデル */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex flex-col gap-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest">時間給モデル（従来型）</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏱</span>
              <div>
                <p className="text-sm font-bold text-gray-700">8時間の仕事</p>
                <p className="text-xs text-gray-400">時給¥1,500 → ¥12,000</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-1">
              <div className="w-5 flex flex-col items-center gap-0.5">
                <div className="w-px h-3 bg-gray-300" />
                <svg className="w-2.5 h-2.5 text-gray-300" fill="currentColor" viewBox="0 0 10 10"><path d="M2 0 L5 6 L8 0 Z" /></svg>
              </div>
              <span className="text-xs text-blue-500 font-medium">AIで1時間に短縮</span>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <span className="text-2xl">📉</span>
              <div>
                <p className="text-sm font-bold text-amber-800">収入：1時間分のみ</p>
                <p className="text-xs text-amber-600">¥1,500 に変わる</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-200 pt-3">
            AIが速くするほど、収入が変わる時代が来る。<br />
            効率化が自分の首を絞める構造。
          </p>
        </div>

        {/* 固定価格モデル */}
        <div className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-6 flex flex-col gap-4 relative">
          <div className="absolute -top-3.5 left-6">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">経験イチバ</span>
          </div>
          <p className="text-[10px] font-bold text-blue-400 tracking-widest mt-1">固定価格モデル</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white border border-blue-100 rounded-xl px-4 py-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="text-sm font-bold text-blue-800">¥30,000 で届けるもの（固定）</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-blue-100 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-gray-500">8時間かかっても</p>
                <p className="text-sm font-black text-blue-700">¥30,000</p>
              </div>
              <div className="bg-white border border-blue-100 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-gray-500">1時間で仕上げても</p>
                <p className="text-sm font-black text-blue-700">¥30,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="text-sm font-bold text-emerald-800">実質時給：青天井</p>
                <p className="text-xs text-emerald-600">AIを使うほど稼げる</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed border-t border-blue-200 pt-3">
            AIは「相棒」になる。経験×AIで、<br />
            新しい稼ぎ方にシフトできる。
          </p>
        </div>

      </div>

      {/* 一言まとめ */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200 px-6 py-4 text-center">
        <p className="text-sm text-gray-600 leading-relaxed">
          時間給で測られている限り、AIは向かい風になる。
          <span className="text-blue-600 font-bold"> 固定価格なら、AIは相棒になる。</span>
        </p>
      </div>
    </div>
  );
}

/* ---- 3行比較図（横フロー） ---- */
function ConceptDiagram() {
  return (
    <div className="space-y-3">

      {/* 従来型 */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-3">従来型</p>
        <div className="flex items-center">
          <DiagBox icon="🏢" label="クライアント" />
          <DiagArrow stretch />
          <DiagFee label="仲介会社" sub="20〜30%" red />
          <DiagArrow stretch />
          <DiagFee label="エージェント" sub="登録料・成約料" amber />
          <DiagArrow stretch />
          <DiagBox icon="💼" label="経験者" />
        </div>
      </div>

      {/* 直接系他社 */}
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50/40 px-5 py-4">
        <p className="text-[10px] font-bold text-yellow-600 tracking-widest mb-3">直接発注系 他社</p>
        <div className="flex items-center">
          <DiagBox icon="🏢" label="クライアント" />
          <DiagArrow stretch />
          <DiagFee label="プラットフォーム" sub="サービス料 〜20%" amber />
          <DiagArrow stretch />
          <DiagBox icon="💼" label="経験者" />
        </div>
      </div>

      {/* 経験イチバ */}
      <div className="rounded-2xl border-2 border-blue-400 bg-blue-50 px-5 py-4 relative">
        <div className="absolute -top-3.5 left-6 whitespace-nowrap">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">経験イチバ</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <DiagBox icon="🏢" label="クライアント" blue ai />
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-bold text-blue-700">直接発注</span>
              <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">🤖 AI運営</span>
            </div>
            <span className="text-[10px] text-blue-400">手数料・仲介料 すべて ¥0</span>
            <div className="w-full flex items-center">
              <div className="flex-1 h-px bg-blue-400" />
              <svg className="w-2.5 h-2.5 text-blue-400 -ml-px flex-shrink-0" fill="currentColor" viewBox="0 0 10 10">
                <path d="M0 2 L6 5 L0 8 Z" />
              </svg>
            </div>
          </div>
          <DiagBox icon="💼" label="経験者" blue ai />
        </div>
        <div className="mt-3 border-t border-blue-200 pt-2.5 flex gap-1.5 items-start">
          <span className="text-[11px] font-bold text-blue-700 whitespace-nowrap">なぜ¥0？</span>
          <p className="text-[11px] text-gray-500 leading-relaxed">AIが設計・開発・運営を担うため、人件費・オフィス費用がかかりません。コストはサーバー代のみ。</p>
        </div>
      </div>

    </div>
  );
}

function DiagBox({ icon, label, blue, ai }: { icon: string; label: string; blue?: boolean; ai?: boolean }) {
  return (
    <div className={`flex-shrink-0 rounded-xl border px-3 py-2 flex flex-col items-center gap-0.5 w-[88px] relative ${
      blue ? "bg-white border-blue-200" : "bg-white border-gray-200"
    }`}>
      {ai && (
        <span className="absolute -top-2.5 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">🤖 AI</span>
      )}
      <span className="text-xl">{icon}</span>
      <span className={`text-[11px] font-bold text-center leading-tight ${blue ? "text-blue-800" : "text-gray-700"}`}>{label}</span>
    </div>
  );
}

function DiagArrow({ blue, stretch }: { blue?: boolean; stretch?: boolean }) {
  const color = blue ? "bg-blue-300" : "bg-gray-300";
  const fill = blue ? "#93c5fd" : "#d1d5db";
  return (
    <div className={`flex items-center ${stretch ? "flex-1 min-w-[16px]" : "flex-shrink-0 w-5"}`}>
      <div className={`flex-1 h-px ${color}`} />
      <svg className="w-2 h-2 flex-shrink-0 -ml-px" fill={fill} viewBox="0 0 10 10">
        <path d="M0 2 L6 5 L0 8 Z" />
      </svg>
    </div>
  );
}

function DiagFee({ label, sub, red, amber }: { label: string; sub: string; red?: boolean; amber?: boolean }) {
  const cls = red
    ? "bg-red-50 border-red-200 text-red-700"
    : amber
    ? "bg-amber-50 border-amber-200 text-amber-700"
    : "bg-gray-50 border-gray-200 text-gray-700";
  return (
    <div className={`flex-shrink-0 rounded-xl border px-3 py-2 text-center w-[108px] ${cls}`}>
      <p className="text-[11px] font-bold leading-tight">{label}</p>
      <p className="text-[10px] opacity-80 mt-0.5">{sub}</p>
    </div>
  );
}

/* ---- SVGアイコン（Lucideスタイル） ---- */
function IconCpu() {
  return (
    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <path d="M9 4V2M12 4V2M15 4V2M9 22v-2M12 22v-2M15 22v-2M4 9H2M4 12H2M4 15H2M22 9h-2M22 12h-2M22 15h-2" />
    </svg>
  );
}

function IconShieldCheck() {
  return (
    <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
    </svg>
  );
}

function IconUnlock() {
  return (
    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function IconFileText() {
  return (
    <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
    </svg>
  );
}

/* ---- データ ---- */
const stats = [
  { value: "利用料ゼロ", label: "手数料・仲介料" },
  { value: "固定価格", label: "成果物単位" },
  { value: "週末OK", label: "スポット対応" },
];

const zeroItems = ["登録料", "月額利用料", "成約手数料", "中間マージン"];

const steps = [
  { title: "メールで登録", desc: "メールアドレスで30秒登録。会社メールで法人認証すると信頼バッジが付く。" },
  { title: "成果物をイチバの棚に並べる", desc: "「CSV分析¥30,000・3日」のように成果物・価格・納期を登録する。自由記述なし、詐称不可。" },
  { title: "AIで作成、経験者が仕上げて納品", desc: "発注を受けたら生成AIで高速ドラフト。経験者の知見でファクトチェック・示唆を付与して納品。" },
];

const deliveryFlow = [
  { title: "AIと壁打ちして依頼を整理", desc: "課題・期待値・制約をAIと一緒に言語化。ミスマッチを事前に防ぐ", time: "〜5分", badge: "発注者側AI" },
  { title: "経験者へ問い合わせ", desc: "整理した要件をもとにフォームで送信。当日中に返信", time: "当日中", badge: null },
  { title: "着手前の要件確認", desc: "経験者が「この理解で進めます」を一往復。認識ズレをゼロにしてから着手", time: "〜1日", badge: null },
  { title: "AIドラフト＋経験者の付加価値", desc: "AIが叩き台を生成し、経験者が実体験・知見で仕上げ。ここが価値の源泉", time: "1〜5日", badge: "経験者の知見" },
  { title: "納品＋修正1回対応", desc: "成果物を受け取り。内容に対して修正が1回まで含まれます", time: "完了", badge: "修正1回保証" },
];

const commercializationCases = [
  {
    role: "現役会社員（副業初挑戦）",
    experience: "会社で副業OKになったが、何をすればいいか全く分からなかった。自分の仕事なんて社内でしか通じないと思っていた。でも部署の後輩に採用面接のコツを教えたら『こんなに分かりやすく聞いたの初めて』と言われた。10年採用に関わってきたのに、これが"経験"として売れるとは思っていなかった。",
    productTitle: "採用担当者が本当に見ている面接評価ポイントと突破ガイド",
    deliverables: [
      "採用担当者が面接中に実際につけている評価シートと採点基準",
      "「なぜ落とされたか」よくある理由TOP10と改善ポイント",
      "志望動機・自己PRで差がつく構成テンプレート",
    ],
    price: "¥15,000",
  },
  {
    role: "OB・退職者（元銀行融資担当）",
    experience: "30年間銀行で融資審査をしてきた。中小企業が融資を断られる理由のほとんどは、決算書の見せ方と事業計画の書き方が悪いだけだった。指導すれば通る案件が山ほどある。",
    productTitle: "銀行融資が通る決算書・事業計画書の整え方パッケージ",
    deliverables: [
      "融資担当者の視点で見る「NG決算書」チェックリスト",
      "審査員が重視する事業計画書の必須項目と書き方",
      "よくある否決理由TOP10と改善テンプレート",
    ],
    price: "¥35,000",
  },
  {
    role: "育休中の親（元SNSマーケ担当）",
    experience: "産前は大手ECのSNSマーケ担当だった。育休中に自社の子ども服ブランドのInstagramを趣味で試したら、3ヶ月でフォロワーが1万人になった。同じ悩みを持つ育休ママたちに発信したのが効いた。",
    productTitle: "ゼロから1万フォロワーへのInstagram育成ロードマップ（育児・子どもジャンル特化）",
    deliverables: [
      "ジャンル別「バズる投稿テーマ」の選び方と投稿カレンダー",
      "育児アカウントでエンゲージメントが上がる構成パターン",
      "フォロワー増加の踊り場を突破するための施策リスト",
    ],
    price: "¥20,000",
  },
  {
    role: "専業主婦（元経理担当10年）",
    experience: "子育てで退職して8年経つが、夫の個人事業の経理を全部独学でこなしてきた。確定申告・弥生会計・インボイス対応まで自己流でやっていたら、近所の同業者から教えてほしいと言われるようになった。",
    productTitle: "個人事業主の確定申告・弥生会計セットアップ完全ガイド（初心者向け）",
    deliverables: [
      "開業から確定申告まで時系列でやることリスト",
      "インボイス登録の要否判断フローと登録手順",
      "弥生会計の初期設定から月次入力までの操作手順書",
    ],
    price: "¥15,000",
  },
  {
    role: "海外在住・越境人材（シンガポール10年）",
    experience: "シンガポールで10年働いた。日本企業がアジア進出で躓く原因はほぼ決まっていて、現地採用の人材管理と契約文化の違いへの無理解だった。同じ失敗を3社で見た。",
    productTitle: "シンガポール進出企業向け・現地人材マネジメントと契約トラブル回避チェックリスト",
    deliverables: [
      "日本式マネジメントが通じない場面TOP5と現地流への切り替え方",
      "雇用契約・業務委託契約で日本と異なる重要条項の解説",
      "退職交渉・給与交渉の文化的背景と対処フレーム",
    ],
    price: "¥40,000",
  },
  {
    role: "早期退職・キャリアチェンジ中（元大手メーカー調達）",
    experience: "大手メーカーで調達を15年やった。中国・ベトナム工場との交渉で分かったのは、単価を削るより『金型の所有権と金型費の取り決め』をしっかりやる方が長期コストが全然違う。これを知らない中小企業が多い。",
    productTitle: "海外工場との金型所有権・金型費交渉の実務テンプレート",
    deliverables: [
      "金型所有権を発注側に置くための契約条項ひな形",
      "金型費の分割・無償化交渉で使える交渉シナリオ集",
      "金型管理台帳と工場側への定期確認フォーマット",
    ],
    price: "¥30,000",
  },
  {
    role: "元教育者（高校理科教員20年）",
    experience: "20年間高校で理科を教えた。最後の5年で気づいたのは、苦手な生徒に共通するのは『手順を覚えようとして失敗の原因を考えない』こと。原因思考を教えたら担当クラスの偏差値が平均8上がった。",
    productTitle: "理科・数学が苦手な中高生の原因思考力を育てる授業設計テンプレート",
    deliverables: [
      "「なぜ間違えたか」を生徒自身が言語化できるワークシート",
      "原因思考を習慣化する授業導入5分ルーティン",
      "保護者向け「家庭でできる思考習慣サポート」説明資料",
    ],
    price: "¥25,000",
  },
];

