import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Composer from "./composer";
import FeedModeToggle from "./feed-mode-toggle";
import LikeButton from "./like-button";
import LogoutButton from "./logout-button";
import ScoreExplain from "./score-explain";

export const dynamic = "force-dynamic";

function scoreOf(post: any): number {
    const likes = post.likes_count ?? 0;
    const created = new Date(post.created_at).getTime();
    const ageHours = (Date.now() - created) / 3_600_000;
    const recency = ageHours < 1 ? 10 : ageHours < 24 ? 5 : 0;
    const boost = post.boost_flag ? 3 : 0;
    return likes * 2 + recency + boost;
}

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string }>;
}) {
    const { mode } = await searchParams;
    const isRanked = mode === "ranked";
    const isFollowing = mode === "following";
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    let profile: { username: string; display_name: string } | null = null;
    if (user) {
        const { data } = await supabase
            .from("sona_profiles")
            .select("username, display_name")
            .eq("id", user.id)
            .maybeSingle();
        profile = data;
    }

    let postsQuery = supabase
        .from("sona_posts")
        .select(
            "id, content, created_at, user_id, likes_count, boost_flag, sona_profiles ( username, display_name )"
        )
        .order("created_at", { ascending: false })
        .limit(100);
    if (isFollowing) {
        if (!user) {
            postsQuery = postsQuery.eq("user_id", "00000000-0000-0000-0000-000000000000");
        } else {
            const { data: followingRows } = await supabase
                .from("sona_follows")
                .select("following_id")
                .eq("follower_id", user.id);
            const ids = (followingRows ?? []).map((row) => row.following_id);
            if (ids.length === 0) {
                postsQuery = postsQuery.eq("user_id", "00000000-0000-0000-0000-000000000000");
            } else {
                postsQuery = postsQuery.in("user_id", ids);
            }
        }
    }
    const { data: fetchedPosts } = await postsQuery;
    const posts = fetchedPosts ? [...fetchedPosts] : [];
    if (isRanked) posts.sort((a, b) => scoreOf(b) - scoreOf(a));

    return (
        <div>
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Sona</h1>
                    <p className="text-sm text-[#78716C]">Stay close. Stay real.</p>
                </div>
                {user ? (
                    <LogoutButton />
                ) : (
                    <Link
                        href="/login"
                        className="rounded-lg bg-[#0F766E] px-3 py-1.5 text-sm text-white hover:bg-[#0D5F58]"
                    >
                        Log in
                    </Link>
                )}
            </header>

            <FeedModeToggle />

            {user ? (
                <Composer userId={user.id} username={profile?.username} />
            ) : (
                <p className="mb-6 text-sm text-[#78716C]">
                    <Link href="/login" className="text-[#0F766E] underline">
                        Log in
                    </Link>{" "}
                    to post.
                </p>
            )}

            <div className="space-y-4">
                {isFollowing && !user ? (
                    <p className="text-sm text-[#78716C]"><Link href="/login" className="text-[#0F766E] underline">Log in</Link> to see posts from people you follow.</p>
                ) : isFollowing && user && posts.length === 0 ? (
                    <p className="text-sm text-[#78716C]">You&apos;re not following anyone yet. Find people and hit Follow on their profile.</p>
                ) : posts.length ? (
                    posts.map((post) => {
                        const author = Array.isArray(post.sona_profiles)
                            ? post.sona_profiles[0]
                            : post.sona_profiles;
                        const ageHours =
                            (Date.now() - new Date(post.created_at).getTime()) / 3_600_000;
                        return (
                            <article
                                key={post.id}
                                className="rounded-xl border border-[#E7E5E4] bg-white p-4"
                            >
                                {author ? (
                                    <Link
                                        href={`/u/${author.username}`}
                                        className="mb-1 block text-sm text-[#0F766E] hover:underline"
                                    >
                                        {author.display_name}{" "}
                                        <span className="text-[#78716C]">@{author.username}</span>
                                    </Link>
                                ) : (
                                    <p className="mb-1 text-sm text-[#78716C]">Unknown</p>
                                )}
                                <p className="whitespace-pre-wrap">{post.content}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-xs text-[#78716C]">
                                        {new Date(post.created_at).toLocaleString()}
                                    </p>
                                    <LikeButton
                                        postId={post.id}
                                        userId={user?.id ?? null}
                                        initialCount={post.likes_count ?? 0}
                                    />
                                </div>
                                {isRanked && (
                                    <ScoreExplain
                                        likes={post.likes_count ?? 0}
                                        boost={Boolean(post.boost_flag)}
                                        ageHours={ageHours}
                                    />
                                )}
                            </article>
                        );
                    })
                ) : (
                    <p className="text-sm text-[#78716C]">No posts yet.</p>
                )}
            </div>
        </div>
    );
}
