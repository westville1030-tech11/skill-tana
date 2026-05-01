"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Service } from "@/lib/database.types";

type Props = {
  proLinkedInId: string;
  services: Service[];
};

export function InquiryForm({ proLinkedInId, services }: Props) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    service_title: services[0]?.title ?? "",
    message: "",
    deadline: "",
    budget: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pro_linkedin_id: proLinkedInId, ...form }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h3 className="font-bold text-emerald-800 mb-2">問い合わせを送信しました</h3>
        <p className="text-sm text-emerald-700">
          経験者からの返信は <a href="/inbox" className="underline font-medium">受信箱</a> で確認できます。
        </p>
      </div>
    );
  }

  // 未ログイン
  if (status !== "loading" && !session) {
    return (
      <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50 text-center space-y-3">
        <p className="text-sm text-gray-700 font-medium">問い合わせにはログインが必要です</p>
        <p className="text-xs text-gray-500">登録・ログインは無料です（30秒）</p>
        <div className="flex gap-3 justify-center">
          <a
            href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
            className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            ログイン
          </a>
          <a
            href="/signup"
            className="border border-blue-300 text-blue-700 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            新規登録
          </a>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-lg"
      >
        この経験者に問い合わせる
      </button>
    );
  }

  return (
    <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">問い合わせフォーム</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

      {/* ログイン中のユーザー情報 */}
      <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-2.5 mb-4">
        <span className="text-xs text-gray-500">送信者：</span>
        <span className="text-sm font-medium text-gray-800">{session?.user?.name ?? ""}</span>
        <span className="text-xs text-gray-400">{session?.user?.email ?? ""}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {services.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">興味のある成果物</label>
            <select
              value={form.service_title}
              onChange={(e) => setForm((p) => ({ ...p, service_title: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.title}>{s.title} — ¥{s.price.toLocaleString()}</option>
              ))}
              <option value="">その他・相談したい</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            依頼内容・相談したいこと <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            placeholder="どんなデータがあるか、何を知りたいか、現在の状況などを自由にご記入ください"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-y"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">希望納期（任意）</label>
            <input
              type="text"
              value={form.deadline}
              onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
              placeholder="例: 2週間以内"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">予算感（任意）</label>
            <input
              type="text"
              value={form.budget}
              onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
              placeholder="例: 3〜5万円"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
              送信中...
            </>
          ) : "送信する"}
        </button>
      </form>
    </div>
  );
}
