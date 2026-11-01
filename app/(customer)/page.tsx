import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { HomeCategoryGrid } from "@/components/ui/customer/home-category-grid";
import { prefetchHomeCategories } from "@/Otherfiles/tanstack/home";

export default async function CustomerHomePage() {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();

  await prefetchHomeCategories(queryClient, cookieHeader);

  return (
    <main className="min-h-screen bg-[#fafafa] px-3 pt-50 py-5 text-[#0f1111] sm:px-5 sm:pt-35 lg:px-8">
      <div className="mx-auto max-w-375">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomeCategoryGrid />
        </HydrationBoundary>
      </div>
    </main>
  );
}
