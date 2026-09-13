export default function PostMedia({
    media = [],
    onDoubleTap,
}: {
    media?: { url: string; alt?: string }[];
    onDoubleTap?: () => void;
}) {
    if (media.length === 0) return null;

    const items = media.slice(0, 4);
    const single = items.length === 1;
    const container = single
        ? "aspect-[4/5] overflow-hidden"
        : "grid grid-cols-2 gap-1 aspect-[4/5] overflow-hidden";

    let lastTap = 0;
    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap < 350) {
            lastTap = 0;
            onDoubleTap?.();
        } else {
            lastTap = now;
        }
    };

    return (
        <div onClick={handleTap} role="button" tabIndex={-1}>
            <div className={container}>
                {items.map((m, i) => (
                    <img
                        key={i}
                        src={m.url}
                        alt={m.alt ?? ""}
                        loading="lazy"
                        width={400}
                        height={500}
                        className="h-full w-full object-cover"
                        style={{ aspectRatio: "4 / 5" }}
                    />
                ))}
            </div>
            {items.length > 1 && (
                <div className="mt-1 flex items-center">
                    {items.map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                                i === 0
                                    ? "bg-[hsl(var(--sona-text-brand))]"
                                    : "bg-[hsl(var(--sona-text-tertiary))]"
                            }`}
                            aria-hidden
                        />
                    ))}
                </div>
            )}
        </div>
    );
}