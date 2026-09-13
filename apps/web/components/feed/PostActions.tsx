"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "../ui/Icon";
import Sheet from "../ui/Sheet";
import { useToast } from "../ui/ToastProvider";

export default function PostActions({
    postId,
}: {
    postId: string;
}) {
    const [saved, setSaved] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const { show } = useToast();

    const toggleSave = () => {
        const next = !saved;
        setSaved(next);
        show(next ? "Saved" : "Removed", "success");
    };

    const copyLink = async () => {
        const url = `${window.location.origin}/p/${postId}`;
        try {
            await navigator.clipboard.writeText(url);
            show("Link copied", "success");
        } catch {
            show("Could not copy link", "error");
        }
        setShareOpen(false);
    };

    const nativeShare = () => {
        const url = `${window.location.origin}/p/${postId}`;
        const share = (navigator as { share?: (d: { url: string }) => Promise<void> }).share;
        if (typeof share === "function") {
            share({ url }).catch(() => show("Copy link instead", "info"));
        } else {
            show("Press Copy link", "info");
        }
        setShareOpen(false);
    };

    const iconBtn = (active: boolean) =>
        `flex h-10 w-10 items-center justify-center rounded-full ${active ? "text-[hsl(var(--sona-text-brand))]" : "text-[hsl(var(--sona-text-secondary))]"
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
                        disabled={typeof (navigator as any).share !== "function"}
                        className="flex min-h-[44px] items-center gap-3 rounded-lg px-4 text-sm font-medium text-[hsl(var(--sona-text-primary))] hover:bg-[hsl(var(--sona-bg-brand-soft))] disabled:opacity-50"
                    >
                        <Icon name="share" /> Share…
                    </button>
                </div>
            </Sheet>

        </div>
    );
}