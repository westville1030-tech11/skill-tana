import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PROMPT = `以下は履歴書または職務経歴書です。情報を抽出してJSON形式で返してください。

必ずJSON形式のみで返してください（説明文不要）:
{
  "name": "氏名（フルネーム）",
  "headline": "現在の肩書き・職種（50字以内）",
  "bio": "この人物の強みと経験を活かした自己紹介文（200字以内、日本語、一人称なし）",
  "current_company": "現在の所属会社名",
  "current_role": "現在の役職",
  "past_companies": ["過去の会社1", "過去の会社2"],
  "skills": ["スキル1", "スキル2", "スキル3", "スキル4", "スキル5"]
}`;

export async function POST(req: NextRequest) {
  const { fileBase64, mediaType } = await req.json();
  if (!fileBase64 || !mediaType) {
    return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
  }

  const client = new Anthropic();

  const contentBlock = mediaType === "application/pdf"
    ? {
        type: "document" as const,
        source: { type: "base64" as const, media_type: "application/pdf" as const, data: fileBase64 },
      }
    : {
        type: "image" as const,
        source: { type: "base64" as const, media_type: mediaType as "image/jpeg" | "image/png" | "image/webp", data: fileBase64 },
      };

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [contentBlock, { type: "text", text: PROMPT }],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not found");
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "解析エラー" }, { status: 500 });
  }
}
