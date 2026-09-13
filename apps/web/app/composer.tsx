"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Composer({ userId, username }: { userId: string; username?: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const charCount = content.length;
    const isOverLimit = charCount > 5000;
    const counterColor =
        charCount > 5000
            ? "text-[hsl(var(--sona-error))]"
            : charCount > 4500
                ? "text-[hsl(var(--sona-marigold))]"
                : "text-[hsl(var(--sona-text-secondary))]";

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim() || isOverLimit) return;
        setLoading(true);
        setError(null);

        const { error } = await supabase.from("sona_posts").insert({ user_id: userId, content: content.trim() });
        setLoading(false);
        if (error) {
            setError(error.message);
            return;
        }
        setContent("");
        router.refresh();
    }

    return (
        <form onSubmit={submit} className="mb-6 rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-3">
            {username && <p className="mb-2 text-xs text-[hsl(var(--sona-text-secondary))]">Posting as @{username}</p>}
            <div className="relative">
                <textarea
                    id="post-content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    aria-label="Post content"
                    autoComplete="off"
                    rows={3}
                    maxLength={5000}
                    className="min-h-28 w-full resize-none rounded-lg border border-transparent p-2 outline-none focus-visible:border-[hsl(var(--sona-border-brand))]"
                />
                <div className="absolute bottom-1 right-2 text-xs" aria-hidden="true">
                    <span className={counterColor}>{charCount}/5000</span>
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-[hsl(var(--sona-error))]">{error}</p>}
            <div className="mt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !content.trim() || isOverLimit}
                    className="min-h-11 rounded-lg bg-[hsl(var(--sona-text-brand))] px-4 py-2 text-sm text-[hsl(var(--sona-text-on-brand))] hover:opacity-90 disabled:opacity-50"
                    aria-label={loading ? "Posting" : "Publish post"}
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </form>
    );
}
