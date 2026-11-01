"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ShoppingCart, Package, PackagePlus, Truck, Info, Store } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useVendorProfile } from "@/Otherfiles/tanstack/vendor-profile";

const navigationItems = [
  { title: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { title: "Products", href: "/vendor/products", icon: Package },
  { title: "Logistics", href: "/vendor/logitics", icon: Truck },
  { title: "About", href: "/vendor/about", icon: Info },
];
const createitems = [
  { title: "Create Product", href: "/vendor/create", icon: PackagePlus },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const profileQuery = useVendorProfile();
  const profile = profileQuery.data;
  const storeImage = [
    profile?.Companyimage?.cloudinaryId,
    profile?.Companyimage?.publicId,
  ].find((value) => typeof value === "string" && /^https?:\/\//i.test(value));

  const handleMouseEnter = () => {
    if (state === "collapsed") {
      setHoverExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    setHoverExpanded(false);
  };

  const handleNavigation = () => {
    setOpenMobile(false);
    setHoverExpanded(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      hoverExpanded={hoverExpanded}
      className="text-slate-400"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <SidebarHeader className="border-b border-slate-800!">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex gap-2 items-center"
              size="lg"
              render={<Link href="/vendor/dashboard" onClick={handleNavigation} />}
            >
              <div className="flex size-8 items-center justify-center rounded-lg">
                {storeImage ? (
                  <Image
                    src={storeImage}
                    height={55}
                    width={50}
                    alt={`${profile?.companyName ?? "Vendor"} store`}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <Store className="size-5" aria-hidden="true" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:grid">
                <span className="truncate font-semibold tracking-wider">
                  {profile?.companyName ?? "Vendor store"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

     
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`flex gap-1.5 items-center transition-all duration-200 ease-in-out `}
                      isActive={isActive}
                      render={
                        <Link
                          onClick={handleNavigation}
                          href={item.href}
                        />
                      }
                    >
                      <item.icon />
                      <div className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:block">
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
            Create Product
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createitems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`flex gap-1.5 items-center transition-all duration-200 ease-in-out `}
                      isActive={isActive}
                      render={
                        <Link
                          onClick={handleNavigation}
                          href={item.href}
                        />
                      }
                    >
                      <item.icon />
                      <div className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:block">
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. BOTTOM: BOSS IMAGE */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex  gap-2 items-center "
              size="lg"
              render={<Link href="/vendor/profile" onClick={handleNavigation} />}
            >
              <div className="flex size-8 items-center justify-center rounded-lg">
                {storeImage ? (
                  <Image
                    src={storeImage}
                    height={800}
                    width={800}
                    alt={`${profile?.companyName ?? "Vendor"} store`}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <Store className="size-5" aria-hidden="true" />
                )}
              </div>

              <span className="truncate group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:inline font-semibold hover: tracking-wider">
                {profile
                  ? `${profile.name} ${profile.lastName}`.trim()
                  : profileQuery.isPending
                    ? "Loading profile..."
                    : "Vendor profile"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
