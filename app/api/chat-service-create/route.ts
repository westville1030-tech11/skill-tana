import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `あなたは「経験商品化アシスタント」です。
登録者が自分の経験を「買ってもらえる商品」に変えるための壁打ちを行います。

以下の順番で質問してください（1回1〜2問まで）：
1回目：「どんな問題・課題に直面しましたか？具体的に教えてください。」
2回目：「その問題をどのように解決しましたか？何が決め手でしたか？」
3回目：「その経験を活かして、どんな人・どんな場面で役に立てると思いますか？」

3回の壁打ちが終わったら、必ず以下のJSONフォーマットで商品案を出力してください。
説明文は一切不要で、JSONのみ返してください。

---SERVICE_JSON---
{
  "title": "商品タイトル（30字以内）",
  "description": "商品説明（80字以内）",
  "experience_story": "実体験ストーリー（「〇〇という問題に直面し、△△という方法で解決した」という形式で150字程度）",
  "price_suggestion": 30000,
  "days_suggestion": 3,
  "service_type": "spot"
}
---END---

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

  const jsonMatch = content.text.match(/---SERVICE_JSON---([\s\S]*?)---END---/);
  let serviceDraft = null;
  if (jsonMatch) {
    try {
      serviceDraft = JSON.parse(jsonMatch[1].trim());
    } catch { /* ignore */ }
  }

  const displayText = jsonMatch
    ? "実体験をもとに商品案を作りました。内容を確認して調整してください。"
    : content.text;

  return NextResponse.json({ text: displayText, serviceDraft });
}
