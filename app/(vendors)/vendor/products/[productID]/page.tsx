import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorProductGallery } from "@/components/ui/vendor/vendor-product-gallery";
import api from "@/lib/axios";

interface ProductImage {
  cloudinaryId: string;
  publicId: string;
}

interface VendorProductDetails {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  colors: string[];
  categoryID: string;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
}

interface paramprop {
  params: Promise<{ productID: string }>;
}

export default async function VendorProductDetailPage({ params }: paramprop) {
  const { productID } = await params;
  const cookieHeader = (await cookies()).toString();
  let product: VendorProductDetails;

  try {
    const response = await api.get<{
      success: boolean;
      product?: VendorProductDetails;
    }>(`/vendor/readProduct/${productID}`, {
      headers: { Cookie: cookieHeader },
    });
    if (!response.data.success || !response.data.product) notFound();
    product = response.data.product;
  } catch {
    notFound();
  }

  const productImages = product.images.map((image) => image.publicId);

  return (
    <main className="vendor-dashboard-surface min-h-[calc(100dvh-3.5rem)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="mb-1 h-7 -ml-2 text-muted-foreground"
              render={<Link href="/vendor/products" />}
              nativeButton={false}
            >
              <ArrowLeft /> Products
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                {product.name}
              </h1>
              <Badge variant="outline" className="font-mono">
                {product.sku}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.brand}
              <span className="mx-2">/</span>
              {product.categoryID}
            </p>
          </div>
          <Button className="bg-sky-400 text-slate-950 hover:bg-sky-300" render={<Link href={`/vendor/create?productID=${product._id}`} />} nativeButton={false}>
            Edit product
          </Button>
        </header>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] xl:gap-8">
          <div className="lg:sticky lg:top-20">
            <div className="h-[min(72vh,680px)] min-h-[440px] rounded-2xl border border-sky-300/20 bg-[#243d5e] p-4 shadow-xl shadow-blue-950/20">
              <VendorProductGallery
                images={productImages}
                name={product.name}
                discount={product.discount}
                sku={product.sku}
              />
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-sky-300/15 bg-[#1e3350] p-5 shadow-lg shadow-blue-950/15 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/10 pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">Product details</h2>
                </div>
                <Badge variant="outline" className="border-amber-400/20 bg-amber-400/10 text-amber-300">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)} <span className="text-muted-foreground">({product.reviewCount})</span>
                </Badge>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-6 text-sm">
                <div className="col-span-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-sky-200/10 py-3 sm:col-span-1">
                  <dt className="w-20 shrink-0 text-xs text-muted-foreground">Price</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-sky-200">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                    {product.discount > 0 && <><span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span><span className="text-xs font-medium text-rose-300">{product.discount}% off</span></>}
                  </dd>
                </div>
                <div className="flex items-baseline gap-2 border-b border-sky-200/10 py-2.5"><dt className="w-20 shrink-0 text-xs text-muted-foreground">Stock</dt><dd className="font-medium text-slate-100">{product.stock} units</dd></div>
                <div className="flex items-baseline gap-2 border-b border-sky-200/10 py-2.5"><dt className="w-20 shrink-0 text-xs text-muted-foreground">Brand</dt><dd className="truncate font-medium text-slate-100">{product.brand || "Not specified"}</dd></div>
                <div className="flex items-baseline gap-2 border-b border-sky-200/10 py-2.5"><dt className="w-20 shrink-0 text-xs text-muted-foreground">Category</dt><dd className="truncate font-medium text-slate-100">{product.categoryID || "Not specified"}</dd></div>
                <div className="flex items-baseline gap-2 border-b border-sky-200/10 py-2.5"><dt className="w-20 shrink-0 text-xs text-muted-foreground">SKU</dt><dd className="truncate font-mono text-xs text-slate-200">{product.sku}</dd></div>
                <div className="col-span-2 flex items-baseline gap-2 border-b border-sky-200/10 py-2.5"><dt className="w-20 shrink-0 text-xs text-muted-foreground">Colors</dt><dd className="font-medium text-slate-100">{product.colors.length ? product.colors.join(", ") : "Not specified"}</dd></div>
                <div className="col-span-2 flex items-baseline gap-2 border-b border-sky-200/10 py-2.5"><dt className="w-20 shrink-0 text-xs text-muted-foreground">Product ID</dt><dd className="truncate font-mono text-xs text-slate-300" title={product._id}>{product._id}</dd></div>
              </dl>

              <div className="mt-3 pt-1">
                <h3 className="text-sm font-semibold text-slate-100">Description</h3>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                  {product.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
