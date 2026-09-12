import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Composer from "./composer";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let profile: { username: string; display_name: string } | null = null;
    if (user) {
        const { data } = await supabase.from("sona_profiles").select("username, display_name").eq("id", user.id).maybeSingle();
        profile = data;
    }
    const { data: posts } = await supabase.from("sona_posts").select("id, content, created_at, user_id, sona_profiles ( username, display_name )").order("created_at", { ascending: false }).limit(50);

    return <div>
        <header className="mb-8 flex items-center justify-between"><div><h1 className="text-2xl font-semibold">Sona</h1><p className="text-sm text-[#78716C]">Stay close. Stay real.</p></div>{user ? <LogoutButton /> : <Link href="/login" className="rounded-lg bg-[#0F766E] px-3 py-1.5 text-sm text-white hover:bg-[#0D5F58]">Log in</Link>}</header>
        {user ? <Composer userId={user.id} username={profile?.username} /> : <p className="mb-6 text-sm text-[#78716C]"><Link href="/login" className="text-[#0F766E] underline">Log in</Link>{" "}to post.</p>}
        <div className="space-y-4">{posts?.length ? posts.map((post) => { const author = Array.isArray(post.sona_profiles) ? post.sona_profiles[0] : post.sona_profiles; return <article key={post.id} className="rounded-xl border border-[#E7E5E4] bg-white p-4">{author ? <Link href={`/u/${author.username}`} className="mb-1 block text-sm text-[#0F766E] hover:underline">{author.display_name} <span className="text-[#78716C]">@{author.username}</span></Link> : <p className="mb-1 text-sm text-[#78716C]">Unknown</p>}<p className="whitespace-pre-wrap">{post.content}</p><p className="mt-2 text-xs text-[#78716C]">{new Date(post.created_at).toLocaleString()}</p></article>; }) : <p className="text-sm text-[#78716C]">No posts yet.</p>}</div>
    </div>;
}
