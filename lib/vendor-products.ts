export type Product = {
  id: string;
  vendorID: string;
  vendorCompanyName: string;
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
  rating: number;
  reviewCount: number;
};

export const products: Product[] = [
  {
    id: "BT-1042",
    vendorID: "VND-1001",
    vendorCompanyName: "Bon Ton Studio",
    rating: 4.8,
    reviewCount: 126,
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
    vendorID: "VND-1002",
    vendorCompanyName: "Field House",
    rating: 4.9,
    reviewCount: 84,
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
    vendorID: "VND-1003",
    vendorCompanyName: "Sunday Linen",
    rating: 4.6,
    reviewCount: 57,
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
  {
    id: "BT-1056",
    vendorID: "VND-1004",
    vendorCompanyName: "Northline Objects",
    rating: 4.7,
    reviewCount: 43,
    name: "Mushroom Table Lamp",
    description: "A compact, warm-glow table lamp with a clean silhouette for desks and bedside tables.",
    brand: "Northline Objects",
    categoryID: "Home & kitchen",
    stock: 24,
    price: 72,
    discount: 12,
    color: "Cream",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85"],
    attributes: "Material: Powder-coated metal\nLight: Warm LED compatible\nStyle: Modern",
  },
  {
    id: "BT-1063",
    vendorID: "VND-1005",
    vendorCompanyName: "Juniper Goods",
    rating: 4.5,
    reviewCount: 29,
    name: "Everyday Leather Card Holder",
    description: "A slim full-grain leather wallet with room for the cards you reach for every day.",
    brand: "Juniper Goods",
    categoryID: "Bags & accessories",
    stock: 31,
    price: 34,
    discount: 0,
    color: "Cognac",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85"],
    attributes: "Material: Full-grain leather\nSlots: 6 card slots\nCare: Wipe clean",
  },
];
