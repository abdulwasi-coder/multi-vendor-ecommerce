import api from "@/lib/axios";
import type {
  AdminDashboard, AdminOrderFeed, ApiMessage, AuthCredentials, BalanceFeed,
  Category, CategoryFeed, SignupInput, VendorFeed, VendorProfileResponse,
} from "@/types/platform";

export const authApi = {
  signup: (input: SignupInput) => api.post<ApiMessage>("/authentication/createAccount", input).then(({ data }) => data),
  login: (input: AuthCredentials) => api.post<ApiMessage>("/authentication/login", input).then(({ data }) => data),
  logout: () => api.post<ApiMessage>("/authentication/logout").then(({ data }) => data),
  forgotPassword: (email: string) => api.post<ApiMessage>("/authentication/forgetpassword", { email }).then(({ data }) => data),
};

export const categoryApi = {
  list: () => api.get<CategoryFeed>("/admin/getAllCategories").then(({ data }) => data),
  create: (input: { name: string; parentCategory?: string; attributes?: string[] }) => api.post<{ success: boolean; category: Category; message?: string }>("/admin/createCategory", input).then(({ data }) => data),
};

export const vendorApi = {
  register: (body: FormData) => api.post<ApiMessage>("/vendor/register", body).then(({ data }) => data),
  profile: () => api.get<VendorProfileResponse>("/vendor/getProfile").then(({ data }) => data),
};

export const adminApi = {
  dashboard: () => api.get<AdminDashboard>("/admin/getAdminDashboard").then(({ data }) => data),
  vendors: (page = 1, status = "pending") => api.get<VendorFeed>("/admin/getVendors", { params: { page, limit: 20, status } }).then(({ data }) => data),
  approveVendor: (id: string, userId: string) => api.post<ApiMessage>(`/admin/approaveVendor/${encodeURIComponent(id)}`, { userId }).then(({ data }) => data),
  orders: (page = 1) => api.get<AdminOrderFeed>("/admin/getAdminOrderFeed", { params: { page, limit: 20 } }).then(({ data }) => data),
  balances: (page = 1) => api.get<BalanceFeed>("/admin/getVendorBalanceLedger", { params: { page, limit: 20 } }).then(({ data }) => data),
};
