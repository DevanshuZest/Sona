import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Composer from "../composer";

export const dynamic = "force-dynamic";

export default async function ComposePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let profile: { username: string; display_name: string } | null = null;
    if (user) {
        const { data } = await supabase
            .from("sona_profiles")
            .select("username, display_name")
            .eq("id", user.id)
            .maybeSingle();
        profile = data;
    }

    return <Composer userId={user.id} username={profile?.username} />;
}