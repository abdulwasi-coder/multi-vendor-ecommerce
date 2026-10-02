import { PageFrame } from "@/components/app-ui";
import { CheckoutReview } from "@/components/checkout-review";
export default function CheckoutRoute() { return <PageFrame eyebrow="Checkout" title="Delivery and payment" description="Review your address, payment method, and order items."><CheckoutReview /></PageFrame>; }
