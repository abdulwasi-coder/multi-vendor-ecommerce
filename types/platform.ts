export type ApiMessage = { success?: boolean; message?: string; user?: string };

export type AuthCredentials = { email: string; password: string };
export type SignupInput = AuthCredentials & { name: string };
export type Category = {
  _id: string;
  name: string;
  parentCategory?: { _id: string; name: string } | string | null;
  attributes?: string[];
};
export type CategoryFeed = { success: boolean; count: number; categories: Category[] };
export type VendorRecord = {
  _id: string;
  userid: { _id: string; email: string; isEmailVerified?: boolean } | string;
  name: string;
  lastName: string;
  companyName: string;
  country: string;
  mobilenumber: string;
  storeDescription: string;
  storeSlug: string;
  status: string;
  Companyimage?: { cloudinaryId?: string; publicId?: string };
};
export type VendorFeed = { success: boolean; currentPage?: number; cuurentPage?: number; totalPages: number; totalVendors: number; vendors: VendorRecord[] };
export type AdminDashboard = {
  success: boolean;
  summary: {
    grossMerchandizeValue: number;
    activeVendorCount: number;
    PlatformRevenue: number;
    registeredCustomerCount: number;
  };
  chartData?: unknown;
};
export type AdminOrder = {
  _id: string;
  customerID?: { _id: string; name?: string; email?: string };
  totalPrice?: number;
  paymentStatus?: string;
  createdAt?: string;
};
export type AdminOrderFeed = { success: boolean; currentPage: number; totalPages: number; totalOrders: number; orders: AdminOrder[] };
export type BalanceEntry = {
  vendorID: string;
  BusinessName: string;
  grossSales: number;
  vendorPayoutBalance: number;
  platfromRevenue: number;
};
export type BalanceFeed = { success: boolean; currentPage: number; totalPages: number; totalVendors: number; vendorsData: BalanceEntry[] };
export type VendorProfileResponse = { success: boolean; vendor: VendorRecord };
