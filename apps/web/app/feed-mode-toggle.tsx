"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FeedModeToggle() {
    const router = useRouter();
    const params = useSearchParams();
    const mode = params.get("mode") === "ranked" ? "ranked" : "chrono";

    function set(next: "chrono" | "ranked") {
        const query = next === "ranked" ? "?mode=ranked" : "";
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
