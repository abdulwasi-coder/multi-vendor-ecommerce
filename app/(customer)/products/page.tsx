import ProductCatalogView, {
  type CategoryOption,
  type ProductFeedResponse,
  type ProductSearchParams,
} from "@/components/ui/customer/product-catalog-view";

const PRODUCT_PAGE_SIZE = 20;

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
    new URL(`/user/products?${queryString}`, backendUrl),
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
    !Array.isArray(data.categories) ||
    !Array.isArray(data.selectedCategories) ||
    !Array.isArray(data.brands) ||
    !Array.isArray(data.selectedBrands) ||
    !Array.isArray(data.colors) ||
    !Array.isArray(data.selectedColors) ||
    typeof data.totalProducts !== "number" ||
    typeof data.currentPage !== "number" ||
    typeof data.totalPages !== "number" ||
    typeof data.skipped !== "number" ||
    typeof data.limit !== "number"
  ) {
    throw new Error(data.message ?? "Product results were not returned.");
  }

  return data;
}

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params: ProductSearchParams = await searchParams;
  const query = values(params.q)[0]?.trim().slice(0, 100) ?? "";
  const selectedCategories = values(params.category);
  const selectedBrands = values(params.brand);
  const selectedColors = values(params.color);
  const minPrice = values(params.minPrice)[0] ?? "";
  const maxPrice = values(params.maxPrice)[0] ?? "";
  const minimumRating = Number(values(params.rating)[0] ?? 0);
  const sort = values(params.sort)[0] ?? "featured";
  const requestedPage = Math.max(
    1,
    Math.floor(Number(values(params.page)[0]) || 1),
  );
  let feed: ProductFeedResponse | undefined;
  let loadError: string | undefined;

  try {
    const search = new URLSearchParams({
      page: String(requestedPage),
      limit: String(PRODUCT_PAGE_SIZE),
      sort,
      ...(query ? { search: query } : {}),
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {}),
      ...(minimumRating ? { rating: String(minimumRating) } : {}),
    });
    for (const categoryId of selectedCategories) {
      search.append("category", categoryId);
    }
    for (const brand of selectedBrands) {
      search.append("brand", brand);
    }
    for (const color of selectedColors) {
      search.append("color", color);
    }

    feed = await fetchProductFeed(search.toString());
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load products.";
  }

  const products = feed?.products ?? [];
  const categories: CategoryOption[] = [
    ...(feed?.selectedCategories ?? []),
    ...(feed?.categories ?? []).filter(
      (category) =>
        !feed?.selectedCategories.some(
          (selectedCategory) => selectedCategory.id === category.id,
        ),
    ),
  ];
  const brands = [
    ...new Set([...(feed?.selectedBrands ?? []), ...(feed?.brands ?? [])]),
  ];
  const colors = [
    ...new Set([...(feed?.selectedColors ?? []), ...(feed?.colors ?? [])]),
  ];
  const activeCategoryNames = (feed?.selectedCategories ?? [])
    .map((category) => category.name)
    .join(", ");
  const firstResult = feed && feed.totalProducts > 0 ? feed.skipped + 1 : 0;
  const lastResult = feed
    ? Math.min(feed.skipped + products.length, feed.totalProducts)
    : 0;

  return (
    <ProductCatalogView
      params={params}
      feed={feed}
      loadError={loadError}
      query={query}
      selectedCategories={selectedCategories}
      selectedBrands={selectedBrands}
      selectedColors={selectedColors}
      minPrice={minPrice}
      maxPrice={maxPrice}
      minimumRating={minimumRating}
      sort={sort}
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
