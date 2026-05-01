import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { request } = await req.json();
  if (!request?.trim()) return NextResponse.json({ error: "request required" }, { status: 400 });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `あなたはフリーランス発注プラットフォームの品質チェックAIです。
以下の発注依頼文を評価してください。

【依頼文】
${request}

【評価基準】
以下のいずれかに該当する場合は quality: "poor" にしてください：
1. 意味のない文字列が含まれている（「あああ」「aaaa」などの繰り返し）
2. 何をしてほしいか具体的な作業内容がわからない
3. 「格安で」「なんとなく」「適当に」など品質を下げる表現がある
4. 依頼内容が極めて抽象的で受注者が何を作れば良いか判断できない

上記に該当しない場合（具体的な作業・目的・背景が含まれている）は quality: "good"

必ずJSON形式のみで返してください：
{"quality":"good","feedback":""}
または
{"quality":"poor","feedback":"〇〇が不足しています。△△を具体的に記載してください。"}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ quality: "poor", feedback: "依頼内容をより具体的に記載してください。" });
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch {
    // AI失敗時はチェックをスキップして通過させる
    return NextResponse.json({ quality: "good", feedback: "" });
  }
}
