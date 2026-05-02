"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

type ServiceDraft = {
  title: string;
  description: string;
  experience_story: string;
  ai_usage?: string;
  recommended_tools?: string[];
  price_suggestion: number;
  days_suggestion: number;
  service_type: string;
};

type Drafts = { deliverable: ServiceDraft; consulting: ServiceDraft } | null;
type Mode = null | "decided" | "explore";
type ExploreMode = null | "chat" | "resume";

function DraftCard({ draft, label, badge, badgeColor, onSelect }: {
  draft: ServiceDraft; label: string; badge: string; badgeColor: string; onSelect: () => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full self-start ${badgeColor}`}>{badge}</span>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">タイトル</p>
        <p className="font-semibold text-gray-900 text-sm leading-snug">{draft.title}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">説明</p>
        <p className="text-xs text-gray-600 leading-relaxed">{draft.description}</p>
      </div>
      {draft.experience_story && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-amber-700 mb-1">💬 実体験</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">{draft.experience_story}</p>
        </div>
      )}
      {draft.ai_usage && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-blue-700 mb-1">🤖 AIの活用方法</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">{draft.ai_usage}</p>
          {draft.recommended_tools && draft.recommended_tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {draft.recommended_tools.map(tool => (
                <span key={tool} className="bg-white border border-blue-200 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{tool}</span>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex gap-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
        <span className="font-bold text-blue-700">¥{draft.price_suggestion.toLocaleString()}</span>
        <span>{draft.days_suggestion}日以内</span>
      </div>
      <button onClick={onSelect} className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-white font-bold py-3 rounded-xl text-sm mt-1">
        {label}で登録する →
      </button>
    </div>
  );
}

export default function TryPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [exploreMode, setExploreMode] = useState<ExploreMode>(null);

  // A型
  const [decidedForm, setDecidedForm] = useState({ title: "", description: "", price: "", days: "" });
  const [decidedChatActive, setDecidedChatActive] = useState(false);
  const [decidedChecking, setDecidedChecking] = useState(false);
  const [decidedError, setDecidedError] = useState("");

  // 壁打ち
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  // 履歴書
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 共通
  const [drafts, setDrafts] = useState<Drafts>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const reset = () => {
    setMode(null); setExploreMode(null);
    setDecidedForm({ title: "", description: "", price: "", days: "" });
    setDecidedChatActive(false);
    setDecidedError(""); setDecidedChecking(false);
    setMessages([]); setInput(""); setThinking(false);
    setResumeError(""); setResumeUploading(false);
    setDrafts(null);
  };

  const goRegister = (draft: ServiceDraft) => {
    sessionStorage.setItem("pendingDraft", JSON.stringify(draft));
    window.location.href = "/profile/edit";
  };

  // A型: フォーム送信 → チャット開始（初回メッセージを自動投稿）
  const submitDecided = async () => {
    if (!decidedForm.title || !decidedForm.description) return;
    setDecidedChatActive(true);
    const firstMsg = `「${decidedForm.title}」というサービスを出品したいと思っています。${decidedForm.description}。価格は${decidedForm.price ? `${parseInt(decidedForm.price).toLocaleString()}円` : "未定"}、納期は${decidedForm.days ? `${decidedForm.days}日` : "未定"}を想定しています。`;
    const next: Message[] = [{ role: "user", content: firstMsg }];
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
    } finally {
      setThinking(false);
    }
  };

  // A型: 3回壁打ち後に登録へ進む
  const finishDecided = async () => {
    setDecidedChecking(true);
    setDecidedError("");
    try {
      const res = await fetch("/api/check-service-quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: decidedForm.title,
          description: decidedForm.description,
          price: parseInt(decidedForm.price) || 0,
          days: parseInt(decidedForm.days) || 0,
        }),
      });
      const result = await res.json() as { score: string; feedback: string };
      if (result.score === "fail") {
        setDecidedError(result.feedback);
        return;
      }
      const draft: ServiceDraft = {
        title: decidedForm.title,
        description: decidedForm.description,
        experience_story: "",
        price_suggestion: parseInt(decidedForm.price) || 0,
        days_suggestion: parseInt(decidedForm.days) || 1,
        service_type: "spot",
      };
      setDrafts({ deliverable: draft, consulting: draft });
    } catch {
      setDecidedError("確認に失敗しました。もう一度お試しください。");
    } finally {
      setDecidedChecking(false);
    }
  };

  // 壁打ち送信
  const sendChat = async () => {
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
      if (data.deliverableDraft || data.consultingDraft) {
        setDrafts({
          deliverable: data.deliverableDraft ?? data.consultingDraft,
          consulting: data.consultingDraft ?? data.deliverableDraft,
        });
      }
    } finally {
      setThinking(false);
    }
  };

  // 履歴書アップロード
  const handleFileUpload = async (file: File) => {
    setResumeError("");
    setResumeUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const res = await fetch("/api/resume-service-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, mediaType: file.type }),
      });
      const data = await res.json();
      if (data.error) { setResumeError(data.error); return; }
      setDrafts({
        deliverable: data.deliverableDraft ?? data.consultingDraft,
        consulting: data.consultingDraft ?? data.deliverableDraft,
      });
    } catch {
      setResumeError("読み込みに失敗しました。PDF・画像ファイルをお試しください。");
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {mode ? (
            <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600">← 最初に戻る</button>
          ) : (
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← トップに戻る</Link>
          )}
          <span className="text-sm font-bold text-gray-800">経験イチバ</span>
          <Link href="/profile/edit" className="text-xs text-gray-400 hover:text-gray-600">スキップ →</Link>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

        {/* ━━━ 完成した2案 ━━━ */}
        {drafts && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">
                {mode === "decided" ? "内容を確認してください" : "2つの商品案ができました"}
              </p>
              <p className="text-xs text-gray-400 mt-1">内容は後で編集できます。</p>
            </div>
            <div className={mode === "decided" ? "" : "grid sm:grid-cols-2 gap-4"}>
              {mode === "decided" ? (
                <DraftCard
                  draft={drafts.deliverable}
                  label="この内容"
                  badge="✅ 出品内容"
                  badgeColor="bg-green-50 text-green-700"
                  onSelect={() => goRegister(drafts.deliverable)}
                />
              ) : (
                <>
                  <DraftCard draft={drafts.deliverable} label="成果物型" badge="📄 成果物型" badgeColor="bg-blue-50 text-blue-700" onSelect={() => goRegister(drafts.deliverable)} />
                  <DraftCard draft={drafts.consulting} label="コンサル型" badge="💬 コンサル型" badgeColor="bg-purple-50 text-purple-700" onSelect={() => goRegister(drafts.consulting)} />
                </>
              )}
            </div>
            <button onClick={reset} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2">
              最初からやり直す
            </button>
          </div>
        )}

        {/* ━━━ モード選択（最初の画面） ━━━ */}
        {!drafts && mode === null && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2">
              <p className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 inline-block px-3 py-1 rounded-full">登録 ステップ1 / 2</p>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">
                あなたの経験を<br />商品にしましょう
              </h1>
              <p className="text-sm text-gray-500">どちらに近いですか？</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMode("decided")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group"
              >
                <span className="text-2xl">✍️</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">出品する内容が<br />決まっている</p>
                <p className="text-xs text-gray-500 leading-relaxed">タイトル・説明・価格を入力して、AIに内容を確認してもらいます</p>
              </button>
              <button
                onClick={() => setMode("explore")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group"
              >
                <span className="text-2xl">🔍</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">何を出せばいいか<br />まだ分からない</p>
                <p className="text-xs text-gray-500 leading-relaxed">AIが経験をヒアリングして、商品案を2つ作ります</p>
              </button>
            </div>
          </>
        )}

        {/* ━━━ A型: チャット（フォーム送信後） ━━━ */}
        {!drafts && mode === "decided" && decidedChatActive && (() => {
          const userCount = messages.filter(m => m.role === "user").length;
          const remaining = Math.max(0, 3 - userCount);
          return (
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
                <div className="space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
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
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                    placeholder="続きを入力…（Enterで送信）"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!input.trim() || thinking}
                    className="bg-blue-600 text-white px-4 rounded-xl disabled:opacity-40 flex-shrink-0 hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {remaining > 0 ? (
                <p className="text-center text-xs text-gray-400">あと {remaining} 回やり取りすると登録へ進めます</p>
              ) : (
                <div className="space-y-2">
                  {decidedError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{decidedError}</p>
                  )}
                  <button
                    onClick={finishDecided}
                    disabled={decidedChecking}
                    className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {decidedChecking ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />確認中...</>
                    ) : "登録へ進む →"}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* ━━━ A型: フォーム入力 ━━━ */}
        {!drafts && mode === "decided" && !decidedChatActive && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900">出品内容を入力してください</h2>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">タイトル <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={decidedForm.title}
                onChange={(e) => setDecidedForm(p => ({ ...p, title: e.target.value }))}
                placeholder="例: 新規事業計画書のレビュー・フィードバック"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">説明・提供内容 <span className="text-red-500">*</span></label>
              <textarea
                value={decidedForm.description}
                onChange={(e) => setDecidedForm(p => ({ ...p, description: e.target.value }))}
                placeholder="どんな経験をもとに、何を提供するかを書いてください"
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">価格（円）</label>
                <input
                  type="number"
                  value={decidedForm.price}
                  onChange={(e) => setDecidedForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="例: 30000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">納期（日）</label>
                <input
                  type="number"
                  value={decidedForm.days}
                  onChange={(e) => setDecidedForm(p => ({ ...p, days: e.target.value }))}
                  placeholder="例: 7"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {decidedError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{decidedError}</p>
            )}
            <button
              onClick={submitDecided}
              disabled={!decidedForm.title || !decidedForm.description || decidedChecking}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {decidedChecking ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />AIが確認中...</>
              ) : "内容を確認して登録へ進む"}
            </button>
          </div>
        )}

        {/* ━━━ B/C型: 探索モード選択 ━━━ */}
        {!drafts && mode === "explore" && exploreMode === null && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-1">
              <h2 className="font-bold text-gray-900">どちらで商品案を作りますか？</h2>
              <p className="text-sm text-gray-500">AIが2案を自動で作ります。内容は後で編集できます。</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setExploreMode("chat")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group"
              >
                <span className="text-2xl">💬</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">AIと話しながら<br />決める</p>
                <p className="text-xs text-gray-500 leading-relaxed">経験をヒアリングして商品案を作ります。話すように入力するだけでOK。</p>
              </button>
              <button
                onClick={() => setExploreMode("resume")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group"
              >
                <span className="text-2xl">📄</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">履歴書・経歴書から<br />提案してもらう</p>
                <p className="text-xs text-gray-500 leading-relaxed">PDF・画像をアップロードするだけ。AIが内容を読んで2案を提案します。</p>
              </button>
            </div>
          </>
        )}

        {/* ━━━ B/C壁打ち: チャット ━━━ */}
        {!drafts && mode === "explore" && exploreMode === "chat" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
            <div className="space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-xs text-gray-400 text-center pt-8">下の入力欄からAIに話しかけてみてください</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
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
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                placeholder={messages.length === 0 ? "例：前職で採用担当として〇〇をしていました" : "続きを入力…（Enterで送信）"}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                rows={2}
              />
              <button
                onClick={sendChat}
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

        {/* ━━━ B/C履歴書: アップロード ━━━ */}
        {!drafts && mode === "explore" && exploreMode === "resume" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-bold text-gray-900 mb-1">履歴書・職務経歴書をアップロード</h2>
              <p className="text-xs text-gray-500">PDF、JPG、PNG、WebP に対応しています</p>
            </div>

            {resumeUploading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <span className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm">AIが読み込んでいます...</p>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl py-14 flex flex-col items-center gap-3 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-medium">クリックしてファイルを選択</span>
                <span className="text-xs">PDF / JPG / PNG / WebP</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
            />

            {resumeError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{resumeError}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
