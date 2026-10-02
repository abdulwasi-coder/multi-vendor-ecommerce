import api from "@/lib/axios";

export type ProductDetailsResponse = {
  success: boolean;
  id?: string;
  name?: string;
  price?: number;
  stock?: string | number;
  description?: string;
  images?: { cloudinaryId?: string; publicId?: string }[];
  category?: { name?: string; allowedFilters?: string[] };
  store?: { name?: string; slug?: string; storeDescription?: string };
};

export async function getProductById(id: string): Promise<ProductDetailsResponse> {
  const { data } = await api.get<ProductDetailsResponse>(`/user/products/${encodeURIComponent(id)}`);
  if (!data.success || !data.name || typeof data.price !== "number") {
    throw new Error("The product details response is incomplete. The backend detail controller needs a fix.");
  }
  return data;
}
