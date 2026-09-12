"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const focusClasses =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]";

const itemClasses = `flex w-full items-center gap-2 h-9 px-3 rounded-lg text-sm text-[#1C1917] hover:bg-[#F0FDFA] ${focusClasses}`;

export default function UserMenu({
    user,
    profile,
}: {
    user: { id: string };
    profile: { username: string; display_name: string } | null;
}) {
    const supabase = createClient();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const username = profile?.username || "";
    const name = profile?.display_name || username || "?";
    const initials = name.trim()[0]?.toUpperCase() || "?";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        const onPointerDown = (event: globalThis.MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onPointerDown);
        };
    }, [open]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setOpen(false);
        router.push("/");
        router.refresh();
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-haspopup="true"
                aria-expanded={open}
                aria-label="User menu"
                className={`flex h-11 w-11 items-center justify-center rounded-full ${focusClasses}`}
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0FDFA] text-[#0F766E] font-semibold text-xs">
                    {initials}
                </span>
            </button>

            {mounted && open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#E7E5E4] bg-white shadow-lg p-1"
                >
                    <Link href={`/u/${username}`} onClick={() => setOpen(false)} className={itemClasses}>
                        Profile
                    </Link>
                    <Link href="/compose" onClick={() => setOpen(false)} className={itemClasses}>
                        Compose
                    </Link>
                    <Link href="/notifications" onClick={() => setOpen(false)} className={itemClasses}>
                        Notifications
                    </Link>
                    <Link href="/settings" onClick={() => setOpen(false)} className={itemClasses}>
                        Settings
                    </Link>
                    <div role="separator" className="my-1 h-px bg-[#E7E5E4]" />
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={`flex w-full items-center h-9 px-3 rounded-lg text-sm text-[#DC2626] hover:bg-[#F0FDFA] ${focusClasses}`}
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}