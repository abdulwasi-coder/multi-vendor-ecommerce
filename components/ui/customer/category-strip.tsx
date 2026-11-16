"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PendingLabel } from "@/components/ui/customer/pending-filter";

type StripItem = { id: string; name: string };

export function CategoryStrip({
  basePath,
  params,
  items,
  selectedId,
  allLabel = "All Departments",
}: {
  basePath: string;
  params: Record<string, string>;
  items: StripItem[];
  selectedId: string;
  allLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: direction * 480,
      behavior: "smooth",
    });
  };

  const hrefFor = (id: string) => {
    const search = new URLSearchParams(params);
    search.delete("page");
    if (id) {
      search.set("category", id);
    } else {
      search.delete("category");
      search.delete("brand");
    }
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const chipClass = (selected: boolean) =>
    `shrink-0 rounded-md border px-5 py-2.5 text-sm ${
      selected
        ? "border-[#007185] bg-[#eaf6f7] font-bold ring-1 ring-[#007185]"
        : "border-[#d5d9d9] font-medium hover:bg-[#f7fafa]"
    }`;

  const arrowClass =
    "grid size-9 shrink-0 place-items-center rounded-full border border-[#d5d9d9] bg-white text-[#0f1111] shadow-sm transition hover:bg-[#f7fafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e77600]";

  return (
    <div
      role="navigation"
      aria-label="Categories"
      className="flex items-center gap-2 border-b border-[#d5d9d9] px-3 py-3 sm:gap-3 sm:px-6 lg:px-8"
    >
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll categories left"
        className={arrowClass}
      >
        <ChevronLeft className="size-5" />
      </button>
      <div
        ref={scrollerRef}
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <Link
          href={hrefFor("")}
          scroll={false}
          aria-current={!selectedId ? "page" : undefined}
          className={chipClass(!selectedId)}
        >
          <PendingLabel>{allLabel}</PendingLabel>
        </Link>
        {items.map((item) => {
          const selected = selectedId === item.id;
          return (
            <Link
              key={item.id}
              href={hrefFor(item.id)}
              scroll={false}
              aria-current={selected ? "page" : undefined}
              className={chipClass(selected)}
            >
              <PendingLabel>{item.name}</PendingLabel>
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll categories right"
        className={arrowClass}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
