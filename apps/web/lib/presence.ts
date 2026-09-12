export async function touchPresence(supabase, userId) {
  return supabase.from("sona_presence").upsert(
    { user_id: userId, last_seen: new Date().toISOString(), status: "online" },
    { onConflict: "user_id" }
  );
}

export async function getPresence(supabase, userId) {
  return supabase.from("sona_presence").select("last_seen, status").eq("user_id", userId).maybeSingle();
}
