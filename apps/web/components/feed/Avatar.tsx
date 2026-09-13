const PRESENCE_COLOR: Record<"online" | "away" | "offline", string> = {
    online: "bg-emerald-500",
    away: "bg-[hsl(var(--sona-marigold))]",
    offline: "bg-neutral-400",
};

export default function Avatar({
    user,
    size,
    presence,
    ring = false,
}: {
    user: { username?: string; display_name?: string; avatar_url?: string | null };
    size: 32 | 40 | 48 | 64;
    presence?: "online" | "away" | "offline";
    ring?: boolean;
}) {
    const name = user.display_name || user.username || "?";
    const initials = name.trim()[0]?.toUpperCase() || "?";

    return (
        <span
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${
                ring
                    ? "ring-2 ring-offset-2 ring-[hsl(var(--sona-text-brand))]"
                    : "bg-[hsl(var(--sona-bg-brand-soft))] text-[hsl(var(--sona-text-brand))]"
            }`}
            style={{ width: size, height: size }}
        >
            {user.avatar_url ? (
                <img
                    src={user.avatar_url}
                    alt=""
                    width={size}
                    height={size}
                    loading="lazy"
                    className="object-cover"
                />
            ) : (
                <span className="text-sm font-semibold" style={{ fontSize: size * 0.4 }}>
                    {initials}
                </span>
            )}
            {presence && (
                <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[hsl(var(--sona-bg-surface))] ${PRESENCE_COLOR[presence]}`}
                    aria-hidden
                />
            )}
        </span>
    );
}