export default function TopRatedLoading() {
  return (
    <main className="min-h-screen bg-white pb-14 pt-40 text-[#0f1111] sm:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex gap-2 overflow-hidden border-b border-[#d5d9d9] px-4 py-4 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-10 w-32 shrink-0 animate-pulse rounded-md bg-[#f0f2f2]" />
          ))}
        </div>
        <div className="grid gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[225px_minmax(0,1fr)] lg:px-8 lg:py-7">
          <aside className="hidden space-y-4 lg:block">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-[#e3e6e6]" />
                <div className="h-3 w-full animate-pulse rounded bg-[#f0f2f2]" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-[#f0f2f2]" />
              </div>
            ))}
          </aside>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="animate-pulse rounded-lg border border-[#f4f4f4] bg-white p-3">
                <div className="aspect-square rounded-md bg-[#f0f2f2]" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-16 rounded bg-[#e3e6e6]" />
                  <div className="h-3.5 w-full rounded bg-[#e3e6e6]" />
                  <div className="h-3 w-2/3 rounded bg-[#f0f2f2]" />
                  <div className="h-5 w-20 rounded bg-[#e3e6e6]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
