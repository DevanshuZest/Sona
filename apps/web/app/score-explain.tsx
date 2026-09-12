"use client";

import { useState } from "react";

export default function ScoreExplain({
    likes,
    boost,
    ageHours,
}: {
    likes: number;
    boost: boolean;
    ageHours: number;
}) {
    const [open, setOpen] = useState(false);
    const likeScore = likes * 2;
    const recency = ageHours < 1 ? 10 : ageHours < 24 ? 5 : 0;
    const boostScore = boost ? 3 : 0;
    const total = likeScore + recency + boostScore;

    return (
        <div className="mt-2 text-xs text-[#78716C]">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="underline hover:text-[#0F766E]"
            >
                Why am I seeing this?
            </button>
            {open && (
                <ul className="mt-2 space-y-1 rounded-lg border border-[#E7E5E4] bg-[#FDFCFA] p-3">
                    <li className="flex justify-between">
                        <span>Likes ({likes} x 2)</span>
                        <span>{likeScore}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Recency ({ageHours < 1 ? "&lt;1h" : ageHours < 24 ? "&lt;24h" : "old"})</span>
                        <span>{recency}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Author boost</span>
                        <span>{boostScore}</span>
                    </li>
                    <li className="flex justify-between border-t border-[#E7E5E4] pt-1 font-medium text-[#1C1917]">
                        <span>Total score</span>
                        <span>{total}</span>
                    </li>
                    <li className="pt-1 italic">This score is deterministic. No AI. No hidden weights.</li>
                </ul>
            )}
        </div>
    );
}
