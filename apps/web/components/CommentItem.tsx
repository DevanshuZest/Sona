"use client";

import Link from "next/link";
import { useState } from "react";

export type Comment = {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    parent_id: string | null;
    sona_profiles: { username: string; display_name: string } | null;
};

type CommentItemProps = {
    comment: Comment;
    viewerId: string | null;
    depth: number;
    onDelete: (id: string) => void;
    onReply: (parentId: string, content: string) => Promise<void>;
    allComments: Comment[];
};

function relativeTime(createdAt: string) {
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CommentItem({ comment, viewerId, depth, onDelete, onReply, allComments }: CommentItemProps) {
    const [replying, setReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyingBusy, setReplyingBusy] = useState(false);
    const profile = comment.sona_profiles;
    const username = profile?.username ?? "user";
    const children = allComments.filter((item) => item.parent_id === comment.id);

    async function submitReply(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = replyContent.trim();
        if (!trimmed || trimmed.length > 2000 || replyingBusy) return;
        setReplyingBusy(true);
        try {
            await onReply(comment.id, trimmed);
            setReplyContent("");
            setReplying(false);
        } finally {
            setReplyingBusy(false);
        }
    }

    return (
        <article aria-label={`Comment by @${username}`} className={`py-3 border-b border-[#E7E5E4] last:border-0 ${depth < 3 ? "ml-4 border-l pl-4" : ""}`}>
            {depth >= 3 && <p className="text-xs text-[#78716C]">→ reply to @{username}</p>}
            <header className="flex flex-wrap items-baseline">
                <Link href={`/u/${username}`} className="font-medium text-[#0F766E] hover:underline">{profile?.display_name ?? username}</Link>
                <span className="ml-2 text-sm text-[#78716C]">@{username}</span>
                <span className="ml-2 text-xs text-[#78716C]">· {relativeTime(comment.created_at)}</span>
            </header>
            <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
            <div className="group mt-2 flex min-h-10 items-center gap-4 text-sm">
                <button type="button" onClick={() => setReplying((value) => !value)} className="min-h-10 text-[#0F766E] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]" aria-label={`Reply to @${username}`}>Reply</button>
                {viewerId === comment.user_id && <button type="button" onClick={() => onDelete(comment.id)} className="min-h-10 text-[#DC2626] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100" aria-label={`Delete comment by @${username}`}>Delete</button>}
            </div>
            {replying && (
                <form onSubmit={submitReply} className="mt-2 space-y-2">
                    <textarea value={replyContent} onChange={(event) => setReplyContent(event.target.value)} maxLength={2000} rows={2} aria-label={`Reply to @${username}`} className="w-full resize-none rounded-lg border border-[#E7E5E4] bg-white p-2 text-sm focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]" />
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setReplying(false)} className="min-h-10 px-3 text-sm text-[#78716C] hover:underline">Cancel</button>
                        <button type="submit" disabled={replyingBusy || !replyContent.trim() || replyContent.length > 2000} className="min-h-10 rounded-lg bg-[#0F766E] px-3 text-sm text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]">{replyingBusy ? "…" : "Reply"}</button>
                    </div>
                </form>
            )}
            {children.map((child) => <CommentItem key={child.id} comment={child} viewerId={viewerId} depth={depth + 1} onDelete={onDelete} onReply={onReply} allComments={allComments} />)}
        </article>
    );
}