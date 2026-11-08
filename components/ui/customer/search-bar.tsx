"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import api from "@/lib/axios";

interface SuggestionProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  images: string[];
}

interface SearchResponse {
  success: boolean;
  products?: SuggestionProduct[];
}

const SUGGESTION_LIMIT = 6;
const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedQuery(query.trim()),
      DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    api
      .get<SearchResponse>("/user/search", {
        params: { q: debouncedQuery, limit: SUGGESTION_LIMIT },
        signal: controller.signal,
      })
      .then((response) => {
        setSuggestions(response.data.products ?? []);
        setIsOpen(true);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function submitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  }

  const showDropdown =
    isOpen && debouncedQuery.length >= MIN_QUERY_LENGTH && query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div ref={containerRef} className="relative order-3 flex h-10 min-w-0 flex-[1_1_100%] sm:order-0 sm:h-11 sm:flex-1">
      <form
        role="search"
        className="flex h-full min-w-0 flex-1 overflow-hidden rounded-l-md bg-white focus-within:ring-2 focus-within:ring-[#f3a847]"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch(query);
        }}
      >
        <label htmlFor="marketplace-search" className="sr-only">
          Search products
        </label>
        <input
          id="marketplace-search"
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="marketplace-search-suggestions"
          aria-autocomplete="list"
          placeholder="Search Marketly"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          className="min-w-0 flex-1 border-0 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 sm:px-4"
        />
      </form>
      <button
        type="button"
        aria-label="Search"
        onClick={() => submitSearch(query)}
        className="grid h-full w-11 shrink-0 place-items-center rounded-r-md bg-[#f3a847] text-[#131921] transition hover:bg-[#f7bd68] sm:w-14"
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="size-5" aria-hidden="true" />
        )}
      </button>

      {showDropdown && (
        <div
          id="marketplace-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-lg"
        >
          {suggestions.length === 0 && !isLoading ? (
            <p className="px-4 py-3 text-sm text-zinc-500">
              No products found for &quot;{debouncedQuery}&quot;
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((product) => {
                const salePrice = product.price * (1 - product.discount / 100);
                const image = product.images[0];
                return (
                  <li key={product.id} role="option" aria-selected="false">
                    <Link
                      href={`/products?q=${encodeURIComponent(product.name)}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 transition hover:bg-zinc-50"
                    >
                      <span className="relative size-10 shrink-0 overflow-hidden rounded bg-zinc-100">
                        {image ? (
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {product.name}
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                          {product.brand}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold">
                        {formatPrice(salePrice)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href={`/products?q=${encodeURIComponent(debouncedQuery)}`}
            onClick={() => setIsOpen(false)}
            className="block border-t border-zinc-100 px-4 py-2.5 text-sm font-semibold text-[#c45500] transition hover:bg-zinc-50"
          >
            See all results for "{debouncedQuery}"
          </Link>
        </div>
      )}
    </div>
  );
}
