export default function TermsPage() {
    return (
        <div className="mx-auto max-w-[680px] py-12">
            <h1 className="text-3xl font-semibold text-[#1C1917]">Terms of Service</h1>
            <p className="mt-4 text-[#78716C]">Last updated: September 2026.</p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">1. What Sona is</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Sona is a privacy-first social platform. It is open source under the AGPL-3.0
                license. There are no ads, no tracking pixels, and no hidden ranking agendas.
                You can read every line of code that runs this service.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">2. Your account</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Your account belongs to you. You can delete it at any time, and deleting it
                removes your profile and data. We never sell or share your account information.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">3. Content you post</h2>
            <p className="text-[#1C1917] leading-relaxed">
                You own the content you post. By posting, you grant Sona a limited license to
                store it and display it to other users. Nothing you post is used for advertising,
                machine learning on your data, or resale.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">4. What we don&apos;t do</h2>
            <p className="text-[#1C1917] leading-relaxed">
                We do not shadowban accounts. We do not hide posts based on secret ranking. We
                do not sell your data. Our feed algorithm is deterministic, explainable, and
                visible to you on every post.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">5. Moderation</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Sona puts moderation in your hands: you can block, mute, and report other users.
                Reports are reviewed by maintainers. There is no algorithmic censorship layer.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">6. License</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Sona&apos;s source code is licensed under AGPL-3.0. You can inspect, use, and
                modify it. If you run a modified network service, you are required to share your
                changes under the same license.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">7. Changes to these terms</h2>
            <p className="text-[#1C1917] leading-relaxed">
                If these terms change in a meaningful way, we will tell you through the app
                before they take effect.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-[#1C1917]">8. Contact</h2>
            <p className="text-[#1C1917] leading-relaxed">
                Questions or concerns? Open an issue on the{" "}
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