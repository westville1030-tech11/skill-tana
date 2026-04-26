"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import type { Service } from "@/lib/database.types";

const CATEGORIES = [
  { value: "consultant", label: "コンサルタント" },
  { value: "engineer", label: "エンジニア" },
  { value: "designer", label: "デザイナー" },
  { value: "other", label: "その他" },
];

const emptyForm = { title: "", description: "", price: "", days: "" };

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("available");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/my-profile")
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            setCategory(data.category ?? "");
            setAvailability(data.availability ?? "available");
            setLinkedinUrl(data.linkedin_url ?? "");
            setServices(data.services ?? []);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return <div className="flex items-center justify-center py-32 text-gray-400">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">棚に並べる</h1>
        <p className="text-gray-600 mb-8">LinkedInアカウントでログインして、成果物を棚に並べましょう。</p>
        <button
          onClick={() => signIn("linkedin")}
          className="flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl font-medium mx-auto hover:bg-blue-800 transition-colors"
        >
          <LinkedInIcon />
          LinkedInでログイン（無料）
        </button>
      </div>
    );
  }

  const save = async (extra?: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/my-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          availability,
          linkedin_url: linkedinUrl,
          services,
          ...extra,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (!newForm.title || !newForm.price || !newForm.days) return;
    const s: Service = {
      id: crypto.randomUUID(),
      title: newForm.title,
      description: newForm.description,
      price: Number(newForm.price),
      days: Number(newForm.days),
    };
    const next = [...services, s];
    setServices(next);
    setNewForm(emptyForm);
    setShowAddForm(false);
    save({ services: next });
  };

  const deleteService = (id: string) => {
    const next = services.filter((s) => s.id !== id);
    setServices(next);
    save({ services: next });
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setEditForm({
      title: s.title,
      description: s.description,
      price: String(s.price),
      days: String(s.days),
    });
  };

  const saveEdit = () => {
    const next = services.map((s) =>
      s.id === editingId
        ? {
            ...s,
            title: editForm.title,
            description: editForm.description,
            price: Number(editForm.price),
            days: Number(editForm.days),
          }
        : s
    );
    setServices(next);
    setEditingId(null);
    save({ services: next });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">マイ棚の設定</h1>
        <p className="text-gray-500 text-sm">成果物を棚に並べて、クライアントから直接発注を受けましょう</p>
      </div>

      {/* LinkedInから自動取得 */}
      <section className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          LinkedInから自動取得
        </h2>
        <div className="flex items-center gap-4">
          {session.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
              👤
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{session.user?.name}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1.5 border border-blue-100">
              <LinkedInIcon small /> LinkedIn認証済み
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          名前・写真はLinkedIn上で変更してください。次回ログイン時に自動で反映されます。
        </p>
      </section>

      {/* LinkedInプロフィールURL */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">LinkedInプロフィールURL</h2>
        <p className="text-xs text-gray-400 mb-3">
          クライアントがあなたの職歴・つながり数を確認するために使われます。
          スパム防止のため、本人のプロフィールURLを設定してください。
        </p>
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          onBlur={(e) => save({ linkedin_url: e.target.value })}
          placeholder="https://www.linkedin.com/in/your-name/"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>

      {/* 基本設定 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700">基本設定</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-2">職種</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  save({ category: cat.value });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">稼働状況</label>
          <select
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value);
              save({ availability: e.target.value });
            }}
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">稼働可能</option>
            <option value="part-time">副業可</option>
            <option value="busy">稼働不可</option>
          </select>
        </div>
      </section>

      {/* 成果物メニュー */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">成果物メニュー</h2>
            <p className="text-xs text-gray-400 mt-0.5">棚に並べる成果物を登録してください</p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              + 追加
            </button>
          )}
        </div>

        <div className="space-y-3">
          {services.map((s) =>
            editingId === s.id ? (
              <div key={s.id} className="border border-blue-200 rounded-xl bg-blue-50 p-4 space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="成果物タイトル"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white min-h-16 resize-y"
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="内容説明"
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">価格（円）</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={editForm.price}
                      onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                      placeholder="30000"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">納期（日数）</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={editForm.days}
                      onChange={(e) => setEditForm((p) => ({ ...p, days: e.target.value }))}
                      placeholder="3"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm hover:bg-blue-800"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 bg-white"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div key={s.id} className="border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{s.title}</h3>
                  {s.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.description}</p>
                  )}
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs font-semibold text-blue-700">
                      ¥{s.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">{s.days}日以内</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEdit(s)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteService(s.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            )
          )}

          {services.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
              まだ成果物が登録されていません
            </div>
          )}
        </div>

        {/* 追加フォーム */}
        {showAddForm && (
          <div className="mt-3 border border-blue-200 rounded-xl bg-blue-50 p-4 space-y-3">
            <p className="text-sm font-medium text-blue-700">新しい成果物を追加</p>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              value={newForm.title}
              onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="成果物タイトル（例: CSV分析レポート）"
            />
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white min-h-16 resize-y"
              value={newForm.description}
              onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="内容説明（例: AIでドラフト作成、プロが検証して納品）"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">価格（円）</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newForm.price}
                  onChange={(e) => setNewForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="30000"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">納期（日数）</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newForm.days}
                  onChange={(e) => setNewForm((p) => ({ ...p, days: e.target.value }))}
                  placeholder="3"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addService}
                className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg text-sm hover:bg-blue-800 font-medium"
              >
                棚に追加する
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewForm(emptyForm);
                }}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 bg-white"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 保存トースト */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          ✓ 保存しました
        </div>
      )}

      {saving && (
        <div className="fixed bottom-6 right-6 bg-gray-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm">
          保存中...
        </div>
      )}
    </div>
  );
}

function LinkedInIcon({ small }: { small?: boolean }) {
  return (
    <svg className={small ? "w-3 h-3" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
