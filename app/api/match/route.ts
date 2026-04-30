import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getProfiles } from "@/lib/profiles";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { request, deadline, budget } = await req.json();

  if (!request) {
    return NextResponse.json({ error: "request is required" }, { status: 400 });
  }

  // 登録されている成果物を取得（Supabase未設定時はサンプル）
  let services: { profileId: string; title: string; description: string; price: number; days: number; category: string; company?: string; role?: string }[] = [];
  try {
    const profiles = await getProfiles();
    for (const p of profiles) {
      for (const s of p.services ?? []) {
        services.push({
          profileId: p.linkedin_id,
          title: s.title,
          description: s.description,
          price: s.price,
          days: s.days,
          category: p.category ?? "",
          company: p.company ?? undefined,
          role: p.role ?? undefined,
        });
      }
    }
  } catch {
    // Supabase未設定時はサンプルデータで動作確認
    services = sampleServices;
  }

  if (services.length === 0) {
    services = sampleServices;
  }

  const servicesText = services
    .map((s, i) =>
      `[${i + 1}] タイトル: ${s.title}
   カテゴリ: ${s.category}
   説明: ${s.description}
   価格: ¥${s.price.toLocaleString()}
   納期: ${s.days}日以内
   提供者: ${s.company ?? "不明"} / ${s.role ?? "不明"}`
    )
    .join("\n\n");

  const prompt = `あなたはスキルマッチングの専門家です。
クライアントの依頼に対して、登録されている成果物の中から最適なものを最大3件選び、理由を添えて日本語で推薦してください。

【クライアントの依頼】
${request}
${deadline ? `希望納期: ${deadline}` : ""}
${budget ? `予算: ${budget}` : ""}

【登録されている成果物一覧】
${servicesText}

【出力形式】JSON配列で以下の形式で返してください:
[
  {
    "rank": 1,
    "index": <成果物の番号>,
    "reason": "推薦理由（2〜3文）",
    "match_score": "高/中/低"
  }
]
成果物が依頼に合わない場合は空配列を返してください。JSON以外は出力しないでください。`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "[]";
    const recommendations = JSON.parse(text);

    const results = recommendations.map((r: { rank: number; index: number; reason: string; match_score: string }) => ({
      rank: r.rank,
      service: services[r.index - 1],
      reason: r.reason,
      match_score: r.match_score,
    }));

    return NextResponse.json({ results });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "マッチング処理に失敗しました" }, { status: 500 });
  }
}

const sampleServices = [
  { profileId: "s1", title: "CSV・Excelデータ分析レポート", description: "AIで集計・可視化ドラフトを作成。経験者が示唆を付与して納品", price: 30000, days: 3, category: "consultant", company: "大手メーカー", role: "データアナリスト" },
  { profileId: "s2", title: "戦略論点整理スライド（1枚）", description: "AIで論点を構造化、経験者が実態に合わせて仕上げる1枚スライド", price: 50000, days: 5, category: "consultant", company: "外資コンサル", role: "シニアコンサルタント" },
  { profileId: "s3", title: "業務自動化スクリプト作成", description: "AIでコードをドラフト生成、経験者が検証・実業務に合わせて調整", price: 40000, days: 4, category: "engineer", company: "ITベンチャー", role: "フルスタックエンジニア" },
  { profileId: "s4", title: "壁打ち相談セッション（60分）", description: "AIでリサーチ・資料を事前準備。経験者との対話で課題を深堀り", price: 15000, days: 1, category: "consultant", company: "戦略コンサル", role: "マネージャー" },
];
