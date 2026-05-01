import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { request } = await req.json();
  if (!request?.trim()) return NextResponse.json({ error: "request required" }, { status: 400 });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `あなたはフリーランス発注プラットフォームの品質チェックAIです。
以下の発注依頼文を評価してください。

【依頼文】
${request}

以下の基準で評価し、JSONで返してください：
- quality: "good"（十分具体的）または "poor"（曖昧・不十分）
- feedback: poorの場合のみ、何が不足しているか1〜2文で日本語で指摘する。goodの場合は空文字

曖昧・不十分な例：「あああ」「格安でやって」「なんか分析して」「適当によろしく」「安くて早い人」

必ずJSON形式のみで返してください：
{"quality":"good","feedback":""}
または
{"quality":"poor","feedback":"〇〇が不足しています。△△を具体的に記載してください。"}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    // AI失敗時はチェックをスキップして通過させる
    return NextResponse.json({ quality: "good", feedback: "" });
  }
}
