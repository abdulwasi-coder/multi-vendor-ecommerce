import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Box,
  Package,
  Pencil,
  Star,
  StarHalf,
  Store,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VendorProductGallery } from "@/components/ui/vendor/vendor-product-gallery";
import { products } from "@/lib/vendor-products";

interface paramprop {
  params: Promise<{ productID: string }>;
}

export default async function VendorProductDetailPage({ params }: paramprop) {
  const { productID } = await params;
  const product = products.find((item) => item.id === productID);
  if (!product) notFound();

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-4 border-b pb-4">
          <div className="min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="mb-1 h-7 -ml-2 text-muted-foreground"
              render={<Link href="/vendor/products" />}
            >
              <ArrowLeft /> Products
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {product.name}
              </h1>
              <Badge variant="outline" className="font-mono">
                {product.id}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.brand}
              <span className="mx-2">/</span>
              {product.categoryID}
            </p>
          </div>
          <Button
            render={<Link href={`/vendor/create?productID=${product.id}`} />}
          >
            <Pencil /> Edit product
          </Button>
        </header>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <div className="space-y-4">
            <div className="h-[min(48vh,400px)] min-h-70 md:h-[min(50vh,460px)] md:min-h-[95vh]">
              <VendorProductGallery
                images={product.images}
                name={product.name}
                discount={product.discount}
                sku={product.vendorCompanyName}
              />
            </div>
          </div>

          <div>
            <div className=" py-4 border-y flex flex-col gap-2">
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-sm">{product.name}</span>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  visit the {product.vendorCompanyName}
                </span>
                <div className="flex gap-0.5 text-[10px] items-center">
                  {product.rating}
                  {Array.from({ length: 4 }, (_, index) => (
                    <Star
                      key={index}
                      size={12}
                      className="fill-orange-500 text-orange-500"
                    />
                  ))}
                  <StarHalf
                    size={12}
                    className="fill-orange-500 text-orange-500"
                  />
                  ({product.reviewCount})
                </div>
              </div>
            </div>
         
            <div className="flex py-2 flex-col border-y gap-1">
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">ID:</span>
                  <span>{product.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Price:</span>
                  <span>${product.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">color:</span>
                  <span>{product.color}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">brand:</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">discount:</span>
                  <span>{product.discount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Category:</span>
                  <span>Shopping</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">stock:</span>
                  <span>{product.stock}</span>
                </div>
              </div>
            </div>
            <div className="flex py-2 flex-col border-y gap-1">
              <div className="flex flex-col gap-3 text-xs">
                <span className="font-semibold text-sm">About The Item</span>
                   <span className="text-gray-500">{product.description}</span>
              </div>
            </div>
            <Button className="my-3">Edit Product</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
