"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const docLabel: Record<string, string> = {
  contract: "業務委託契約書",
  invoice: "請求書",
  "purchase-order": "発注書",
};

export default function DocPage() {
  const params = useParams();
  const docType = params.type as string;
  const inquiryId = params.id as string;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/generate-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiry_id: inquiryId, doc_type: docType }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setContent(data.content);
      })
      .catch(() => setError("生成に失敗しました"))
      .finally(() => setLoading(false));
  }, [inquiryId, docType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-gray-500">
        <span className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm">{docLabel[docType] ?? "文書"}を生成中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-500">
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.close()} className="text-sm text-gray-500 underline">閉じる</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0 print:py-0">
      {/* 操作バー（印刷時非表示） */}
      <div className="print:hidden max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">{docLabel[docType] ?? "文書"}</span>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            印刷 / PDF保存
          </button>
          <button
            onClick={() => window.close()}
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>

      {/* 文書本体 */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-10 print:shadow-none print:rounded-none print:p-12">
        <p className="text-xs text-gray-400 mb-6 print:hidden">
          ※ AIが生成した下書きです。内容をご確認のうえ、必要に応じて修正してください。
        </p>
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}
