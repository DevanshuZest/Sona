"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const focusClasses =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--sona-text-brand))]";

export default function BottomNav() {
    const pathname = usePathname();
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            supabase
                .from("sona_profiles")
                .select("username")
                .eq("id", user.id)
                .single()
                .then(({ data }) => {
                    if (data?.username) setUsername(data.username);
                });
        });
    }, []);

    const items = [
        { key: "home", href: "/", label: "Home" },
        { key: "search", href: "/search", label: "Search" },
        { key: "compose", href: "/compose", label: "Compose" },
        { key: "profile", href: username ? `/u/${username}` : "/login", label: "Profile" },
    ];

    const isActive = (key: string, href: string) => {
        if (key === "home") return pathname === "/";
        if (key === "profile") return pathname.startsWith("/u/");
        return pathname.startsWith(href);
    };

    return (
        <nav aria-label="Primary" className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
            <div className="flex h-14 w-full max-w-[680px] items-center border-t border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))]">
                {items.map((item) => {
                    const active = isActive(item.key, item.href);
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center text-sm ${focusClasses} ${
                                active ? "font-medium text-[hsl(var(--sona-text-brand))]" : "text-[hsl(var(--sona-text-secondary))]"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}