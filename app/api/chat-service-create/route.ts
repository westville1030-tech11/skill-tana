import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `あなたは「経験商品化アシスタント」です。
登録者が自分の経験を「買ってもらえる商品」に変えるための壁打ちを行います。

以下の順番で質問してください（1回1〜2問まで）：
1回目：「あなたのこれまでの経験を教えてください。職務内容、得意なこと、印象に残っている取り組みなど、なんでも構いません。もしプロフィールをお持ちであれば、そこから一緒に考えることもできます。」
2回目：「その経験の中で、特に苦労したことや、工夫して乗り越えたエピソードはありますか？」
3回目：「その経験は、どんな人や場面で役に立てそうですか？」

3回の壁打ちが終わったら、以下のフォーマットで必ず2つの商品案を出力してください。
説明文・前置き・マークダウン記法は一切不要です。区切り文字とJSONだけ出力してください。

DELIVERABLE_START
{"title":"商品タイトル（30字以内）","description":"成果物の説明（80字以内）","experience_story":"実体験ストーリー（150字程度、一人称なし）","price_suggestion":30000,"days_suggestion":3,"service_type":"spot"}
DELIVERABLE_END

CONSULTING_START
{"title":"コンサル商品タイトル（30字以内）","description":"コンサル・壁打ちセッションの説明（80字以内）","experience_story":"実体験ストーリー（150字程度、一人称なし）","price_suggestion":15000,"days_suggestion":1,"service_type":"spot"}
CONSULTING_END

トーンは親しみやすく、簡潔に。`;

function extractJson(text: string, startTag: string, endTag: string) {
  // パターン1: カスタム区切り文字
  const m1 = text.match(new RegExp(startTag + "\\s*([\\s\\S]*?)\\s*" + endTag));
  if (m1) { try { return JSON.parse(m1[1].trim()); } catch {} }

  // パターン2: コードブロック内のJSON（フォールバック）
  const blocks = [...text.matchAll(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/g)];
  const idx = startTag.includes("DELIVERABLE") ? 0 : 1;
  if (blocks[idx]) { try { return JSON.parse(blocks[idx][1]); } catch {} }

  return null;
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: SYSTEM,
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  const deliverableDraft = extractJson(content.text, "DELIVERABLE_START", "DELIVERABLE_END");
  const consultingDraft = extractJson(content.text, "CONSULTING_START", "CONSULTING_END");

  let displayText = content.text
    .replace(/DELIVERABLE_START[\s\S]*?DELIVERABLE_END/g, "")
    .replace(/CONSULTING_START[\s\S]*?CONSULTING_END/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .trim();

  if (deliverableDraft || consultingDraft) {
    displayText = "実体験をもとに2つの商品案を作りました。どちらかを選んでください。";
  }

  return NextResponse.json({ text: displayText, deliverableDraft, consultingDraft });
}
