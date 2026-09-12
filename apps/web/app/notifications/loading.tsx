"use client";

import { useEffect, useState } from "react";

export default function NotificationsLoading() {
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
        <div className="divide-y divide-[#E7E5E4]">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${pulse}`}>
                    <div className="h-8 w-8 shrink-0 rounded-full bg-[#F5F3F0]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 rounded bg-[#F5F3F0]" />
                        <div className="h-3 w-1/2 rounded bg-[#F5F3F0]" />
                    </div>
                </div>
            ))}
        </div>
    );
}