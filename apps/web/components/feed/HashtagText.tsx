import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN = /(#[a-zA-Z0-9_]{1,50}|@[a-z0-9_]{3,30})/g;

export default function HashtagText({
    text,
    className = "",
}: {
    text: string;
    className?: string;
}) {
    const parts: ReactNode[] = [];
    let last = 0;
    let key = 0;

    for (const match of text.matchAll(TOKEN)) {
        const token = match[0];
        if (match.index > last) {
            parts.push(<span key={`t${key++}`}>{text.slice(last, match.index)}</span>);
        }
        if (token.startsWith("#")) {
            parts.push(
                <Link
                    key={`h${key++}`}
                    href={`/search?q=${token.slice(1)}`}
                    className="font-medium text-[hsl(var(--sona-text-brand))] hover:underline"
                >
                    {token}
                </Link>
            );
        } else {
            parts.push(
                <Link
                    key={`m${key++}`}
                    href={`/u/${token.slice(1)}`}
                    className="font-medium text-[hsl(var(--sona-text-brand))] hover:underline"
                >
                    {token}
                </Link>
            );
        }
        last = match.index + token.length;
    }

    if (last < text.length) {
        parts.push(<span key={`t${key++}`}>{text.slice(last)}</span>);
    }
    if (parts.length === 0) {
        parts.push(<span key={`t${key++}`}>{text}</span>);
    }

    return <p className={`whitespace-pre-wrap leading-relaxed ${className}`}>{parts}</p>;
}