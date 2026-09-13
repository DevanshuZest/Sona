import Link from "next/link";

export default function EmptyState({
    title,
    body,
    ctaHref,
    ctaLabel,
    suggestions = [],
}: {
    title: string;
    body?: string;
    ctaHref?: string;
    ctaLabel?: string;
    suggestions?: { username: string; display_name: string }[];
}) {
    return (
        <div className="rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-8 text-center">
            <p className="font-semibold text-base text-[hsl(var(--sona-text-primary))]">{title}</p>
            {body && (
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--sona-text-secondary))]">{body}</p>
            )}
            {suggestions.length > 0 && (
                <div className="mt-8">
                    <p className="text-xs font-medium text-[hsl(var(--sona-text-secondary))]">
                        Follow these people
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                        {suggestions.map((s) => (
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
                </div>
            )}
            {ctaHref && (
                <Link
                    href={ctaHref}
                    className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[hsl(var(--sona-text-brand))] px-4 text-sm font-medium text-[hsl(var(--sona-text-on-brand))]"
                >
                    {ctaLabel || "Go"}
                </Link>
            )}
        </div>
    );
}