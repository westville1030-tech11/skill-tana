import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                登録料・利用料・手数料、すべて永久無料
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                あなたの職業で培ったスキルを<br />
                <span className="text-blue-200">成果物単位で切り売りする</span>
              </h1>
              <p className="text-blue-100 mb-8 leading-relaxed">
                生成AIで高速ドラフト、プロが確認・仕上げて納品。<br className="hidden md:block" />
                週末1〜2時間から。LinkedIn認証で信頼を証明し、直接発注。仲介手数料はゼロ。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/profile/edit"
                  className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors text-center">
                  無料でスキルを登録
                </Link>
                <Link href="/browse"
                  className="border border-white/40 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors text-center">
                  棚を見る
                </Link>
              </div>
            </div>

            {/* 統計 */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full lg:w-auto">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-blue-200 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 全部ゼロ */}
      <section className="py-6 px-4 bg-green-50 border-b border-green-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {zeroItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <span className="text-green-600 font-black">¥0</span>
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 仕組み図（Before/After） */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">仕組み</h2>
          <p className="text-center text-gray-500 text-sm mb-10">仲介を完全に排除した直接発注</p>
          <ConceptDiagram />
        </div>
      </section>

      {/* AI × 専門知識 */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">なぜ安く、早いのか</h2>
          <p className="text-center text-gray-500 text-sm mb-10">生成AIとプロの専門知識を組み合わせた仕組み</p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold text-gray-900 mb-2">AIが高速ドラフト</h3>
              <p className="text-sm text-gray-600 leading-relaxed">数時間かかる作業を生成AIが数分で初稿を生成。</p>
            </div>
            <div className="flex items-center justify-center text-gray-300 text-3xl font-light hidden md:flex">→</div>
            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-bold text-gray-900 mb-2">プロが確認・仕上げ</h3>
              <p className="text-sm text-gray-600 leading-relaxed">AIの出力をプロの知見で検証し、実態に沿った成果物に仕上げる。</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8 bg-gray-50 rounded-xl py-3 px-4">
            AIが作った初稿を、プロが確認・修正することで<strong className="text-gray-700">精度と実用性を担保</strong>します。
          </p>
        </div>
      </section>

      {/* Founderストーリー */}
      <section className="py-14 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="border-l-4 border-blue-300 pl-6">
            <p className="text-gray-600 leading-relaxed italic">
              「これまでチームとして動いてきた。でもAIが出てきて、一人でも出来ると気づいた。
              かといって今の仕事を辞めてフリーランスにもなれない。
              エージェントは期待値が高すぎる。既存サービスは敷居が違う。
              週末1〜2時間、データをもらって分析するだけ——
              それだけを安く簡単に切り売りできる場所が欲しかった。」
            </p>
            <p className="text-sm text-gray-400 mt-3">— スキル棚 創設者</p>
          </div>
        </div>
      </section>

      {/* 成果物例 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">棚に並ぶ成果物の例</h2>
          <p className="text-center text-gray-500 text-sm mb-8">週末数時間〜のスポット対応</p>

          {/* カテゴリフィルター */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {["すべて", "データ分析", "戦略", "エンジニアリング", "相談"].map((cat, i) => (
              <span key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-default ${i === 0 ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"}`}>
                {cat}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {serviceExamples.map((s) => (
              <div key={s.title} className="border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                      {s.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-blue-700 font-bold">{s.price}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.days}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/browse" className="text-blue-600 text-sm font-medium hover:underline">
              すべての成果物を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* 3ステップ */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">使い方</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-700">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">今すぐ棚に並べる</h2>
          <p className="text-blue-200 mb-2">LinkedInアカウントがあれば30秒で登録完了。</p>
          <p className="text-green-300 font-semibold mb-8">登録料・利用料・手数料、すべて永久無料。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/profile/edit"
              className="bg-white text-blue-700 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              無料でスキルを登録
            </Link>
            <Link href="/browse"
              className="border border-white/40 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
              棚を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- Before/After 図 ---- */
function ConceptDiagram() {
  return (
    <svg viewBox="0 0 720 310" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: "sans-serif" }}>
      {/* BEFORE */}
      <text x="16" y="26" fontSize="10" fill="#9ca3af" fontWeight="700" letterSpacing="3">BEFORE</text>
      <ActorCard x={14} y={42} icon="🏢" topLabel="クライアント" bottomLabel="依頼する側" color="#f3f4f6" border="#d1d5db" />
      <ThinArrow x1={122} y1={78} x2={178} y2={78} />
      <FeeBox x={178} y={52} label="仲介会社" sub="手数料 20〜30%" color="#fef2f2" border="#fca5a5" textColor="#dc2626" />
      <ThinArrow x1={318} y1={78} x2={374} y2={78} />
      <FeeBox x={374} y={52} label="エージェント" sub="登録料・成約料" color="#fffbeb" border="#fcd34d" textColor="#b45309" />
      <ThinArrow x1={514} y1={78} x2={570} y2={78} />
      <ActorCard x={582} y={42} icon="💼" topLabel="プロ" bottomLabel="スキルを持つ側" color="#f3f4f6" border="#d1d5db" />

      {/* 区切り線 */}
      <line x1="24" y1="148" x2="696" y2="148" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* AFTER */}
      <text x="16" y="174" fontSize="10" fill="#16a34a" fontWeight="700" letterSpacing="3">AFTER</text>
      <ActorCard x={14} y={188} icon="🏢" topLabel="クライアント" bottomLabel="依頼する側" color="#eff6ff" border="#bfdbfe" />
      <line x1="122" y1="224" x2="568" y2="224" stroke="#3b82f6" strokeWidth="2.5" />
      <polygon points="566,217 582,224 566,231" fill="#3b82f6" />
      <rect x="240" y="204" width="240" height="42" rx="21" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="360" y="221" fontSize="13" fill="#1d4ed8" fontWeight="800" textAnchor="middle">直接発注</text>
      <text x="360" y="237" fontSize="10.5" fill="#3b82f6" textAnchor="middle">手数料・仲介料 すべて ¥0</text>
      <ActorCard x={582} y={188} icon="💼" topLabel="プロ" bottomLabel="スキルを持つ側" color="#eff6ff" border="#bfdbfe" />

      <text x="360" y="284" fontSize="10.5" fill="#16a34a" fontWeight="600" textAnchor="middle">
        ✓ 登録料 ¥0　　✓ 月額利用料 ¥0　　✓ 成約手数料 ¥0
      </text>
    </svg>
  );
}

function ActorCard({ x, y, icon, topLabel, bottomLabel, color, border }: {
  x: number; y: number; icon: string; topLabel: string; bottomLabel: string; color: string; border: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={108} height={72} rx={12} fill={color} stroke={border} strokeWidth="1.5" />
      <text x={x + 54} y={y + 28} fontSize="22" textAnchor="middle">{icon}</text>
      <text x={x + 54} y={y + 48} fontSize="11.5" fill="#111827" textAnchor="middle" fontWeight="700">{topLabel}</text>
      <text x={x + 54} y={y + 63} fontSize="9.5" fill="#6b7280" textAnchor="middle">{bottomLabel}</text>
    </g>
  );
}

function ThinArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6} y2={y2} stroke="#d1d5db" strokeWidth="1.5" />
      <polygon points={`${x2 - 6},${y2 - 4} ${x2},${y2} ${x2 - 6},${y2 + 4}`} fill="#d1d5db" />
    </g>
  );
}

function FeeBox({ x, y, label, sub, color, border, textColor }: {
  x: number; y: number; label: string; sub: string; color: string; border: string; textColor: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={140} height={50} rx={10} fill={color} stroke={border} strokeWidth="1.5" />
      <text x={x + 70} y={y + 21} fontSize="12" fill={textColor} textAnchor="middle" fontWeight="700">{label}</text>
      <text x={x + 70} y={y + 37} fontSize="10" fill={textColor} textAnchor="middle" opacity="0.85">{sub}</text>
    </g>
  );
}

/* ---- データ ---- */
const stats = [
  { value: "¥0", label: "手数料・仲介料" },
  { value: "30秒", label: "LinkedIn登録" },
  { value: "固定価格", label: "成果物単位" },
  { value: "週末OK", label: "スポット対応" },
];

const zeroItems = ["登録料", "月額利用料", "成約手数料", "中間マージン"];

const steps = [
  { title: "LinkedInでログイン", desc: "LinkedInアカウントで認証。30秒で完了。キャリアが自動で信頼の証明になる。" },
  { title: "成果物を棚に並べる", desc: "「このCSV分析¥30,000・3日」のように成果物・価格・納期を登録する。" },
  { title: "AIで作成、プロが仕上げて納品", desc: "発注を受けたら生成AIで高速ドラフト。プロの専門知識で確認・実態に合わせて仕上げ、クライアントへ納品。" },
];

const serviceExamples = [
  { category: "データ分析", title: "CSV・Excelデータ分析レポート", desc: "AIで集計・可視化ドラフトを作成。プロが示唆を付与して納品", price: "¥30,000", days: "3日以内" },
  { category: "戦略", title: "戦略論点整理スライド（1枚）", desc: "AIで論点を構造化、プロが実態に合わせて仕上げる1枚スライド", price: "¥50,000", days: "5日以内" },
  { category: "エンジニアリング", title: "業務自動化スクリプト作成", desc: "AIでコードをドラフト生成、プロが検証・実業務に合わせて調整", price: "¥40,000", days: "4日以内" },
  { category: "相談", title: "壁打ち相談セッション（60分）", desc: "AIでリサーチ・資料を事前準備。プロとの対話で課題を深堀り", price: "¥15,000", days: "当日〜翌日" },
];
