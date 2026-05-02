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

      {/* 成果物例 */}
      <section className="py-28 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">イチバの棚に並ぶ成果物の例</h2>
          <p className="text-center text-gray-400 mb-10">週末数時間〜のスポット対応</p>

          <div className="flex gap-2 flex-wrap justify-center mb-8 overflow-x-auto">
            {["すべて", "事業会社", "士業", "コンサル", "エンジニア"].map((cat, i) => (
              <span key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-default whitespace-nowrap ${i === 0 ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                {cat}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {serviceExamples.map((s) => (
              <div key={s.title} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-medium">
                      {s.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="num text-blue-600 font-black text-lg">{s.price}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.days}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/browse" className="text-blue-600 text-sm font-medium hover:underline">
              すべての成果物を見る →
            </Link>
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
    role: "製造エンジニア",
    experience: "海外工場のラインで歩留まりが80%まで落ちた。現地スタッフは『機械のせいだ』と言ったが、粘り強く5つのなぜで深掘りしたら、洗浄工程の乾燥時間が気温によって数秒足りないことが原因だと分かった。センサーの閾値を調整して98%まで戻した。",
    productTitle: "海外拠点の歩留まり急落を救う「5つのなぜ」実践チェックリスト",
    deliverables: [
      "機械の故障を疑う前に確認すべき「環境要因」の相関図",
      "言語の壁を越えて現場スタッフから「事実」を引き出すヒアリングシート",
      "乾燥・温度工程における閾値設定の最適化テンプレート",
    ],
    price: "¥40,000",
  },
  {
    role: "飲食店エリアマネージャー（会社員）",
    experience: "万年人手不足の店舗があった。店長が怖くて新人がすぐ辞めていた。店長に怒るのをやめさせ、代わりに「サンクスカード」を導入した。最初は反発されたが、半年後には離職率がゼロになり、売上も120%になった。",
    productTitle: "離職率をゼロに変える「店長マインド変革」とサンクスカード運用セット",
    deliverables: [
      "高圧的なリーダーを「育てるリーダー」に変えるための1on1面談台本",
      "現場が形骸化せずに続けられる「サンクスカード」導入ステップ図",
      "スタッフの定着率を月次で可視化する管理フォーマット",
    ],
    price: "¥20,000",
  },
  {
    role: "大手企業 営業（会社員）",
    experience: "競合他社に価格で負け続けていた。顧客担当者の愚痴をよく聞くと、実は『稟議を通すのが面倒』だと言っていた。顧客の社内稟議にそのまま使える比較表と上司向けの説得スライドを代わりに作って渡した結果、価格を下げずに1億円の受注が取れた。",
    productTitle: "価格競争を回避する「顧客の社内稟議」代行作成パッケージ",
    deliverables: [
      "顧客の担当者がそのまま社内で使える「競合比較・選定理由」スライド構成案",
      "決裁者が気にする「リスクと投資対効果」を網羅したQA集",
      "「お願い営業」から「課題解決パートナー」へ昇格するためのヒアリング項目",
    ],
    price: "¥50,000",
  },
];

const serviceExamples = [
  { category: "事業会社", title: "中途採用の面接評価シート設計", desc: "採用したい人物像・職種要件をヒアリングし、選考基準を言語化した評価シートを設計（人事）", price: "¥20,000", days: "3日以内" },
  { category: "事業会社", title: "商談提案書テンプレート作成", desc: "扱う商材・想定顧客・よく出る質問をヒアリングし、次の商談から使える提案構成を設計（営業）", price: "¥20,000", days: "4日以内" },
  { category: "事業会社", title: "月次レポート自動集計フォーマット設計", desc: "現状の集計フローと欲しいアウトプットを確認した上で、Excelテンプレを設計・納品（経理）", price: "¥25,000", days: "5日以内" },
  { category: "事業会社", title: "事業計画書フレーム整理＆フィードバック", desc: "目的・対象読者・現状の課題を確認した上で、構成と数字の整合性をレビュー（経営企画）", price: "¥30,000", days: "5日以内" },
  { category: "士業", title: "社内規程・契約書の法的チェックリスト作成", desc: "対象書類の目的と取引関係をヒアリングし、リスク箇所と修正ポイントを整理して納品", price: "¥35,000", days: "3日以内" },
  { category: "士業", title: "内部統制の整備状況チェック＆改善提案", desc: "現状の統制フローと懸念点をヒアリングし、リスク項目と優先度を整理してレポート化", price: "¥40,000", days: "5日以内" },
  { category: "コンサル", title: "市場分析＆参入戦略の論点整理", desc: "ターゲット市場・競合・自社強みをヒアリングし、検討すべき論点と仮説を整理（戦略）", price: "¥40,000", days: "5日以内" },
  { category: "コンサル", title: "業務課題の仮説整理＆他社事例共有", desc: "現状課題と改善目標をヒアリングし、類似事例と打ち手の方向性をレポートで整理（業務）", price: "¥30,000", days: "4日以内" },
  { category: "コンサル", title: "システム要件整理＆ベンダー選定基準作成", desc: "業務フローと課題をヒアリングし、要件定義の骨子とRFP用チェックリストを設計（IT）", price: "¥35,000", days: "5日以内" },
  { category: "エンジニア", title: "業務自動化の方法相談（60分）", desc: "現状フローと困りごとをヒアリングし、最適な自動化手段を一緒に選定", price: "¥15,000", days: "当日〜翌日" },
];
