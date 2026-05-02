"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
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
  const [matchChecking, setMatchChecking] = useState(false);
  const [matchResult, setMatchResult] = useState<{score: string; feedback: string} | null>(null);
  const [lineVerified, setLineVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (open && session?.user && lineVerified === null) {
      fetch("/api/my-profile")
        .then(r => r.json())
        .then(data => setLineVerified(!!data?.line_verified))
        .catch(() => setLineVerified(true));
    }
  }, [open, session, lineVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!matchResult) {
      const selectedService = services.find(s => s.title === form.service_title);
      setMatchChecking(true);
      try {
        const res = await fetch("/api/check-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_title: selectedService?.title ?? form.service_title,
            service_description: selectedService?.description,
            service_price: selectedService?.price,
            service_days: selectedService?.days,
            inquiry_message: form.message,
            inquiry_budget: form.budget,
            inquiry_deadline: form.deadline,
          }),
        });
        const result = await res.json() as { score: string; feedback: string };
        setMatchResult(result);
        if (result.score !== "match") return;
      } catch {}
      finally {
        setMatchChecking(false);
      }
    }

    setSending(true);
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
          返信は <a href="/sent" className="underline font-medium">送った問い合わせ</a> で確認できます。
        </p>
      </div>
    );
  }

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

  if (lineVerified === null) {
    return (
      <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50 flex items-center justify-center py-12">
        <span className="w-5 h-5 border-2 border-blue-400/40 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (lineVerified === false) {
    return (
      <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">問い合わせフォーム</h3>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <LineVerificationStep />
      </div>
    );
  }

  return (
    <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">問い合わせフォーム</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

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
              onChange={(e) => { setForm((p) => ({ ...p, service_title: e.target.value })); setMatchResult(null); }}
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
            onChange={(e) => { setForm((p) => ({ ...p, message: e.target.value })); setMatchResult(null); }}
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

        {matchResult && matchResult.score !== "match" && (
          <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
            matchResult.score === "mismatch"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-yellow-50 border border-yellow-200 text-yellow-800"
          }`}>
            {matchResult.score === "mismatch" ? "⚠️" : "💡"} {matchResult.feedback}
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-1.5">
          <p className="text-xs text-gray-500">
            💳 現在はご成約後に直接お振込みでの精算となります。決済保護（エスクロー）機能は近日実装予定です。
          </p>
          <p className="text-xs text-gray-500">
            💡 初回取引のコツ：着手金50%・納品確認後に残り50%の分割払いをおすすめします。
          </p>
        </div>

        <button
          type="submit"
          disabled={sending || matchChecking}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {matchChecking ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
              マッチ度を確認中...
            </>
          ) : sending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
              送信中...
            </>
          ) : matchResult && matchResult.score !== "match" ? "それでも送信する" : "送信する"}
        </button>
      </form>
    </div>
  );
}

function LineVerificationStep() {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-green-800 mb-1">LINE認証が必要です</p>
        <p className="text-xs text-green-700 leading-relaxed">
          不正利用防止のため、問い合わせにはLINE認証が必要です。LINEアカウントは電話番号と紐付いているため、なりすまし防止になります。一度認証すると次回以降は不要です。
        </p>
      </div>
      <button
        onClick={() => signIn("line", { callbackUrl: typeof window !== "undefined" ? window.location.href : "/" })}
        className="w-full bg-[#06C755] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#05a847] transition-colors flex items-center justify-center gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.07 2 11.07c0 4.5 3.44 8.26 8.14 8.93.32.07.75.21.86.48.1.24.06.62.03.86l-.14.83c-.04.24-.19.95.83.52 1.02-.44 5.52-3.25 7.53-5.56C20.85 15.42 22 13.35 22 11.07 22 6.07 17.52 2 12 2z"/>
        </svg>
        LINEで認証して問い合わせる
      </button>
    </div>
  );
}
