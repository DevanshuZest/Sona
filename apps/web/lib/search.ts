export async function searchUsers(supabase, q) {
    return supabase.rpc("sona_search_users", { q, lim: 20 });
}

export async function searchPosts(supabase, q) {
    return supabase.rpc("sona_search_posts", { q, lim: 20 });
}
