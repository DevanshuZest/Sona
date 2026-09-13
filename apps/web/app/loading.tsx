"use client";

import { useEffect, useState } from "react";

export default function Loading() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const matchMedia = (window as any).matchMedia;
        if (typeof matchMedia === "function") {
            const mq = matchMedia("(prefers-reduced-motion: reduce)");
            setReducedMotion(mq.matches);
            mq.addEventListener("change", (e: any) => setReducedMotion(e.matches));
            return () => mq.removeEventListener("change", () => { });
        }
    }, []);

    const pulse = reducedMotion ? "" : "animate-pulse";

    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-28 rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-4 ${pulse}`}>
                    <div className="mb-3 h-4 w-32 rounded bg-[hsl(var(--sona-bg-brand-soft))]" />
                    <div className="mb-2 h-4 w-full rounded bg-[hsl(var(--sona-bg-brand-soft))]" />
                    <div className="h-4 w-2/3 rounded bg-[hsl(var(--sona-bg-brand-soft))]" />
                </div>
            ))}
        </div>
    );
}
