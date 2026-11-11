import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorProductGallery } from "@/components/ui/vendor/vendor-product-gallery";

interface ProductAttribute {
  key: string;
  value: unknown;
}

interface ProductImage {
  publicId: string;
}

interface CustomerProductDetails {
  success: boolean;
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  attributes: ProductAttribute[];
  images: ProductImage[];
  category: { name: string };
  store: {
    name: string;
    storeDescription?: string;
    Companyimage?: string;
  };
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatAttributeValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value ?? "");
}

interface paramprop {
  params: Promise<{ id: string }>;
}

export default async function CustomerProductDetailPage({
  params,
}: paramprop) {
  const { id } = await params;
  const backendUrl = process.env.Base_Url;
  if (!backendUrl) notFound();

  let response: Response;
  let data: CustomerProductDetails;
  try {
    response = await fetch(new URL(`/user/products/${id}`, backendUrl), {
      next: { revalidate: 60, tags: ["customer-product-feed"] },
    });
    data = (await response.json()) as CustomerProductDetails;
  } catch {
    notFound();
  }

  if (!response!.ok || !data!.success) notFound();

  const productImages = (data.images ?? []).map((image) => image.publicId);

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-4 border-b pb-4">
          <div className="min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="mb-1 h-7 -ml-2 text-muted-foreground"
              render={<Link href="/products" />}
            >
              <ArrowLeft /> Products
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {data.name}
              </h1>
              <Badge variant="outline" className="font-mono">
                {data.sku}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.category?.name}
            </p>
          </div>
        </header>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <div className="h-[min(48vh,400px)] min-h-70 md:h-[min(50vh,460px)] md:min-h-[95vh]">
            <VendorProductGallery
              images={productImages}
              name={data.name}
              discount={0}
              sku={data.sku}
            />
          </div>

          <div>
            <div className="flex flex-col gap-1 border-y py-4">
              <span className="text-2xl font-semibold">
                {formatPrice(data.price)}
              </span>
              <span className="text-sm text-muted-foreground">
                {data.stock > 0 ? `${data.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {data.attributes?.length > 0 && (
              <div className="flex flex-col gap-1 border-y py-4">
                <span className="text-sm font-semibold">Specifications</span>
                <dl className="flex flex-col gap-1.5 text-xs">
                  {data.attributes.map((attribute) => (
                    <div
                      key={attribute.key}
                      className="flex items-center justify-between gap-4"
                    >
                      <dt className="capitalize text-muted-foreground">
                        {attribute.key.replaceAll("_", " ")}
                      </dt>
                      <dd className="text-right font-medium">
                        {formatAttributeValue(attribute.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="flex flex-col gap-3 border-y py-4">
              <span className="text-sm font-semibold">About The Item</span>
              <p className="whitespace-pre-wrap wrap-break-word text-sm text-muted-foreground">
                {data.description}
              </p>
            </div>

            {data.store?.name && (
              <div className="mt-4 rounded-lg border p-4">
                <p className="text-sm font-semibold">Sold by {data.store.name}</p>
                {data.store.storeDescription && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {data.store.storeDescription}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
