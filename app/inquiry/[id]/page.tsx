import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

type Inquiry = {
  id: string;
  service_title: string | null;
  client_name: string | null;
  message: string;
  deadline: string | null;
  budget: string | null;
  pro_reply: string | null;
  pro_replied_at: string | null;
  client_token: string | null;
  created_at: string;
};

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function InquiryPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  const { data } = await getAdmin()
    .from("inquiries")
    .select("id, service_title, client_name, message, deadline, budget, pro_reply, pro_replied_at, client_token, created_at")
    .eq("id", id)
    .single();

  const inquiry = data as Inquiry | null;

  if (!inquiry || inquiry.client_token !== token) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-1">経験イチバ · 問い合わせスレッド</p>
        <h1 className="text-xl font-bold text-gray-900">
          {inquiry.service_title ? `「${inquiry.service_title}」への問い合わせ` : "問い合わせの詳細"}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(inquiry.created_at).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="space-y-4">
        {/* 依頼者のメッセージ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-gray-500">
            {inquiry.client_name ? `${inquiry.client_name}さんの依頼内容` : "依頼内容"}
          </p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          {(inquiry.deadline || inquiry.budget) && (
            <div className="flex gap-4 pt-1 border-t border-gray-100">
              {inquiry.deadline && (
                <div>
                  <p className="text-xs text-gray-400">希望納期</p>
                  <p className="text-sm text-gray-700">{inquiry.deadline}</p>
                </div>
              )}
              {inquiry.budget && (
                <div>
                  <p className="text-xs text-gray-400">予算</p>
                  <p className="text-sm text-gray-700">{inquiry.budget}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 経験者の返信 */}
        {inquiry.pro_reply ? (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
            <p className="text-xs font-semibold text-blue-700">
              経験者からの返信 · {inquiry.pro_replied_at ? new Date(inquiry.pro_replied_at).toLocaleDateString("ja-JP", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
            </p>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{inquiry.pro_reply}</p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400">経験者からの返信を待っています</p>
            <p className="text-xs text-gray-300 mt-1">このページをブックマークしてご確認ください</p>
          </div>
        )}
      </div>
    </div>
  );
}
