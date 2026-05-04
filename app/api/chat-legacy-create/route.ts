import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_BASE = `あなたは「経験継承アシスタント」です。
長年の経験を持つ方から、その人にしかない「生きた経験」を引き出す対話を行います。
トーンは温かく、丁寧に。相手の経験を大切にする姿勢で。`;

const SYSTEM_FINALIZE = `
ユーザーがまとめを希望しました。以下の2案を出力してください。
説明文・前置き・マークダウン記法は一切不要です。区切り文字とJSONだけ出力してください。

SESSION_START
{"title":"セッションタイトル（30字以内）","description":"どんな経験を持つ人と話せるか（80字以内）","experience_story":"語られた実体験の核心（150字程度、一人称なし）","ai_usage":"セッション準備にAIをどう使うか（50字以内）","recommended_tools":["Gemini","ChatGPT"],"price_suggestion":15000,"days_suggestion":1,"service_type":"spot","price_rationale":"この経験を直接聞ける価値を経験の希少性・再現困難性で説明する1文（60字以内）","target_buyer":"この経験から学びたい個人の人物像・キャリアステージ（50字以内）","target_company":"この経験を必要としている企業の業種・規模・担当者の役職（50字以内）"}
SESSION_END

DOCUMENT_START
{"title":"経験録のタイトル（30字以内）","description":"どんな経験がどんな形で残るか（80字以内）","experience_story":"語られた実体験の核心（150字程度、一人称なし）","ai_usage":"AIと一緒に経験を文書化する方法（50字以内）","recommended_tools":["Claude","NotebookLM"],"price_suggestion":10000,"days_suggestion":7,"service_type":"spot","price_rationale":"この経験を文書として得られる価値を経験の希少性・再現困難性で説明する1文（60字以内）","target_buyer":"この経験録を必要としている個人の人物像・キャリアステージ（50字以内）","target_company":"この経験録を活用したい企業の業種・規模・担当者の役職（50字以内）"}
DOCUMENT_END`;

function buildSystem(userCount: number, isFinalize: boolean): string {
  if (isFinalize) return SYSTEM_BASE + SYSTEM_FINALIZE;

  if (userCount === 1) {
    return SYSTEM_BASE + `

【指示】ユーザーが質問1に回答しました。次の質問2だけを聞いてください。それ以外は何も聞かないこと。
質問2：「そのとき、何が決め手になりましたか？なぜそう動けたんでしょう？当時の判断や感情も含めて教えてください。」`;
  }

  if (userCount === 2) {
    return SYSTEM_BASE + `

【指示】ユーザーが質問2に回答しました。次の質問3だけを聞いてください。それ以外は何も聞かないこと。
質問3：「今振り返って、あの経験はあなたに何を教えてくれましたか？次の世代に伝えるとしたら、何を伝えたいですか？」`;
  }

  if (userCount === 3) {
    return SYSTEM_BASE + `

【指示】3つの質問が終わりました。次の言葉だけを返してください。それ以外は何も聞かないこと。
「ありがとうございます。もう少し深掘りしたいことがあれば、お聞きします。それとも、今お話しいただいた内容を2つの形にまとめましょうか？」`;
  }

  return SYSTEM_BASE + `

【指示】追加の深掘りフェーズです。ユーザーの回答に対して、1問だけ質問してください。それ以上は聞かないこと。`;
}

function extractJson(text: string, startTag: string, endTag: string) {
  const m = text.match(new RegExp(startTag + "\\s*([\\s\\S]*?)\\s*" + endTag));
  if (m) { try { return JSON.parse(m[1].trim()); } catch {} }
  return null;
}

const FINALIZE_TRIGGERS = ["まとめてください", "まとめましょう", "まとめて", "まとめる", "纏めて", "纏める", "形にして", "お願いします", "はい", "yes", "ok", "OK"];

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const client = new Anthropic();

  if (messages.length === 0) {
    return NextResponse.json({
      text: "あなたのキャリアの中で、一番泥臭かった・しんどかった時期や出来事を教えていただけますか？どんな状況でしたか？",
      sessionDraft: null,
      documentDraft: null,
    });
  }

  const userMessages = messages.filter(m => m.role === "user");
  const userCount = userMessages.length;
  const lastUserText = userMessages[userMessages.length - 1]?.content ?? "";
  const isFinalize = userCount >= 3 && FINALIZE_TRIGGERS.some(t => lastUserText.includes(t));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: buildSystem(userCount, isFinalize),
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  const sessionDraft = extractJson(content.text, "SESSION_START", "SESSION_END");
  const documentDraft = extractJson(content.text, "DOCUMENT_START", "DOCUMENT_END");

  let displayText = content.text
    .replace(/SESSION_START[\s\S]*?SESSION_END/g, "")
    .replace(/DOCUMENT_START[\s\S]*?DOCUMENT_END/g, "")
    .trim();

  if (sessionDraft || documentDraft) {
    displayText = "お話しいただいた経験をもとに、2つの形を提案します。";
  }

  return NextResponse.json({ text: displayText, sessionDraft, documentDraft });
}
