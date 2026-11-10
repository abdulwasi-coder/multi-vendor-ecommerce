import ProductCatalogView, {
  type CategoryOption,
  type ProductFeedResponse,
  type ProductSearchParams,
} from "@/components/ui/customer/product-catalog-view";


function values(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

async function fetchProductFeed(queryString: string) {
  const backendUrl = process.env.Base_Url;
  if (!backendUrl) {
    throw new Error("The product service is not configured.");
  }

  const response = await fetch(
    new URL(`/user/search?${queryString}`, backendUrl),
    {
      next: { revalidate: 60, tags: ["customer-product-feed"] },
    },
  );
  const data = (await response.json()) as ProductFeedResponse;

  if (!response.ok) {
    throw new Error(
      data.message ?? `Product service returned status ${response.status}.`,
    );
  }

  if (
    !data.success ||
    !Array.isArray(data.products) ||
    (data.selectedCategory != null &&
      typeof data.selectedCategory !== "object") ||
    typeof data.totalProducts !== "number" ||
    typeof data.currentPage !== "number" ||
    typeof data.totalPages !== "number"
  ) {
    throw new Error(data.message ?? "Product results were not returned.");
  }

  return data;
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params: ProductSearchParams = await searchParams;
  let feed: ProductFeedResponse | undefined;
  let loadError: string | undefined;

  try {
    const search = new URLSearchParams();
    for (const [key, paramValue] of Object.entries(params)) {
      for (const entry of values(paramValue)) {
        search.append(key, entry);
      }
    }

    feed = await fetchProductFeed(search.toString());
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load products.";
  }

  const products = feed?.products ?? [];
  const categories: CategoryOption[] = [
    ...(feed?.selectedCategory ? [feed.selectedCategory] : []),
    ...(feed?.categories ?? []).filter(
      (category) => category.id !== feed?.selectedCategory?.id,
    ),
  ];
  const brands = [
    ...new Set([
      ...(feed?.selectedBrands ?? []),
      ...(feed?.selectedCategory?.brands ?? []),
    ]),
  ];
  const colors = [
    ...new Set([...(feed?.selectedColors ?? []), ...(feed?.colors ?? [])]),
  ];
  const activeCategoryNames = feed?.selectedCategory?.name ?? "";
  const firstResult = feed && feed.totalProducts > 0 ? feed.skipped + 1 : 0;
  const lastResult = feed
    ? Math.min(feed.skipped + products.length, feed.totalProducts)
    : 0;

  return (
    <ProductCatalogView
      params={params}
      feed={feed}
      loadError={loadError}
      products={products}
      categories={categories}
      brands={brands}
      colors={colors}
      activeCategoryNames={activeCategoryNames}
      firstResult={firstResult}
      lastResult={lastResult}
    />
  );
}
