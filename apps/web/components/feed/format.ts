export function relativeTime(iso: string): string {
    const then = new Date(iso).getTime();
    const diffMs = Date.now() - then;
    if (Number.isNaN(diffMs)) return "";
    const min = Math.floor(diffMs / 60_000);
    if (min < 1) return "now";
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}d`;
    const wk = Math.floor(day / 7);
    if (wk < 5) return `${wk}w`;
    const mo = Math.floor(day / 30);
    if (mo < 12) return `${mo}mo`;
    return `${Math.floor(day / 365)}y`;
}

export function formatCount(n: number): string {
    if (!Number.isFinite(n)) return "0";
    if (n >= 1_000_000) return `${trimZero((n / 1_000_000).toFixed(1))}m`;
    if (n >= 1_000) return `${trimZero((n / 1_000).toFixed(1))}k`;
    return `${n}`;
}

function trimZero(s: string): string {
    return s.replace(/\.0$/, "");
}

export function fullDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
}