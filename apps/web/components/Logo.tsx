export default function Logo({ size = 28 }: { size?: number }) {
    return (
        <span
            className="inline-flex items-center justify-center rounded-full bg-[#0F766E] text-white font-bold"
            style={{ width: size, height: size, fontSize: size * 0.55 }}
            aria-hidden
        >
            s
        </span>
    );
}