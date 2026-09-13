"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export default function Sheet({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/40"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-2xl border-t border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-6 shadow-lg">
                {title && (
                    <p className="font-semibold text-base text-[hsl(var(--sona-text-primary))]">{title}</p>
                )}
                {children}
            </div>
        </div>
    );
}