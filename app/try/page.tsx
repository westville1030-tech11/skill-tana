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
  price_rationale?: string;
  target_buyer?: string;
};

type Drafts = { deliverable: ServiceDraft; consulting: ServiceDraft } | null;
type FlowType = null | "skill" | "legacy";
type Mode = null | "decided" | "explore";
type ExploreMode = null | "chat" | "resume";
type DecidedMode = null | "form" | "file" | "paste";

type SampleTable = { sheetName: string; headers: string[]; rows: string[][] };

function DraftCard({ draft, label, badge, badgeColor, onSelect, isDeliverable, selectable, isSelected, onToggleSelect }: {
  draft: ServiceDraft; label: string; badge: string; badgeColor: string; onSelect: () => void; isDeliverable?: boolean;
  selectable?: boolean; isSelected?: boolean; onToggleSelect?: () => void;
}) {
  const [sampleOpen, setSampleOpen] = useState(false);
  const [sampleData, setSampleData] = useState<SampleTable | null>(null);
  const [sampleLoading, setSampleLoading] = useState(false);

  useEffect(() => {
    setSampleData(null);
    setSampleOpen(false);
  }, [draft.title, draft.description]);

  const toggleSample = async () => {
    if (sampleData) { setSampleOpen(v => !v); return; }
    setSampleLoading(true);
    try {
      const res = await fetch("/api/service-sample-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draft.title, description: draft.description }),
      });
      const data = await res.json();
      setSampleData(data);
      setSampleOpen(true);
    } finally {
      setSampleLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 transition-all ${
        selectable ? "cursor-pointer " + (isSelected ? "border-amber-400 ring-2 ring-amber-100" : "border-gray-200 hover:border-amber-200") : "border-gray-100"
      }`}
      onClick={selectable ? onToggleSelect : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>
        {selectable && (
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
            isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300 bg-white"
          }`}>
            {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
        )}
      </div>
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
      {isDeliverable && (
        <div>
          <button
            onClick={toggleSample}
            disabled={sampleLoading}
            className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1 disabled:opacity-50"
          >
            {sampleLoading ? (
              <><span className="flex gap-0.5">{[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</span>サンプル生成中…</>
            ) : (
              <>{sampleOpen ? "▲ 閉じる" : "📊 AIが提案する納品物の叩き案を見る"}</>
            )}
          </button>
          {sampleOpen && sampleData && (
            <div className="mt-2 border border-teal-100 rounded-xl overflow-hidden">
              <div className="bg-teal-50 px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-teal-700">📄 {sampleData.sheetName}</span>
                <span className="text-[9px] text-teal-500">（AIが生成したサンプルイメージです）</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-teal-100">
                      {sampleData.headers.map((h, i) => (
                        <th key={i} className="px-2.5 py-1.5 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2.5 py-1.5 text-gray-600 whitespace-nowrap border-b border-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="border-t border-gray-100 pt-2 space-y-1.5">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">参考価格</span>
          <span className="font-bold text-blue-700 text-sm">¥{draft.price_suggestion.toLocaleString()}</span>
          <span>{draft.days_suggestion}日以内</span>
        </div>
        {draft.price_rationale && (
          <p className="text-[11px] text-gray-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 leading-relaxed">{draft.price_rationale}</p>
        )}
      </div>
      {draft.target_buyer && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-semibold text-emerald-700 mb-1">👤 こんな方に届けたい</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">{draft.target_buyer}</p>
        </div>
      )}
      {!selectable && (
        <button onClick={onSelect} className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-white font-bold py-3 rounded-xl text-sm mt-1">
          {label}で登録する →
        </button>
      )}
    </div>
  );
}

export default function TryPage() {
  const [flowType, setFlowType] = useState<FlowType>(null);

  // OBフロー
  const [legacyMessages, setLegacyMessages] = useState<Message[]>([]);
  const [legacyInput, setLegacyInput] = useState("");
  const [legacyThinking, setLegacyThinking] = useState(false);
  const [legacyDrafts, setLegacyDrafts] = useState<{ session: ServiceDraft; document: ServiceDraft } | null>(null);
  const [legacyRounds, setLegacyRounds] = useState(0);

  const [mode, setMode] = useState<Mode>(null);
  const [exploreMode, setExploreMode] = useState<ExploreMode>(null);

  // A型
  const [decidedMode, setDecidedMode] = useState<DecidedMode>(null);
  const [decidedForm, setDecidedForm] = useState({ title: "", description: "", price: "", days: "" });
  const [decidedChatActive, setDecidedChatActive] = useState(false);
  const [decidedChecking, setDecidedChecking] = useState(false);
  const [decidedError, setDecidedError] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [pasteInputMode, setPasteInputMode] = useState<"text" | "url">("text");
  const [pasteProcessing, setPasteProcessing] = useState(false);
  const [pasteDrafts, setPasteDrafts] = useState<(ServiceDraft & { product_type: string })[] | null>(null);
  const [pasteNewIdeas, setPasteNewIdeas] = useState<(ServiceDraft & { product_type: string })[] | null>(null);
  const [selectedPasteKeys, setSelectedPasteKeys] = useState<Set<string>>(new Set());

  // 壁打ち
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  // 履歴書
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 共通
  const [drafts, setDrafts] = useState<Drafts>(null);
  const [refineChat, setRefineChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const reset = () => {
    setFlowType(null);
    setMode(null); setExploreMode(null);
    setDecidedMode(null);
    setDecidedForm({ title: "", description: "", price: "", days: "" });
    setDecidedChatActive(false);
    setDecidedError(""); setDecidedChecking(false);
    setMessages([]); setInput(""); setThinking(false);
    setResumeError(""); setResumeUploading(false);
    setPasteText(""); setPasteUrl(""); setPasteInputMode("text"); setPasteProcessing(false); setPasteDrafts(null); setPasteNewIdeas(null); setSelectedPasteKeys(new Set());
    setDrafts(null); setRefineChat(false);
    setLegacyMessages([]); setLegacyInput(""); setLegacyThinking(false); setLegacyDrafts(null); setLegacyRounds(0);
  };

  const goRegister = (draft: ServiceDraft) => {
    sessionStorage.setItem("pendingDraft", JSON.stringify(draft));
    window.location.href = "/profile/edit";
  };

  const goRegisterMultiple = () => {
    const all = [
      ...(pasteDrafts ?? []).map((d, i) => ({ key: `e-${i}`, draft: d })),
      ...(pasteNewIdeas ?? []).map((d, i) => ({ key: `n-${i}`, draft: d })),
    ];
    const selected = all.filter(({ key }) => selectedPasteKeys.has(key)).map(({ draft }) => draft);
    if (!selected.length) return;
    sessionStorage.setItem("pendingDrafts", JSON.stringify(selected));
    window.location.href = "/profile/edit";
  };

  const togglePasteKey = (key: string) => {
    setSelectedPasteKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // A型ファイル: アップロード → draft抽出 → チャット自動開始
  const handleDecidedFile = async (file: File) => {
    setResumeError("");
    if (file.size > 3 * 1024 * 1024) {
      setResumeError("ファイルサイズが大きすぎます（3MB以内にしてください）。PDFに変換するか、不要なページを削除してお試しください。");
      return;
    }
    setResumeUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        binary += String.fromCharCode(...uint8Array.subarray(i, i + chunkSize));
      }
      const base64 = btoa(binary);
      const res = await fetch("/api/resume-service-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, mediaType: file.type, fileName: file.name }),
      });
      if (!res.ok) {
        const text = await res.text();
        setResumeError(`サーバーエラー (${res.status}): ${text.slice(0, 200)}`);
        return;
      }
      const data = await res.json();
      if (data.error) { setResumeError(data.error); return; }
      const draft = data.deliverableDraft ?? data.consultingDraft;
      setDecidedForm({
        title: draft.title ?? "",
        description: draft.description ?? "",
        price: String(draft.price_suggestion ?? ""),
        days: String(draft.days_suggestion ?? ""),
      });
      setDecidedChatActive(true);
      const firstMsg = `ファイルを読み込みました。「${draft.title}」という内容で出品したいと思っています。${draft.description}。価格は${draft.price_suggestion ? `${draft.price_suggestion.toLocaleString()}円` : "未定"}、納期は${draft.days_suggestion ? `${draft.days_suggestion}日` : "未定"}を想定しています。`;
      const next: Message[] = [{ role: "user", content: firstMsg }];
      setMessages(next);
      setThinking(true);
      const chatRes = await fetch("/api/chat-service-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const chatData = await chatRes.json();
      setMessages([...next, { role: "assistant", content: chatData.text }]);
    } catch (e) {
      setResumeError(`読み込みエラー: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setResumeUploading(false);
      setThinking(false);
    }
  };

  // A型: フォーム送信 → チャット開始（初回メッセージを自動投稿）
  const handlePaste = async () => {
    const hasInput = pasteInputMode === "url" ? pasteUrl.trim() : pasteText.trim();
    if (!hasInput) return;
    setPasteProcessing(true);
    setPasteDrafts(null);
    setDecidedError("");
    try {
      const body = pasteInputMode === "url"
        ? { url: pasteUrl.trim() }
        : { text: pasteText };
      const res = await fetch("/api/parse-service-paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) { setDecidedError(data.error); return; }
      if (!data.drafts?.length && !data.new_ideas?.length) { setDecidedError("商品案を生成できませんでした。テキストの量が少ない場合は、より詳しい内容を貼り付けてください。"); return; }
      setPasteDrafts(data.drafts ?? []);
      setPasteNewIdeas(data.new_ideas ?? []);
    } finally {
      setPasteProcessing(false);
    }
  };

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

  // OBフロー チャット
  const sendLegacyMessage = async (text: string, currentMessages: Message[]) => {
    const next: Message[] = [...currentMessages, { role: "user", content: text }];
    setLegacyMessages(next);
    setLegacyThinking(true);
    try {
      const res = await fetch("/api/chat-legacy-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setLegacyRounds(prev => prev + 1);
      setLegacyMessages([...next, { role: "assistant", content: data.text }]);
      if (data.sessionDraft || data.documentDraft) {
        setLegacyDrafts({
          session: data.sessionDraft ?? data.documentDraft,
          document: data.documentDraft ?? data.sessionDraft,
        });
      }
    } finally {
      setLegacyThinking(false);
    }
  };

  const sendLegacyChat = async () => {
    const text = legacyInput.trim();
    if (!text || legacyThinking) return;
    setLegacyInput("");
    await sendLegacyMessage(text, legacyMessages);
  };

  const finalizeLegacy = () => {
    if (legacyThinking) return;
    sendLegacyMessage("まとめてください", legacyMessages);
  };

  // 履歴書アップロード
  const handleFileUpload = async (file: File) => {
    setResumeError("");
    if (file.size > 3 * 1024 * 1024) {
      setResumeError("ファイルサイズが大きすぎます（3MB以内にしてください）。PDFに変換するか、不要なページを削除してお試しください。");
      return;
    }
    setResumeUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        binary += String.fromCharCode(...uint8Array.subarray(i, i + chunkSize));
      }
      const base64 = btoa(binary);
      const res = await fetch("/api/resume-service-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, mediaType: file.type, fileName: file.name }),
      });
      if (!res.ok) {
        const text = await res.text();
        setResumeError(`サーバーエラー (${res.status}): ${text.slice(0, 200)}`);
        return;
      }
      const data = await res.json();
      if (data.error) { setResumeError(data.error); return; }
      setDrafts({
        deliverable: data.deliverableDraft ?? data.consultingDraft,
        consulting: data.consultingDraft ?? data.deliverableDraft,
      });
    } catch (e) {
      setResumeError(`読み込みエラー: ${e instanceof Error ? e.message : String(e)}`);
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
                  <DraftCard draft={drafts.deliverable} label="成果物型" badge="📄 成果物型" badgeColor="bg-blue-50 text-blue-700" onSelect={() => goRegister(drafts.deliverable)} isDeliverable />
                  <DraftCard draft={drafts.consulting} label="コンサル型" badge="💬 コンサル型" badgeColor="bg-purple-50 text-purple-700" onSelect={() => goRegister(drafts.consulting)} />
                </>
              )}
            </div>

            {/* ファイルアップ後：AIと磨くボタン */}
            {mode === "explore" && exploreMode === "resume" && !refineChat && (
              <button
                onClick={async () => {
                  setRefineChat(true);
                  setThinking(true);
                  const context = `ファイルから以下の2案が生成されました。\n\n【成果物型】${drafts.deliverable.title}：${drafts.deliverable.description}\n【コンサル型】${drafts.consulting.title}：${drafts.consulting.description}`;
                  const init: Message[] = [{ role: "user", content: context }];
                  try {
                    const res = await fetch("/api/chat-service-create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ messages: init }),
                    });
                    const data = await res.json();
                    setMessages([...init, { role: "assistant", content: data.text }]);
                  } finally {
                    setThinking(false);
                  }
                }}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                この内容をAIと磨く
              </button>
            )}

            {/* AIと磨く：チャット */}
            {mode === "explore" && exploreMode === "resume" && refineChat && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {messages.map((m, i) => m.role === "assistant" && (
                    <div key={i} className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">{m.content}</div>
                  ))}
                  {thinking && <div className="text-xs text-gray-400 animate-pulse">考え中...</div>}
                  <div ref={bottomRef} />
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="気になる点や変えたい点を入力..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!input.trim() || thinking}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-blue-700 transition-colors"
                  >送信</button>
                </div>
              </div>
            )}

            <button onClick={reset} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2">
              最初からやり直す
            </button>
          </div>
        )}

        {/* ━━━ フロータイプ選択（最初の画面） ━━━ */}
        {!drafts && !legacyDrafts && flowType === null && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2">
              <p className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 inline-block px-3 py-1 rounded-full">はじめに</p>
              <h1 className="text-xl font-bold text-gray-900 leading-snug">
                どちらに近いですか？
              </h1>
              <p className="text-sm text-gray-500">目的に合わせて、最適な流れでご案内します。</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setFlowType("skill")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-3 transition-all group flex flex-col"
              >
                <span className="text-2xl">💼</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">スキル・成果物を<br />売りたい</p>
                <p className="text-xs text-gray-500 leading-relaxed">副業・フリーランスとして、自分のスキルを商品化します。AIがすばやく商品案を作ります。</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">
                  こちらを選ぶ →
                </div>
              </button>
              <button
                onClick={() => setFlowType("legacy")}
                className="bg-white border-2 border-gray-200 hover:border-teal-400 rounded-2xl p-6 text-left space-y-3 transition-all group flex flex-col"
              >
                <span className="text-2xl">📖</span>
                <p className="font-bold text-gray-900 group-hover:text-teal-700">経験・知恵を<br />形に残したい</p>
                <p className="text-xs text-gray-500 leading-relaxed">長年の経験を話しながら、対話セッションや経験録として後世に伝える形にします。</p>
                <div className="mt-auto pt-3 w-full bg-teal-600 group-hover:bg-teal-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">
                  こちらを選ぶ →
                </div>
              </button>
            </div>
          </>
        )}

        {/* ━━━ OBフロー: チャット ━━━ */}
        {flowType === "legacy" && !legacyDrafts && (
          <div className="space-y-4">
            {legacyMessages.length === 0 && !legacyThinking && (
              <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4">
                <p className="text-sm text-teal-700 font-medium mb-1">あなたの経験を聞かせてください</p>
                <p className="text-xs text-teal-600">AIが3つの質問をしながら、経験の核心を引き出します。対話セッションまたは経験録として形に残します。</p>
              </div>
            )}
            {legacyMessages.length === 0 && !legacyThinking && (
              <button
                onClick={async () => {
                  setLegacyThinking(true);
                  try {
                    const res = await fetch("/api/chat-legacy-create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ messages: [] }),
                    });
                    const data = await res.json();
                    setLegacyMessages([{ role: "assistant", content: data.text }]);
                  } finally {
                    setLegacyThinking(false);
                  }
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 transition-colors text-white font-bold py-3.5 rounded-xl text-sm"
              >
                話し始める →
              </button>
            )}
            {(legacyMessages.length > 0 || legacyThinking) && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
                <div className="space-y-3 min-h-[200px] max-h-[420px] overflow-y-auto">
                  {legacyMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user" ? "bg-teal-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {legacyThinking && (
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
                {legacyMessages.length > 0 && (
                  <div className="flex gap-2 border-t border-gray-100 pt-4">
                    <textarea
                      value={legacyInput}
                      onChange={(e) => setLegacyInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendLegacyChat(); } }}
                      placeholder="続きを入力…（Enterで送信）"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
                      rows={2}
                    />
                    <button
                      onClick={sendLegacyChat}
                      disabled={!legacyInput.trim() || legacyThinking}
                      className="bg-teal-600 text-white px-4 rounded-xl disabled:opacity-40 flex-shrink-0 hover:bg-teal-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
            {legacyRounds >= 3 && !legacyThinking && (
              <div className="border border-teal-200 bg-teal-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs text-teal-700">十分に話せましたか？今の内容をもとに2つの商品案を作ることができます。</p>
                <button
                  onClick={finalizeLegacy}
                  className="w-full bg-teal-600 hover:bg-teal-700 transition-colors text-white font-bold py-3 rounded-xl text-sm"
                >
                  この内容でまとめる →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ━━━ OBフロー: 2案 ━━━ */}
        {flowType === "legacy" && legacyDrafts && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">2つの形を提案します</p>
              <p className="text-xs text-gray-400 mt-1">内容は後で編集できます。</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <DraftCard
                draft={legacyDrafts.session}
                label="対話セッション"
                badge="💬 対話セッション"
                badgeColor="bg-purple-50 text-purple-700"
                onSelect={() => goRegister(legacyDrafts.session)}
              />
              <DraftCard
                draft={legacyDrafts.document}
                label="経験録"
                badge="📖 経験録"
                badgeColor="bg-teal-50 text-teal-700"
                onSelect={() => goRegister(legacyDrafts.document)}
              />
            </div>
            <button onClick={reset} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2">
              最初からやり直す
            </button>
          </div>
        )}

        {/* ━━━ モード選択（スキルフロー） ━━━ */}
        {!drafts && flowType === "skill" && mode === null && (
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
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">✍️</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">出品する内容が<br />決まっている</p>
                <p className="text-xs text-gray-500 leading-relaxed">タイトル・説明・価格を入力して、AIに内容を確認してもらいます</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
              <button
                onClick={() => setMode("explore")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">🔍</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">何を出せばいいか<br />まだ分からない</p>
                <p className="text-xs text-gray-500 leading-relaxed">AIが経験をヒアリングして、商品案を2つ作ります</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
            </div>
          </>
        )}

        {/* ━━━ A型: チャット（フォーム送信後） ━━━ */}
        {!drafts && flowType === "skill" && mode === "decided" && decidedChatActive && (() => {
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

        {/* ━━━ A型: 入力方法選択 ━━━ */}
        {!drafts && flowType === "skill" && mode === "decided" && !decidedChatActive && decidedMode === null && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-1">
              <h2 className="font-bold text-gray-900">どちらで出品内容を入力しますか？</h2>
              <p className="text-sm text-gray-500">AIが内容を確認してから登録に進みます。</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => setDecidedMode("form")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">✍️</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">内容を直接入力する</p>
                <p className="text-xs text-gray-500 leading-relaxed">タイトル・説明・価格を入力してAIに確認してもらいます。</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
              <button
                onClick={() => setDecidedMode("paste")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">📋</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">他サービスからコピペする</p>
                <p className="text-xs text-gray-500 leading-relaxed">他のフリーランスサービスの出品内容をそのまま貼り付けるだけ。AIが自動で整理します。</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
              <button
                onClick={() => setDecidedMode("file")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">📂</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">既存ファイルから読み込む</p>
                <p className="text-xs text-gray-500 leading-relaxed">納品物・提案書・名刺など、仕事に関係するファイルをそのまま使えます。</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
            </div>
          </>
        )}

        {/* ━━━ A型: コピペ ━━━ */}
        {!drafts && flowType === "skill" && mode === "decided" && !decidedChatActive && decidedMode === "paste" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-bold text-gray-900 mb-1">他サービスの出品内容を貼り付ける</h2>
              <p className="text-xs text-gray-500">他のサービスの出品ページのテキストをそのまま貼り付けてください。AIがタイトル・説明・価格・納期を自動で整理します。</p>
            </div>
            {!pasteDrafts && !pasteNewIdeas ? (
              <>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1 self-start">
                  <button
                    onClick={() => setPasteInputMode("text")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${pasteInputMode === "text" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    テキストを貼り付け
                  </button>
                  <button
                    onClick={() => setPasteInputMode("url")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${pasteInputMode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    URLを入力
                  </button>
                </div>
                {pasteInputMode === "text" ? (
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder={"例：\nサービス名: 新規事業計画書レビュー\n\n20年の事業開発経験をもとに、事業計画書のレビューとフィードバックを提供します。...\n\n価格: 30,000円\n納期: 3日"}
                    rows={10}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={pasteUrl}
                      onChange={(e) => setPasteUrl(e.target.value)}
                      placeholder="https://example.com/profile/xxx"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400">フリーランスサービス等のプロフィールや出品ページのURLを入力してください。サイトによっては読み込めない場合があります。</p>
                  </div>
                )}
                {decidedError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{decidedError}</p>
                )}
                <button
                  onClick={handlePaste}
                  disabled={(pasteInputMode === "text" ? !pasteText.trim() : !pasteUrl.trim()) || pasteProcessing}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {pasteProcessing ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />AIが商品案を作っています...</>
                  ) : "AIに商品案を出してもらう →"}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">商品案ができました — 気に入ったものを選んでください</p>
                  <button onClick={() => { setPasteDrafts(null); setPasteNewIdeas(null); }} className="text-xs text-gray-400 hover:text-gray-600">← 貼り直す</button>
                </div>
                {(pasteDrafts?.length ?? 0) > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />既存サービスの整理版
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {pasteDrafts!.map((draft, i) => {
                        const key = `e-${i}`;
                        return (
                          <DraftCard
                            key={i}
                            draft={draft}
                            label={draft.product_type === "deliverable" ? "成果物型" : "コンサル型"}
                            badge={draft.product_type === "deliverable" ? "📄 成果物型" : "💬 コンサル型"}
                            badgeColor={draft.product_type === "deliverable" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}
                            onSelect={() => goRegister(draft)}
                            isDeliverable={draft.product_type === "deliverable"}
                            selectable isSelected={selectedPasteKeys.has(key)} onToggleSelect={() => togglePasteKey(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {(pasteNewIdeas?.length ?? 0) > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />AIが提案する新しい商品アイデア
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {pasteNewIdeas!.map((draft, i) => {
                        const key = `n-${i}`;
                        return (
                          <DraftCard
                            key={i}
                            draft={draft}
                            label={draft.product_type === "deliverable" ? "成果物型" : "コンサル型"}
                            badge="💡 新アイデア"
                            badgeColor="bg-emerald-50 text-emerald-700"
                            onSelect={() => goRegister(draft)}
                            isDeliverable={draft.product_type === "deliverable"}
                            selectable isSelected={selectedPasteKeys.has(key)} onToggleSelect={() => togglePasteKey(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedPasteKeys.size > 0 && (
                  <div className="sticky bottom-4 z-10">
                    <button
                      onClick={goRegisterMultiple}
                      className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-white font-bold py-4 rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{selectedPasteKeys.size}件</span>
                      選択した商品をまとめて登録する →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ━━━ A型: ファイルアップロード ━━━ */}
        {!drafts && flowType === "skill" && mode === "decided" && !decidedChatActive && decidedMode === "file" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-bold text-gray-900 mb-1">仕事に関係するファイルをアップロード</h2>
              <p className="text-xs text-gray-500">例：納品物、提案書、名刺、スライドなど　PDF / Word / PowerPoint / Excel / JPG / PNG に対応（3MB以内）</p>
            </div>
            {resumeUploading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <span className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm">AIが読み込んでいます...</p>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleDecidedFile(f); }}
                className={`w-full border-2 border-dashed rounded-2xl py-14 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                  isDragging ? "border-blue-400 bg-blue-50 text-blue-500" : "border-gray-300 hover:border-blue-400 text-gray-400 hover:text-blue-500"
                }`}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-medium">{isDragging ? "ここにドロップ" : "クリックまたはドラッグ＆ドロップ"}</span>
                <span className="text-xs">PDF / Word / PowerPoint / Excel / JPG / PNG</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.pptx,.xlsx"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDecidedFile(f); }}
            />
            {resumeError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{resumeError}</p>
            )}
          </div>
        )}

        {/* ━━━ A型: フォーム入力 ━━━ */}
        {!drafts && flowType === "skill" && mode === "decided" && !decidedChatActive && decidedMode === "form" && (
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
        {!drafts && flowType === "skill" && mode === "explore" && exploreMode === null && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-1">
              <h2 className="font-bold text-gray-900">どちらで商品案を作りますか？</h2>
              <p className="text-sm text-gray-500">AIが2案を自動で作ります。内容は後で編集できます。</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setExploreMode("chat")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">💬</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">AIと話しながら<br />決める</p>
                <p className="text-xs text-gray-500 leading-relaxed">経験をヒアリングして商品案を作ります。話すように入力するだけでOK。</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
              <button
                onClick={() => setExploreMode("resume")}
                className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-left space-y-2 transition-all group flex flex-col"
              >
                <span className="text-2xl">📄</span>
                <p className="font-bold text-gray-900 group-hover:text-blue-700">仕事に関係するファイルから<br />提案してもらう</p>
                <p className="text-xs text-gray-500 leading-relaxed">提案書・名刺・履歴書など何でもOK。AIが内容を読んで2案を提案します。</p>
                <div className="mt-auto pt-3 w-full bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-bold text-center py-2 rounded-xl transition-colors">こちらを選ぶ →</div>
              </button>
            </div>
          </>
        )}

        {/* ━━━ B/C壁打ち: チャット ━━━ */}
        {!drafts && flowType === "skill" && mode === "explore" && exploreMode === "chat" && (
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
        {!drafts && flowType === "skill" && mode === "explore" && exploreMode === "resume" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="font-bold text-gray-900 mb-1">仕事に関係するファイルをアップロード</h2>
              <p className="text-xs text-gray-500">例：過去の作成物、提案書、名刺、履歴書、顧客とのやり取りなど　PDF / Word / PowerPoint / Excel / JPG / PNG に対応（3MB以内）</p>
            </div>

            {resumeUploading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <span className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm">AIが読み込んでいます...</p>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFileUpload(f);
                }}
                className={`w-full border-2 border-dashed rounded-2xl py-14 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50 text-blue-500"
                    : "border-gray-300 hover:border-blue-400 text-gray-400 hover:text-blue-500"
                }`}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-medium">
                  {isDragging ? "ここにドロップ" : "クリックまたはドラッグ＆ドロップ"}
                </span>
                <span className="text-xs">PDF / Word / PowerPoint / Excel / JPG / PNG</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.pptx,.xlsx"
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
