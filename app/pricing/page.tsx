import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">← トップに戻る</Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">価格設定について</h1>
      <p className="text-center text-gray-400 mb-14">大手コンサルと「中身は同じ人材」なのに、価格は1/4以下の理由</p>

      {/* 比較表 */}
      <div className="grid md:grid-cols-2 gap-5 mb-14">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">大手コンサル</p>
          <div className="space-y-3 text-sm">
            {[
              { label: "担当者層", value: "シニアマネジャー級" },
              { label: "時間単価（想定）", value: "¥40,000〜¥60,000/h", highlight: true },
              { label: "最小発注単位", value: "数百万円〜（数ヶ月契約）", highlight: true },
              { label: "コストの内訳", value: "知見 + 会社利益 + 販管費 + 広告費" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-500">{r.label}</span>
                <span className={`font-semibold text-right ${r.highlight ? "text-red-500" : "text-gray-700"}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-900 border border-blue-700 rounded-2xl p-7 text-white">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">スキル棚（本サービス）</p>
          <div className="space-y-3 text-sm">
            {[
              { label: "担当者層", value: "同じシニアマネジャー級（副業）" },
              { label: "実質時間単価", value: "¥10,000〜¥15,000/h", highlight: true },
              { label: "最小発注単位", value: "¥30,000〜（1成果物単位）", highlight: true },
              { label: "コストの内訳", value: "純粋な知見 100%（中抜きなし）" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between gap-4 py-2 border-b border-blue-700/50 last:border-0">
                <span className="text-blue-200">{r.label}</span>
                <span className={`font-semibold text-right ${r.highlight ? "text-green-400" : "text-white"}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* コンサル料の解剖図 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-8 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-6 text-center">コンサル料の「中身」を解剖すると</h2>
        <div className="space-y-3">
          {[
            { label: "会社の利益・株主配当", pct: 20, color: "bg-red-400" },
            { label: "オフィス賃料・インフラ", pct: 15, color: "bg-orange-400" },
            { label: "営業マン・マーケ費用", pct: 20, color: "bg-yellow-400" },
            { label: "管理職・バックオフィス", pct: 15, color: "bg-gray-300" },
            { label: "あなたへの知見（本質）", pct: 30, color: "bg-blue-500" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-44 flex-shrink-0 text-right">{row.label}</span>
              <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${row.color} rounded-full flex items-center justify-end pr-2`} style={{ width: `${row.pct}%` }}>
                  <span className="text-white text-xs font-bold">{row.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-5">スキル棚では「あなたへの知見」の部分だけに払う</p>
      </div>

      {/* 計算式 */}
      <div className="bg-slate-50 rounded-2xl p-7">
        <h2 className="font-bold text-gray-900 mb-6 text-center">「安い＝質が低い」ではない。AIが時間を削ったから安い。</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">従来の作り方</p>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>経験者が1から作成</p>
              <p className="num text-2xl font-black text-gray-400">5時間 × ¥10,000</p>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs text-gray-400">発注者の支払い</p>
              <p className="num text-3xl font-black text-red-500">¥50,000</p>
            </div>
          </div>
          <div className="bg-blue-900 border border-blue-700 rounded-xl p-5 text-white">
            <p className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-3">スキル棚の作り方</p>
            <div className="space-y-1 text-sm text-blue-200 mb-4">
              <p>AIが初稿（5分）</p>
              <p>＋ 経験者が検証・仕上げ（1時間）</p>
              <p className="num text-2xl font-black text-white">1時間 × ¥10,000</p>
            </div>
            <div className="border-t border-blue-700 pt-3">
              <p className="text-xs text-blue-300">発注者の支払い</p>
              <p className="num text-3xl font-black text-green-400">¥10,000〜</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-5">
          経験者の時給（価値）は変わらない。AIで手を動かす時間を80%削ったから、この価格が実現できる。
        </p>
      </div>

      <div className="text-center mt-12">
        <Link href="/browse" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
          棚を見る →
        </Link>
      </div>
    </div>
  );
}
