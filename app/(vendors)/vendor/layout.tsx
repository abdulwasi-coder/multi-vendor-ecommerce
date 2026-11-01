import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/vendor/vendorSideBar";
import { prefetchVendorProfile } from "@/Otherfiles/tanstack/vendor-profile";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();
  await prefetchVendorProfile(queryClient, cookieHeader);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-w-0 flex-1">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
