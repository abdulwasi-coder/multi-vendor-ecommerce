import api from "@/lib/axios";

export type CustomerProfile = { _id?: string; name?: string } | null;

export async function getCustomerProfile(): Promise<CustomerProfile> {
  try {
    const response = await api.get("/user/userProfile");
    const result = response.data as {
      success?: boolean;
      userData?: { _id?: string; name?: string };
    };
    return result.success ? (result.userData ?? null) : null;
  } catch {
    return null;
  }
}
