"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    async function logout() {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    return (
        <button
            onClick={logout}
            className="rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5 text-sm text-[#78716C] hover:border-[#0F766E] hover:text-[#0F766E]"
        >
            Log out
        </button>
    );
}
