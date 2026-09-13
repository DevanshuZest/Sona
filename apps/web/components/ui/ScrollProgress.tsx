"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            if (window.scrollY < 8) {
                setProgress(0);
                return;
            }

            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const nextProgress = scrollableHeight > 0
                ? (window.scrollY / scrollableHeight) * 100
                : 0;
            setProgress(nextProgress);
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    if (progress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 z-[60] h-[2px] bg-[#0F766E]"
            style={{ width: progress + "%" }}
            aria-hidden="true"
        />
    );
}