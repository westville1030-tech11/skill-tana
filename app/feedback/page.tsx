"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { value: "feature", label: "機能の要望" },
  { value: "bug", label: "不具合の報告" },
  { value: "ux", label: "使いにくかった点" },
  { value: "other", label: "その他" },
];

export default function FeedbackPage() {
  const [category, setCategory] = useState("feature");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message, email }),
      });
      setDone(true);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-4xl mb-4">ありがとうございます</div>
        <p className="text-gray-600 mb-8 leading-relaxed">
          ご意見を受け付けました。サービス改善に活かします。
        </p>
        <Link href="/" className="text-blue-600 text-sm hover:underline">← トップに戻る</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-8 inline-block">← トップに戻る</Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">ご意見箱</h1>
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
        さらなる機能向上のため、皆様のご意見をお待ちしております。
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-2">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c.value
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
            ご意見・ご要望 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="例：〇〇の機能があると便利です、△△の部分がわかりにくかったです"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-36 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
            メールアドレス <span className="text-gray-400 font-normal">（任意・返信が必要な場合）</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {sending ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}
