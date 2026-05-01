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
  created_at: string;
};

export default function InboxPage() {
  const { data: session, status } = useSession();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

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
        <a
          href="/login"
          className="inline-flex items-center bg-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors"
        >
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

                  {/* 返信ボタン */}
                  <a
                    href={`mailto:${q.client_email}?subject=${encodeURIComponent(`【経験イチバ】${q.service_title ?? "ご相談"}へのご返信`)}&body=${encodeURIComponent(`${q.client_name ?? ""}様\n\nお問い合わせありがとうございます。\n\n`)}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors text-sm"
                  >
                    ✉ {q.client_email} にメールで返信する
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
