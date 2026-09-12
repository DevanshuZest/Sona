import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Composer from "./composer";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("sona_posts")
    .select("id, content, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(50);

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

      {user ? (
        <Composer userId={user.id} />
      ) : (
        <p className="mb-6 text-sm text-[#78716C]">
          <Link href="/login" className="text-[#0F766E] underline">
            Log in
          </Link>{" "}
          to post.
        </p>
      )}

      <div className="space-y-4">
        {posts?.length ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-[#E7E5E4] bg-white p-4"
            >
              <p className="whitespace-pre-wrap">{post.content}</p>
              <p className="mt-2 text-xs text-[#78716C]">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm text-[#78716C]">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
