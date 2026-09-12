import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div>
                <p className="text-sm text-[#78716C]">You need to be logged in to view notifications.</p>
            </div>
        );
    }

    const { data: profile } = await supabase
        .from("sona_profiles")
        .select("username")
        .eq("id", user.id)
        .single();

    const { data: notifications } = await supabase
        .from("sona_notifications")
        .select("*, sona_profiles ( username, display_name )")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Mark all as read
    if (notifications && notifications.length > 0) {
        const unreadIds = notifications
            .filter((n: any) => !n.read)
            .map((n: any) => n.id);
        if (unreadIds.length > 0) {
            await supabase
                .from("sona_notifications")
                .update({ read: true })
                .in("id", unreadIds);
        }
    }

    // Re-fetch to get updated read status
    const { data: freshNotifications } = await supabase
        .from("sona_notifications")
        .select("*, sona_profiles ( username, display_name )")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div>
            {freshNotifications && freshNotifications.length > 0 ? (
                <div className="divide-y divide-[#E7E5E4]">
                    {freshNotifications.map((notification: any) => {
                        const actorProfile = notification.sona_profiles;
                        const actorName = actorProfile?.display_name || "Someone";
                        const actorUsername = actorProfile?.username || "";
                        const actorAvatarInitials = actorUsername?.[0]?.toUpperCase() || "?";

                        let actionText = "";
                        let linkHref = "";

                        switch (notification.kind) {
                            case "like":
                                actionText = `${actorName} liked your post`;
                                linkHref = notification.post_id ? `#post-${notification.post_id}` : "/";
                                break;
                            case "follow":
                                actionText = `${actorName} started following you`;
                                linkHref = `/u/${actorUsername}`;
                                break;
                            case "reply":
                                actionText = `${actorName} replied to your post`;
                                linkHref = notification.post_id ? `#post-${notification.post_id}` : "/";
                                break;
                            default:
                                actionText = `${actorName} did something`;
                                linkHref = "/";
                        }

                        return (
                            <Link
                                key={notification.id}
                                href={linkHref}
                                className={`block px-4 py-3 text-sm ${
                                    notification.read
                                        ? "bg-white text-[#1C1917]"
                                        : "bg-[#F5F3F0] text-[#1C1917] font-medium"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0FDFA] text-[#0F766E]">
                                        {actorAvatarInitials}
                                    </div>
                                    <div className="flex-1">
                                        <p className="whitespace-nowrap">{actionText}</p>
                                        <p className="text-xs text-[#78716C]">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-[#78716C]">No notifications yet.</p>
            )}
        </div>
    );
}