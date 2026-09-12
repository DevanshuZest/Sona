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
                            className="rounded-lg border border-[#E7E5E4] bg-white px-3 h-9 inline-flex items-center text-sm text-[#1C1917] hover:border-[#0F766E]"
                        >
                            Edit profile
                        </Link>
                    </div>
                )}
                <h1 className="text-2xl font-semibold text-[#1C1917]">{profile.display_name}</h1>
                <p className="text-sm text-[#0F766E]">@{profile.username}</p>
                {profile.bio && <p className="mt-3 text-[#78716C]">{profile.bio}</p>}
                <p className="mt-2 text-xs text-[#78716C]">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-[#78716C]">
                    <span><strong className="text-[#1C1917]">{followerCount ?? 0}</strong> followers</span>
                    <span><strong className="text-[#1C1917]">{followingCount ?? 0}</strong> following</span>
                    <FollowButton viewerId={viewer?.id ?? null} targetId={profile.id} />
                </div>
            </header>
            <div className="space-y-4">
                {posts?.length ? (
                    posts.map((post) => (
                        <article key={post.id} className="rounded-xl border border-[#E7E5E4] bg-white p-4">
                            <p className="whitespace-pre-wrap">{post.content}</p>
                            <p className="mt-2 text-xs text-[#78716C]">{new Date(post.created_at).toLocaleString()}</p>
                        </article>
                    ))
                ) : (
                    <p className="text-sm text-[#78716C]">No posts yet.</p>
                )}
            </div>
        </div>
    );
}
