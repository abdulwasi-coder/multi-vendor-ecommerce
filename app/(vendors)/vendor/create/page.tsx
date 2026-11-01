import { ProductForm } from "@/components/ui/vendor/vendor-product-form";

export default async function CreateProductPage({ searchParams }: PageProps<"/vendor/create">) {
  return <ProductForm/>;
}
