export async function listComments(supabase, postId) {
  return supabase
    .from("sona_comments")
    .select("id, content, created_at, user_id, parent_id, sona_profiles!sona_comments_user_id_fkey ( username, display_name )")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
}

export async function createComment(supabase, { postId, userId, content, parentId }) {
  return supabase.from("sona_comments").insert({
    post_id: postId,
    user_id: userId,
    content,
    parent_id: parentId ?? null,
  }).select().single();
}

export async function deleteComment(supabase, id, userId) {
  return supabase.from("sona_comments").delete().eq("id", id).eq("user_id", userId);
}
