"use client";

import { useEffect, useState } from "react";

export default function ProfileLoading() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const matchMedia = (window as any).matchMedia;
        if (typeof matchMedia === "function") {
            const mq = matchMedia("(prefers-reduced-motion: reduce)");
            setReducedMotion(mq.matches);
            mq.addEventListener("change", (e: any) => setReducedMotion(e.matches));
            return () => mq.removeEventListener("change", () => {});
        }
    }, []);

    const pulse = reducedMotion ? "" : "animate-pulse";

    return (
        <div className="space-y-4">
            <div className={`rounded-xl border border-[#E7E5E4] bg-white p-6 ${pulse}`}>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-full bg-[#F5F3F0]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-40 rounded bg-[#F5F3F0]" />
                        <div className="h-4 w-24 rounded bg-[#F5F3F0]" />
                    </div>
                </div>
                <div className="mt-4 h-16 rounded bg-[#F5F3F0]" />
            </div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className={`rounded-xl border border-[#E7E5E4] bg-white p-4 h-28 ${pulse}`}>
                    <div className="h-4 w-32 rounded bg-[#F5F3F0] mb-3" />
                    <div className="h-4 w-full rounded bg-[#F5F3F0] mb-2" />
                    <div className="h-4 w-2/3 rounded bg-[#F5F3F0]" />
                </div>
            ))}
        </div>
    );
}