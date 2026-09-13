import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "../../../components/Comments";
import LikeButton from "../../like-button";
import { createClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const [{ data: post }, { data: { user } }] = await Promise.all([
        supabase.from("sona_posts").select("id, content, created_at, user_id, likes_count, boost_flag, sona_profiles ( username, display_name )").eq("id", id).maybeSingle(),
        supabase.auth.getUser(),
    ]);
    if (!post) notFound();
    const author = Array.isArray(post.sona_profiles) ? post.sona_profiles[0] : post.sona_profiles;

    return <div>
        <Link href="/" className="mb-4 inline-block text-sm text-[#0F766E] hover:underline">← Back to feed</Link>
        <article className="rounded-xl border border-[#E7E5E4] bg-white p-4">
            {author && <Link href={`/u/${author.username}`} className="mb-1 block text-sm text-[#0F766E] hover:underline">{author.display_name} <span className="text-[#78716C]">@{author.username}</span></Link>}
            <p className="whitespace-pre-wrap">{post.content}</p>
            <div className="mt-2 flex items-center justify-between"><p className="text-xs text-[#78716C]">{new Date(post.created_at).toLocaleString()}</p><LikeButton postId={post.id} userId={user?.id ?? null} initialCount={post.likes_count ?? 0} /></div>
        </article>
        <Comments postId={id} userId={user?.id ?? null} />
    </div>;
}