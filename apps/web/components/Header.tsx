"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BellNotification from "./BellNotification";

export default function Header() {
    const pathname = usePathname();
    const supabase = createClient();
    const router = useRouter();

    const focusRing = "outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2";

    return (
        <header
            className="sticky top-0 z-50 h-14 border-b border-[#E7E5E4] bg-surface px-4"
            style={{ height: "56px" }}
        >
            <div className="mx-auto flex max-w-[680px] items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F766E] font-semibold text-white text-xs"
                        aria-label="Sona home"
                    >
                        s
                    </div>
                    <span className="font-semibold text-[#1C1917] text-lg">Sona</span>
                </Link>

                <AuthRightElement pathname={pathname} focusRing={focusRing} supabase={supabase} router={router} />
            </div>
        </header>
    );
}

function AuthRightElement({ pathname, focusRing, supabase, router }: {
    pathname: string;
    focusRing: string;
    supabase: ReturnType<typeof createClient>;
    router: ReturnType<typeof useRouter>;
}) {
    const [user, setUser] = useState<any>(null);
    const [profileUsername, setProfileUsername] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) {
                supabase.from("sona_profiles").select("username").eq("id", user.id).single()
                    .then(({ data }) => {
                        if (data?.username) {
                            setProfileUsername(data.username);
                        }
                    });
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowDropdown(false);
        router.push("/");
    };

    return (
        <div className="flex items-center gap-2">
            <BellNotification userId={user?.id ?? null} />
            {user && profileUsername ? (
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#F0FDFA] text-[#0F766E] font-semibold text-xs ${focusRing}`}
                        aria-label="User menu"
                    >
                        {user.email ? user.email[0].toUpperCase() : "?"}
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-[#E7E5E4] bg-surface shadow-lg">
                            <Link
                                href={`/u/${profileUsername}`}
                                className={`block w-full px-3 py-2 text-left text-sm text-[#1C1917] hover:bg-[#F0FDFA] hover:text-[#0F766E] font-medium ${focusRing}`}
                                onClick={() => setShowDropdown(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/settings"
                                className={`block w-full px-3 py-2 text-left text-sm text-[#1C1917] hover:bg-[#F0FDFA] hover:text-[#0F766E] font-medium ${focusRing}`}
                                onClick={() => setShowDropdown(false)}
                            >
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`w-full px-3 py-2 text-left text-sm text-[#1C1917] hover:bg-[#F0FDFA] hover:text-[#0F766E] font-medium ${focusRing}`}
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    href="/login"
                    className={`rounded-lg bg-[#0F766E] px-3 py-1.5 text-sm font-medium text-white ${focusRing}`}
                >
                    Log in
                </Link>
            )}
        </div>
    );
}