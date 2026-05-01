import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PROMPT = `以下は履歴書または職務経歴書です。この人物の経験をもとに、副業・スポット発注向けの商品案を2つ作ってください。

説明文・前置き・マークダウン記法は一切不要です。区切り文字とJSONだけ出力してください。

1つ目：成果物型（レポート・テンプレート・ドキュメントなど、納品できる形があるもの）
DELIVERABLE_START
{"title":"商品タイトル（30字以内）","description":"成果物の説明（80字以内）","experience_story":"この経歴から読み取れる実体験ストーリー（150字程度、一人称なし）","ai_usage":"AIをどう使って納品するか（60字以内）","recommended_tools":["Claude","Perplexity"],"price_suggestion":30000,"days_suggestion":3,"service_type":"spot"}
DELIVERABLE_END

2つ目：コンサルティング型（対話・壁打ち・アドバイスセッションなど）
CONSULTING_START
{"title":"コンサル商品タイトル（30字以内）","description":"コンサル・セッションの説明（80字以内）","experience_story":"この経歴から読み取れる実体験ストーリー（150字程度、一人称なし）","ai_usage":"AIをどう使って納品するか（60字以内）","recommended_tools":["Gemini","ChatGPT"],"price_suggestion":15000,"days_suggestion":1,"service_type":"spot"}
CONSULTING_END

recommended_toolsは成果物の内容に合わせて2〜3個選んでください。
- ドキュメント・テンプレート: Claude, Claude Code
- リサーチ・情報収集: Perplexity, Gemini
- ヒアリング・セッション準備: Gemini, ChatGPT
- 議事録・サマリー: ChatGPT, NotebookLM`;

function extractJson(text: string, startTag: string, endTag: string) {
  const m = text.match(new RegExp(startTag + "\\s*([\\s\\S]*?)\\s*" + endTag));
  if (m) { try { return JSON.parse(m[1].trim()); } catch {} }
  const blocks = [...text.matchAll(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/g)];
  const idx = startTag.includes("DELIVERABLE") ? 0 : 1;
  if (blocks[idx]) { try { return JSON.parse(blocks[idx][1]); } catch {} }
  return null;
}

export async function POST(req: NextRequest) {
  const { fileBase64, mediaType } = await req.json();
  if (!fileBase64 || !mediaType) {
    return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
  }

  const client = new Anthropic();

  const contentBlock = mediaType === "application/pdf"
    ? { type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: fileBase64 } }
    : { type: "image" as const, source: { type: "base64" as const, media_type: mediaType as "image/jpeg" | "image/png" | "image/webp", data: fileBase64 } };

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: [contentBlock, { type: "text", text: PROMPT }] }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  const deliverableDraft = extractJson(content.text, "DELIVERABLE_START", "DELIVERABLE_END");
  const consultingDraft = extractJson(content.text, "CONSULTING_START", "CONSULTING_END");

  if (!deliverableDraft && !consultingDraft) {
    return NextResponse.json({ error: "商品案の生成に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({
    deliverableDraft: deliverableDraft ?? consultingDraft,
    consultingDraft: consultingDraft ?? deliverableDraft,
  });
}
