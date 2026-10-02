/** Response types for the multi-vendor API mounted at `/user/products`. */
export type ProductFeedImage = {
  /** The backend currently stores the Cloudinary secure URL in this field. */
  cloudinaryId: string;
  publicId: string;
};

/**
 * Exact shape returned by the current FeedProducts controller.
 * The response currently omits the product name and returns only the first image.
 */
export type ProductFeedItem = {
  id: string;
  price: number;
  stock: number;
  storeSlug: string;
  storeName?: string;
  categoryName: string;
  thumbNailImage?: ProductFeedImage;
};

export type ProductFeedResponse = {
  success: true;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  product: ProductFeedItem[];
};

/** Filters accepted by the current GET /user/products route. */
export type ProductFeedParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  discount?: number;
};

/** Error bodies produced by the existing authentication and error middleware. */
export type ProductApiError = {
  success?: false;
  message: string;
};
