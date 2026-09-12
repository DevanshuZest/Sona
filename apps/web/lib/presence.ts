import type { SupabaseClient } from "@supabase/supabase-js";

export async function touchPresence(supabase: SupabaseClient, userId: string) {
  return supabase.from("sona_presence").upsert(
    { user_id: userId, last_seen: new Date().toISOString(), status: "online" },
    { onConflict: "user_id" }
  );
}

export async function getPresence(supabase: SupabaseClient, userId: string) {
  return supabase.from("sona_presence").select("last_seen, status").eq("user_id", userId).maybeSingle();
}
