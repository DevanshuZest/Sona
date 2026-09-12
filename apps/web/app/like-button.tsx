"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LikeButton({
    postId,
    userId,
    initialCount,
}: {
    postId: string;
    userId: string | null;
    initialCount: number;
}) {
    const router = useRouter();
    const supabase = createClient();
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        supabase
            .from("sona_reactions")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", userId)
            .eq("kind", "like")
            .maybeSingle()
            .then(({ data }) => setLiked(!!data));
    }, [postId, userId, supabase]);

    async function toggle() {
        if (!userId) {
            router.push("/login");
            return;
        }
        setLoading(true);
        if (liked) {
            await supabase
                .from("sona_reactions")
                .delete()
                .eq("post_id", postId)
                .eq("user_id", userId)
                .eq("kind", "like");
            setLiked(false);
            setCount((current) => Math.max(current - 1, 0));
        } else {
            await supabase
                .from("sona_reactions")
                .insert({ post_id: postId, user_id: userId, kind: "like" });
            setLiked(true);
            setCount((current) => current + 1);
        }
        setLoading(false);
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            aria-label={liked ? "Unlike" : "Like"}
            className={`flex items-center gap-1 text-sm ${liked ? "text-[#0F766E]" : "text-[#78716C] hover:text-[#0F766E]"
                }`}
        >
            <span aria-hidden>{liked ? "♥" : "♡"}</span>
            <span>{count}</span>
        </button>
    );
}
