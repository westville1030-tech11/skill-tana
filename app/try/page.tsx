"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

type ServiceDraft = {
  title: string;
  description: string;
  experience_story: string;
  price_suggestion: number;
  days_suggestion: number;
  service_type: string;
};

export default function TryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState<ServiceDraft | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setThinking(true);
    try {
      const res = await fetch("/api/chat-service-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text }]);
      if (data.serviceDraft) setDraft(data.serviceDraft);
    } finally {
      setThinking(false);
    }
  };

  // 下書きをsessionStorageに保存してprofile/editへ
  const goRegister = () => {
    if (draft) {
      sessionStorage.setItem("pendingDraft", JSON.stringify(draft));
    }
    window.location.href = "/profile/edit";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← トップに戻る</Link>
          <span className="text-sm font-bold text-gray-800">経験イチバ</span>
          <Link href="/profile/edit" className="text-xs text-gray-400 hover:text-gray-600">スキップ →</Link>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* イントロ（チャット開始前のみ） */}
        {messages.length === 0 && !draft && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
            <p className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 inline-block px-3 py-1 rounded-full">登録 ステップ1 / 2</p>
            <h1 className="text-xl font-bold text-gray-900 leading-snug">
              まず、あなたの経験を<br />AIと一緒に商品にしてみましょう
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              AIがあなたの経験をヒアリングして、商品案を自動で作ります。<br />
              商品案ができたら、そのままアカウント登録に進めます。
            </p>
            <Link href="/profile/edit" className="inline-block text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 pt-1">
              スキップしてプロフィール登録へ →
            </Link>
          </div>
        )}

        {/* チャットエリア */}
        {!draft && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
            <div className="space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-xs text-gray-400 text-center pt-8">下の入力欄からAIに話しかけてみてください</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <span className="flex gap-1">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 border-t border-gray-100 pt-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={messages.length === 0 ? "例：前職で採用担当として〇〇をしていました" : "続きを入力…（Enterで送信）"}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                rows={2}
              />
              <button
                onClick={send}
                disabled={!input.trim() || thinking}
                className="bg-blue-600 text-white px-4 rounded-xl disabled:opacity-40 flex-shrink-0 hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 商品案プレビュー */}
        {draft && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 text-lg">✓</span>
                <p className="text-sm font-bold text-emerald-700">商品案ができました</p>
              </div>

              <div className="bg-white border border-emerald-100 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">タイトル</p>
                  <p className="font-semibold text-gray-900">{draft.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">説明</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{draft.description}</p>
                </div>
                {draft.experience_story && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-700 mb-1">💬 実体験</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{draft.experience_story}</p>
                  </div>
                )}
                <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-100 pt-2">
                  <span className="font-bold text-blue-700">¥{draft.price_suggestion.toLocaleString()}</span>
                  <span>{draft.days_suggestion}日以内</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
              <p className="text-sm font-bold text-gray-900">この商品案でイチバに出品しませんか？</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                登録は無料・30秒で完了します。内容は登録後にいつでも編集できます。
              </p>
              <button
                onClick={goRegister}
                className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-white font-bold py-4 rounded-xl text-sm"
              >
                登録して出品する →
              </button>
              <button
                onClick={() => { setDraft(null); setMessages([]); setInput(""); }}
                className="w-full text-xs text-gray-400 hover:text-gray-600 py-2"
              >
                もう一度やり直す
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
