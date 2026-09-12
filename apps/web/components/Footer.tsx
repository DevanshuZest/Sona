export default function Footer() {
    return (
        <footer className="mt-12 border-t border-[var(--sona-color-border-primary)] py-4 text-center text-sm text-[var(--sona-color-text-secondary)]">
            <span className="whitespace-nowrap">
                Sona · AGPL-3.0 ·{" "}
                <a
                    href="https://github.com/DevanshuZest/Sona"
                    className="text-[var(--sona-color-text-brand)] underline hover:text-[var(--sona-color-text-brand)]"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </span>
        </footer>
    );
}