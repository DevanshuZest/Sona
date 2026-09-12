"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmResetPage() {
    const router = useRouter();
    const supabase = createClient();
    const [ready, setReady] = useState(false);
    const [valid, setValid] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { setValid(Boolean(user)); setReady(true); }); }, [supabase.auth]);
    async function submit(e: React.FormEvent) {
        e.preventDefault(); setError(null);
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }
        setLoading(true); const { error } = await supabase.auth.updateUser({ password }); setLoading(false);
        if (error) { setError(error.message); return; }
        setMessage("Password updated."); setTimeout(() => router.push("/"), 1000);
    }
    if (!ready) return <div className="mx-auto mt-16 max-w-sm"><p className="text-[#78716C]">Checking reset link...</p></div>;
    if (!valid) return <div className="mx-auto mt-16 max-w-sm"><h1 className="mb-2 text-3xl font-semibold">Reset password</h1><p className="mb-4 text-[#78716C]">Invalid or expired reset link.</p><Link href="/reset" className="text-sm text-[#0F766E] hover:underline">Request a new link</Link></div>;
    return <div className="mx-auto mt-16 max-w-sm"><h1 className="mb-2 text-3xl font-semibold">Choose a new password</h1><form onSubmit={submit} className="space-y-4"><input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" /><input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={6} required className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />{error && <p className="text-sm text-red-600">{error}</p>}{message && <p className="text-sm text-[#0F766E]">{message}</p>}<button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0F766E] px-3 py-2 text-white hover:bg-[#0D5F58] disabled:opacity-50">{loading ? "..." : "Update password"}</button></form></div>;
}
