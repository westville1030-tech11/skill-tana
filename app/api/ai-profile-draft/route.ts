import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "テキストが必要です" }, { status: 400 });

  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `以下はLinkedInプロフィールのテキストです。情報を抽出してJSON形式で返してください。

${text}

必ずJSON形式のみで返してください（説明文不要）:
{
  "name": "氏名（フルネーム）",
  "headline": "現在の肩書き・職種（50字以内）",
  "bio": "この人物の強みと経験を活かした自己紹介文（200字以内、日本語、一人称なし）",
  "current_company": "現在の所属会社名",
  "current_role": "現在の役職",
  "past_companies": ["過去の会社1", "過去の会社2"],
  "skills": ["スキル1", "スキル2", "スキル3", "スキル4", "スキル5"]
}`,
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
