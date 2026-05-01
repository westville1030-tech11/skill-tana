import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const client = new Anthropic();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

  const { imageBase64, mediaType } = await req.json();
  if (!imageBase64 || !mediaType) return NextResponse.json({ error: "画像が必要です" }, { status: 400 });

  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(mediaType)) {
    return NextResponse.json({ error: "JPEG・PNG・WebP形式の画像を使用してください" }, { status: 400 });
  }

  let extracted: { company: string; role: string; name: string };
  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: imageBase64 },
          },
          {
            type: "text",
            text: `この名刺画像から以下の情報を抽出してください。必ずJSON形式のみで返してください。
{"company":"会社名","role":"役職","name":"氏名"}
読み取れない項目は空文字列にしてください。名刺ではない画像の場合は {"company":"","role":"","name":""} を返してください。`,
          },
        ],
      }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "読み取りに失敗しました" }, { status: 500 });
    extracted = JSON.parse(match[0]);
  } catch {
    return NextResponse.json({ error: "読み取りに失敗しました" }, { status: 500 });
  }

  if (!extracted.company && !extracted.role && !extracted.name) {
    return NextResponse.json({ error: "名刺の情報を読み取れませんでした。別の画像をお試しください" }, { status: 400 });
  }

  await supabase().from("profiles").update({
    card_verified: true,
    card_company: extracted.company || null,
    card_role: extracted.role || null,
    updated_at: new Date().toISOString(),
  }).eq("linkedin_id", session.user.id);

  return NextResponse.json({ ok: true, company: extracted.company, role: extracted.role, name: extracted.name });
}
