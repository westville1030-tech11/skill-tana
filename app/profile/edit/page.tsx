"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // 法人メール認証
  const [corpEmail, setCorpEmail] = useState("");
  const [corpCode, setCorpCode] = useState("");
  const [corpCodeSent, setCorpCodeSent] = useState(false);
  const [corpSending, setCorpSending] = useState(false);
  const [corpVerifying, setCorpVerifying] = useState(false);
  const [corpVerified, setCorpVerified] = useState(false);
  const [corpDomain, setCorpDomain] = useState("");
  const [corpSendError, setCorpSendError] = useState("");
  const [corpVerifyError, setCorpVerifyError] = useState("");

  // 名刺認証
  const [cardVerified, setCardVerified] = useState(false);
  const [cardCompany, setCardCompany] = useState("");
  const [cardRole, setCardRole] = useState("");
  const [cardReading, setCardReading] = useState(false);
  const [cardPreview, setCardPreview] = useState("");
  const [cardImageBase64, setCardImageBase64] = useState("");
  const [cardMediaType, setCardMediaType] = useState("");
  const [cardExtracted, setCardExtracted] = useState<{ company: string; role: string; name: string } | null>(null);
  const [cardError, setCardError] = useState("");

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
            setCorpVerified(data.corporate_email_verified ?? false);
            setCorpDomain(data.corporate_email_domain ?? "");
            setCardVerified(data.card_verified ?? false);
            setCardCompany(data.card_company ?? "");
            setCardRole(data.card_role ?? "");
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
          <a href="/login" className="w-full flex items-center justify-center bg-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors">
            ログイン
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

  const handleCardFile = (file: File) => {
    if (!file) return;
    setCardError("");
    setCardExtracted(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCardPreview(dataUrl);
      const [header, base64] = dataUrl.split(",");
      const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
      setCardImageBase64(base64);
      setCardMediaType(mime);
    };
    reader.readAsDataURL(file);
  };

  const readCard = async () => {
    if (!cardImageBase64) return;
    setCardReading(true);
    setCardError("");
    try {
      const res = await fetch("/api/verify-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: cardImageBase64, mediaType: cardMediaType }),
      });
      const data = await res.json();
      if (!res.ok) { setCardError(data.error); return; }
      setCardExtracted(data);
      setCardVerified(true);
      setCardCompany(data.company);
      setCardRole(data.role);
    } catch {
      setCardError("読み取りに失敗しました");
    } finally {
      setCardReading(false);
    }
  };

  const sendCorpCode = async () => {
    setCorpSending(true);
    setCorpSendError("");
    try {
      const res = await fetch("/api/verify-corporate/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: corpEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setCorpSendError(data.error); return; }
      setCorpCodeSent(true);
    } catch {
      setCorpSendError("送信に失敗しました");
    } finally {
      setCorpSending(false);
    }
  };

  const confirmCorpCode = async () => {
    setCorpVerifying(true);
    setCorpVerifyError("");
    try {
      const res = await fetch("/api/verify-corporate/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: corpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setCorpVerifyError(data.error); return; }
      setCorpVerified(true);
      setCorpDomain(data.domain);
      setCorpCodeSent(false);
      setCorpCode("");
    } catch {
      setCorpVerifyError("認証に失敗しました");
    } finally {
      setCorpVerifying(false);
    }
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
              ✓ ログイン済み
            </span>
          </div>
        </div>
      </section>

      {/* ── 法人メール認証 ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">法人メール認証</h2>
            <p className="text-xs text-gray-400 mt-0.5">会社のメールアドレスを認証すると「企業認証済み」バッジが付きます</p>
          </div>
          {corpVerified && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
              ✓ 企業認証済み
            </span>
          )}
        </div>

        {corpVerified ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
            <span className="font-semibold">@{corpDomain}</span> で認証済みです
          </div>
        ) : (
          <div className="space-y-3">
            {!corpCodeSent ? (
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">会社のメールアドレス</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={corpEmail}
                    onChange={(e) => { setCorpEmail(e.target.value); setCorpSendError(""); }}
                    placeholder="you@yourcompany.com"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendCorpCode}
                    disabled={corpSending || !corpEmail.includes("@")}
                    className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {corpSending ? "送信中..." : "コードを送る"}
                  </button>
                </div>
                {corpSendError && <p className="text-xs text-red-500 mt-1.5">{corpSendError}</p>}
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                  <span className="font-semibold">{corpEmail}</span> に6桁の認証コードを送信しました
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">認証コード（6桁）</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={corpCode}
                      onChange={(e) => { setCorpCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCorpVerifyError(""); }}
                      placeholder="123456"
                      maxLength={6}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest font-mono"
                    />
                    <button
                      onClick={confirmCorpCode}
                      disabled={corpVerifying || corpCode.length !== 6}
                      className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {corpVerifying ? "確認中..." : "認証する"}
                    </button>
                  </div>
                  {corpVerifyError && <p className="text-xs text-red-500 mt-1.5">{corpVerifyError}</p>}
                </div>
                <button
                  onClick={() => { setCorpCodeSent(false); setCorpCode(""); setCorpVerifyError(""); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  メールアドレスを変更する
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* ── 名刺認証 ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">名刺認証（退職者・OB向け）</h2>
            <p className="text-xs text-gray-400 mt-0.5">過去の名刺をアップロードすると「過去所属確認済み」バッジが付きます</p>
          </div>
          {cardVerified && (
            <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
              ✓ 過去所属確認済み
            </span>
          )}
        </div>

        {cardVerified ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
            {cardCompany && <span className="font-semibold">{cardCompany}</span>}
            {cardRole && <span className="text-blue-600"> / {cardRole}</span>}
            <span className="text-blue-500"> で確認済みです</span>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${cardPreview ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                {cardPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cardPreview} alt="名刺プレビュー" className="max-h-40 mx-auto rounded-lg object-contain" />
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-1">名刺画像をアップロード</p>
                    <p className="text-xs text-gray-400">JPEG・PNG・WebP対応</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCardFile(f); }}
              />
            </label>

            {cardPreview && !cardExtracted && (
              <button
                onClick={readCard}
                disabled={cardReading}
                className="w-full bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cardReading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />AIで読み取り中...</>
                ) : "AIで名刺を読み取る"}
              </button>
            )}

            {cardExtracted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
                ✓ 読み取り完了：{cardExtracted.company}{cardExtracted.role ? ` / ${cardExtracted.role}` : ""}
              </div>
            )}

            {cardError && <p className="text-xs text-red-500">{cardError}</p>}
          </div>
        )}
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

      {/* ── アカウント削除 ── */}
      <DeleteAccountSection />

      {saved && <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">✓ 保存しました</div>}
      {saving && <div className="fixed bottom-6 right-6 bg-gray-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm">保存中...</div>}
    </div>
  );
}

function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/delete-account", { method: "DELETE" });
      if (!res.ok) return;
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
      router.push("/");
    } finally {
      setDeleting(false);
    }
  };

  if (!session) return null;

  return (
    <section className="bg-white rounded-2xl border border-red-100 p-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">アカウント削除</h2>
      <p className="text-xs text-gray-400 mb-4">削除するとプロフィール・成果物がすべて消去されます。取り消しはできません。</p>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          アカウントを削除する
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 space-y-3">
          <p className="text-sm font-semibold text-red-700">本当に削除しますか？この操作は取り消せません。</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? "削除中..." : "はい、削除します"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </section>
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
