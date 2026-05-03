import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 6000);
}

async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ja,en;q=0.9",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return extractTextFromHtml(html);
}

async function generateDrafts(client: Anthropic, text: string) {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{
      role: "user",
      content: `以下はフリーランスサービス等の出品テキストです。

${text}

このスキル・経験をもとに、副業・スポット発注向けの商品案を最大8個作ってください。
成果物型・コンサル型・規模の大小などバリエーションをつけてください。

説明・前置き不要。JSONのみ出力：
{"drafts":[
  {
    "title":"商品タイトル（30字以内）",
    "description":"説明（80字以内）",
    "experience_story":"この経歴から読み取れる実体験（100字程度、一人称なし）",
    "ai_usage":"AIをどう使って納品するか（50字以内）",
    "recommended_tools":["Claude","Perplexity"],
    "price_suggestion":30000,
    "days_suggestion":3,
    "service_type":"spot",
    "product_type":"deliverable",
    "estimated_hours":8,
    "hourly_rate_min":3000,
    "hourly_rate_max":8000,
    "price_rationale":"価格の根拠を1文で（60字以内）"
  }
]}

product_typeは"deliverable"（納品物あり）か"consulting"（対話・セッション）のどちらか。
price_suggestionはestimated_hours × hourly_rate_minとhourly_rate_maxの中間値を基準に設定。
estimated_hoursはAI活用込みの実作業時間。hourly_rate_min/maxは出品者の経験年数・専門性から推定した適正時間単価の範囲。
price_rationaleは「なぜこの価格か」を買い手が納得できる1文（例：「X年の実務経験をもとに、社内対応比50%のコストで同等成果を提供」）。`,
    }],
  });
  return message;
}

export async function POST(req: NextRequest) {
  const { text, url } = await req.json();
  if (!text && !url) return NextResponse.json({ error: "text or url required" }, { status: 400 });

  const client = new Anthropic();
  let sourceText = text ?? "";

  if (url) {
    try {
      sourceText = await fetchUrlText(url);
      if (!sourceText) return NextResponse.json({ error: "URLからテキストを取得できませんでした。ページのテキストをコピーして「テキストを貼り付け」からお試しください。" }, { status: 400 });
    } catch {
      return NextResponse.json({ error: "URLの読み込みができませんでした。多くのサービスはセキュリティ上、直接読み込めない場合があります。ページのテキストをコピーして「テキストを貼り付け」からお試しください。" }, { status: 400 });
    }
  }

  const message = await generateDrafts(client, sourceText);
  const content = message.content[0];
  if (content.type !== "text") return NextResponse.json({ error: "AI error" }, { status: 500 });

  const match = content.text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "parse error" }, { status: 500 });

  try {
    const parsed = JSON.parse(match[0]);
    return NextResponse.json({ drafts: parsed.drafts?.slice(0, 10) ?? [] });
  } catch {
    return NextResponse.json({ error: "json parse error" }, { status: 500 });
  }
}
