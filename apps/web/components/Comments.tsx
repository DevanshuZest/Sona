"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CommentItem, { type Comment } from "./CommentItem";
import { createComment, deleteComment, listComments } from "../lib/comments";
import { createClient } from "../lib/supabase/client";

const PAGE_SIZE = 20;

function profileFor() {
    return { username: "you", display_name: "You" };
}

function removeCommentTree(comments: Comment[], id: string) {
    const removed = new Set([id]);
    let changed = true;
    while (changed) {
        changed = false;
        comments.forEach((comment) => {
            if (comment.parent_id && removed.has(comment.parent_id) && !removed.has(comment.id)) {
                removed.add(comment.id);
                changed = true;
            }
        });
    }
    return comments.filter((comment) => !removed.has(comment.id));
}

export default function Comments({ postId, userId }: { postId: string; userId: string | null }) {
    const [supabase] = useState(() => createClient());
    const [comments, setComments] = useState<Comment[]>([]);
    const [visibleTopLevel, setVisibleTopLevel] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function loadComments() {
        setError(null);
        const { data, error: loadError } = await listComments(supabase, postId);
        if (loadError) setError("Comments could not be loaded. Please try again.");
        else setComments((data ?? []).map((comment) => ({
            ...comment,
            sona_profiles: Array.isArray(comment.sona_profiles) ? comment.sona_profiles[0] ?? null : comment.sona_profiles,
        })) as Comment[]);
        setLoading(false);
    }

    useEffect(() => { void loadComments(); }, [postId]);

    function resizeTextarea(element: HTMLTextAreaElement) {
        element.style.height = "auto";
        element.style.height = `${Math.min(element.scrollHeight, 96)}px`;
    }

    async function submitComment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!userId || submitting) return;
        const trimmed = content.trim();
        if (!trimmed || trimmed.length > 2000) return;
        const temporaryId = `temp-${Date.now()}`;
        const optimisticComment: Comment = { id: temporaryId, content: trimmed, created_at: new Date().toISOString(), user_id: userId, parent_id: null, sona_profiles: profileFor() };
        setComments((current) => [...current, optimisticComment]);
        setSubmitting(true);
        setError(null);
        const { error: createError } = await createComment(supabase, { postId, userId, content: trimmed });
        if (createError) {
            setComments((current) => current.filter((comment) => comment.id !== temporaryId));
            setError("Your comment could not be posted. Please try again.");
        } else {
            setContent("");
            await loadComments();
        }
        setSubmitting(false);
    }

    async function submitReply(parentId: string, replyContent: string) {
        if (!userId) return;
        const temporaryId = `temp-${Date.now()}`;
        const optimisticComment: Comment = { id: temporaryId, content: replyContent, created_at: new Date().toISOString(), user_id: userId, parent_id: parentId, sona_profiles: profileFor() };
        setComments((current) => [...current, optimisticComment]);
        setError(null);
        const { error: createError } = await createComment(supabase, { postId, userId, content: replyContent, parentId });
        if (createError) {
            setComments((current) => current.filter((comment) => comment.id !== temporaryId));
            setError("Your reply could not be posted. Please try again.");
            throw createError;
        }
        await loadComments();
    }

    async function handleDelete(id: string) {
        if (!userId) return;
        const previous = comments;
        setComments((current) => removeCommentTree(current, id));
        const { error: deleteError } = await deleteComment(supabase, id, userId);
        if (deleteError) {
            setComments(previous);
            setError("The comment could not be deleted. Please try again.");
        }
    }

    const topLevel = comments.filter((comment) => !comment.parent_id).reverse();
    const visible = topLevel.slice(0, visibleTopLevel);

    return (
        <section aria-label="Comments" className="mt-6">
            <h2 className="text-lg font-semibold text-[#1C1917]">Replies</h2>
            {loading ? <div aria-label="Loading comments" className="mt-2 space-y-2">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-[#F5F3F0] motion-reduce:animate-none" />)}</div>
                : error && comments.length === 0 ? <p role="alert" className="mt-3 text-sm text-[#DC2626]">{error}</p>
                    : comments.length === 0 ? <p className="mt-3 text-sm text-[#78716C]">No replies yet. Be the first. ↓</p>
                        : <div className="mt-2">{visible.map((comment) => <CommentItem key={comment.id} comment={comment} viewerId={userId} depth={0} onDelete={handleDelete} onReply={submitReply} allComments={comments} />)}{visibleTopLevel < topLevel.length && <button type="button" onClick={() => setVisibleTopLevel((value) => value + PAGE_SIZE)} className="mt-3 min-h-10 text-sm text-[#0F766E] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]">Load more comments</button>}</div>}
            {userId ? <form onSubmit={submitComment} className="sticky bottom-16 bg-[#FDFCFA] pb-3 pt-3 sm:bottom-0">
                <textarea id="comment-input" name="comment" aria-label="Write a comment" aria-describedby="comment-counter" value={content} onChange={(event) => { setContent(event.target.value); resizeTextarea(event.currentTarget); }} placeholder="Add a reply…" rows={1} maxLength={2000} className="w-full resize-none rounded-xl border border-[#E7E5E4] bg-white p-3 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]" />
                <div className="mt-2 flex items-center justify-between"><span id="comment-counter" className={content.length > 1800 ? "text-xs text-[#DC2626]" : "text-xs text-[#78716C]"}>{content.length}/2000</span><button type="submit" disabled={submitting || !content.trim() || content.length > 2000} className="h-10 rounded-lg bg-[#0F766E] px-4 text-sm text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]">{submitting ? "…" : "Post reply"}</button></div>
                {error && <p role="alert" className="mt-1 text-sm text-[#DC2626]">{error}</p>}
            </form> : <p className="mt-4 text-center text-sm text-[#78716C]"><Link href="/login" className="text-[#0F766E] underline">Log in to reply</Link></p>}
        </section>
    );
}