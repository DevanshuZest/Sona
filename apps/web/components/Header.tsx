"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
    const pathname = usePathname();
    const supabase = createClient();

    const focusRing = "outline-none focus:ring-2 focus:ring-[var(--sona-color-text-brand)] focus:ring-offset-2";

    return (
        <header
            className="sticky top-0 z-50 h-14 border-b border-[var(--sona-color-border-primary)] bg-[var(--sona-color-bg-surface)] px-4"
            style={{ height: "56px" }}
        >
            <div className="mx-auto flex max-w-[680px] items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sona-color-text-brand)] font-semibold text-[var(--sona-color-text-on-brand)] text-sm"
                        aria-label="Sona home"
                    >
                        s
                    </div>
                    <span className="font-semibold text-[var(--sona-color-text-primary)] text-lg">Sona</span>
                </Link>

                <AuthRightElement pathname={pathname} focusRing={focusRing} />
            </div>
        </header>
    );
}

function AuthRightElement({ pathname, focusRing }: { pathname: string, focusRing: string }) {
    const [user, setUser] = useState<any>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowDropdown(false);
    };

    if (user) {
        const initials = user.email ? user.email[0].toUpperCase() : "?";
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sona-color-text-brand)] font-semibold text-[var(--sona-color-text-on-brand)] text-sm ${focusRing}`}
                    aria-label="User menu"
                >
                    {initials}
                </button>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 rounded-lg border border-[var(--sona-color-border-primary)] bg-[var(--sona-color-bg-surface)] shadow-lg">
                        <Link
                            href="/profile"
                            className={`block w-full px-3 py-2 text-left text-sm text-[var(--sona-color-text-primary)] hover:bg-[var(--sona-color-bg-brand-soft)] hover:text-[var(--sona-color-text-brand)] font-medium ${focusRing}`}
                            onClick={() => setShowDropdown(false)}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className={`w-full px-3 py-2 text-left text-sm text-[var(--sona-color-text-primary)] hover:bg-[var(--sona-color-bg-brand-soft)] hover:text-[var(--sona-color-text-brand)] font-medium ${focusRing}`}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href="/login"
            className={`rounded-lg bg-[var(--sona-color-text-brand)] px-4 py-2 text-sm font-medium text-[var(--sona-color-text-on-brand)] hover:bg-[var(--sona-color-border-brand)] ${focusRing}`}
        >
            Log in
        </Link>
    );
}