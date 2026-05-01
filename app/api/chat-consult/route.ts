import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `あなたは「発注要件整理アシスタント」です。
ユーザーが経験者に仕事を依頼しようとしています。依頼内容をより具体的・明確にするために、鋭い質問を1〜2個だけ返してください。

質問の観点（毎回違う角度で聞くこと）：
- 目的・背景：「なぜこれが必要ですか？最終的にどう使いますか？」
- 成功条件：「どうなれば成功ですか？誰が承認・評価しますか？」
- 制約・素材：「納期・予算は？今ある資料やデータはありますか？」
- 対象・スコープ：「誰向けですか？どの範囲までやってほしいですか？」

3回目の質問の後は、会話をまとめた「整理された依頼文」を返してください。
整理された依頼文は必ず以下のフォーマットで：

---SUMMARY---
（整理された依頼文をここに200字程度で）
---END---

トーンは丁寧・簡潔。余計な前置きなし。`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SYSTEM,
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  const summaryMatch = content.text.match(/---SUMMARY---([\s\S]*?)---END---/);
  const summary = summaryMatch ? summaryMatch[1].trim() : null;
  const displayText = summaryMatch
    ? content.text.replace(/---SUMMARY---[\s\S]*?---END---/, "要件を整理しました。下のボタンから依頼を送れます。").trim()
    : content.text;

  return NextResponse.json({ text: displayText, summary });
}
