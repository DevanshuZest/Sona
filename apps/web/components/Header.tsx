import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "./Logo";
import BellNotification from "./BellNotification";
import UserMenu from "./UserMenu";

export default async function Header() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let profile: { username: string; display_name: string } | null = null;
    if (user) {
        const { data } = await supabase
            .from("sona_profiles")
            .select("username, display_name")
            .eq("id", user.id)
            .maybeSingle();
        profile = data;
    }

    const focusClasses =
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]";

    return (
        <header className="sticky top-0 z-40 h-14 border-b border-[#E7E5E4] bg-white">
            <div className="mx-auto flex max-w-[680px] items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2" aria-label="Sona home">
                    <Logo size={24} />
                    <span className="font-semibold text-[#1C1917]">Sona</span>
                </Link>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <BellNotification userId={user.id} />
                            <UserMenu user={user} profile={profile} />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={`rounded-lg bg-[#0F766E] h-9 inline-flex items-center px-3 text-sm font-medium text-white ${focusClasses}`}
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
