export type Product = {
  id: string;
  name: string;
  description: string;
  brand: string;
  categoryID: string;
  stock: number;
  price: number;
  discount: number;
  color: string;
  images: string[];
  attributes: string;
};

export const products: Product[] = [
  {
    id: "BT-1042",
    name: "Everyday Canvas Tote",
    description: "A sturdy, thoughtfully made carry-all for everyday errands and weekend plans.",
    brand: "Bon Ton Studio",
    categoryID: "Bags & accessories",
    stock: 42,
    price: 48,
    discount: 10,
    color: "Natural / ink",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=85",
    ],
    attributes: "Material: 12 oz cotton canvas\nDimensions: 38 × 42 cm\nCare: Spot clean",
  },
  {
    id: "BT-1038",
    name: "Stoneware Pour-over Set",
    description: "Hand-finished stoneware brewer and matching cup for a slower morning ritual.",
    brand: "Field House",
    categoryID: "Home & kitchen",
    stock: 18,
    price: 86,
    discount: 0,
    color: "Warm white",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
    ],
    attributes: "Material: Stoneware\nPieces: 2\nDishwasher safe: Yes",
  },
  {
    id: "BT-1021",
    name: "Linen Table Runner",
    description: "Soft washed European linen with an easy, relaxed drape.",
    brand: "Sunday Linen",
    categoryID: "Home & kitchen",
    stock: 7,
    price: 64,
    discount: 15,
    color: "Sage",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85",
    ],
    attributes: "Material: 100% linen\nDimensions: 45 × 180 cm",
  },
];
