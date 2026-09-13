import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "../Logo";
import Icon from "../ui/Icon";

const NAV = [
    { key: "home", href: "/", label: "Home", icon: "home" },
    { key: "search", href: "/search", label: "Search", icon: "search" },
    { key: "compose", href: "/compose", label: "Compose", icon: "compose" },
    { key: "settings", href: "/settings", label: "Settings", icon: "settings" },
];

export default async function SidebarNav() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let username = "";
    if (user) {
        const { data } = await supabase
            .from("sona_profiles")
            .select("username")
            .eq("id", user.id)
            .maybeSingle();
        username = data?.username ?? "";
    }

    const items = [...NAV];
    if (user) {
        items.push({ key: "profile", href: `/u/${username}`, label: "Profile", icon: "user" });
    }

    return (
        <aside className="sticky top-14 hidden flex-col gap-2 self-start md:flex">
            <Link href="/" aria-label="Sona home" className="flex items-center gap-2 px-2">
                <Logo size={40} />
                <span className="hidden text-lg font-semibold text-[hsl(var(--sona-text-primary))] lg:inline">
                    Sona
                </span>
            </Link>
            {items.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    className="flex min-h-[44px] items-center gap-3 rounded-lg px-2 text-[hsl(var(--sona-text-primary))] hover:bg-[hsl(var(--sona-bg-brand-soft))]"
                >
                    <Icon name={item.icon} size={22} />
                    <span className="hidden text-sm font-medium text-[hsl(var(--sona-text-primary))] lg:inline">
                        {item.label}
                    </span>
                </Link>
            ))}
            {!user && (
                <Link
                    href="/login"
                    className="flex min-h-[44px] items-center justify-center rounded-lg bg-[hsl(var(--sona-text-brand))] px-2 text-sm font-medium text-[hsl(var(--sona-text-on-brand))]"
                >
                    <span className="hidden lg:inline">Log in</span>
                    <span className="lg:hidden">In</span>
                </Link>
            )}
        </aside>
    );
}