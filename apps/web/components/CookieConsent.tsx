"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "sona-cookie-ok";

export default function CookieConsent() {
    const [accepted, setAccepted] = useState<boolean | null>(null);

    useEffect(() => {
        setAccepted(window.localStorage.getItem(CONSENT_KEY) === "true");
    }, []);

    if (accepted === null || accepted) return null;

    const accept = () => {
        window.localStorage.setItem(CONSENT_KEY, "true");
        setAccepted(true);
    };

    return (
        <div className="fixed bottom-16 left-0 right-0 z-40 sm:bottom-4">
            <div className="mx-auto max-w-[680px] px-4">
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-3 shadow-lg flex items-center justify-between gap-3">
                    <p className="text-sm text-[#1C1917]">
                        Sona uses one session cookie. No tracking. No ads.{" "}
                        <Link href="/privacy" className="text-[#0F766E] underline hover:text-[#0F766E]">
                            Privacy
                        </Link>
                    </p>
                    <button
                        type="button"
                        onClick={accept}
                        className="shrink-0 rounded-lg bg-[#0F766E] px-3 h-9 text-sm font-medium text-white hover:bg-[#0D5F58]"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}