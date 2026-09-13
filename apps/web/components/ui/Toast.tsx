"use client";

import type { ReactNode } from "react";

export default function Toast({
    show,
    children,
}: {
    show: boolean;
    children: ReactNode;
}) {
    return (
        <div
            aria-live="polite"
            role="status"
            className={`fixed left-1/2 top-4 z-[70] -translate-x-1/2 pointer-events-none transition-transform duration-300 ${
                show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
            }`}
        >
            <div className="rounded-lg border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] px-4 py-2 text-sm text-[hsl(var(--sona-text-primary))] shadow-lg">
                {children}
            </div>
        </div>
    );
}