"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "../ui/Icon";
import Sheet from "../ui/Sheet";
import Toast from "../ui/Toast";

export default function PostActions({
    postId,
}: {
    postId: string;
}) {
    const [saved, setSaved] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [toast, setToast] = useState("");

    const showToast = (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 1800);
    };

    const toggleSave = () => {
        const next = !saved;
        setSaved(next);
        showToast(next ? "Saved" : "Removed");
    };

    const copyLink = async () => {
        const url = `${window.location.origin}/p/${postId}`;
        try {
            await navigator.clipboard.writeText(url);
            showToast("Link copied");
        } catch {
            showToast(url);
        }
        setShareOpen(false);
    };

    const nativeShare = () => {
        const url = `${window.location.origin}/p/${postId}`;
        if (typeof navigator.share === "function") {
            navigator.share({ url }).catch(() => showToast("Copy link instead"));
        } else {
            showToast("Press Copy link");
        }
        setShareOpen(false);
    };

    const iconBtn = (active: boolean) =>
        `flex h-10 w-10 items-center justify-center rounded-full ${
            active ? "text-[hsl(var(--sona-text-brand))]" : "text-[hsl(var(--sona-text-secondary))]"
        } hover:bg-[hsl(var(--sona-bg-brand-soft))]`;

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/p/${postId}`}
                aria-label="Reply"
                className={iconBtn(false)}
            >
                <Icon name="reply" />
            </Link>
            <button
                type="button"
                onClick={toggleSave}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved" : "Save"}
                className={iconBtn(saved)}
            >
                <Icon name={saved ? "check" : "bookmark"} />
            </button>
            <button
                type="button"
                onClick={() => setShareOpen(true)}
                aria-label="Share"
                className={iconBtn(false)}
            >
                <Icon name="share" />
            </button>

            <Sheet open={shareOpen} onClose={() => setShareOpen(false)} title="Share">
                <div className="mt-4 flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={copyLink}
                        className="flex min-h-[44px] items-center gap-3 rounded-lg px-4 text-sm font-medium text-[hsl(var(--sona-text-primary))] hover:bg-[hsl(var(--sona-bg-brand-soft))]"
                    >
                        <Icon name="share" /> Copy link
                    </button>
                    <button
                        type="button"
                        onClick={nativeShare}
                        disabled={typeof navigator.share !== "function"}
                        className="flex min-h-[44px] items-center gap-3 rounded-lg px-4 text-sm font-medium text-[hsl(var(--sona-text-primary))] hover:bg-[hsl(var(--sona-bg-brand-soft))] disabled:opacity-50"
                    >
                        <Icon name="share" /> Share…
                    </button>
                </div>
            </Sheet>

            <Toast show={toast !== ""}>
                <Icon name="check" size={16} className="mr-2 inline-block" />
                {toast}
            </Toast>
        </div>
    );
}