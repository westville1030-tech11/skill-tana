import { createClient } from "@supabase/supabase-js";
import type { Profile } from "./database.types";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key);
}

export async function getProfiles(category?: string): Promise<Profile[]> {
  const supabase = getClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  const profiles = (data ?? []) as Profile[];
  // 成果物が1件以上あるプロフィールのみ表示
  return profiles.filter((p) => p.services && p.services.length > 0);
}

export async function getProfileByLinkedInId(linkedinId: string): Promise<Profile | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("linkedin_id", linkedinId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function updateProfile(
  linkedinId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() } as Record<string, unknown>)
    .eq("linkedin_id", linkedinId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
