import type { ReactNode } from "react";

const PATHS: Record<string, ReactNode> = {
    home: (
        <path d="M4 13h16M9 13v-7l-1-1-1 1M13 13v-7l1-1-1 1z" fill="currentColor" />
    ),
    search: (
        <path d="M10 6a4 4 0 1 0 4 5M17 12v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
    user: (
        <path d="M8 7a4 4 0 1 0 4 6M6 11h12v4h-12z" fill="currentColor" />
    ),
    bell: (
        <path d="M8 4a4 4 0 0 1 8 4M12 5l-4 0-4 3-4 3-4 4-4 4z" fill="none" stroke="currentColor" strokeWidth="2" />
    ),
    settings: (
        <path d="M6 6h12M9 8a3 3 0 0 1 0 3M9 8a3 3 0 0 1 0-3M9 8a3 3 0 0 1-3 0M9 8a3 3 0 0 1 3 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
    ),
    compose: (
        <path d="M10 12h4M12 10v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
    heart: (
        <path d="M12 20c-2 0-4-1.5-4-3.5-2-5.5-3-3.5-1-4.5h-2-1.8 0 2.2 1 3.4 2 4 4 1.6 3-1.6 3-2.5-2.5z" fill="currentColor" />
    ),
    bookmark: (
        <path d="M6 3v17M18 3v17M6 3l5 3-5 3-5-9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    share: (
        <path d="M6 6v12M6 6h12M12 10v6M12 18l-4 2-4-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
    reply: (
        <path d="M6 8h12M6 8l-2 4-4 0-4 2-4 4-6-6z" fill="currentColor" />
    ),
    more: (
        <path d="M6 8h12M6 13h12M6 18h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
    check: (
        <path d="M6 8l3 5 3 5 5-3 3-5 1-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    x: (
        <path d="M7 7l10 10M7 17l10-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
    image: (
        <path d="M4 4h16v16h-16v-9M12 12v4M12 12h-3l4 0 0 4 4 0 0-4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
    video: (
        <path d="M7 5v14M17 5v14M12 12l0 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
};

export default function Icon({
    name,
    size = 20,
    className = "",
}: {
    name: string;
    size?: number;
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            stroke="currentColor"
            className={className}
            aria-hidden
        >
            {PATHS[name]}
        </svg>
    );
}