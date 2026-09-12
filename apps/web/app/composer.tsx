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
    const counterColor = charCount > 4500 ? "text-[#DC2626]" : "text-[#78716C]";

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
        <form onSubmit={submit} className="mb-6 rounded-xl border border-[#E7E5E4] bg-white p-3">
            {username && <p className="mb-2 text-xs text-[#78716C]">Posting as @{username}</p>}
            <div className="relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={3}
                    maxLength={5000}
                    className="w-full resize-none outline-none"
                />
                <div className="absolute bottom-1 right-2 text-xs" aria-hidden="true">
                    <span className={counterColor}>{charCount}/5000</span>
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <div className="mt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !content.trim() || isOverLimit}
                    className="rounded-lg bg-[#0F766E] px-3 py-1.5 text-sm text-white hover:bg-[#0D5F58] disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </form>
    );
}
