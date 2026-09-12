"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [emailForOtp, setEmailForOtp] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function validate() {
        const validEmail = /^\S+@\S+\.\S+$/.test(email);
        const validUsername = /^[a-z0-9_]{3,30}$/.test(username);
        setEmailError(validEmail ? null : "Enter a valid email address.");
        setPasswordError(mode !== "forgot" && password.length < 6 ? "Password must be at least 6 characters." : null);
        setUsernameError(mode === "signup" && !validUsername ? "Use 3-30 lowercase letters, numbers, or underscores." : null);
        return validEmail && (mode === "forgot" || password.length >= 6) && (mode !== "signup" || validUsername);
    }

    async function handleGoogleLogin() {
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    async function handleSendOtp() {
        setError(null);
        setMessage(null);
        if (!/^\S+@\S+\.\S+$/.test(emailForOtp)) {
            setError("Enter a valid email address.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email: emailForOtp,
            options: { shouldCreateUser: true },
        });
        setLoading(false);
        if (error) setError(error.message);
        else {
            setShowOtpInput(true);
            setMessage("Check your email for a 6-digit code.");
        }
    }

    async function handleVerifyOtp(token: string) {
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({ email: emailForOtp, token, type: "email" });
        setLoading(false);
        if (error) setError(error.message);
        else {
            router.push("/");
            router.refresh();
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (!validate()) return;
        setLoading(true);
        try {
            if (mode === "forgot") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset/confirm" });
                if (error) throw error;
                setMessage("If that email exists, we sent a reset link.");
            } else if (mode === "signup") {
                const { error } = await supabase.auth.signUp({ email, password, options: { data: { username, display_name: displayName } } });
                if (error) throw error;
                router.push("/");
                router.refresh();
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const isForgot = mode === "forgot";
    return (
        <div className="mx-auto mt-16 max-w-sm">
            <h1 className="mb-2 text-3xl font-semibold">Sona</h1>
            <p className="mb-8 text-[#78716C]">{isForgot ? "Reset your password." : "Stay close. Stay real."}</p>
            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 text-[#1C1917] hover:border-[#0F766E] disabled:opacity-50">Continue with Google</button>
            <div className="my-6 flex items-center gap-3 text-sm text-[#78716C]"><span className="h-px flex-1 bg-[#E7E5E4]" /><span>or</span><span className="h-px flex-1 bg-[#E7E5E4]" /></div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && <>
                    <div><label htmlFor="username" className="sr-only">Username</label><input id="username" name="username" autoComplete="username" type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} minLength={3} maxLength={30} pattern="^[a-z0-9_]+$" required className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />{usernameError && <p className="text-sm text-red-600">{usernameError}</p>}</div>
                    <div><label htmlFor="display_name" className="sr-only">Display name</label><input id="display_name" name="display_name" type="text" placeholder="Your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} minLength={1} maxLength={60} required className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" /></div>
                </>}
                <div><label htmlFor="email" className="sr-only">Email</label><input id="email" name="email" autoComplete="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />{emailError && <p className="text-sm text-red-600">{emailError}</p>}</div>
                {!isForgot && <div><label htmlFor="password" className="sr-only">Password</label><input id="password" name="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />{passwordError && <p className="text-sm text-red-600">{passwordError}</p>}</div>}
                {error && <p className="text-sm text-red-600">{error}</p>}{message && <p className="text-sm text-[#0F766E]">{message}</p>}
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0F766E] px-3 py-2 text-white hover:bg-[#0D5F58] disabled:opacity-50">{loading ? "..." : isForgot ? "Send reset link" : mode === "login" ? "Log in" : "Sign up"}</button>
            </form>
            <div className="my-6 flex items-center gap-3 text-sm text-[#78716C]"><span className="h-px flex-1 bg-[#E7E5E4]" /><span>or</span><span className="h-px flex-1 bg-[#E7E5E4]" /></div>
            <section aria-labelledby="otp-heading" className="space-y-3">
                <h2 id="otp-heading" className="text-sm font-medium">Email OTP</h2>
                {!showOtpInput ? <>
                    <label htmlFor="otp-email" className="sr-only">Email for code</label><input id="otp-email" name="otp-email" autoComplete="email" type="email" placeholder="Email" value={emailForOtp} onChange={(e) => setEmailForOtp(e.target.value)} className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />
                    <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 text-[#1C1917] hover:border-[#0F766E] disabled:opacity-50">Send code</button>
                </> : <>
                    <label htmlFor="otp-code" className="sr-only">6-digit code</label><input id="otp-code" name="otp-code" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2 outline-none focus:border-[#0F766E]" />
                    <button type="button" onClick={() => handleVerifyOtp(otp)} disabled={loading || otp.length !== 6} className="w-full rounded-lg bg-[#0F766E] px-3 py-2 text-white hover:bg-[#0D5F58] disabled:opacity-50">Verify</button>
                </>}
            </section>
            {mode === "login" && <button type="button" onClick={() => setMode("forgot")} className="mt-4 block text-sm text-[#78716C] hover:text-[#0F766E]">Forgot password?</button>}
            <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="mt-4 text-sm text-[#78716C] hover:text-[#0F766E]">{mode === "signup" ? "Have an account? Log in" : "No account? Sign up"}</button>
            {isForgot && <Link href="/login" className="mt-4 block text-sm text-[#78716C] hover:text-[#0F766E]">Back to login</Link>}
        </div>
    );
}
