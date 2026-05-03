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

const emptyForm = { title: "", description: "", price: "", days: "", service_type: "spot" as "spot" | "ongoing", experience_type: undefined as "failure" | "inheritance" | undefined, frequency: "" };

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // プロフィール基本情報
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // LinkedIn / 所属情報
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [company, setCompany] = useState("");
  const [companyDisplay, setCompanyDisplay] = useState("");
  const [role, setRole] = useState("");
  const [linkedinConnections, setLinkedinConnections] = useState("");
  const [pastCompanies, setPastCompanies] = useState<string[]>([]);
  const [pastCompaniesDisplay, setPastCompaniesDisplay] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState("");

  // 設定
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("available");

  // 成果物
  const [services, setServices] = useState<Service[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [newForm, setNewForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  // AI壁打ち（成果物作成）
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatRounds, setChatRounds] = useState(0);
  const [chatThinking, setChatThinking] = useState(false);
  type ChatDraftType = {
    title: string; description: string; experience_story: string;
    ai_usage?: string; recommended_tools?: string[];
    price_suggestion: number; days_suggestion: number; service_type: "spot" | "ongoing";
    price_rationale?: string;
  };
  const [chatDrafts, setChatDrafts] = useState<{ deliverable: ChatDraftType; consulting: ChatDraftType } | null>(null);
  const [chatDraft, setChatDraft] = useState<ChatDraftType | null>(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [resumeRefineActive, setResumeRefineActive] = useState(false);
  const [deliverableSampleOpen, setDeliverableSampleOpen] = useState(false);
  const [deliverableSampleData, setDeliverableSampleData] = useState<{ sheetName: string; headers: string[]; rows: string[][] } | null>(null);
  const [deliverableSampleLoading, setDeliverableSampleLoading] = useState(false);
  const [qualityChecking, setQualityChecking] = useState(false);
  const [qualityResult, setQualityResult] = useState<{score: string; feedback: string} | null>(null);
  const [addQualityChecking, setAddQualityChecking] = useState(false);
  const [addQualityResult, setAddQualityResult] = useState<{score: string; feedback: string} | null>(null);

  // AIドラフト
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState("");
  const [resumeMediaType, setResumeMediaType] = useState("");
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
            setCompanyDisplay(data.company_display ?? "");
            setRole(data.role ?? "");
            setLinkedinConnections(data.linkedin_connections ?? "");
            setServices(data.services ?? []);
            setPastCompanies(data.past_companies ?? []);
            setPastCompaniesDisplay(data.past_companies_display ?? []);
          }
        })
        .catch(() => {});

      // /try から sessionStorage 経由で渡されたドラフトを読み込む（単体）
      const pending = sessionStorage.getItem("pendingDraft");
      if (pending) {
        sessionStorage.removeItem("pendingDraft");
        try {
          setChatDraft(JSON.parse(pending));
        } catch {}
      }

      // /try からの複数ドラフト一括登録
      const pendingMultiple = sessionStorage.getItem("pendingDrafts");
      if (pendingMultiple) {
        sessionStorage.removeItem("pendingDrafts");
        try {
          const drafts = JSON.parse(pendingMultiple) as Array<{
            title: string; description: string; price_suggestion: number;
            days_suggestion: number; service_type?: string; experience_story?: string;
          }>;
          const newServices = drafts.map(d => ({
            id: crypto.randomUUID(),
            title: d.title,
            description: d.description,
            price: d.price_suggestion,
            days: d.days_suggestion,
            service_type: (d.service_type ?? "spot") as "spot" | "ongoing",
            experience_story: d.experience_story ?? "",
          }));
          setServices(prev => {
            const combined = [...prev, ...newServices];
            fetch("/api/my-profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ services: combined }),
            }).catch(() => {});
            return combined;
          });
        } catch {}
      }
    }
  }, [session]);

  useEffect(() => {
    setDeliverableSampleData(null);
    setDeliverableSampleOpen(false);
  }, [chatDrafts?.deliverable.title, chatDrafts?.deliverable.description]);

  if (status === "loading") {
    return <div className="flex items-center justify-center py-32 text-gray-400">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">イチバの棚に並べる</h1>
        <p className="text-gray-600 mb-8">ログインして、成果物をイチバの棚に並べましょう。</p>
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
    setSaveError("");
    try {
      const res = await fetch("/api/my-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          headline,
          bio,
          skills,
          category: category || null,
          availability,
          linkedin_url: linkedinUrl,
          company,
          company_display: companyDisplay || null,
          role,
          linkedin_connections: linkedinConnections || null,
          services,
          past_companies: pastCompanies,
          past_companies_display: pastCompaniesDisplay,
          ...extra,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const d = await res.json().catch(() => ({}));
        setSaveError(d.error ?? "保存に失敗しました。もう一度お試しください。");
        setTimeout(() => setSaveError(""), 4000);
      }
    } catch {
      setSaveError("通信エラーが発生しました。接続を確認してください。");
      setTimeout(() => setSaveError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeFile = (file: File) => {
    setResumeFile(file);
    setDraftDone(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const [header, base64] = dataUrl.split(",");
      const mime = header.match(/:(.*?);/)?.[1] ?? "application/pdf";
      setResumeBase64(base64);
      setResumeMediaType(mime);
    };
    reader.readAsDataURL(file);
  };

  const runAIDraft = async () => {
    if (!resumeBase64) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/ai-profile-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: resumeBase64, mediaType: resumeMediaType }),
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
        setResumeFile(null);
        setResumeBase64("");
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

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatThinking) return;
    setChatInput("");
    const next = [...chatMessages, { role: "user" as const, content: text }];
    setChatMessages(next);
    setChatThinking(true);
    try {
      const res = await fetch("/api/chat-service-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const newRounds = chatRounds + 1;
      setChatRounds(newRounds);
      setChatMessages([...next, { role: "assistant", content: data.text }]);
      if (data.deliverableDraft || data.consultingDraft) {
        setChatDrafts({
          deliverable: data.deliverableDraft ?? data.consultingDraft,
          consulting: data.consultingDraft ?? data.deliverableDraft,
        });
      }
    } finally {
      setChatThinking(false);
    }
  };

  const confirmChatDraft = (draft: NonNullable<typeof chatDraft>) => {
    const s: Service = {
      id: crypto.randomUUID(),
      title: draft.title,
      description: draft.description,
      experience_story: draft.experience_story,
      price: draft.price_suggestion,
      days: draft.days_suggestion,
      service_type: draft.service_type,
    };
    const next = [...services, s];
    setServices(next);
    save({ services: next });
    setQualityResult(null);
    setShowAIChat(false);
    setChatMessages([]);
    setChatRounds(0);
    setChatDraft(null);
    setChatDrafts(null);
    setChatInput("");
  };

  const addCompany = (val: string) => {
    const c = val.trim();
    if (!c || pastCompanies.includes(c)) return;
    const next = [...pastCompanies, c];
    const nextDisplay = [...pastCompaniesDisplay, ""];
    setPastCompanies(next);
    setPastCompaniesDisplay(nextDisplay);
    save({ past_companies: next, past_companies_display: nextDisplay });
  };

  const removeCompany = (i: number) => {
    const next = pastCompanies.filter((_, idx) => idx !== i);
    const nextDisplay = pastCompaniesDisplay.filter((_, idx) => idx !== i);
    setPastCompanies(next);
    setPastCompaniesDisplay(nextDisplay);
    save({ past_companies: next, past_companies_display: nextDisplay });
  };

  const updateCompanyDisplay = (i: number, val: string) => {
    const next = [...pastCompaniesDisplay];
    next[i] = val;
    setPastCompaniesDisplay(next);
  };

  const saveCompanyDisplay = () => {
    save({ past_companies_display: pastCompaniesDisplay });
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
      experience_type: newForm.experience_type,
      frequency: newForm.frequency || undefined,
    };
    const next = [...services, s];
    setServices(next);
    setNewForm(emptyForm);
    setShowAddForm(false);
    setAddQualityResult(null);
    save({ services: next });
  };

  const handleAddWithQualityCheck = async () => {
    if (!newForm.title || !newForm.price || !newForm.days) return;
    if (addQualityResult) {
      addService();
      return;
    }
    setAddQualityChecking(true);
    try {
      const res = await fetch("/api/check-service-quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newForm.title,
          description: newForm.description,
          price: Number(newForm.price),
          days: Number(newForm.days),
        }),
      });
      const result = await res.json() as { score: string; feedback: string };
      if (result.score === "pass") {
        addService();
      } else {
        setAddQualityResult(result);
      }
    } catch {
      addService();
    } finally {
      setAddQualityChecking(false);
    }
  };

  const deleteService = (id: string) => {
    const next = services.filter((s) => s.id !== id);
    setServices(next);
    save({ services: next });
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setEditForm({ title: s.title, description: s.description, price: String(s.price), days: String(s.days), service_type: s.service_type ?? "spot", experience_type: s.experience_type, frequency: s.frequency ?? "" });
  };

  const saveEdit = () => {
    const next = services.map((s) =>
      s.id === editingId
        ? { ...s, title: editForm.title, description: editForm.description, price: Number(editForm.price), days: Number(editForm.days), service_type: editForm.service_type, experience_type: editForm.experience_type, frequency: editForm.frequency || undefined }
        : s
    );
    setServices(next);
    setEditingId(null);
    save({ services: next });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">マイ棚の設定</h1>
          <p className="text-gray-500 text-sm">成果物をイチバの棚に並べて、クライアントから直接発注を受けましょう</p>
        </div>
        {session.user.id && (
          <a
            href={`/profile/${session.user.id}`}
            target="_blank"
            className="flex-shrink-0 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            マイ棚を見る →
          </a>
        )}
      </div>

      {/* ── AIドラフト（履歴書・職務経歴書から一括入力）── */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">✨</span>
          <h2 className="text-sm font-bold text-blue-800">履歴書・職務経歴書からAIで自動入力</h2>
        </div>
        <p className="text-xs text-blue-600 mb-4 leading-relaxed">
          PDFまたは画像（JPEG・PNG）をアップロードすると、AIが名前・経歴・スキルを自動で入力します。
        </p>
        {draftDone ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
            ✓ プロフィールを自動入力しました。内容を確認して保存してください。
          </div>
        ) : (
          <>
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${resumeFile ? "border-blue-400 bg-blue-50" : "border-blue-200 hover:border-blue-300 bg-white"}`}>
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <span className="text-lg">📄</span>
                    <span className="text-sm font-medium">{resumeFile.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-blue-600 mb-1">クリックしてファイルを選択</p>
                    <p className="text-xs text-blue-400">PDF・Word・PowerPoint・Excel・画像対応</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.pptx,.xlsx"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeFile(f); }}
              />
            </label>
            <button
              onClick={runAIDraft}
              disabled={drafting || !resumeBase64}
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
            <label className="block text-sm text-gray-600 mb-1.5">現在の所属（非公開）</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={(e) => save({ company: e.target.value })}
              placeholder="例: アクセンチュア株式会社"
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
          <label className="block text-sm text-gray-600 mb-1.5">
            公開表示名（任意）
            <span className="ml-2 text-xs text-gray-400 font-normal">— 空欄の場合は所属名がそのまま表示されます</span>
          </label>
          <input
            type="text"
            value={companyDisplay}
            onChange={(e) => setCompanyDisplay(e.target.value)}
            onBlur={(e) => save({ company_display: e.target.value || null })}
            placeholder="例: Big4コンサルティングファーム、連結売上5兆円規模の製造業"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <p className="text-xs text-gray-400">実名は非公開にしたい場合は「公開表示名」に一般化した名称を入力してください。</p>
        </div>
        <div className="space-y-3">
          {pastCompanies.map((c, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <CompanyLogo name={c} size={16} />
                <span className="text-sm text-gray-700 flex-1">{c}</span>
                <button
                  onClick={() => removeCompany(i)}
                  className="text-gray-400 hover:text-red-500 text-xs leading-none"
                >削除</button>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  公開表示名（任意）
                  <span className="ml-1 font-normal">— 空欄の場合は実名がそのまま表示されます</span>
                </label>
                <input
                  type="text"
                  value={pastCompaniesDisplay[i] ?? ""}
                  onChange={(e) => updateCompanyDisplay(i, e.target.value)}
                  onBlur={saveCompanyDisplay}
                  placeholder="例: Big4コンサルティングファーム、外資系メーカー（欧州本社）"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                />
              </div>
            </div>
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
            <p className="text-xs text-gray-400 mt-0.5">実体験をもとにAIが商品案を作ります</p>
          </div>
          {!showAddForm && !showAIChat && !chatDrafts && !chatDraft && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setShowAIChat(true); setChatMessages([]); setChatRounds(0); setChatDraft(null); setChatDrafts(null); }}
                className="text-sm bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                ✨ AI壁打ちで追加
              </button>
              <button
                onClick={() => setShowResumeUpload(true)}
                className="text-sm bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                📄 実績資料から提案
              </button>
              <button onClick={() => setShowAddForm(true)} className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                手動で追加
              </button>
            </div>
          )}
        </div>

        {/* 履歴書アップロード */}
        {showResumeUpload && (
          <ResumeUploadPanel
            onCancel={() => setShowResumeUpload(false)}
            onDraftsReady={(drafts) => {
              setChatDrafts(drafts);
              setShowResumeUpload(false);
            }}
          />
        )}

        {/* AI壁打ちチャット */}
        {showAIChat && !chatDrafts && !chatDraft && (
          <div className="mb-4 border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-700">✨ 実体験から商品を作る</p>
              <button onClick={() => setShowAIChat(false)} className="text-xs text-gray-400 hover:text-gray-600">キャンセル</button>
            </div>
            <p className="text-xs text-blue-600">あなたの経験をAIに話すと、成果物型・コンサル型の2案を自動で作ります。</p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-blue-100 text-gray-700"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatThinking && (
                <div className="flex justify-start">
                  <div className="bg-white border border-blue-100 rounded-xl px-3 py-2">
                    <span className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder={chatMessages.length === 0 ? "例: 前職で採用担当として〇〇をしていました" : "続きを入力...（Enterで送信）"}
                className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                rows={2}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || chatThinking}
                className="bg-blue-600 text-white px-3 rounded-lg disabled:opacity-40 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* AI生成の2案選択 */}
        {chatDrafts && !chatDraft && (
          <div className="mb-4 space-y-3">
            <p className="text-xs font-semibold text-emerald-700">✓ 2つの商品案ができました — どちらかを選んでください</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { d: chatDrafts.deliverable, badge: "📄 成果物型", color: "border-blue-200 bg-blue-50", isDeliverable: true },
                { d: chatDrafts.consulting,  badge: "💬 コンサル型", color: "border-purple-200 bg-purple-50", isDeliverable: false },
              ].map(({ d, badge, color, isDeliverable }) => (
                <div key={badge} className={`border rounded-xl p-3 space-y-2 ${color}`}>
                  <span className="text-[10px] font-bold text-gray-600">{badge}</span>
                  <p className="text-xs font-semibold text-gray-900 leading-snug">{d.title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{d.description}</p>
                  {d.ai_usage && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5">
                      <p className="text-[10px] font-semibold text-blue-700 mb-0.5">🤖 AIの活用方法</p>
                      <p className="text-[10px] text-gray-600 leading-relaxed">{d.ai_usage}</p>
                      {d.recommended_tools && d.recommended_tools.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {d.recommended_tools.map(tool => (
                            <span key={tool} className="bg-white border border-blue-200 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{tool}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">参考価格</span>
                      <span className="font-bold text-blue-700">¥{d.price_suggestion.toLocaleString()}</span>
                      <span>{d.days_suggestion}日以内</span>
                    </div>
                    {d.price_rationale && (
                      <p className="text-[10px] text-gray-500 bg-white/60 border border-slate-200 rounded-lg px-2.5 py-2 leading-relaxed">{d.price_rationale}</p>
                    )}
                  </div>
                  {isDeliverable && (
                    <div>
                      <button
                        onClick={async () => {
                          if (deliverableSampleData) { setDeliverableSampleOpen(v => !v); return; }
                          setDeliverableSampleLoading(true);
                          try {
                            const res = await fetch("/api/service-sample-table", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ title: d.title, description: d.description }),
                            });
                            const data = await res.json();
                            setDeliverableSampleData(data);
                            setDeliverableSampleOpen(true);
                          } finally {
                            setDeliverableSampleLoading(false);
                          }
                        }}
                        disabled={deliverableSampleLoading}
                        className="text-[10px] text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        {deliverableSampleLoading ? (
                          <><span className="flex gap-0.5">{[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</span>生成中…</>
                        ) : (
                          <>{deliverableSampleOpen ? "▲ 閉じる" : "📊 AIが提案する納品物の叩き案を見る"}</>
                        )}
                      </button>
                      {deliverableSampleOpen && deliverableSampleData && (
                        <div className="mt-1 border border-teal-100 rounded-xl overflow-hidden">
                          <div className="bg-teal-50 px-2 py-1 flex items-center gap-1">
                            <span className="text-[9px] font-bold text-teal-700">📄 {deliverableSampleData.sheetName}</span>
                            <span className="text-[8px] text-teal-400">（AIサンプル）</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[9px]">
                              <thead>
                                <tr className="bg-gray-50 border-b border-teal-100">
                                  {deliverableSampleData.headers.map((h, i) => (
                                    <th key={i} className="px-2 py-1 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {deliverableSampleData.rows.map((row, ri) => (
                                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                    {row.map((cell, ci) => (
                                      <td key={ci} className="px-2 py-1 text-gray-600 whitespace-nowrap border-b border-gray-100">{cell}</td>
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
                  <button
                    onClick={() => setChatDraft(d)}
                    className="w-full bg-white border border-gray-300 text-gray-700 text-xs py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    この案を選ぶ
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { setShowAIChat(false); setShowResumeUpload(false); setChatDrafts(null); setChatMessages([]); setChatRounds(0); setResumeRefineActive(false); }} className="text-xs text-gray-400 hover:text-gray-600">
                キャンセル
              </button>
              {!resumeRefineActive && (
                <button
                  onClick={() => {
                    if (chatDrafts) {
                      const initMsg = `資料から2つの商品案を作りました。\n\n📄 成果物型：${chatDrafts.deliverable.title}\n${chatDrafts.deliverable.description}\n\n💬 コンサル型：${chatDrafts.consulting.title}\n${chatDrafts.consulting.description}\n\n修正したい点や追加したい要素があれば教えてください。`;
                      setChatMessages([{ role: "assistant", content: initMsg }]);
                      setChatRounds(0);
                      setResumeRefineActive(true);
                    }
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
                >
                  ✨ この内容をAIと磨く
                </button>
              )}
            </div>
            {resumeRefineActive && (
              <div className="mt-2 border border-emerald-200 bg-white rounded-xl p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-emerald-700">✨ AIと磨く</p>
                  <button onClick={() => { setResumeRefineActive(false); setChatMessages([]); setChatRounds(0); }} className="text-xs text-gray-400 hover:text-gray-600">閉じる</button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        m.role === "user" ? "bg-emerald-600 text-white" : "bg-white border border-emerald-100 text-gray-700"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {chatThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-emerald-100 rounded-xl px-3 py-2">
                        <span className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                    placeholder="修正したい点や追加したい要素を入力..."
                    className="flex-1 border border-emerald-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || chatThinking}
                    className="bg-emerald-600 text-white px-3 rounded-lg disabled:opacity-40 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 選んだ案の詳細確認・編集 */}
        {chatDraft && (
          <div className="mb-4 border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-emerald-700">✓ 内容を確認・編集してください</p>
            <div className="bg-white border border-emerald-100 rounded-lg p-3 space-y-2">
              <input
                className="w-full text-sm font-semibold text-gray-900 border-b border-gray-100 pb-1 focus:outline-none"
                value={chatDraft.title}
                onChange={(e) => setChatDraft(d => d ? { ...d, title: e.target.value } : d)}
              />
              <textarea
                className="w-full text-xs text-gray-600 resize-none focus:outline-none leading-relaxed"
                rows={2}
                value={chatDraft.description}
                onChange={(e) => setChatDraft(d => d ? { ...d, description: e.target.value } : d)}
              />
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-400 mb-1 font-medium">実体験ストーリー</p>
                <textarea
                  className="w-full text-xs text-gray-600 resize-none focus:outline-none leading-relaxed bg-amber-50 rounded px-2 py-1"
                  rows={3}
                  value={chatDraft.experience_story}
                  onChange={(e) => setChatDraft(d => d ? { ...d, experience_story: e.target.value } : d)}
                />
              </div>
              {chatDraft.ai_usage !== undefined && (
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-xs text-gray-400 mb-1 font-medium">🤖 AIの活用方法</p>
                  <textarea
                    className="w-full text-xs text-gray-600 resize-none focus:outline-none leading-relaxed bg-blue-50 rounded px-2 py-1"
                    rows={2}
                    value={chatDraft.ai_usage ?? ""}
                    onChange={(e) => setChatDraft(d => d ? { ...d, ai_usage: e.target.value } : d)}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">参考価格</span>
                  <span className="font-bold text-blue-700">¥{chatDraft.price_suggestion.toLocaleString()}</span>
                  <span>{chatDraft.days_suggestion}日以内</span>
                </div>
                {chatDraft.price_rationale && (
                  <p className="text-[11px] text-gray-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2 leading-relaxed">{chatDraft.price_rationale}</p>
                )}
              </div>
            </div>
            {qualityResult && (
              <div className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                qualityResult.score === "fail"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-yellow-50 border border-yellow-200 text-yellow-800"
              }`}>
                {qualityResult.score === "fail" ? "❌" : "⚠️"} {qualityResult.feedback}
              </div>
            )}
            <div className="flex gap-2">
              {qualityResult?.score !== "fail" && (
                <button
                  onClick={async () => {
                    if (qualityResult?.score === "warn") {
                      confirmChatDraft(chatDraft);
                      return;
                    }
                    setQualityChecking(true);
                    setQualityResult(null);
                    try {
                      const res = await fetch("/api/check-service-quality", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: chatDraft.title,
                          description: chatDraft.description,
                          experience_story: chatDraft.experience_story,
                          price: chatDraft.price_suggestion,
                          days: chatDraft.days_suggestion,
                        }),
                      });
                      const result = await res.json() as { score: string; feedback: string };
                      if (result.score === "pass") {
                        confirmChatDraft(chatDraft);
                      } else {
                        setQualityResult(result);
                      }
                    } catch {
                      confirmChatDraft(chatDraft);
                    } finally {
                      setQualityChecking(false);
                    }
                  }}
                  disabled={qualityChecking}
                  className="flex-1 bg-emerald-600 text-white text-sm py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {qualityChecking ? (
                    <><span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />確認中...</>
                  ) : qualityResult?.score === "warn" ? "このまま出品する" : "この内容で出品する"}
                </button>
              )}
              <button
                onClick={() => {
                  if (qualityResult?.score === "fail") {
                    setQualityResult(null);
                  } else {
                    setChatDraft(null);
                    setQualityResult(null);
                  }
                }}
                className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50"
              >
                {qualityResult?.score === "fail" ? "編集する" : "選び直す"}
              </button>
            </div>
          </div>
        )}


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
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, experience_type: undefined }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${!editForm.experience_type ? "bg-gray-700 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
                  >通常</button>
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, experience_type: "failure" }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${editForm.experience_type === "failure" ? "bg-orange-600 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
                  >失敗から学んだ</button>
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, experience_type: "inheritance" }))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${editForm.experience_type === "inheritance" ? "bg-teal-600 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
                  >継承・次世代へ</button>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-900 text-sm">{s.title}</h3>
                    {s.service_type === "ongoing" && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">継続</span>}
                    {s.experience_type === "failure" && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">失敗から学んだ</span>}
                    {s.experience_type === "inheritance" && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">継承・次世代へ</span>}
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

            {/* 経験タイプ */}
            <div className="flex gap-2">
              <button
                onClick={() => setNewForm((p) => ({ ...p, experience_type: undefined }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${!newForm.experience_type ? "bg-gray-700 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
              >
                通常
              </button>
              <button
                onClick={() => setNewForm((p) => ({ ...p, experience_type: "failure" }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${newForm.experience_type === "failure" ? "bg-orange-600 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
              >
                失敗から学んだ
              </button>
              <button
                onClick={() => setNewForm((p) => ({ ...p, experience_type: "inheritance" }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${newForm.experience_type === "inheritance" ? "bg-teal-600 text-white" : "bg-white border border-gray-300 text-gray-600"}`}
              >
                継承・次世代へ
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
            {addQualityResult && (
              <div className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                addQualityResult.score === "fail"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-yellow-50 border border-yellow-200 text-yellow-800"
              }`}>
                {addQualityResult.score === "fail" ? "❌" : "⚠️"} {addQualityResult.feedback}
              </div>
            )}
            <div className="flex gap-2">
              {addQualityResult?.score !== "fail" && (
                <button
                  onClick={handleAddWithQualityCheck}
                  disabled={addQualityChecking}
                  className={`flex-1 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1.5 ${newForm.service_type === "ongoing" ? "bg-purple-700 hover:bg-purple-800" : "bg-blue-700 hover:bg-blue-800"}`}
                >
                  {addQualityChecking ? (
                    <><span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />確認中...</>
                  ) : addQualityResult?.score === "warn" ? "このまま追加する" : "イチバの棚に追加する"}
                </button>
              )}
              <button
                onClick={() => {
                  if (addQualityResult?.score === "fail") {
                    setAddQualityResult(null);
                  } else {
                    setShowAddForm(false);
                    setNewForm(emptyForm);
                    setAddQualityResult(null);
                  }
                }}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm bg-white"
              >
                {addQualityResult?.score === "fail" ? "編集する" : "キャンセル"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── アカウント削除 ── */}
      <DeleteAccountSection />

      {saved && <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">✓ 保存しました</div>}
      {saving && <div className="fixed bottom-6 right-6 bg-gray-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm">保存中...</div>}
      {saveError && <div className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-xs">{saveError}</div>}
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

type ServiceDraft = {
  title: string; description: string; experience_story: string;
  ai_usage?: string; recommended_tools?: string[];
  price_suggestion: number; days_suggestion: number; service_type: "spot" | "ongoing";
  price_rationale?: string;
};

function ResumeUploadPanel({
  onCancel,
  onDraftsReady,
}: {
  onCancel: () => void;
  onDraftsReady: (drafts: { deliverable: ServiceDraft; consulting: ServiceDraft }) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    if (file.size > 3 * 1024 * 1024) {
      setError("ファイルサイズが大きすぎます（3MB以内にしてください）。PDFに変換するか、不要なページを削除してお試しください。");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/resume-service-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, mediaType: file.type, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok || (!data.deliverableDraft && !data.consultingDraft)) {
        setError("商品案の生成に失敗しました。もう一度お試しください。");
        return;
      }
      onDraftsReady({
        deliverable: data.deliverableDraft ?? data.consultingDraft,
        consulting: data.consultingDraft ?? data.deliverableDraft,
      });
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4 border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-emerald-700">📄 実績資料から商品案を作る</p>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">キャンセル</button>
      </div>
      <p className="text-xs text-emerald-700 leading-relaxed">
        履歴書・提案書・過去成果物など、PDF・Word・PowerPoint・Excel・画像をアップロードすると、AIが内容を読み取って成果物型・コンサル型の2案を提案します。
      </p>
      {uploading ? (
        <div className="flex items-center justify-center gap-2 py-6">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
          <span className="text-xs text-emerald-700">経歴を分析中…</span>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-100/50 transition-colors">
            <p className="text-sm text-emerald-700 font-medium">クリックしてファイルを選択</p>
            <p className="text-xs text-gray-400 mt-1">PDF・Word・PPT・Excel・JPG・PNG（3MB以内）</p>
          </div>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.pptx,.xlsx"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </label>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
