import type { SupabaseClient } from "@supabase/supabase-js";

export async function getSessionUser(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSessionProfile(supabase: SupabaseClient, userId: string) {
    const { data } = await supabase
        .from("sona_profiles")
        .select("username, display_name")
        .eq("id", userId)
        .maybeSingle();
    return data;
}

export async function ensureSession(supabase: SupabaseClient) {
    const { data } = await supabase.auth.getSession();
    return data.session !== null;
}