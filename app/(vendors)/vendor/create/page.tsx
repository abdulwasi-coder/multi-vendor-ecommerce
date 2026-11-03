import { ProductForm } from "@/components/ui/vendor/vendor-product-form";

export default async function CreateProductPage({
  searchParams,
}: PageProps<"/vendor/create">) {
  const { productID } = await searchParams;
  return (
    <ProductForm
      productId={typeof productID === "string" ? productID : undefined}
    />
  );
}
