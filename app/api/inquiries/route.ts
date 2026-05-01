import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// クライアントが問い合わせを送信
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pro_linkedin_id, service_title, client_name, client_email, message, deadline, budget } = body;

  if (!pro_linkedin_id || !client_email || !message) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  const client_token = randomUUID();

  const { data, error } = await getAdmin().from("inquiries").insert({
    pro_linkedin_id,
    service_title: service_title ?? null,
    client_name: client_name ?? null,
    client_email,
    message,
    deadline: deadline ?? null,
    budget: budget ?? null,
    client_token,
  }).select("id, client_token").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id, client_token: data.client_token });
}

// 経験者が自分への問い合わせ一覧を取得
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getAdmin()
    .from("inquiries")
    .select("*")
    .eq("pro_linkedin_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// 問い合わせを「確認済み」にする / 経験者が返信する
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, pro_reply } = await req.json();

  const updates: Record<string, unknown> = { status: "read" };
  if (pro_reply !== undefined) {
    updates.pro_reply = pro_reply;
    updates.pro_replied_at = new Date().toISOString();
  }

  await getAdmin()
    .from("inquiries")
    .update(updates)
    .eq("id", id)
    .eq("pro_linkedin_id", session.user.id);

  return NextResponse.json({ ok: true });
}
