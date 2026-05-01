import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const PROMPT = `あなたは副業・スポット発注マーケットプレイスのマッチング判定AIです。
以下の経験者プロフィールと発注者の依頼内容を照合してください。

判定基準：
1. 依頼内容が経験者の提供サービスと合致しているか
2. 依頼の予算・納期が経験者の価格・納期と大きく乖離していないか
3. 依頼内容が明確で、経験者が対応可能か判断できるか

以下のJSONのみ出力してください（説明文・マークダウン不要）：
{"score":"match","feedback":"問題なし"}

scoreの定義：
- match：マッチ度が高い、そのまま問い合わせ可能
- warn：一部ミスマッチの可能性あり（feedbackに確認点を書く）
- mismatch：大きなミスマッチの可能性あり（feedbackに理由を書く）

feedbackは日本語で40字以内。`;

export async function POST(req: NextRequest) {
  const { service_title, service_description, service_price, service_days, inquiry_message, inquiry_budget, inquiry_deadline } = await req.json();

  if (!service_title || !inquiry_message) {
    return NextResponse.json({ score: "match", feedback: "" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `${PROMPT}

【経験者のサービス】
タイトル：${service_title}
説明：${service_description ?? "（未記入）"}
価格：¥${service_price?.toLocaleString() ?? "未設定"}
納期：${service_days ?? "未設定"}日

【発注者の依頼】
依頼内容：${inquiry_message}
予算：${inquiry_budget ? `¥${inquiry_budget}` : "未設定"}
希望納期：${inquiry_deadline ?? "未設定"}`,
      }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) {
      const result = JSON.parse(match[0]);
      return NextResponse.json(result);
    }
    return NextResponse.json({ score: "match", feedback: "" });
  } catch {
    return NextResponse.json({ score: "match", feedback: "" });
  }
}
