/**
 * Temporary editorial content for the homepage prototype.
 * Replace these records with the product and category API contracts when those exist.
 * These fields are local presentation data, not backend schema.
 */
export type HomeProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  imageAlt: string;
  badge?: string;
  rating?: number;
};

export const categories = [
  {
    name: "Everyday style",
    detail: "Easy pieces, considered well.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Two friends browsing a clothing store",
  },
  {
    name: "Home & living",
    detail: "A little more room to unwind.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Warm, calm contemporary living room",
  },
  {
    name: "Accessories",
    detail: "Finishing touches for every day.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Thoughtfully styled clothing and accessories",
  },
  {
    name: "Beauty & care",
    detail: "Small rituals, made special.",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Skincare products arranged on a clean surface",
  },
];

export const featuredProducts: HomeProduct[] = [
  {
    id: "linen-shirt",
    name: "Classic button-up shirt",
    price: 68,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    imageAlt: "White button-up shirt styled with a dark tie",
    badge: "Bestseller",
    rating: 4.8,
  },
  {
    id: "ceramic-vase",
    name: "Sculptural ceramic vase",
    price: 42,
    image: "https://images.unsplash.com/photo-1526053567686-8678f9f14681?auto=format&fit=crop&w=800&q=85",
    imageAlt: "White ceramic vase beside a window",
    rating: 4.9,
  },
  {
    id: "everyday-tote",
    name: "Woven market bag",
    price: 36,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Bright woven handbag with rounded handles",
    badge: "Popular",
    rating: 4.7,
  },
  {
    id: "daily-moisturizer",
    name: "Restorative hair mask",
    price: 28,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Boxed restorative hair mask",
    rating: 4.8,
  },
];

export const newProducts: HomeProduct[] = [
  {
    id: "weekend-knit",
    name: "Graphic cotton tee",
    price: 74,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85",
    imageAlt: "White graphic cotton t-shirt",
    badge: "Just added",
    rating: 4.6,
  },
  {
    id: "glass-carafe",
    name: "Handblown glass carafe",
    price: 54,
    image: "https://images.unsplash.com/photo-1774296479033-d4c903a2912c?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Coffee brewing in a glass carafe",
    badge: "Just added",
  },
  {
    id: "leather-crossbody",
    name: "Structured leather handbag",
    price: 112,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Red structured leather handbag on display",
    badge: "Just added",
    rating: 4.7,
  },
  {
    id: "botanical-wash",
    name: "Botanical face oil",
    price: 24,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Amber bottle of botanical face oil",
    badge: "Just added",
  },
];
