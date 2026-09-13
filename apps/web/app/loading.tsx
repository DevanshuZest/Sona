export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6" aria-busy="true" role="status" aria-label="Loading feed">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
                <aside className="hidden space-y-2 md:block">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-10 w-full rounded-lg bg-[#F5F3F0] animate-pulse" />
                    ))}
                </aside>
                <main className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="rounded-xl border border-[#E7E5E4] bg-white p-4">
                            <div className="mb-3 h-4 w-32 rounded bg-[#F5F3F0] animate-pulse" />
                            <div className="mb-2 h-4 w-full rounded bg-[#F5F3F0] animate-pulse" />
                            <div className="h-4 w-2/3 rounded bg-[#F5F3F0] animate-pulse" />
                        </div>
                    ))}
                </main>
                <aside className="hidden space-y-4 lg:block">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="h-32 w-full rounded-xl bg-[#F5F3F0] animate-pulse" />
                    ))}
                </aside>
            </div>
        </div>
    );
}
