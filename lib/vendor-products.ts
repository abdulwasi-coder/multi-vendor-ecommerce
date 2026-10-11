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
    images: [],
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
    images: [],
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
    images: [],
    attributes: "Material: 100% linen\nDimensions: 45 × 180 cm",
  },
];
