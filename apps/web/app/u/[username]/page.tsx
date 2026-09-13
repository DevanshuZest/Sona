import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import FollowButton from "./follow-button";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const supabase = await createClient();
    const { data: profile } = await supabase.from("sona_profiles").select("id, username, display_name, bio, created_at").eq("username", username).maybeSingle();
    if (!profile) notFound();
    const { count: followerCount } = await supabase.from("sona_follows").select("*", { count: "exact", head: true }).eq("following_id", profile.id);
    const { count: followingCount } = await supabase.from("sona_follows").select("*", { count: "exact", head: true }).eq("follower_id", profile.id);
    const { data: { user: viewer } } = await supabase.auth.getUser();
    const { data: posts } = await supabase.from("sona_posts").select("id, content, created_at").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(50);
    const isOwn = viewer?.id === profile.id;

    return (
        <div>
            <header className="mb-8">
                {isOwn && (
                    <div className="flex justify-end">
                        <Link
                            href="/settings"
                            className="inline-flex h-9 items-center rounded-lg border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] px-3 text-sm text-[hsl(var(--sona-text-primary))] hover:border-[hsl(var(--sona-border-brand))]"
                        >
                            Edit profile
                        </Link>
                    </div>
                )}
                <h1 className="text-2xl font-semibold text-[hsl(var(--sona-text-primary))]">{profile.display_name}</h1>
                <p className="text-sm text-[hsl(var(--sona-text-brand))]">@{profile.username}</p>
                {profile.bio && <p className="mt-3 text-[hsl(var(--sona-text-secondary))]">{profile.bio}</p>}
                <p className="mt-2 text-xs text-[hsl(var(--sona-text-secondary))]">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-[hsl(var(--sona-text-secondary))]">
                    <span><strong className="text-[hsl(var(--sona-text-primary))]">{followerCount ?? 0}</strong> followers</span>
                    <span><strong className="text-[hsl(var(--sona-text-primary))]">{followingCount ?? 0}</strong> following</span>
                    <FollowButton viewerId={viewer?.id ?? null} targetId={profile.id} />
                </div>
            </header>
            <div className="space-y-4">
                {posts?.length ? (
                    posts.map((post) => (
                        <article key={post.id} className="rounded-xl border border-[hsl(var(--sona-border-primary))] bg-[hsl(var(--sona-bg-surface))] p-4">
                            <p className="whitespace-pre-wrap">{post.content}</p>
                            <p className="mt-2 text-xs text-[hsl(var(--sona-text-secondary))]">{new Date(post.created_at).toLocaleString()}</p>
                        </article>
                    ))
                ) : (
                    <p className="text-sm text-[hsl(var(--sona-text-secondary))]">No posts yet.</p>
                )}
            </div>
        </div>
    );
}
