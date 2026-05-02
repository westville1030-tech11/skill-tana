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
                  個人の取引手数料・登録料は永久無料。AIが運営するから、成約しても一切引かれません。
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5 tracking-tight">
                あなたの経験を、<br />
                <span className="text-blue-300">誰かの答えに。</span>
              </h1>
              <div className="grid sm:grid-cols-2 gap-4 mb-6 mt-8">
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
              <div className="text-center lg:text-left mb-8">
                <Link href="/browse" className="text-slate-400 text-sm hover:text-white transition-colors">
                  まずイチバの棚を見てみる →
                </Link>
              </div>

              {/* キラーワード3つ */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "¥0 手数料なし", desc: "成約しても引かれない" },
                  { value: "経験を商品化して届ける", desc: "AIが一緒に作る" },
                  { value: "AIの目でひと確認", desc: "実体験を確かめる" },
                ].map((item) => (
                  <div key={item.value} className="bg-white/8 border border-white/10 rounded-xl px-3 py-3 text-center">
                    <p className="text-xs font-bold text-white leading-snug">{item.value}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-tight">{item.desc}</p>
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

      {/* B: AIだけ vs AI×経験者 */}
      <section className="py-28 px-4 bg-slate-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">AIだけだと、一般論にしかならない</h2>
          <p className="text-center text-gray-400 mb-12">経験者の実体験が入って初めて、あなたに刺さる答えになる</p>
          <AIvsExperience />
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

      {/* 価格提案ロジック */}
      <section className="py-28 px-4 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">AIの価格提案ロジック</h2>
          <p className="text-center text-gray-400 mb-12">登録時に職種・経験を入力すると、AIが相場から適正価格を提案します</p>
          <PricingLogic />
        </div>
      </section>

      {/* 競合比較 */}
      <section className="py-28 px-4 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">他のサービスとの違い</h2>
          <p className="text-center text-gray-400 mb-14">経験イチバが「成果物×固定価格×AI」にこだわる理由</p>
          <ComparisonTable />
        </div>
      </section>

      {/* 品質保証 */}
      <section className="py-14 px-4 bg-blue-50 border-y border-blue-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-600 text-center leading-relaxed max-w-xl mx-auto mb-10">
            AIは叩き台を作る。経験者は<span className="font-bold text-blue-700">「それは正しいか」「現場ではどうだったか」</span>を加える。<br/>
            その組み合わせが、コピペできない成果物を生む。
          </p>
          <p className="text-center text-xs font-bold text-blue-600 uppercase tracking-widest mb-8">3つの品質保証</p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xl">🔍</span>
              <p className="text-sm font-bold text-gray-800">実体験の具体性をAIが確認</p>
              <p className="text-xs text-gray-500 leading-relaxed">出品時・納品時に「この人の経験でしか出てこない具体性があるか」をチェック。一般論だけの成果物は警告対象になります。</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl">🔄</span>
              <p className="text-sm font-bold text-gray-800">修正1回が標準で含まれます</p>
              <p className="text-xs text-gray-500 leading-relaxed">着手前に要件を確認した上で進めるため、納品後の認識ズレを最小化します。</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xl">💬</span>
              <p className="text-sm font-bold text-gray-800">期待と違ったら、AIが照合します</p>
              <p className="text-xs text-gray-500 leading-relaxed">成果物の説明と実際の内容をAIが照合し、乖離がある場合は再対応をリクエストできます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 発注から納品までのフロー */}
      <section className="py-28 px-4 bg-white border-t border-gray-100">
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

/* ---- ヒーロー グラフィック: もやもや → AI → 成果物 ---- */
function HeroGraphic() {
  return (
    <svg width="100%" viewBox="0 0 680 340" role="img" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#B4B2A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>

      {/* セクションラベル */}
      <text x="90"  y="28" textAnchor="middle" fontSize="12" fill="#94a3b8">もやもやした経験</text>
      <text x="340" y="28" textAnchor="middle" fontSize="12" fill="#94a3b8">経験イチバ</text>
      <text x="590" y="28" textAnchor="middle" fontSize="12" fill="#94a3b8">誰かに届く成果物</text>

      {/* 左：経験カード */}
      <rect x="20" y="50"  width="140" height="52" rx="8" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5"/>
      <text x="90" y="71"  textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="500" fill="#444441">採用の経験</text>
      <text x="90" y="89"  textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#5F5E5A">売れる？</text>

      <rect x="20" y="144" width="140" height="52" rx="8" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5"/>
      <text x="90" y="165" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="500" fill="#444441">融資の知識</text>
      <text x="90" y="183" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#5F5E5A">使える？</text>

      <rect x="20" y="238" width="140" height="52" rx="8" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5"/>
      <text x="90" y="259" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="500" fill="#444441">調達ノウハウ</text>
      <text x="90" y="277" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#5F5E5A">商品に？</text>

      {/* 左→中央 矢印 */}
      <line x1="160" y1="76"  x2="280" y2="163" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#arrow)"/>
      <line x1="160" y1="170" x2="280" y2="170" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#arrow)"/>
      <line x1="160" y1="264" x2="280" y2="177" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#arrow)"/>

      {/* 中央：経験イチバ AI */}
      <circle cx="340" cy="170" r="56" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
      <text x="340" y="161" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="500" fill="#3C3489">経験イチバ</text>
      <text x="340" y="181" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#534AB7">AI が商品化</text>

      {/* 中央→右 矢印 */}
      <line x1="396" y1="145" x2="520" y2="90"  stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#arrow)"/>
      <line x1="396" y1="170" x2="520" y2="170" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#arrow)"/>
      <line x1="396" y1="195" x2="520" y2="250" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#arrow)"/>

      {/* 右：成果物カード */}
      <rect x="520" y="56"  width="144" height="52" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
      <text x="592" y="74"  textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#085041">採用面接突破ガイド</text>
      <text x="592" y="92"  textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#0F6E56">¥15,000</text>

      <rect x="520" y="144" width="144" height="52" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
      <text x="592" y="162" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#085041">銀行融資を通す実務書</text>
      <text x="592" y="180" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#0F6E56">¥35,000</text>

      <rect x="520" y="232" width="144" height="52" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
      <text x="592" y="250" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#085041">海外調達交渉テンプレ</text>
      <text x="592" y="268" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#0F6E56">¥40,000</text>
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
    {
      label: "期待外れの時",
      spot:   "対応なし",
      skill:  "評価を書くのみ",
      ours:   "AIが照合→再対応",
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

/* ---- AI単独 vs AI×経験者 ---- */
function AIvsExperience() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* AI単独 */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-400 bg-gray-200 px-3 py-1 rounded-full self-start">AIだけで作ると</span>
          <p className="text-sm text-gray-500 leading-relaxed italic">
            「面接で大切なのは第一印象と事前準備です。自己PRは具体的なエピソードを交えて、志望動機は企業研究をもとに述べましょう。」
          </p>
          <p className="text-xs text-gray-400 mt-auto">↑ 検索すれば出てくる。誰の経験でもない。</p>
        </div>
        {/* AI×経験者 */}
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 flex flex-col gap-3 relative">
          <div className="absolute -top-3.5 left-5">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">採用担当10年の実体験を加えると</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed italic mt-2">
            「内定した人に共通していたのは『入社後に自分が解くべき課題』を持っていたこと。面接官が実際につけているメモは、準備の量ではなく、課題設定の解像度です。」
          </p>
          <p className="text-xs text-amber-600 mt-auto">↑ 10年の実体験でしか出てこない。</p>
        </div>
      </div>
      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-6 py-4 text-center">
        <p className="text-sm text-gray-700 leading-relaxed">
          AIは速い。でも<span className="font-bold text-blue-700">経験者の実体験なしには、一般論しか生まれない。</span><br className="hidden sm:block"/>
          経験イチバの成果物は、AIの速さと経験者の知見を両方持っている。
        </p>
      </div>
    </div>
  );
}

/* ---- 価格提案ロジック ---- */
function PricingLogic() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2">
          {/* 他社 */}
          <div className="bg-gray-50 p-6 border-r border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-4">他社（手数料20〜30%）</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">受注額</span>
                <span className="num text-lg font-black text-gray-700">¥30,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">手数料</span>
                <span className="num text-sm font-bold text-red-400">−¥9,000</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">手取り</span>
                <span className="num text-xl font-black text-gray-500">¥21,000</span>
              </div>
            </div>
          </div>
          {/* 経験イチバ */}
          <div className="bg-blue-50 p-6">
            <p className="text-[10px] font-bold text-blue-400 tracking-widest mb-4">経験イチバ（手数料ゼロ）</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600">受注額</span>
                <span className="num text-lg font-black text-blue-700">¥30,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600">手数料</span>
                <span className="num text-sm font-bold text-emerald-500">¥0</span>
              </div>
              <div className="h-px bg-blue-200" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">手取り</span>
                <span className="num text-xl font-black text-blue-700">¥30,000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-600 px-6 py-3 text-center">
          <p className="text-sm text-white font-bold">同じ価格で出して、¥9,000 多く手元に残る</p>
        </div>
      </div>
      {/* カテゴリ別相場 */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-4">AIが参照するカテゴリ別相場（成果物1件あたり）</p>
        <div className="space-y-2">
          {[
            { category: "士業（税理士・弁護士・社労士）", range: "¥30,000〜¥50,000", source: "専門資格×実務経験" },
            { category: "戦略・経営コンサル",             range: "¥30,000〜¥50,000", source: "大手ファーム・事業会社出身" },
            { category: "ITエンジニア・データ分析",       range: "¥20,000〜¥40,000", source: "開発・分析実績" },
            { category: "事業会社（人事・経理・営業）",   range: "¥15,000〜¥30,000", source: "業務経験・社内知見" },
            { category: "教育・研究・専門職",             range: "¥15,000〜¥25,000", source: "指導実績・研究歴" },
          ].map((r) => (
            <div key={r.category} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-700 font-medium">{r.category}</span>
                <span className="text-[10px] text-gray-400 ml-2">{r.source}</span>
              </div>
              <span className="num text-xs font-black text-blue-600 flex-shrink-0">{r.range}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
          各種求人・フリーランス案件のWeb上の公開データをもとに算出。経験の具体性・成果物の数により上下します。
        </p>
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

const zeroItems = ["登録料", "月額利用料", "成約手数料", "中間マージン"];

const steps = [
  { title: "LINEで登録", desc: "LINEアカウントで30秒登録。会社メールで法人認証すると信頼バッジが付く。" },
  { title: "AIと壁打ちして出品", desc: "AIに経験を話すとタイトル・価格・実体験を提案。「採用面接突破ガイド ¥15,000・3日」のように成果物が完成する。" },
  { title: "発注が来たらAIと仕上げて納品", desc: "AIがドラフトを生成し、経験者の知見でファクトチェック・示唆を付与して納品。修正1回まで含む。" },
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
    experience: "会社で副業OKになったが、何をすればいいか全く分からなかった。自分の仕事なんて社内でしか通じないと思っていた。でも部署の後輩に採用面接のコツを教えたら『こんなに分かりやすく聞いたの初めて』と言われた。10年採用に関わってきたのに、これが「経験」として売れるとは思っていなかった。",
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

