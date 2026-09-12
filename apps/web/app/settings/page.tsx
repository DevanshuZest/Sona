"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<{ username: string; display_name: string; bio: string | null } | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profileData } = await supabase
                .from("sona_profiles")
                .select("username, display_name, bio")
                .eq("id", user.id)
                .single();
            setProfile(profileData);
        };

        getUser();
    }, [supabase, router]);

    if (!user || !profile) {
        return <p className="text-sm text-[#78716C]">Loading...</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        // Get values from form
        const formData = new FormData(e.target as HTMLFormElement);
        const displayName = formData.get("display_name") as string;
        const bio = formData.get("bio") as string;
        const username = formData.get("username") as string;

        const { error } = await supabase
            .from("sona_profiles")
            .update({
                display_name: displayName,
                bio: bio,
                username: username,
            })
            .eq("id", user.id);

        if (error) {
            setError(error.message);
        } else {
            router.push(`/u/${username}`);
        }
        setSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#1C1917]">
                    Username
                </label>
                <p className="text-xs text-[#78716C]">
                    Changing this breaks old links to your profile.
                </p>
                <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={profile.username}
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="[a-z0-9_]+"
                    className="mt-1 block w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5 text-sm text-[#1C1917] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                    aria-label="Username profile"
                />
            </div>

            <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-[#1C1917]">
                    Display Name
                </label>
                <input
                    type="text"
                    id="display_name"
                    name="display_name"
                    defaultValue={profile.display_name}
                    required
                    minLength={1}
                    maxLength={60}
                    className="mt-1 block w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5 text-sm text-[#1C1917] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                    aria-label="Display name profile"
                />
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-[#1C1917]">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio || ""}
                    rows={3}
                    maxLength={300}
                    className="mt-1 block w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-1.5 text-sm text-[#1C1917] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E] focus:outline-none resize-none"
                    aria-label="Bio profile"
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#0F766E] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0D5F58] disabled:opacity-50"
            >
                {saving ? "Saving..." : "Update Profile"}
            </button>
        </form>
    );
}