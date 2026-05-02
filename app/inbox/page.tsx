"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type Inquiry = {
  id: string;
  service_title: string | null;
  client_name: string | null;
  client_email: string;
  message: string;
  deadline: string | null;
  budget: string | null;
  status: "new" | "read";
  pro_reply: string | null;
  pro_replied_at: string | null;
  client_token: string | null;
  created_at: string;
};

export default function InboxPage() {
  const { data: session, status } = useSession();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/inquiries")
        .then((r) => r.json())
        .then((data) => {
          setInquiries(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const markRead = async (id: string) => {
    await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setInquiries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "read" } : q))
    );
  };

  const sendReply = async (id: string) => {
    const text = replyInputs[id]?.trim();
    if (!text) return;
    setReplying(id);
    try {
      await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pro_reply: text }),
      });
      setInquiries((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, pro_reply: text, pro_replied_at: new Date().toISOString(), status: "read" }
            : q
        )
      );
      setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    } finally {
      setReplying(null);
    }
  };

  const copyLink = (id: string, token: string | null) => {
    if (!token) return;
    const url = `${window.location.origin}/inquiry/${id}?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
    const inq = inquiries.find((q) => q.id === id);
    if (inq?.status === "new") markRead(id);
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center py-32 text-gray-400">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">受信箱</h1>
        <p className="text-gray-500 mb-8">ログインすると問い合わせを確認できます。</p>
        <a href="/login" className="inline-flex items-center bg-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors">
          ログイン
        </a>
      </div>
    );
  }

  const unread = inquiries.filter((q) => q.status === "new").length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">受信箱</h1>
        {unread > 0 && (
          <span className="num bg-blue-600 text-white text-sm font-black px-2.5 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">まだ問い合わせはありません</p>
          <p className="text-sm">成果物を公開すると、ここに届きます</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((q) => (
            <div
              key={q.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                q.status === "new" ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-white"
              }`}
            >
              {/* ヘッダー行 */}
              <button
                onClick={() => toggle(q.id)}
                className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {q.status === "new" && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                    <span className="font-semibold text-gray-900 truncate">
                      {q.client_name ?? "匿名"} さんから
                    </span>
                    {q.service_title && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        {q.service_title}
                      </span>
                    )}
                    {q.pro_reply && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        返信済み
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{q.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">
                    {new Date(q.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <span className="text-gray-300 text-sm">{expanded === q.id ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* 展開詳細 */}
              {expanded === q.id && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                  <div className="pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">依頼内容</p>
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{q.message}</p>
                    </div>
                    {(q.deadline || q.budget) && (
                      <div className="flex gap-4">
                        {q.deadline && (
                          <div>
                            <p className="text-xs text-gray-400 font-medium">希望納期</p>
                            <p className="text-sm text-gray-700">{q.deadline}</p>
                          </div>
                        )}
                        {q.budget && (
                          <div>
                            <p className="text-xs text-gray-400 font-medium">予算</p>
                            <p className="text-sm text-gray-700">{q.budget}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 既存の返信 */}
                  {q.pro_reply && (
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <p className="text-xs text-green-700 font-medium mb-1">
                        あなたの返信 · {q.pro_replied_at ? new Date(q.pro_replied_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{q.pro_reply}</p>
                    </div>
                  )}

                  {/* 文書作成（返信済みの場合のみ） */}
                  {q.pro_reply && (
                    <div className="flex gap-2">
                      <a
                        href={`/doc/contract/${q.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        📄 契約書を作成
                      </a>
                      <a
                        href={`/doc/invoice/${q.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        🧾 請求書を作成
                      </a>
                    </div>
                  )}

                  {/* 返信フォーム */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">{q.pro_reply ? "返信を更新する" : "返信する"}</p>
                    <textarea
                      value={replyInputs[q.id] ?? ""}
                      onChange={(e) => setReplyInputs((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="依頼者への返信を入力してください"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-20"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => sendReply(q.id)}
                        disabled={!replyInputs[q.id]?.trim() || replying === q.id}
                        className="flex-1 bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-40"
                      >
                        {replying === q.id ? "送信中..." : "返信を送る"}
                      </button>
                      {q.client_token && (
                        <button
                          onClick={() => copyLink(q.id, q.client_token)}
                          className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
                        >
                          {copied === q.id ? "コピーしました ✓" : "依頼者用リンクをコピー"}
                        </button>
                      )}
                    </div>
                    {q.client_token && (
                      <p className="text-xs text-gray-400">
                        依頼者用リンクをコピーして、依頼者に送ると返信内容を確認してもらえます
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
