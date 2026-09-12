import type { SupabaseClient } from "@supabase/supabase-js";

export async function blockUser(supabase: SupabaseClient, blockerId: string, blockedId: string) {
  return supabase.from("sona_blocks").insert({ blocker_id: blockerId, blocked_id: blockedId });
}

export async function unblockUser(supabase: SupabaseClient, blockerId: string, blockedId: string) {
  return supabase
    .from("sona_blocks")
    .delete()
    .eq("blocker_id", blockerId)
    .eq("blocked_id", blockedId);
}

export async function listBlocked(supabase: SupabaseClient, blockerId: string) {
  return supabase
    .from("sona_blocks")
    .select("blocked_id, created_at, sona_profiles!sona_blocks_blocked_id_fkey ( username, display_name )")
    .eq("blocker_id", blockerId)
    .order("created_at", { ascending: false });
}

export async function muteUser(supabase: SupabaseClient, muterId: string, mutedId: string) {
  return supabase.from("sona_mutes").insert({ muter_id: muterId, muted_id: mutedId });
}

export async function unmuteUser(supabase: SupabaseClient, muterId: string, mutedId: string) {
  return supabase
    .from("sona_mutes")
    .delete()
    .eq("muter_id", muterId)
    .eq("muted_id", mutedId);
}

export async function reportTarget(
  supabase: SupabaseClient,
  args: {
    reporterId: string;
    targetKind: "post" | "comment" | "profile";
    targetId: string;
    reason: "spam" | "harassment" | "hate" | "misinfo" | "nudity" | "violence" | "self_harm" | "other";
    details?: string;
  },
) {
  return supabase.from("sona_reports").insert({
    reporter_id: args.reporterId,
    target_kind: args.targetKind,
    target_id: args.targetId,
    reason: args.reason,
    details: args.details ?? null,
  });
}

export async function listMyReports(supabase: SupabaseClient, reporterId: string) {
  return supabase
    .from("sona_reports")
    .select("id, target_kind, target_id, reason, status, created_at, resolved_at")
    .eq("reporter_id", reporterId)
    .order("created_at", { ascending: false });
}

// Use in feed queries to filter out posts from blocked users
export async function getBlockedIds(supabase: SupabaseClient, viewerId: string): Promise<string[]> {
  const { data } = await supabase
    .from("sona_blocks")
    .select("blocked_id")
    .eq("blocker_id", viewerId);
  const out = (data ?? []).map((r: any) => r.blocked_id as string);

  const { data: back } = await supabase
    .from("sona_blocks")
    .select("blocker_id")
    .eq("blocked_id", viewerId);
  const incoming = (back ?? []).map((r: any) => r.blocker_id as string);

  return Array.from(new Set([...out, ...incoming]));
}
