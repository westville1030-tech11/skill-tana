"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type Inquiry = {
  id: string;
  service_title: string | null;
  pro_linkedin_id: string;
  message: string;
  deadline: string | null;
  budget: string | null;
  pro_reply: string | null;
  pro_replied_at: string | null;
  created_at: string;
};

export default function SentPage() {
  const { data: session, status } = useSession();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/sent-inquiries")
        .then((r) => r.json())
        .then((data) => {
          setInquiries(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center py-32 text-gray-400">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">送信した問い合わせ</h1>
        <p className="text-gray-500 mb-8">ログインすると問い合わせ履歴を確認できます。</p>
        <a href="/login" className="inline-flex items-center bg-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors">
          ログイン
        </a>
      </div>
    );
  }

  const unread = inquiries.filter((q) => q.pro_reply && !expanded?.includes(q.id)).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">送信した問い合わせ</h1>
        {unread > 0 && (
          <span className="bg-blue-600 text-white text-sm font-black px-2.5 py-0.5 rounded-full">
            返信あり {unread}
          </span>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">まだ問い合わせはありません</p>
          <p className="text-sm"><a href="/browse" className="text-blue-600 hover:underline">経験者を探す →</a></p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((q) => (
            <div
              key={q.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                q.pro_reply ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-white"
              }`}
            >
              <button
                onClick={() => setExpanded((prev) => (prev === q.id ? null : q.id))}
                className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {q.pro_reply && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                    <span className="font-semibold text-gray-900 truncate">
                      {q.service_title ?? "相談・問い合わせ"}
                    </span>
                    {q.pro_reply && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        返信あり
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{q.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">
                    {new Date(q.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                  </p>
                  <span className="text-gray-300 text-sm">{expanded === q.id ? "▲" : "▼"}</span>
                </div>
              </button>

              {expanded === q.id && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">依頼内容</p>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{q.message}</p>
                  </div>
                  {q.pro_reply ? (
                    <>
                    <div className="bg-white border border-blue-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-2">
                        経験者からの返信 · {q.pro_replied_at ? new Date(q.pro_replied_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{q.pro_reply}</p>
                    </div>
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
                        href={`/doc/purchase-order/${q.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        📋 発注書を作成
                      </a>
                    </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-400">経験者からの返信を待っています</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
