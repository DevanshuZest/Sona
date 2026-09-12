"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPage() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    async function submit(e: React.FormEvent) {
        e.preventDefault(); setLoading(true); setError(null);
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset/confirm" });
        setLoading(false); if (error) setError(error.message); else setMessage("If that email exists, we sent a reset link.");
    }
    return <div className="mx-auto mt-16 max-w-sm"><h1 className="mb-2 text-3xl font-semibold">Reset password</h1><p className="mb-8 text-[#78716C]">Enter your email to receive a reset link.</p><form onSubmit={submit} className="space-y-4"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />{error && <p className="text-sm text-red-600">{error}</p>}{message && <p className="text-sm text-[#0F766E]">{message}</p>}<button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0F766E] px-3 py-2 text-white hover:bg-[#0D5F58] disabled:opacity-50">{loading ? "..." : "Send reset link"}</button></form><Link href="/login" className="mt-4 block text-sm text-[#78716C] hover:text-[#0F766E]">Back to login</Link></div>;
}
