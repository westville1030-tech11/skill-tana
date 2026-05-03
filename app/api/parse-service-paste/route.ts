import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{
      role: "user",
      content: `以下はランサーズ・ココナラ等の出品テキストです。

${text}

このスキル・経験をもとに、副業・スポット発注向けの商品案を最大8個作ってください。
成果物型・コンサル型・規模の大小などバリエーションをつけてください。

説明・前置き不要。JSONのみ出力：
{"drafts":[
  {
    "title":"商品タイトル（30字以内）",
    "description":"説明（80字以内）",
    "experience_story":"この経歴から読み取れる実体験（100字程度、一人称なし）",
    "ai_usage":"AIをどう使って納品するか（50字以内）",
    "recommended_tools":["Claude","Perplexity"],
    "price_suggestion":30000,
    "days_suggestion":3,
    "service_type":"spot",
    "product_type":"deliverable"
  }
]}

product_typeは"deliverable"（レポート・テンプレートなど納品物あり）か"consulting"（対話・セッション）のどちらか。
recommended_toolsは2〜3個。price_suggestionはランサーズの時間単価ではなく成果物・経験の価値ベースで設定。`,
    }],
  });

  const content = message.content[0];
  if (content.type !== "text") return NextResponse.json({ error: "AI error" }, { status: 500 });

  const match = content.text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "parse error" }, { status: 500 });

  try {
    const parsed = JSON.parse(match[0]);
    return NextResponse.json({ drafts: parsed.drafts?.slice(0, 10) ?? [] });
  } catch {
    return NextResponse.json({ error: "json parse error" }, { status: 500 });
  }
}
