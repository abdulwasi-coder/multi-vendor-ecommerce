import { ProductForm } from "@/components/vendor-product-form";
import { products } from "@/lib/vendor-products";

export default async function CreateProductPage({ searchParams }: PageProps<"/vendor/create">) {
  const query = await searchParams;
  const product = typeof query.productID === "string" ? products.find((item) => item.id === query.productID) : undefined;
  return <ProductForm product={product} />;
}
