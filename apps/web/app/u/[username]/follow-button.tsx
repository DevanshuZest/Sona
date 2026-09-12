"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FollowButton({
    viewerId,
    targetId,
}: {
    viewerId: string | null;
    targetId: string;
}) {
    const router = useRouter();
    const supabase = createClient();
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!viewerId || viewerId === targetId) return;
        supabase
            .from("sona_follows")
            .select("follower_id")
            .eq("follower_id", viewerId)
            .eq("following_id", targetId)
            .maybeSingle()
            .then(({ data }) => setFollowing(!!data));
    }, [viewerId, targetId, supabase]);

    if (!viewerId) {
        return (
            <a
                href="/login"
                className="rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5 text-sm text-[#1C1917] hover:border-[#0F766E]"
            >
                Log in to follow
            </a>
        );
    }

    if (viewerId === targetId) return null;

    async function toggle() {
        setLoading(true);
        if (following) {
            await supabase
                .from("sona_follows")
                .delete()
                .eq("follower_id", viewerId)
                .eq("following_id", targetId);
            setFollowing(false);
        } else {
            await supabase
                .from("sona_follows")
                .insert({ follower_id: viewerId, following_id: targetId });
            setFollowing(true);
        }
        setLoading(false);
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className={
                following
                    ? "rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5 text-sm text-[#78716C] hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-50"
                    : "rounded-lg bg-[#0F766E] px-3 py-1.5 text-sm text-white hover:bg-[#0D5F58] disabled:opacity-50"
            }
        >
            {following ? "Following" : "Follow"}
        </button>
    );
}
