import Link from "next/link";

export default function ProcessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">← トップに戻る</Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">制作プロセスをすべて公開</h1>
      <p className="text-center text-gray-400 mb-12">「どうやって作ったか」を隠さないことが、信頼につながる</p>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <IconUnlock />
          </div>
          <h2 className="font-bold text-gray-900 mb-3">プロンプト×修正過程を全公開</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            「このレポートはこのプロンプトで下書きし、経験者がここを修正しました」——制作の裏側をブログ・SNSで公開します。
          </p>
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-start gap-2 text-sm">
              <span className="text-blue-600 font-semibold flex-shrink-0">クライアント</span>
              <span className="text-gray-500">品質と根拠が見えるから、安心して発注できる</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-blue-600 font-semibold flex-shrink-0">経験者側</span>
              <span className="text-gray-500">「自分もこれなら稼げる」と仲間が集まってくる</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <IconFileText />
          </div>
          <h2 className="font-bold text-gray-900 mb-3">成果物テンプレートを無料配布</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            イチバの棚に並ぶ成果物の「構成案・ひな形」を無料でダウンロード可能に。試して「やはり経験者に仕上げてほしい」となった人を直接キャッチ。
          </p>
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-start gap-2 text-sm">
              <span className="text-emerald-600 font-semibold flex-shrink-0">SEO</span>
              <span className="text-gray-500">「〇〇 テンプレート 無料」で検索流入を獲得</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-emerald-600 font-semibold flex-shrink-0">転換</span>
              <span className="text-gray-500">「完成版は経験者に依頼」という自然な流れを作る</span>
            </div>
          </div>
        </div>
      </div>

      {/* プロセス例 */}
      <div className="bg-slate-50 rounded-2xl border border-gray-100 p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5 text-center">制作過程の例</p>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 mb-2 font-medium">① プロンプト</p>
            <p className="text-xs text-gray-600 leading-relaxed">「売上データのCSVを渡し、月次トレンドと上位顧客を分析せよ」</p>
          </div>
          <div className="text-gray-200 flex-shrink-0 flex items-center justify-center text-xl">→</div>
          <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 mb-2 font-medium">② AIドラフト</p>
            <p className="text-xs text-gray-600 leading-relaxed">グラフ・集計自動生成。ただし業界文脈・示唆は空白</p>
          </div>
          <div className="text-gray-200 flex-shrink-0 flex items-center justify-center text-xl">→</div>
          <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 mb-2 font-medium">③ 経験者が仕上げ</p>
            <p className="text-xs text-gray-600 leading-relaxed">ファクト確認＋業界知見による示唆を付与して納品</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/browse" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
          イチバの棚を見る →
        </Link>
      </div>
    </div>
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
