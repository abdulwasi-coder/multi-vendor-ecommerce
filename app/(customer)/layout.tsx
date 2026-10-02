import { StoreHeader } from "@/components/store-header";
import { StoreFooter } from "@/components/store-footer";

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><StoreHeader />{children}<StoreFooter /></>;
}
