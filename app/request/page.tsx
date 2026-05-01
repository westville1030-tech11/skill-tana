"use client";

import { useState } from "react";
import Link from "next/link";

const MIN_CHARS = 100;

type MatchResult = {
  rank: number;
  service: {
    profileId: string;
    title: string;
    description: string;
    price: number;
    days: number;
    category: string;
    company?: string;
    role?: string;
  };
  reason: string;
  match_score: "高" | "中" | "低";
};

const scoreColor: Record<string, string> = {
  高: "bg-emerald-50 text-emerald-700 border-emerald-200",
  中: "bg-yellow-50 text-yellow-700 border-yellow-200",
  低: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function RequestPage() {
  const [request, setRequest] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState("");
  const [qualityWarning, setQualityWarning] = useState("");

  const charCount = request.trim().length;
  const isEnough = charCount >= MIN_CHARS;

  const runMatch = async () => {
    setLoading(true);
    setError("");
    setResults(null);
    setQualityWarning("");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, deadline, budget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnough) return;
    setChecking(true);
    setQualityWarning("");
    try {
      const res = await fetch("/api/check-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const data = await res.json();
      if (data.quality === "poor" && data.feedback) {
        setQualityWarning(data.feedback);
        setChecking(false);
        return;
      }
    } catch {
      // チェック失敗時はそのまま進む
    }
    setChecking(false);
    await runMatch();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← トップに戻る
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">発注相談</h1>
      <p className="text-gray-500 text-sm mb-8">
        何が欲しいかを自然な言葉で入力するだけ。AIが棚から最適な成果物を提案します。
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              依頼内容 <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs font-medium ${isEnough ? "text-emerald-600" : "text-gray-400"}`}>
              {charCount} / {MIN_CHARS}文字以上
            </span>
          </div>
          <textarea
            value={request}
            onChange={(e) => { setRequest(e.target.value); setQualityWarning(""); }}
            placeholder="例: 来月末までにExcelの売上データ(5万行)を分析して、どの製品・顧客に注力すべきかレポートにまとめてほしい"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-28 resize-y"
            required
          />
          {!isEnough && charCount > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              あと{MIN_CHARS - charCount}文字以上入力してください。具体的な内容ほど、よいマッチングができます。
            </p>
          )}
        </div>

        {/* AI品質チェックの警告 */}
        {qualityWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4">
            <p className="text-sm font-semibold text-amber-700 mb-1">⚠️ 内容をもう少し具体的にしてみましょう</p>
            <p className="text-sm text-amber-700 mb-3">{qualityWarning}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQualityWarning("")}
                className="flex-1 bg-amber-600 text-white text-sm py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                修正する
              </button>
              <button
                type="button"
                onClick={() => { setQualityWarning(""); runMatch(); }}
                className="flex-1 bg-white border border-amber-300 text-amber-700 text-sm py-2 rounded-lg hover:bg-amber-50 transition-colors"
              >
                このまま送る
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">希望納期（任意）</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="例: 2週間以内、来月10日まで"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">予算感（任意）</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="例: 3〜5万円、10万円以内"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {!qualityWarning && (
          <button
            type="submit"
            disabled={loading || checking || !isEnough}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {checking ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                内容を確認中...
              </>
            ) : loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                AIが候補を探しています...
              </>
            ) : (
              "AIで候補を探す"
            )}
          </button>
        )}
      </form>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {results !== null && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {results.length > 0 ? `${results.length}件の候補が見つかりました` : "条件に合う成果物が見つかりませんでした"}
          </h2>
          {results.length > 0 && (
            <p className="text-sm text-gray-400 mb-6">
              各経験者のLinkedInページから直接ご連絡ください
            </p>
          )}

          <div className="space-y-4">
            {results.map((r) => (
              <div
                key={r.rank}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="num w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                      {r.rank}
                    </span>
                    <h3 className="font-bold text-gray-900">{r.service.title}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${scoreColor[r.match_score]}`}>
                    マッチ度: {r.match_score}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{r.service.description}</p>

                <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-blue-600 font-semibold mb-0.5">AIの推薦理由</p>
                  <p className="text-sm text-blue-800 leading-relaxed">{r.reason}</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="num text-base font-black text-blue-600">
                      ¥{r.service.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400">{r.service.days}日以内</span>
                    {r.service.company && (
                      <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {r.service.company}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/profile/${r.service.profileId}`}
                    className="flex-shrink-0 bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm mb-4">条件を変えて再度お試しください</p>
              <Link href="/browse" className="text-blue-600 text-sm font-medium hover:underline">
                すべての成果物を見る →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
