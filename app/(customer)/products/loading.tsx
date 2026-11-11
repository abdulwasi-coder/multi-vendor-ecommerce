export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-375">
        <div className="h-8 w-64 animate-pulse rounded bg-white" />
        <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden space-y-4 rounded-lg bg-white p-5 lg:block">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-[#e3e6e6]" />
                <div className="h-3 w-full animate-pulse rounded bg-[#f0f2f2]" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-[#f0f2f2]" />
              </div>
            ))}
          </aside>
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="grid animate-pulse gap-4 rounded-lg bg-white p-4 sm:grid-cols-[140px_minmax(0,1fr)]"
              >
                <div className="aspect-square rounded bg-[#f0f2f2]" />
                <div className="space-y-2 py-2">
                  <div className="h-3 w-20 rounded bg-[#e3e6e6]" />
                  <div className="h-4 w-3/4 rounded bg-[#e3e6e6]" />
                  <div className="h-3 w-full rounded bg-[#f0f2f2]" />
                  <div className="h-3 w-2/3 rounded bg-[#f0f2f2]" />
                  <div className="h-6 w-24 rounded bg-[#e3e6e6]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
