"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const REQUIRED_ROUNDS = 3;

type Message = { role: "user" | "assistant"; content: string };

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiRounds, setAiRounds] = useState(0);
  const [summary, setSummary] = useState("");
  const [thinking, setThinking] = useState(false);
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setThinking(true);
    setError("");

    try {
      const res = await fetch("/api/chat-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newRounds = aiRounds + 1;
      setAiRounds(newRounds);
      setMessages([...next, { role: "assistant", content: data.text }]);
      if (data.summary) setSummary(data.summary);
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setThinking(false);
    }
  };

  const runMatch = async () => {
    setMatching(true);
    setError("");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: summary || messages.filter(m => m.role === "user").map(m => m.content).join("\n") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setMatching(false);
    }
  };

  const canSubmit = aiRounds >= REQUIRED_ROUNDS;
  const remaining = Math.max(0, REQUIRED_ROUNDS - aiRounds);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← トップに戻る
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">発注相談</h1>
      <p className="text-gray-500 text-sm mb-6">
        AIと壁打ちしながら依頼内容を整理します。数回のやりとりで、経験者に伝わる依頼文に仕上げます。
      </p>

      {/* 進捗インジケーター */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5 flex-1">
          {Array.from({ length: REQUIRED_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < aiRounds ? "bg-blue-500" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <span className={`text-xs flex-shrink-0 font-medium transition-colors ${canSubmit ? "text-emerald-600" : aiRounds > 0 ? "text-blue-500" : "text-gray-400"}`}>
          {canSubmit ? "依頼内容が整いました" : aiRounds === 0 ? "依頼の解像度" : aiRounds === 1 ? "整理中..." : "精緻化中..."}
        </span>
      </div>

      {/* チャットエリア */}
      {messages.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-4">
          <p className="text-sm text-blue-700 font-medium mb-1">依頼したいことを教えてください</p>
          <p className="text-xs text-blue-500">AIが内容を深掘りしながら、経験者に伝わる依頼文に整理します。</p>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-2 mt-0.5">AI</div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-2 mt-0.5">AI</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 入力エリア（常に表示、マッチング後は非表示） */}
      {results === null && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={messages.length === 0 ? "例: 来月末までにExcelの売上データを分析して、注力すべき顧客をまとめてほしい" : "返答を入力...（Enterで送信、Shift+Enterで改行）"}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-14 max-h-32"
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || thinking}
              className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 壁打ち完了 → 依頼確定ボタン */}
          {canSubmit && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold text-sm">✓ 最低3回の壁打ち完了 — いつでも依頼を送れます</span>
              </div>
          {summary && (
            <div>
              <p className="text-xs text-emerald-700 font-semibold mb-1.5">整理された依頼内容</p>
              <p className="text-sm text-gray-700 bg-white border border-emerald-100 rounded-xl px-4 py-3 leading-relaxed">{summary}</p>
            </div>
          )}
          <button
            onClick={runMatch}
            disabled={matching}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {matching ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />候補を探しています...</>
            ) : "この内容で経験者を探す →"}
          </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* マッチング結果 */}
      {results !== null && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {results.length > 0 ? `${results.length}件の候補が見つかりました` : "条件に合う成果物が見つかりませんでした"}
          </h2>
          {results.length > 0 && (
            <p className="text-sm text-gray-400 mb-6">各経験者に直接ご連絡ください</p>
          )}
          <div className="space-y-4">
            {results.map((r) => (
              <div key={r.rank} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
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
                    <span className="num text-base font-black text-blue-600">¥{r.service.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400">{r.service.days}日以内</span>
                    {r.service.company && (
                      <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {r.service.company}
                      </span>
                    )}
                  </div>
                  <Link href={`/profile/${r.service.profileId}`} className="flex-shrink-0 bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
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
