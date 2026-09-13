export default function Badge({
    kind = "verified",
}: {
    kind?: "verified" | "online" | "away" | "offline";
}) {
    if (kind === "verified") {
        return (
            <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                className="inline-block"
                role="img"
                aria-label="Verified"
            >
                <circle cx="8" cy="8" r="7" fill="hsl(var(--sona-text-brand))" />
                <path
                    d="M4 4 l2 2 2 2 2 1 2 1 2 2-1 2-2 0-2 2 0 2 2 0 2 2-2 0 2 2 0"
                    stroke="hsl(var(--sona-text-on-brand))"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    const color = kind === "online" ? "bg-emerald-500" : kind === "away" ? "bg-[hsl(var(--sona-marigold))]" : "bg-neutral-400";
    return <span className={`inline-block h-2 w-2 rounded-full ${color}`} aria-hidden />;
}