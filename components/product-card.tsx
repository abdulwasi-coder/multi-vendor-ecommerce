import Image from "next/image";
import { Star } from "lucide-react";

import type { HomeProduct } from "@/lib/homepage-content";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: { product: HomeProduct }) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          unoptimized
          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 23vw"
          className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.035]"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-sm bg-background/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3 pt-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-foreground sm:text-base">{product.name}</h3>
          {product.rating ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground" aria-label={`Rated ${product.rating} out of 5`}>
              <Star aria-hidden="true" size={13} className="fill-current" />
              {product.rating.toFixed(1)}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-sm font-medium text-foreground">{currency.format(product.price)}</p>
      </div>
    </article>
  );
}
