import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const supabase = await createClient();
    const { data: profile } = await supabase.from("sona_profiles").select("id, username, display_name, bio, created_at").eq("username", username).maybeSingle();
    if (!profile) notFound();
    const { data: posts } = await supabase.from("sona_posts").select("id, content, created_at").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(50);
    return <div><header className="mb-8"><h1 className="text-2xl font-semibold">{profile.display_name}</h1><p className="text-sm text-[#0F766E]">@{profile.username}</p>{profile.bio && <p className="mt-3 text-[#78716C]">{profile.bio}</p>}<p className="mt-2 text-xs text-[#78716C]">Joined {new Date(profile.created_at).toLocaleDateString()}</p></header><div className="space-y-4">{posts?.length ? posts.map((post) => <article key={post.id} className="rounded-xl border border-[#E7E5E4] bg-white p-4"><p className="whitespace-pre-wrap">{post.content}</p><p className="mt-2 text-xs text-[#78716C]">{new Date(post.created_at).toLocaleString()}</p></article>) : <p className="text-sm text-[#78716C]">No posts yet.</p>}</div></div>;
}
