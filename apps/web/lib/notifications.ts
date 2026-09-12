export async function getUnreadCount(supabase, userId) {
  const { count } = await supabase
    .from("sona_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}

export async function listNotifications(supabase, userId, limit = 50) {
  return supabase
    .from("sona_notifications")
    .select("id, kind, read, created_at, actor_id, post_id, sona_profiles!sona_notifications_actor_id_fkey ( username, display_name )")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function markAllRead(supabase, userId) {
  return supabase
    .from("sona_notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}
