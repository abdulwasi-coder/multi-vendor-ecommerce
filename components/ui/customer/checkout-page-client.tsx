"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Banknote, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useCustomerCart } from "@/lib/customer-cart-store";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type PaymentMethod = "Stripe_Card" | "COD";

const inputClass =
  "h-11 w-full rounded-md border border-[#d5d9d9] bg-white px-3 text-sm text-[#0f1111] outline-none transition focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/20 placeholder:text-[#999]";

export function CheckoutPageClient() {
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Stripe_Card");
  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const items = useCustomerCart((state) => state.items);
  const hydrated = useCustomerCart((state) => state.hydrated);
  const cartLines = items.filter((item) => item.product);
  const itemCount = cartLines.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartLines.reduce(
    (total, item) => total + item.product.price * (1 - item.product.discount / 100) * item.quantity,
    0,
  );

  const setField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (!hydrated) {
    return (
      <main className="min-h-[60vh] bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-375">
          <div className="h-10 w-64 animate-pulse rounded bg-white" />
          <div className="mt-5 h-96 animate-pulse rounded bg-white" />
        </div>
      </main>
    );
  }

  if (cartLines.length === 0) {
    return (
      <main className="min-h-[60vh] bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-375 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold text-[#0f1111]">Nothing to check out</h1>
          <p className="mt-2 text-[#565959]">Your cart is empty.</p>
          <Button render={<Link href="/products" />} className="mt-6 h-11 rounded-full bg-[#ffd814] px-7 text-[#0f1111] hover:bg-[#f7ca00]">
            Explore products
          </Button>
        </div>
      </main>
    );
  }

  const handleSubmit = async () => {
    if (!form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.country.trim()) {
      toast.error("Please fill in phone, address, city and country.");
      return;
    }
    setPlacing(true);
    try {
      const response = await api.post("/checkout", {
        shippingAddress: {
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          postalCode: form.postalCode.trim() || undefined,
        },
        CartItems: cartLines.map((item) => ({
          productID: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
      });

      if (paymentMethod === "Stripe_Card") {
        const url = response.data?.url;
        if (url) {
          window.location.href = url;
          return;
        }
        toast.error("Could not start checkout. Please try again.");
      } else {
        useCustomerCart.setState({ items: [] });
        toast.success("Order placed! Pay on delivery.");
        router.push("/orders");
      }
    } catch (error) {
      const apiMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(
        apiMessage ?? (error instanceof Error ? error.message : "Checkout failed. Please try again."),
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-[60vh] bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-375">
        <h1 className="text-3xl font-normal tracking-tight text-[#0f1111] sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-[#565959]">
          <Link href="/cart" className="text-[#007185] hover:text-[#c45500] hover:underline">
            Back to cart
          </Link>
        </p>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-5">
            <section className="bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-[#0f1111]">Shipping address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-[#0f1111]">Phone *</span>
                  <input className={inputClass} type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={setField("phone")} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-[#0f1111]">Street address *</span>
                  <input className={inputClass} type="text" placeholder="123 Main St, Apt 4" value={form.address} onChange={setField("address")} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-[#0f1111]">City *</span>
                  <input className={inputClass} type="text" placeholder="New York" value={form.city} onChange={setField("city")} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-[#0f1111]">Postal code</span>
                  <input className={inputClass} type="text" placeholder="10001" value={form.postalCode} onChange={setField("postalCode")} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-[#0f1111]">Country *</span>
                  <input className={inputClass} type="text" placeholder="United States" value={form.country} onChange={setField("country")} />
                </label>
              </div>
            </section>

            <section className="bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-[#0f1111]">Payment method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Stripe_Card")}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition ${
                    paymentMethod === "Stripe_Card" ? "border-[#007185] bg-[#f0f7fa]" : "border-[#d5d9d9] hover:border-[#999]"
                  }`}
                >
                  <CreditCard className="size-6 shrink-0 text-[#007185]" />
                  <span>
                    <span className="block text-sm font-semibold text-[#0f1111]">Card</span>
                    <span className="block text-xs text-[#565959]">Visa, Mastercard via Stripe</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition ${
                    paymentMethod === "COD" ? "border-[#007185] bg-[#f0f7fa]" : "border-[#d5d9d9] hover:border-[#999]"
                  }`}
                >
                  <Banknote className="size-6 shrink-0 text-[#007185]" />
                  <span>
                    <span className="block text-sm font-semibold text-[#0f1111]">Cash on delivery</span>
                    <span className="block text-xs text-[#565959]">Pay when your order arrives</span>
                  </span>
                </button>
              </div>
            </section>
          </div>

          <aside className="bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#0f1111]">
              Order summary <span className="text-sm font-normal text-[#565959]">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            </h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
              {cartLines.map(({ product, quantity }) => {
                const unitPrice = product.price * (1 - product.discount / 100);
                return (
                  <li key={product.id} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-[#f7f7f7]">
                      {product.image && <Image src={product.image} alt={product.name} fill sizes="56px" className="object-contain p-1" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#0f1111]">{product.name}</p>
                      <p className="text-xs text-[#565959]">Qty: {quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#0f1111]">{currency.format(unitPrice * quantity)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-[#ddd] pt-4">
              <p className="flex justify-between text-sm text-[#565959]">
                <span>Subtotal</span>
                <span>{currency.format(subtotal)}</span>
              </p>
              <p className="mt-1 flex justify-between text-sm text-[#565959]">
                <span>Shipping</span>
                <span>Calculated by seller</span>
              </p>
              <p className="mt-3 flex justify-between text-lg font-bold text-[#0f1111]">
                <span>Total</span>
                <span>{currency.format(subtotal)}</span>
              </p>
            </div>
            <Button
              className="mt-5 h-11 w-full rounded-full bg-[#ffd814] text-sm font-medium text-[#0f1111] shadow-sm hover:bg-[#f7ca00] disabled:opacity-60"
              disabled={placing}
              onClick={handleSubmit}
            >
              {placing
                ? paymentMethod === "Stripe_Card"
                  ? "Redirecting to Stripe..."
                  : "Placing order..."
                : paymentMethod === "Stripe_Card"
                  ? "Pay with card"
                  : "Place order"}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#565959]">
              <LockKeyhole className="size-3.5" /> Secure checkout
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
