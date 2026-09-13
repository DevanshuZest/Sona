"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";

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
    const toast = useToast();

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
            const { error } = await supabase
                .from("sona_reactions")
                .delete()
                .eq("post_id", postId)
                .eq("user_id", userId)
                .eq("kind", "like");
            if (error) {
                toast.show("Could not update like", "error");
                setLoading(false);
                return;
            }
            setLiked(false);
            setCount((current) => Math.max(current - 1, 0));
            toast.show("Unliked", "info");
        } else {
            const { error } = await supabase
                .from("sona_reactions")
                .insert({ post_id: postId, user_id: userId, kind: "like" });
            if (error) {
                toast.show("Could not update like", "error");
                setLoading(false);
                return;
            }
            setLiked(true);
            setCount((current) => current + 1);
            toast.show("Liked", "success");
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
            className={`flex items-center gap-1 text-sm ${liked ? "text-[hsl(var(--sona-text-brand))]" : "text-[hsl(var(--sona-text-secondary))] hover:text-[hsl(var(--sona-text-brand))]"}`}
        >
            <span aria-hidden>{liked ? "♥" : "♡"}</span>
            <span>{count}</span>
        </button>
    );
}