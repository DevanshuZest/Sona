import type { SupabaseClient } from "@supabase/supabase-js";

export async function searchUsers(supabase: SupabaseClient, q: string) {
    return supabase.rpc("sona_search_users", { q, lim: 20 });
}

export async function searchPosts(supabase: SupabaseClient, q: string) {
    return supabase.rpc("sona_search_posts", { q, lim: 20 });
}
