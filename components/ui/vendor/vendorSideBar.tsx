"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  PackagePlus,
  Truck,
  Info,
  Store,
} from "lucide-react";
import { LogoutButton } from "@/components/ui/logout-button";

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
  const storeImage = profile?.Companyimage?.publicId;

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
      className="vendor-sidebar-surface text-slate-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <SidebarHeader className="border-b border-sky-100/15! px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.06] hover:text-white"
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
                  <Store className="size-5 text-sky-300" aria-hidden="true" />
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
          <SidebarGroupLabel className="text-slate-300/80 text-[10px] font-semibold tracking-[0.16em] uppercase">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="vendor-sidebar-link flex items-center gap-1.5 rounded-xl transition-colors duration-150 hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-sky-300/10 data-[active=true]:text-sky-100 data-[active=true]:shadow-[inset_2px_0_0_#8ab8e8]"
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
          <SidebarGroupLabel className="text-slate-300/80 text-[10px] font-semibold tracking-[0.16em] uppercase">
            Create Product
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createitems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="vendor-sidebar-link flex items-center gap-1.5 rounded-xl transition-colors duration-150 hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-sky-300/10 data-[active=true]:text-sky-100 data-[active=true]:shadow-[inset_2px_0_0_#8ab8e8]"
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
            <LogoutButton variant="sidebar" />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.06] hover:text-white"
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
