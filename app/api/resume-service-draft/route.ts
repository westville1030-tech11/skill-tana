import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import AdmZip from "adm-zip";

const PROMPT = `以下は経歴・実績に関する資料です（履歴書、職務経歴書、提案書、過去成果物など）。この人物の経験をもとに、副業・スポット発注向けの商品案を2つ作ってください。

説明文・前置き・マークダウン記法は一切不要です。区切り文字とJSONだけ出力してください。

1つ目：成果物型（レポート・テンプレート・ドキュメントなど、納品できる形があるもの）
DELIVERABLE_START
{"title":"商品タイトル（30字以内）","description":"成果物の説明（80字以内）","experience_story":"この経歴から読み取れる実体験ストーリー（150字程度、一人称なし）","ai_usage":"AIをどう使って納品するか（60字以内）","recommended_tools":["Claude","Perplexity"],"price_suggestion":30000,"days_suggestion":3,"service_type":"spot","estimated_hours":8,"hourly_rate_min":3000,"hourly_rate_max":8000,"price_rationale":"価格の根拠を1文で（60字以内）"}
DELIVERABLE_END

2つ目：コンサルティング型（対話・壁打ち・アドバイスセッションなど）
CONSULTING_START
{"title":"コンサル商品タイトル（30字以内）","description":"コンサル・セッションの説明（80字以内）","experience_story":"この経歴から読み取れる実体験ストーリー（150字程度、一人称なし）","ai_usage":"AIをどう使って納品するか（60字以内）","recommended_tools":["Gemini","ChatGPT"],"price_suggestion":15000,"days_suggestion":1,"service_type":"spot","estimated_hours":2,"hourly_rate_min":5000,"hourly_rate_max":15000,"price_rationale":"価格の根拠を1文で（60字以内）"}
CONSULTING_END

recommended_toolsは成果物の内容に合わせて2〜3個選んでください。
- ドキュメント・テンプレート: Claude, Claude Code
- リサーチ・情報収集: Perplexity, Gemini
- ヒアリング・セッション準備: Gemini, ChatGPT
- 議事録・サマリー: ChatGPT, NotebookLM

estimated_hoursはAI活用込みの実作業時間。hourly_rate_min/maxは経験・専門性から推定した適正時間単価の範囲。price_suggestionはestimated_hours × 時間単価中間値を基準に設定。price_rationaleは「なぜこの価格か」を買い手が納得できる1文。`;

function extractJson(text: string, startTag: string, endTag: string) {
  const m = text.match(new RegExp(startTag + "\\s*([\\s\\S]*?)\\s*" + endTag));
  if (m) { try { return JSON.parse(m[1].trim()); } catch {} }
  const blocks = [...text.matchAll(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/g)];
  const idx = startTag.includes("DELIVERABLE") ? 0 : 1;
  if (blocks[idx]) { try { return JSON.parse(blocks[idx][1]); } catch {} }
  return null;
}

function stripXml(xml: string): string {
  return xml
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractTextFromZip(buffer: Buffer, fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  const zip = new AdmZip(buffer);
  const texts: string[] = [];

  if (ext === "docx") {
    const entry = zip.getEntry("word/document.xml");
    if (entry) texts.push(stripXml(entry.getData().toString("utf8")));
  } else if (ext === "pptx") {
    zip.getEntries()
      .filter(e => e.entryName.match(/^ppt\/slides\/slide\d+\.xml$/))
      .sort((a, b) => a.entryName.localeCompare(b.entryName))
      .forEach(e => texts.push(stripXml(e.getData().toString("utf8"))));
  } else if (ext === "xlsx") {
    const shared = zip.getEntry("xl/sharedStrings.xml");
    if (shared) texts.push(stripXml(shared.getData().toString("utf8")));
    zip.getEntries()
      .filter(e => e.entryName.match(/^xl\/worksheets\/sheet\d+\.xml$/))
      .forEach(e => texts.push(stripXml(e.getData().toString("utf8"))));
  }

  return texts.join("\n").trim();
}

const OFFICE_EXTS = ["docx", "pptx", "xlsx", "doc", "ppt", "xls"];
const OFFICE_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.ms-excel",
];

function isOfficeFile(mediaType: string, fileName: string) {
  if (OFFICE_TYPES.includes(mediaType)) return true;
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  return OFFICE_EXTS.includes(ext);
}

export async function POST(req: NextRequest) {
  const { fileBase64, mediaType, fileName = "" } = await req.json();
  if (!fileBase64) {
    return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
  }

  const client = new Anthropic();
  let messageContent: Anthropic.MessageParam["content"];

  if (isOfficeFile(mediaType, fileName)) {
    try {
      const buffer = Buffer.from(fileBase64, "base64");
      const text = extractTextFromZip(buffer, fileName);
      if (!text) {
        return NextResponse.json({ error: "ファイルからテキストを抽出できませんでした。PDF形式でお試しください。" }, { status: 400 });
      }
      messageContent = [
        { type: "text", text: `以下はアップロードされたファイルから抽出したテキストです:\n\n${text}` },
        { type: "text", text: PROMPT },
      ];
    } catch (e) {
      console.error("Office extract error:", e);
      return NextResponse.json({ error: "Officeファイルの読み込みに失敗しました。PDF形式でお試しください。" }, { status: 400 });
    }
  } else if (mediaType === "application/pdf") {
    messageContent = [
      { type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: fileBase64 } },
      { type: "text", text: PROMPT },
    ];
  } else {
    messageContent = [
      { type: "image" as const, source: { type: "base64" as const, media_type: mediaType as "image/jpeg" | "image/png" | "image/webp", data: fileBase64 } },
      { type: "text", text: PROMPT },
    ];
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: messageContent }],
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
