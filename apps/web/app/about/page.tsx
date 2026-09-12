export default function AboutPage() {
    return (
        <div className="prose max-w-[680px] text-[#1C1917]">
            <h1>About Sona</h1>

            <h2>What Sona is</h2>
            <p>
                Sona is a privacy-first social platform. We believe in minimal data collection,
                transparent algorithms, and user control over your experience. There are no ads,
                no tracking, and no hidden agendas.
            </p>

            <h2>How the feed works</h2>
            <p>
                Sona offers two feed modes. The default is a chronological feed showing posts
                from accounts you follow. You can also switch to ranked mode, which surfaces
                content based on engagement, age, and boosts. Our algorithm is deterministic
                and explainable — you can see exactly how a post's score is calculated.
            </p>

            <h2>Our license</h2>
            <p>
                Sona is licensed under AGPL-3.0. This means anyone can inspect, use, and
                modify the code, and if you run a modified version on a network, you must
                make your changes available. It also means no ads, no tracking, and no
                data selling. We're building the internet we want to live on.
            </p>

            <p>
                <a
                    href="https://github.com/DevanshuZest/Sona"
                    className="text-[#0F766E] underline hover:text-[#0F766E]"
                >
                    GitHub
                </a>
            </p>
        </div>
    );
}