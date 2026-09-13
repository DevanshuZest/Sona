"use client";

import { useEffect, useState } from "react";

export default function FeedHeader({ label }: { label: string }) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        let lastY = 0;
        const onScroll = () => {
            const y = document.documentElement.scrollTop || document.body.scrollTop || 0;
            const goingDown = y > lastY;
            lastY = y;
            setHidden(goingDown && y > 80);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 flex min-h-[44px] items-center border-b border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] px-4 sona-spring transition-transform duration-300 ${
                hidden ? "-translate-y-12" : "translate-y-0"
            }`}
        >
            <p className="font-semibold text-base text-[hsl(var(--sona-text-primary))]">{label}</p>
        </header>
    );
}