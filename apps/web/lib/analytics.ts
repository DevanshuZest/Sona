export async function track(supabase, event, props = {}, userId = null) {
    return supabase.from("sona_events").insert({
        user_id: userId,
        event,
        props,
    });
}
