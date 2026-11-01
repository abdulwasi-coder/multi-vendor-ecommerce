import { ProductForm } from "@/components/ui/vendor/vendor-product-form";
import { products } from "@/lib/vendor-products";

export default async function CreateProductPage({ searchParams }: PageProps<"/vendor/create">) {

  return <ProductForm/>;
}
