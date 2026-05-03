import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 900,
    messages: [{
      role: "user",
      content: `以下はランサーズ・ココナラ等の出品テキストです。

${text}

次の4項目を分析してJSONで返してください。説明・前置き不要。JSONのみ出力。

{
  "title": "サービスタイトル（そのまま or 短く整理）",
  "description": "説明文（200字以内に要約）",
  "price": 0,
  "days": 0,
  "positioning": "このスキルを経験イチバでどう出品すべきか。成果物型・コンサル型どちらが向いているか、どんな切り口で出すと価値が伝わるかを2〜3文で。",
  "price_thinking": "ランサーズ・ココナラは時間の切り売り型の価格体系だが、経験イチバでは経験・成果の価値で価格を設定する。この人のスキルをどう価値換算すべきか、考え方を2文で。具体的な金額は出さない。"
}

price・daysは元テキストに記載があれば抽出、なければ0。`,
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
