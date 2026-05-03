import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [{
      role: "user",
      content: `あなたは成果物型ビジネス支援サービスのサンプルシートを作成します。

サービス名：${title}
説明：${description}

このサービスで納品されるExcelシートのサンプルデータを1枚分作ってください。
4〜5列、6〜8行のリアルな数値・テキスト入りのサンプルにしてください。

説明・前置き不要。JSONのみ出力：
{"sheetName":"シート名","headers":["列1","列2"],"rows":[["値","値"],["値","値"]]}`,
    }],
  });

  const content = message.content[0];
  if (content.type !== "text") return NextResponse.json({ error: "AI error" }, { status: 500 });

  const match = content.text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "parse error" }, { status: 500 });

  try {
    return NextResponse.json(JSON.parse(match[0]));
  } catch {
    return NextResponse.json({ error: "json parse error" }, { status: 500 });
  }
}
