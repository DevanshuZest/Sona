import type { SupabaseClient } from "@supabase/supabase-js";

export async function track(
    supabase: SupabaseClient,
    event: string,
    props: Record<string, unknown> = {},
    userId: string | null = null,
) {
    return supabase.from("sona_events").insert({
        user_id: userId,
        event,
        props,
    });
}
