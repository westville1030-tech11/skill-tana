import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{
      role: "user",
      content: `以下はランサーズ・ココナラ等の出品テキストです。タイトル・説明・価格・納期を抽出してください。

${text}

説明・前置き不要。JSONのみ出力：
{"title":"サービスタイトル","description":"説明文（200字以内に要約）","price":30000,"days":7}

価格・納期が不明な場合は price:0, days:0 としてください。`,
    }],
  });

  const content = message.content[0];
  if (content.type !== "text") return NextResponse.json({ error: "AI error" }, { status: 500 });

  const match = content.text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "parse error" }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(match[0]));
  } catch {
    return NextResponse.json({ error: "json parse error" }, { status: 500 });
  }
}
