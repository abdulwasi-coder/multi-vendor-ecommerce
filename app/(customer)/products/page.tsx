import { Suspense } from "react";
import { PageFrame } from "@/components/app-ui";
import { ProductCatalog } from "@/components/product-catalog";

export const metadata = { title: "Shop products | Town Market", description: "Search marketplace products and browse current listings." };
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const params = await searchParams; const value = (key: string) => typeof params[key] === "string" ? params[key] as string : ""; const initial = { page: Number(value("page")) || 1, search: value("search"), minPrice: value("minPrice"), maxPrice: value("maxPrice"), category: value("category"), rating: value("rating"), discount: value("discount") }; return <PageFrame eyebrow="Marketplace" title="Shop all products" description="Search and filter current marketplace listings."><Suspense fallback={<p className="animate-pulse rounded bg-muted p-8">Loading catalog…</p>}><ProductCatalog key={JSON.stringify(initial)} initial={initial} /></Suspense></PageFrame>; }
