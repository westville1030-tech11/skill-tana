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
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-xs font-medium px-4 py-1.5 rounded-full">
                    ✓ 現役社員 — 法人メール認証
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white text-xs font-medium px-4 py-1.5 rounded-full">
                    ✓ 退職者・OB — 過去名刺認証
                  </div>
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
                生成AIが成果物のドラフトを高速作成 → 経験者が示唆・検証を加えて納品。<br className="hidden md:block" />
                AIの速度と、ヒトの知見が融合した新しい働き方。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
                <Link href="/profile/edit"
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-center shadow-lg shadow-blue-900/50">
                  イチバに登録
                </Link>
                <Link href="/request"
                  className="bg-white/15 border border-white/25 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors text-center">
                  AIで発注相談
                </Link>
                <Link href="/browse"
                  className="border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors text-center">
                  イチバの棚を見る
                </Link>
              </div>

              {/* 統計 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/8 border border-white/10 rounded-xl px-4 py-4 text-center">
                    <div className="num text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-blue-300 mt-1">{s.label}</div>
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

      {/* なぜ無料か */}
      <section className="py-5 px-4 bg-emerald-50/50 border-b border-emerald-100">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex-shrink-0">なぜ無料？</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            このサービスの設計・開発・運営はほぼすべてAIが担っています。人件費・オフィス費用がかからないため、発生コストはサーバー維持費のみ。
            <span className="text-emerald-600 font-medium">だから、永久無料を維持できます。</span>
          </p>
        </div>
      </section>

      {/* 仕組み図 */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">仕組み</h2>
          <p className="text-center text-gray-400 mb-12">仲介を完全に排除した直接発注</p>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[420px]">
              <ConceptDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* AI × 経験者の価値 */}
      <section className="py-28 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">なぜ安く、早いのか</h2>
          <p className="text-center text-gray-400 mb-12">AI × 経験者の専門知識 = 高品質・低コスト</p>

          <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <IconCpu />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AIが高速ドラフト</h3>
              <p className="text-sm text-gray-500 leading-relaxed">数時間かかる作業を生成AIが数分で初稿を生成</p>
            </div>
            <div className="hidden md:flex items-center justify-center text-gray-200 text-xl flex-shrink-0">→</div>
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <IconShieldCheck />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">経験者がファクトチェック</h3>
              <p className="text-sm text-gray-500 leading-relaxed">AIの誤情報・文脈のズレを経験者が検証・修正</p>
            </div>
            <div className="hidden md:flex items-center justify-center text-gray-200 text-xl flex-shrink-0">→</div>
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <IconLightbulb />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">経験者が示唆を付与</h3>
              <p className="text-sm text-gray-500 leading-relaxed">業界知見・状況判断はAIにはできない。経験者が実態に即した価値を加える</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-800 mb-2">「AIだけで十分では？」</p>
              <p className="text-sm text-gray-500 leading-relaxed">AIは平均的な回答しか出せません。貴社の状況・業界固有の文脈に即した示唆や、数字の意味を読む判断は、経験者の経験があって初めて可能です。</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-sm font-bold text-gray-800 mb-2">「AIの修正作業が大変では？」</p>
              <p className="text-sm text-gray-500 leading-relaxed">AIの活用で作業時間は約80%削減。経験者は検証・仕上げの20%に集中するだけ。だから週末2時間で完結する案件設計が実現できます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作プロセス ティーザー */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <Link href="/process" className="group block bg-slate-50 border border-gray-200 rounded-2xl p-7 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">制作プロセス</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">プロンプト・修正過程をすべて公開</h2>
                <p className="text-sm text-gray-500 leading-relaxed">「どうやって作ったか」を隠さないことが信頼につながる。成果物テンプレートの無料配布も。</p>
              </div>
              <span className="text-emerald-400 text-2xl flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 発注レシピ ティーザー */}
      <section className="py-4 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <Link href="/patterns" className="group block bg-slate-50 border border-gray-200 rounded-2xl p-7 hover:border-purple-300 hover:bg-purple-50/40 transition-all">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">発注レシピ</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">「どうなりたいか」から逆引きする発注の型</h2>
                <p className="text-sm text-gray-500 leading-relaxed">上司への提案を通したい、新規事業のタネを探したい——目的別に使えるレシピ5種。</p>
              </div>
              <span className="text-purple-400 text-2xl flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 価格設定 ティーザー */}
      <section className="py-4 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <Link href="/pricing" className="group block bg-slate-50 border border-gray-200 rounded-2xl p-7 hover:border-blue-300 hover:bg-blue-50/40 transition-all">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">価格設定について</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">大手コンサルと「中身は同じ人材」なのに、なぜ1/4以下の価格なのか</h2>
                <p className="text-sm text-gray-500 leading-relaxed">コンサル料金の内訳、AIによるコスト構造の変化、実際の価格比較を詳しく解説しています。</p>
              </div>
              <span className="text-blue-400 text-2xl flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 発注から納品までのフロー */}
      <section className="py-28 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">発注から納品まで</h2>
          <p className="text-center text-gray-400 mb-14">メールで直接やりとり。プラットフォームの外に出ません</p>

          <div className="flex flex-col md:flex-row items-start">
            {deliveryFlow.map((step, i) => (
              <div key={step.title} className="flex md:flex-col flex-row items-start md:items-center flex-1">
                <div className="flex md:flex-col flex-row items-start md:items-center gap-4 md:gap-3 md:text-center w-full">
                  <div className="num flex-shrink-0 w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 pb-8 md:pb-0 md:px-3">
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

          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {["すべて", "データ分析", "戦略", "エンジニアリング", "相談"].map((cat, i) => (
              <span key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-default ${i === 0 ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
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
          <p className="text-slate-300 mb-2">メールアドレスがあれば30秒で登録完了。</p>
          <p className="text-slate-400 text-sm mb-2">法人メール認証済みのため、経歴詐称・なりすましゼロ。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/profile/edit"
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

/* ---- Before/After 図 ---- */
function ConceptDiagram() {
  return (
    <svg viewBox="0 0 720 310" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: "sans-serif" }}>
      <text x="16" y="26" fontSize="10" fill="#9ca3af" fontWeight="700" letterSpacing="3">BEFORE</text>
      <ActorCard x={14} y={42} icon="🏢" topLabel="クライアント" bottomLabel="依頼する側" color="#f8fafc" border="#e2e8f0" />
      <ThinArrow x1={122} y1={78} x2={178} y2={78} />
      <FeeBox x={178} y={52} label="仲介会社" sub="手数料 20〜30%" color="#fef2f2" border="#fca5a5" textColor="#dc2626" />
      <ThinArrow x1={318} y1={78} x2={374} y2={78} />
      <FeeBox x={374} y={52} label="エージェント" sub="登録料・成約料" color="#fffbeb" border="#fcd34d" textColor="#b45309" />
      <ThinArrow x1={514} y1={78} x2={570} y2={78} />
      <ActorCard x={582} y={42} icon="💼" topLabel="経験者" bottomLabel="スキルを持つ側" color="#f8fafc" border="#e2e8f0" />

      <line x1="24" y1="148" x2="696" y2="148" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="6 4" />

      <text x="16" y="174" fontSize="10" fill="#16a34a" fontWeight="700" letterSpacing="3">AFTER</text>
      <ActorCard x={14} y={188} icon="🏢" topLabel="クライアント" bottomLabel="依頼する側" color="#eff6ff" border="#bfdbfe" />
      <text x="360" y="208" fontSize="13" fill="#1d4ed8" fontWeight="800" textAnchor="middle">直接発注</text>
      <text x="360" y="222" fontSize="10" fill="#3b82f6" textAnchor="middle">手数料・仲介料 すべて ¥0</text>
      <line x1="122" y1="232" x2="568" y2="232" stroke="#3b82f6" strokeWidth="2" />
      <polygon points="566,225 582,232 566,239" fill="#3b82f6" />
      <ActorCard x={582} y={188} icon="💼" topLabel="経験者" bottomLabel="スキルを持つ側" color="#eff6ff" border="#bfdbfe" />
    </svg>
  );
}

function ActorCard({ x, y, icon, topLabel, bottomLabel, color, border }: {
  x: number; y: number; icon: string; topLabel: string; bottomLabel: string; color: string; border: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={108} height={72} rx={12} fill={color} stroke={border} strokeWidth="1" />
      <text x={x + 54} y={y + 28} fontSize="22" textAnchor="middle">{icon}</text>
      <text x={x + 54} y={y + 48} fontSize="11.5" fill="#111827" textAnchor="middle" fontWeight="700">{topLabel}</text>
      <text x={x + 54} y={y + 63} fontSize="9.5" fill="#6b7280" textAnchor="middle">{bottomLabel}</text>
    </g>
  );
}

function ThinArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6} y2={y2} stroke="#d1d5db" strokeWidth="1" />
      <polygon points={`${x2 - 6},${y2 - 4} ${x2},${y2} ${x2 - 6},${y2 + 4}`} fill="#d1d5db" />
    </g>
  );
}

function FeeBox({ x, y, label, sub, color, border, textColor }: {
  x: number; y: number; label: string; sub: string; color: string; border: string; textColor: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={140} height={50} rx={10} fill={color} stroke={border} strokeWidth="1" />
      <text x={x + 70} y={y + 21} fontSize="12" fill={textColor} textAnchor="middle" fontWeight="700">{label}</text>
      <text x={x + 70} y={y + 37} fontSize="10" fill={textColor} textAnchor="middle" opacity="0.85">{sub}</text>
    </g>
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
  { value: "¥0", label: "手数料・仲介料" },
  { value: "経歴証明", label: "法人メール認証済み" },
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
  { title: "イチバの棚で成果物を選ぶ", desc: "気になる成果物を見つける", time: "〜5分" },
  { title: "サイト上で問い合わせ", desc: "フォームから希望・予算・納期を送信", time: "当日中" },
  { title: "要件すり合わせ", desc: "チャットまたは30分MTGで詳細確認", time: "〜1日" },
  { title: "AI作成・経験者が仕上げ", desc: "AIでドラフト生成、経験者が検証・示唆付与", time: "1〜5日" },
  { title: "納品・完了", desc: "成果物を受け取り、お支払い", time: "完了" },
];

const serviceExamples = [
  { category: "データ分析", title: "CSV・Excelデータ分析レポート", desc: "AIで集計・可視化ドラフトを作成。経験者が示唆を付与して納品", price: "¥30,000", days: "3日以内" },
  { category: "戦略", title: "戦略論点整理スライド（1枚）", desc: "AIで論点を構造化、経験者が実態に合わせて仕上げる1枚スライド", price: "¥50,000", days: "5日以内" },
  { category: "エンジニアリング", title: "業務自動化スクリプト作成", desc: "AIでコードをドラフト生成、経験者が検証・実業務に合わせて調整", price: "¥40,000", days: "4日以内" },
  { category: "相談", title: "壁打ち相談セッション（60分）", desc: "AIでリサーチ・資料を事前準備。経験者との対話で課題を深堀り", price: "¥15,000", days: "当日〜翌日" },
];
