"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FeedModeToggle() {
    const router = useRouter();
    const params = useSearchParams();
    const raw = params.get("mode");
    const mode: "chrono" | "following" | "ranked" = raw === "ranked" ? "ranked" : raw === "following" ? "following" : "chrono";

    function set(next: "chrono" | "following" | "ranked") {
        const query = next === "chrono" ? "" : `?mode=${next}`;
        router.push("/" + query);
    }

    return (
        <div className="mb-6 inline-flex rounded-lg border border-[#E7E5E4] bg-white p-1 text-sm">
            <button
                type="button"
                onClick={() => set("chrono")}
                className={`rounded-md px-3 py-1 ${mode === "chrono"
                    ? "bg-[#0F766E] text-white"
                    : "text-[#78716C] hover:text-[#0F766E]"
                    }`}
            >
                Chronological
            </button>
            <button
                type="button"
                onClick={() => set("following")}
                className={`rounded-md px-3 py-1 ${mode === "following"
                    ? "bg-[#0F766E] text-white"
                    : "text-[#78716C] hover:text-[#0F766E]"
                    }`}
            >
                Following
            </button>
            <button
                type="button"
                onClick={() => set("ranked")}
                className={`rounded-md px-3 py-1 ${mode === "ranked"
                    ? "bg-[#0F766E] text-white"
                    : "text-[#78716C] hover:text-[#0F766E]"
                    }`}
            >
                Ranked
            </button>
        </div>
    );
}
