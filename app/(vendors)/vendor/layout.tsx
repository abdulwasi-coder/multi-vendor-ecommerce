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
        <main className="vendor-workspace min-w-0 flex-1">
          <SidebarTrigger className="ml-2 mt-2 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white" />
          {children}
        </main>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
