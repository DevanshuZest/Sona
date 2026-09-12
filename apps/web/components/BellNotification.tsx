"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BellNotification({ userId }: { userId: string | null }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        const fetchUnread = async () => {
            const { count } = await supabase
                .from("sona_notifications")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("read", false);
            setUnreadCount(count || 0);
        };

        fetchUnread();

        const channel = supabase
            .channel("public:sona_notifications")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "sona_notifications",
                    filter: `user_id=eq.${userId}`,
                },
                () => fetchUnread()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase]);

    if (!userId) return null;

    return (
        <button
            onClick={() => router.push("/notifications")}
            className="relative rounded-full p-2 text-[#78716C] hover:bg-[#F0FDFA]"
            aria-label="Notifications"
        >
            <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <circle cx="12" cy="20" r="2" />
            </svg>
            {unreadCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-white text-xs"
                    aria-label={`${unreadCount} unread notifications`}
                >
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}
        </button>
    );
}