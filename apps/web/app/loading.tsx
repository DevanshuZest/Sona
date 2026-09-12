"use client";

import { useEffect, useState } from "react";

export default function Loading() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const shimmerClass = reducedMotion ? "" : "animate-pulse";

    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <article key={i} className={`rounded-xl border border-[#E7E5E4] bg-white p-4 h-32 ${shimmerClass}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#F5F3F0]" />
                        <div className="flex-1">
                            <div className="h-4 bg-[#F5F3F0] rounded" />
                        </div>
                    </div>
                    <div className="space-y-1 mb-2">
                        <div className="h-3 bg-[#F5F3F0] rounded" />
                        <div className="h-3 bg-[#F5F3F0] rounded" />
                        <div className="h-3 bg-[#F5F3F0] rounded w-3/4" />
                    </div>
                    <div className="h-3 bg-[#F5F3F0] rounded w-16" />
                </article>
            ))}
        </div>
    );
}
