"use client";

import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DeliveryProvider } from "@/context/DeliveryContext";
import type { DeliveryLocation } from "@/lib/delivery-zones";

export function StoreChrome({
  address,
  children,
}: {
  address: DeliveryLocation | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  const landingHome = pathname === "/" && !address;

  return (
    <DeliveryProvider initial={address}>
      {landingHome ? (
        children
      ) : (
        <>
          <Header />
          <main className="min-w-0 overflow-x-clip">{children}</main>
          <Footer />
          <CartDrawer />
        </>
      )}
    </DeliveryProvider>
  );
}
