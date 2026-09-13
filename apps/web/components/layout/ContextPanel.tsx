import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type SuggestedProfile = {
    id: string;
    username: string;
    display_name: string;
    bio: string | null;
};

type PresenceRow = {
    user_id: string;
    status: string | null;
    last_seen: string;
    sona_profiles: SuggestedProfile | SuggestedProfile[] | null;
};

export default async function ContextPanel() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("sona_profiles")
        .select("id, username, display_name, bio")
        .limit(5);

    const suggestions: SuggestedProfile[] = !error && data
        ? (data as SuggestedProfile[])
        : [];

    const { data: presenceData } = await supabase
        .from("sona_presence")
        .select("user_id, status, last_seen, sona_profiles ( username, display_name )")
        .limit(5)
        .order("last_seen", { ascending: false });

    const presenceRows = (presenceData ?? []) as PresenceRow[];
    const online = (presenceRows ?? []).filter((r) => r.status && r.status !== "offline");

    return (
        <aside className="sticky top-14 hidden flex-col gap-6 self-start overflow-y-auto sona-scrollbar lg:flex">
            <section className="rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-6">
                <h2 className="text-xs font-semibold uppercase text-[hsl(var(--sona-text-secondary))]">
                    Who to follow
                </h2>
                {suggestions.length ? (
                    <div className="mt-4 flex flex-col gap-2">
                        {suggestions.map((s: SuggestedProfile) => (
                            <Link
                                key={s.username}
                                href={`/u/${s.username}`}
                                className="flex min-h-[44px] items-center justify-between rounded-lg px-4 text-sm font-medium text-[hsl(var(--sona-text-primary))] hover:bg-[hsl(var(--sona-bg-brand-soft))]"
                            >
                                {s.display_name}
                                <span className="text-xs text-[hsl(var(--sona-text-secondary))]">@{s.username}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-[hsl(var(--sona-text-secondary))]">
                        No one to follow yet.
                    </p>
                )}
            </section>

            <section className="rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-6">
                <h2 className="text-xs font-semibold uppercase text-[hsl(var(--sona-text-secondary))]">
                    Presence
                </h2>
                {online.length ? (
                    <div className="mt-4 flex flex-col gap-2">
                        {online.map((row) => {
                            const p = row.sona_profiles;
                            const uname = Array.isArray(p) ? p[0]?.username : p?.username;
                            const dname = Array.isArray(p) ? p[0]?.display_name : p?.display_name;
                            return (
                                <Link
                                    key={row.user_id}
                                    href={`/u/${uname}`}
                                    className="flex min-h-[44px] items-center gap-3 rounded-lg px-4 text-sm font-medium text-[hsl(var(--sona-text-primary))] hover:bg-[hsl(var(--sona-bg-brand-soft))]"
                                >
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                                    {dname || uname || "Someone"}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-[hsl(var(--sona-text-secondary))]">No one online right now.</p>
                )}
            </section>
        </aside>
    );
}