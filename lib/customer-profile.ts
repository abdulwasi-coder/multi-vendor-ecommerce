export type CustomerProfile = { _id?: string; name?: string } | null;

export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response = await fetch("/proxy-backend/user/userProfile", {
    credentials: "include",
  });
  if (!response.ok) return null;
  const result = (await response.json()) as {
    success?: boolean;
    userData?: { _id?: string; name?: string };
  };
  return result.success ? (result.userData ?? null) : null;
}
