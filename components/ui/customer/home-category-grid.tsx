"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  useHomeCategories,
  type HomeCategory,
  type HomeCategoryChild,
} from "@/Otherfiles/tanstack/home";

interface CategoryGroup {
  name: string;
  root: HomeCategory;
  categories: HomeCategoryChild[];
}

function categoryGroups(categories: HomeCategory[]): CategoryGroup[] {
  return categories.map((root) => ({
    name: root.name,
    root,
    categories: root.children,
  }));
}

function categoryImageUrl(category: HomeCategoryChild) {
  const imageUrl = category.Image?.publicId;
  if (typeof imageUrl !== "string" || !/^https?:\/\//i.test(imageUrl)) {
    return undefined;
  }

  return imageUrl.replace("w_400", "w_800").replace("h_400", "h_800");
}

function categoryHref(id: string) {
  return `/products?${new URLSearchParams({ category: id }).toString()}`;
}

export function HomeCategoryGrid() {
  const query = useHomeCategories();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (
      !target ||
      !query.hasNextPage ||
      query.isFetchingNextPage ||
      query.isFetchNextPageError
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void query.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    query.fetchNextPage,
    query.hasNextPage,
    query.isFetchNextPageError,
    query.isFetchingNextPage,
  ]);

  if (query.isPending) {
    return <p role="status">Loading categories...</p>;
  }

  if (query.isError && !query.data) {
    return <p role="alert">Categories could not be loaded.</p>;
  }

  const categories =
    query.data?.pages.flatMap((page) => page.categories) ?? [];
  const groups = categoryGroups(categories);

  return (
    <>
      {query.isError && !query.isFetchNextPageError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          Could not refresh categories. Showing the cached categories.
        </p>
      )}
      {groups.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {groups.map((group) => (
            <section
              key={group.root?._id}
              className="rounded-2xl border bg-white p-3 sm:p-4"
            >
              <div className="mb-1">
                <h2 className="text-lg font-bold leading-7">
                  {group.root ? (
                    <Link
                      href={categoryHref(group.root._id)}
                      className="hover:text-[#c45500]"
                    >
                      {group.name}
                    </Link>
                  ) : (
                    group.name
                  )}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {group.categories.map((category) => {
                  const imageUrl = categoryImageUrl(category);

                  return (
                    <Link
                      key={category._id}
                      href={categoryHref(category._id)}
                      className="group min-w-0 text-sm text-[#0f1111] hover:text-[#c45500]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f4f4f4]">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={category.name}
                            loading="eager"
                            fill
                            sizes="(max-width: 639px) 44vw, (max-width: 1279px) 22vw, 14vw"
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-xs text-[#565959]">
                            No image
                          </span>
                        )}
                      </div>
                      <span className="mt-2 block leading-5">{category.name}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p>No categories are available.</p>
      )}
      {query.isFetchNextPageError && (
        <div className="mt-4 text-center">
          <p role="alert" className="mb-2 text-sm text-red-700">
            Could not load more categories.
          </p>
          <button
            type="button"
            onClick={() => void query.fetchNextPage()}
            className="text-sm font-medium text-[#007185] hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      {query.isFetchingNextPage && (
        <p role="status" className="mt-4 text-center text-sm text-[#565959]">
          Loading more categories...
        </p>
      )}
      {query.hasNextPage && !query.isFetchNextPageError && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
      )}
    </>
  );
}
