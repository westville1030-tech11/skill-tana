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

const emptyForm = { title: "", description: "", price: "", days: "", service_type: "spot" as "spot" | "ongoing", frequency: "" };

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // プロフィール基本情報
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // LinkedIn / 所属情報
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [linkedinConnections, setLinkedinConnections] = useState("");
  const [pastCompanies, setPastCompanies] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState("");

  // 設定
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("available");

  // 成果物
  const [services, setServices] = useState<Service[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  // AIドラフト
  const [linkedinPaste, setLinkedinPaste] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftDone, setDraftDone] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/my-profile")
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            setDisplayName(data.name ?? session.user?.name ?? "");
            setHeadline(data.headline ?? "");
            setBio(data.bio ?? "");
            setSkills(data.skills ?? []);
            setCategory(data.category ?? "");
            setAvailability(data.availability ?? "available");
            setLinkedinUrl(data.linkedin_url ?? "");
            setCompany(data.company ?? "");
            setRole(data.role ?? "");
            setLinkedinConnections(data.linkedin_connections ?? "");
            setServices(data.services ?? []);
            setPastCompanies(data.past_companies ?? []);
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
        <p className="text-gray-600 mb-8">ログインして、成果物を棚に並べましょう。</p>
        <div className="space-y-3">
          <button
            onClick={() => signIn("linkedin")}
            className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors"
          >
            <LinkedInIcon />
            LinkedInでログイン（認証バッジ付き）
          </button>
          <a href="/login" className="w-full flex items-center justify-center bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors">
            メールでログイン
          </a>
          <a href="/signup" className="w-full flex items-center justify-center border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            新規登録（無料）
          </a>
        </div>
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
          name: displayName,
          headline,
          bio,
          skills,
          category,
          availability,
          linkedin_url: linkedinUrl,
          company,
          role,
          linkedin_connections: linkedinConnections,
          services,
          past_companies: pastCompanies,
          ...extra,
        }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } finally { setSaving(false); }
  };

  const runAIDraft = async () => {
    if (!linkedinPaste.trim()) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/ai-profile-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: linkedinPaste }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.name) setDisplayName(data.name);
        if (data.headline) setHeadline(data.headline);
        if (data.bio) setBio(data.bio);
        if (data.current_company) setCompany(data.current_company);
        if (data.current_role) setRole(data.current_role);
        if (data.past_companies?.length) setPastCompanies(data.past_companies);
        if (data.skills?.length) setSkills(data.skills);
        setDraftDone(true);
        setLinkedinPaste("");
      }
    } finally { setDrafting(false); }
  };

  const addSkill = (val: string) => {
    const s = val.trim();
    if (!s || skills.includes(s)) return;
    const next = [...skills, s];
    setSkills(next);
    save({ skills: next });
  };

  const removeSkill = (s: string) => {
    const next = skills.filter((x) => x !== s);
    setSkills(next);
    save({ skills: next });
  };

  const addCompany = (val: string) => {
    const c = val.trim();
    if (!c || pastCompanies.includes(c)) return;
    const next = [...pastCompanies, c];
    setPastCompanies(next);
    save({ past_companies: next });
  };

  const addService = () => {
    if (!newForm.title || !newForm.price || !newForm.days) return;
    const s: Service = {
      id: crypto.randomUUID(),
      title: newForm.title,
      description: newForm.description,
      price: Number(newForm.price),
      days: Number(newForm.days),
      service_type: newForm.service_type,
      frequency: newForm.frequency || undefined,
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
    setEditForm({ title: s.title, description: s.description, price: String(s.price), days: String(s.days), service_type: s.service_type ?? "spot", frequency: s.frequency ?? "" });
  };

  const saveEdit = () => {
    const next = services.map((s) =>
      s.id === editingId
        ? { ...s, title: editForm.title, description: editForm.description, price: Number(editForm.price), days: Number(editForm.days), service_type: editForm.service_type, frequency: editForm.frequency || undefined }
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

      {/* ── AIドラフト（LinkedInから一括入力）── */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">✨</span>
          <h2 className="text-sm font-bold text-blue-800">LinkedInからAIで自動入力</h2>
        </div>
        <p className="text-xs text-blue-600 mb-4 leading-relaxed">
          LinkedInのプロフィールページを開いて全選択（Ctrl+A）→コピー（Ctrl+C）し、下に貼り付けてください。AIが名前・経歴・スキルを自動で入力します。
        </p>
        {draftDone ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
            ✓ プロフィールを自動入力しました。内容を確認して保存してください。
          </div>
        ) : (
          <>
            <textarea
              value={linkedinPaste}
              onChange={(e) => setLinkedinPaste(e.target.value)}
              placeholder="ここにLinkedInプロフィールのテキストを貼り付け..."
              className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-28 resize-y"
            />
            <button
              onClick={runAIDraft}
              disabled={drafting || !linkedinPaste.trim()}
              className="mt-3 flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {drafting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />AI解析中...</>
              ) : "AIでプロフィールを下書き"}
            </button>
          </>
        )}
      </section>

      {/* ── アカウント情報 ── */}
      <section className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">アカウント</h2>
        <div className="flex items-center gap-4">
          {session.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">👤</div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{session.user?.name}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
            <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1.5 border border-blue-100">
              <LinkedInIcon small /> LinkedIn認証済み
            </span>
          </div>
        </div>
      </section>

      {/* ── プロフィール基本情報 ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">プロフィール</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">表示名</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={(e) => save({ name: e.target.value })}
            placeholder="山田 太郎"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">肩書き・ポジション</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            onBlur={(e) => save({ headline: e.target.value })}
            placeholder="例: シニアコンサルタント / データアナリスト"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">自己紹介（200字以内）</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onBlur={(e) => save({ bio: e.target.value })}
            placeholder="強みと提供できる価値を簡潔に"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">スキルタグ</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100">
                {s}
                <button onClick={() => removeSkill(s)} className="text-blue-400 hover:text-red-500 leading-none">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); setSkillInput(""); } }}
              placeholder="例: Python、Excel、財務分析"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => { addSkill(skillInput); setSkillInput(""); }}
              className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-blue-800 transition-colors"
            >追加</button>
          </div>
        </div>
      </section>

      {/* ── LinkedIn / 所属情報 ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-0.5">LinkedInプロフィール情報</h2>
          <p className="text-xs text-gray-400">任意。設定すると信頼バッジが表示されます。</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">LinkedInプロフィールURL</label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            onBlur={(e) => save({ linkedin_url: e.target.value })}
            placeholder="https://www.linkedin.com/in/your-name/"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">現在の所属</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={(e) => save({ company: e.target.value })}
              placeholder="例: 大手メーカー・財務部門"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">役職・ポジション</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onBlur={(e) => save({ role: e.target.value })}
              placeholder="例: シニアコンサルタント"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">LinkedInつながり数（概算）</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "under_100", label: "〜100人" },
              { value: "100_500", label: "100〜500人" },
              { value: "500_1000", label: "500〜1,000人" },
              { value: "over_1000", label: "1,000人以上" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setLinkedinConnections(opt.value); save({ linkedin_connections: opt.value }); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  linkedinConnections === opt.value ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 過去の所属会社 ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-0.5">過去の所属会社（経歴）</h2>
          <p className="text-xs text-gray-400">コンサルや専門職は「どこ出身か」が信頼の根拠になります。</p>
        </div>
        <div className="flex flex-wrap gap-2 min-h-8">
          {pastCompanies.map((c) => (
            <span key={c} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full">
              <CompanyLogo name={c} size={16} />
              {c}
              <button
                onClick={() => { const next = pastCompanies.filter((x) => x !== c); setPastCompanies(next); save({ past_companies: next }); }}
                className="text-gray-400 hover:text-red-500 leading-none ml-0.5"
              >×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && companyInput.trim()) { e.preventDefault(); addCompany(companyInput); setCompanyInput(""); } }}
            placeholder="例: Accenture、McKinsey、トヨタ自動車"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => { addCompany(companyInput); setCompanyInput(""); }}
            className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-blue-800 transition-colors"
          >追加</button>
        </div>
      </section>

      {/* ── 基本設定 ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700">基本設定</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-2">職種</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); save({ category: cat.value }); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            onChange={(e) => { setAvailability(e.target.value); save({ availability: e.target.value }); }}
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">稼働可能</option>
            <option value="part-time">副業可</option>
            <option value="busy">稼働不可</option>
          </select>
        </div>
      </section>

      {/* ── 成果物メニュー ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">成果物メニュー</h2>
            <p className="text-xs text-gray-400 mt-0.5">棚に並べる成果物を登録してください</p>
          </div>
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} className="text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              + 追加
            </button>
          )}
        </div>

        <div className="space-y-3">
          {services.map((s) =>
            editingId === s.id ? (
              <div key={s.id} className={`border rounded-xl p-4 space-y-3 ${editForm.service_type === "ongoing" ? "border-purple-200 bg-purple-50" : "border-blue-200 bg-blue-50"}`}>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, service_type: "spot" }))}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${editForm.service_type === "spot" ? "bg-blue-700 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
                  >スポット成果物</button>
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, service_type: "ongoing" }))}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${editForm.service_type === "ongoing" ? "bg-purple-700 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
                  >継続サポート</button>
                </div>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} placeholder="成果物タイトル" />
                {editForm.service_type === "ongoing" && (
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={editForm.frequency} onChange={(e) => setEditForm((p) => ({ ...p, frequency: e.target.value }))} placeholder="例: 週1回MTG込み、月4回×1h" />
                )}
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white min-h-16 resize-y" value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} placeholder="内容説明" />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">価格（円{editForm.service_type === "ongoing" ? "/月" : ""}）</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">{editForm.service_type === "ongoing" ? "最低契約期間（ヶ月）" : "納期（日数）"}</label>
                    <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={editForm.days} onChange={(e) => setEditForm((p) => ({ ...p, days: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className={`flex-1 text-white py-2 rounded-lg text-sm ${editForm.service_type === "ongoing" ? "bg-purple-700 hover:bg-purple-800" : "bg-blue-700 hover:bg-blue-800"}`}>保存</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm bg-white">キャンセル</button>
                </div>
              </div>
            ) : (
              <div key={s.id} className={`border rounded-xl p-4 flex items-start justify-between gap-3 ${s.service_type === "ongoing" ? "border-purple-200 bg-purple-50" : "border-gray-200"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 text-sm">{s.title}</h3>
                    {s.service_type === "ongoing" && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">継続</span>}
                  </div>
                  {s.frequency && <p className="text-xs text-purple-600 mt-0.5">{s.frequency}</p>}
                  {s.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.description}</p>}
                  <div className="flex gap-3 mt-1.5">
                    <span className={`text-xs font-semibold ${s.service_type === "ongoing" ? "text-purple-700" : "text-blue-700"}`}>
                      ¥{s.price.toLocaleString()}{s.service_type === "ongoing" ? "/月" : ""}
                    </span>
                    <span className="text-xs text-gray-400">{s.days}{s.service_type === "ongoing" ? "ヶ月〜" : "日以内"}</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(s)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">編集</button>
                  <button onClick={() => deleteService(s.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">削除</button>
                </div>
              </div>
            )
          )}
          {services.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">まだ成果物が登録されていません</div>
          )}
        </div>

        {showAddForm && (
          <div className={`mt-3 border rounded-xl p-4 space-y-3 ${newForm.service_type === "ongoing" ? "border-purple-200 bg-purple-50" : "border-blue-200 bg-blue-50"}`}>
            {/* 種別トグル */}
            <div className="flex gap-2">
              <button
                onClick={() => setNewForm((p) => ({ ...p, service_type: "spot" }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${newForm.service_type === "spot" ? "bg-blue-700 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
              >
                スポット成果物
              </button>
              <button
                onClick={() => setNewForm((p) => ({ ...p, service_type: "ongoing" }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${newForm.service_type === "ongoing" ? "bg-purple-700 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
              >
                継続サポート
              </button>
            </div>

            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              value={newForm.title}
              onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={newForm.service_type === "ongoing" ? "例: PMOアドバイザリー、週次進捗管理" : "例: CSV分析レポート、戦略論点整理"}
            />

            {newForm.service_type === "ongoing" && (
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={newForm.frequency}
                onChange={(e) => setNewForm((p) => ({ ...p, frequency: e.target.value }))}
                placeholder="例: 週1回MTG込み、月4回×1h、週次レポート付き"
              />
            )}

            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white min-h-16 resize-y"
              value={newForm.description}
              onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={newForm.service_type === "ongoing" ? "例: PMOとして週次でプロジェクト進捗を管理。課題抽出・ステコミ資料作成込み" : "例: AIでドラフト作成、経験者が検証して納品"}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">
                  価格（円{newForm.service_type === "ongoing" ? "/月" : ""}）
                </label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={newForm.price} onChange={(e) => setNewForm((p) => ({ ...p, price: e.target.value }))} placeholder={newForm.service_type === "ongoing" ? "100000" : "30000"} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">
                  {newForm.service_type === "ongoing" ? "最低契約期間（ヶ月）" : "納期（日数）"}
                </label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" value={newForm.days} onChange={(e) => setNewForm((p) => ({ ...p, days: e.target.value }))} placeholder={newForm.service_type === "ongoing" ? "1" : "3"} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addService} className={`flex-1 text-white py-2.5 rounded-lg text-sm font-medium ${newForm.service_type === "ongoing" ? "bg-purple-700 hover:bg-purple-800" : "bg-blue-700 hover:bg-blue-800"}`}>棚に追加する</button>
              <button onClick={() => { setShowAddForm(false); setNewForm(emptyForm); }} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm bg-white">キャンセル</button>
            </div>
          </div>
        )}
      </section>

      {saved && <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">✓ 保存しました</div>}
      {saving && <div className="fixed bottom-6 right-6 bg-gray-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm">保存中...</div>}
    </div>
  );
}

function CompanyLogo({ name, size = 20 }: { name: string; size?: number }) {
  const domain = name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <span className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        width={size}
        height={size}
        className="rounded-sm object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fb) fb.style.display = "flex";
        }}
      />
      <span className="absolute inset-0 hidden items-center justify-center bg-gray-200 rounded-sm text-gray-600 font-bold" style={{ fontSize: size * 0.45 }}>
        {initials}
      </span>
    </span>
  );
}

function LinkedInIcon({ small }: { small?: boolean }) {
  return (
    <svg className={small ? "w-3 h-3" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
