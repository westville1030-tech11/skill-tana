import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `あなたは「経験商品化アシスタント」です。
登録者が自分の経験を「買ってもらえる商品」に変えるための壁打ちを行います。

以下の順番で質問してください（1回1〜2問まで）：
1回目：「あなたのこれまでの経験を教えてください。職務内容、得意なこと、印象に残っている取り組みなど、なんでも構いません。もしプロフィールをお持ちであれば、そこから一緒に考えることもできます。」
2回目：「その経験の中で、特に苦労したことや、工夫して乗り越えたエピソードはありますか？」
3回目：「その経験は、どんな人や場面で役に立てそうですか？」

3回の壁打ちが終わったら、必ず以下の2つのJSONフォーマットで商品案を出力してください。
説明文・前置きは一切不要で、JSONのみ出力してください。

1つ目：成果物型（レポート・テンプレート・ドキュメント・設計書など、納品できる形があるもの）
---DELIVERABLE_JSON---
{
  "title": "商品タイトル（30字以内）",
  "description": "商品説明（80字以内）",
  "experience_story": "実体験ストーリー（150字程度、一人称なし）",
  "price_suggestion": 30000,
  "days_suggestion": 3,
  "service_type": "spot"
}
---DELIVERABLE_END---

2つ目：コンサルティング型（対話・壁打ち・アドバイスセッション・レビューなど）
---CONSULTING_JSON---
{
  "title": "商品タイトル（30字以内）",
  "description": "商品説明（80字以内）",
  "experience_story": "実体験ストーリー（150字程度、一人称なし）",
  "price_suggestion": 15000,
  "days_suggestion": 1,
  "service_type": "spot"
}
---CONSULTING_END---

トーンは親しみやすく、簡潔に。`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM,
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  const parseJson = (text: string, start: string, end: string) => {
    const match = text.match(new RegExp(`${start}([\\s\\S]*?)${end}`));
    if (!match) return null;
    try { return JSON.parse(match[1].trim()); } catch { return null; }
  };

  const deliverableDraft = parseJson(content.text, "---DELIVERABLE_JSON---", "---DELIVERABLE_END---");
  const consultingDraft = parseJson(content.text, "---CONSULTING_JSON---", "---CONSULTING_END---");

  let displayText = content.text
    .replace(/---DELIVERABLE_JSON---[\s\S]*?---DELIVERABLE_END---/g, "")
    .replace(/---CONSULTING_JSON---[\s\S]*?---CONSULTING_END---/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .trim();

  if (deliverableDraft || consultingDraft) {
    displayText = "実体験をもとに2つの商品案を作りました。どちらかを選んでください。";
  }

  return NextResponse.json({ text: displayText, deliverableDraft, consultingDraft });
}
