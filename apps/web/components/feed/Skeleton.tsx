export default function Skeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading content">
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-6 h-32"
                >
                    <div className="mb-4 h-4 w-32 rounded bg-[hsl(var(--sona-bg-brand-soft))]" />
                    <div className="mb-2 h-4 w-full rounded bg-[hsl(var(--sona-bg-brand-soft))]" />
                    <div className="h-4 w-2/3 rounded bg-[hsl(var(--sona-bg-brand-soft))]" />
                </div>
            ))}
        </div>
    );
}