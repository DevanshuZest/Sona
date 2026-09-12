"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
            router.push("/");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-16 max-w-sm">
            <h1 className="mb-2 text-3xl font-semibold">Sona</h1>
            <p className="mb-8 text-[#78716C]">Stay close. Stay real.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#0F766E] px-3 py-2 text-white hover:bg-[#0D5F58] disabled:opacity-50"
                >
                    {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
                </button>
            </form>

            <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="mt-4 text-sm text-[#78716C] hover:text-[#0F766E]"
            >
                {mode === "login" ? "No account? Sign up" : "Have an account? Log in"}
            </button>
        </div>
    );
}
