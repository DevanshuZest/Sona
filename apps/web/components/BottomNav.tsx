"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { href: "/", label: "Home", symbol: "⌂" },
    { href: "/notifications", label: "Alerts", symbol: "♡" },
    { href: "/settings", label: "Settings", symbol: "⚙" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Primary navigation"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E7E5E4] bg-white md:hidden"
        >
            <div className="mx-auto flex max-w-[680px] justify-around px-4 py-2">
                {items.map((item) => {
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex min-w-16 flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium ${active ? "text-[#0F766E]" : "text-[#78716C]"
                                }`}
                        >
                            <span aria-hidden="true" className="text-lg leading-5">
                                {item.symbol}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
