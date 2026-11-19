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
          <div className="sticky top-0 z-20 flex h-14 items-center border-b border-sky-200/10 bg-[#0e1729]/95 px-4 backdrop-blur-sm">
            <SidebarTrigger
              aria-label="Toggle navigation sidebar"
              className="size-9 rounded-lg border border-sky-200/15 bg-[#15233a] text-slate-300 shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-sky-200/25 hover:bg-[#1d3352] hover:text-white hover:shadow-md focus-visible:ring-sky-400/50 [&_svg]:size-4"
            />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
