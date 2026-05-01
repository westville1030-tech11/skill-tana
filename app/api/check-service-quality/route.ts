import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const PROMPT = `あなたは副業・スポット発注マーケットプレイスの品質審査AIです。
以下の成果物出品内容を審査してください。

審査基準：
1. タイトルの具体性（「なんでもします」「各種対応」など曖昧なものはNG）
2. 説明文の具体性（何を・どのように提供するかが明確か）
3. 実体験の有無（「〇〇業界で△△年」「〇〇の経験あり」など実際の経験が書かれているか）
4. 価格・納期の妥当性（極端に安すぎる/高すぎる/短すぎる/長すぎるはNG）

以下のJSONのみ出力してください（説明文・マークダウン不要）：
{"score":"pass","feedback":"問題なし"}

scoreの定義：
- pass：そのまま出品可能
- warn：出品できるが改善が望ましい（feedbackに改善点を書く）
- fail：再入力が必要（feedbackに理由を書く）

feedbackは日本語で30字以内。`;

export async function POST(req: NextRequest) {
  const { title, description, experience_story, price, days } = await req.json();

  if (!title || !description) {
    return NextResponse.json({ score: "fail", feedback: "タイトルと説明文は必須です" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `${PROMPT}

【出品内容】
タイトル：${title}
説明：${description}
実体験：${experience_story ?? "（未記入）"}
価格：¥${price?.toLocaleString() ?? "未設定"}
納期：${days ?? "未設定"}日`,
      }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) {
      const result = JSON.parse(match[0]);
      return NextResponse.json(result);
    }
    return NextResponse.json({ score: "pass", feedback: "" });
  } catch {
    return NextResponse.json({ score: "pass", feedback: "" });
  }
}
