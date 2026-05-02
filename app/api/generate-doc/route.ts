import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const anthropic = new Anthropic();

function buildPrompt(docType: string, inq: Record<string, string>, today: string): string {
  const base = `
発注者（甲）：${inq.client_name ?? "発注者"}
受託者（乙）：経験者（氏名は個別にご確認ください）
件名：${inq.service_title ?? "業務委託"}
依頼内容：${inq.message ?? ""}
金額：${inq.budget ?? "別途協議"}
納期：${inq.deadline ?? "別途協議"}
日付：${today}
`;

  if (docType === "contract") {
    return `以下の情報を元に、業務委託契約書を日本語で作成してください。シンプルで実用的な内容にしてください。

${base}
以下の条項を含めてください：
1. 業務内容
2. 報酬および支払方法（銀行振込、納品確認後14日以内）
3. 納期
4. 秘密保持
5. 知的財産権の帰属（納品物の著作権は支払完了後に甲に帰属）
6. 契約解除
7. 管轄裁判所（東京地方裁判所）

マークダウン記法は使わず、プレーンテキストで出力してください。`;
  }

  if (docType === "invoice") {
    return `以下の情報を元に、請求書を日本語で作成してください。

請求先：${inq.client_name ?? "発注者"} 様
件名：${inq.service_title ?? "業務委託"}
業務内容：${inq.message ?? ""}
請求金額：${inq.budget ?? "別途協議"}
発行日：${today}
支払期限：発行日から30日以内
振込先：（経験者より別途ご連絡します）

シンプルで実用的な請求書の書式で出力してください。マークダウン記法は使わず、プレーンテキストで出力してください。`;
  }

  if (docType === "purchase-order") {
    return `以下の情報を元に、発注書を日本語で作成してください。

${base}
シンプルで実用的な発注書の書式で出力してください。マークダウン記法は使わず、プレーンテキストで出力してください。`;
  }

  return "";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { inquiry_id, doc_type } = await req.json();
  if (!inquiry_id || !doc_type) {
    return NextResponse.json({ error: "パラメータ不足" }, { status: 400 });
  }

  const { data: inquiry } = await getAdmin()
    .from("inquiries")
    .select("*")
    .eq("id", inquiry_id)
    .single();

  if (!inquiry) {
    return NextResponse.json({ error: "問い合わせが見つかりません" }, { status: 404 });
  }

  const isPro = session.user.id === inquiry.pro_linkedin_id;
  const isClient = session.user.email === inquiry.client_email;
  if (!isPro && !isClient) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  if (!inquiry.pro_reply) {
    return NextResponse.json({ error: "返信後に作成できます" }, { status: 400 });
  }

  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const prompt = buildPrompt(doc_type, inquiry, today);

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ content: text, doc_type, inquiry });
  } catch {
    return NextResponse.json({ error: "生成に失敗しました" }, { status: 500 });
  }
}
