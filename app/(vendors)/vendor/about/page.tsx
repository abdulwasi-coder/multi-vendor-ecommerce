import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  PackageCheck,
  Store,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const principles = [
  {
    icon: HeartHandshake,
    title: "Trusted shopping",
    description: "Helpful service and accurate product information make it easier for customers to shop with confidence.",
  },
  {
    icon: BadgeCheck,
    title: "Quality listings",
    description: "Clear photos, descriptions, and stock details help each product make a strong first impression.",
  },
  {
    icon: PackageCheck,
    title: "Reliable fulfillment",
    description: "Keep orders moving and customers informed from checkout through delivery.",
  },
];

const steps = [
  { number: "01", title: "Build your storefront", description: "Add your store details and tell customers what you offer." },
  { number: "02", title: "List your products", description: "Create clear listings and keep prices and stock up to date." },
  { number: "03", title: "Manage each order", description: "Review new orders and prepare them for delivery." },
];

export default function VendorAboutPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-6 bg-muted/20 px-4 py-7 sm:px-7 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Store management / About</p>
          <h1 className="text-3xl font-semibold tracking-tight">About Bon Ton</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Learn about the marketplace and the simple tools that help your store serve customers.
          </p>
        </div>
        <Link href="/vendor/profile" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
          View your store profile <ArrowRight className="size-4" />
        </Link>
      </header>

      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="border-b bg-background sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="size-5" />
            </span>
            <div className="space-y-1.5">
              <CardTitle className="text-xl">A marketplace for independent stores</CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-6">
                Bon Ton connects customers with products from a community of vendors. Your store has a place to present its catalog, receive orders, and build relationships with returning customers. The vendor dashboard brings everyday store tasks together in one place.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 bg-background p-5 sm:grid-cols-3 sm:p-6">
          {principles.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border bg-muted/20 p-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm"><Icon className="size-4" /></span>
              <h2 className="mt-3 text-sm font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="space-y-3" aria-labelledby="seller-steps-title">
        <div>
          <h2 id="seller-steps-title" className="text-lg font-semibold tracking-tight">How selling works</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use your vendor tools to keep the store running smoothly.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="gap-3 py-5 shadow-sm">
              <CardHeader className="px-5">
                <CardDescription className="font-semibold tracking-wider text-primary">{step.number}</CardDescription>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 text-sm leading-5 text-muted-foreground">{step.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-semibold">Ready to manage your store?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Open your catalog or return to the vendor dashboard.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/vendor/products" className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted">
              Products <ArrowRight className="size-4" />
            </Link>
            <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              Dashboard <ArrowRight className="size-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
