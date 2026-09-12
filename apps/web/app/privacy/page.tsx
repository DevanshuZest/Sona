export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-[680px] py-12">
            <h1 className="text-3xl font-semibold text-[#1C1917]">Privacy Policy</h1>
            <p className="mt-4 text-[#78716C]">Last updated: September 2026.</p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">1. What we collect</h2>
            <p className="text-[#1C1917] leading-relaxed">
                We collect only what you give us: your email address, username, display name,
                and bio. That&apos;s it. No age, no phone number, no location.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">2. What we never collect</h2>
            <p className="text-[#1C1917] leading-relaxed">
                We do not track your behavior across the site. We do not take device
                fingerprints, IP-derived profiles, or scrolling data. We have no third-party
                analytics and no ad IDs.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">3. How we store it</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Data is stored in Supabase Postgres (EU/US regions) and is encrypted at rest.
                Access is protected by row-level security and authenticated requests only.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">4. Cookies</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Sona sets only one session cookie, which is HttpOnly and Secure. There are no
                tracking cookies and no cross-site cookies.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">5. Your rights</h2>
            <p className="text-[#1C1917] leading-relaxed">
                You can export, correct, or delete your data at any time from your{" "}
                <a href="/settings" className="text-[#0F766E] underline hover:text-[#0F766E]">
                    settings
                </a>
                . Deleting your account removes your profile and data from the service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">6. Third parties</h2>
            <p className="text-[#1C1917] leading-relaxed">
                We use Supabase for hosting and authentication. If you choose to, you may log in
                with Google OAuth; otherwise Google never sees your Sona activity.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">7. Contact</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Questions? Open an issue on the{" "}
                <a
                    href="https://github.com/DevanshuZest/Sona/issues"
                    className="text-[#0F766E] underline hover:text-[#0F766E]"
                >
                    GitHub repository
                </a>
                .
            </p>
        </div>
    );
}