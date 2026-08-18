"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DeliveryProvider } from "@/context/DeliveryContext";
import type { DeliveryLocation } from "@/lib/delivery-zones";

const CATEGORY_PATHS = new Set(["/", "/plats", "/favoris", "/recherche", "/composer-ma-box"]);

function showCategories(pathname: string) {
  return CATEGORY_PATHS.has(pathname);
}

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
          {showCategories(pathname) ? (
            <div className="border-b border-line/40 bg-white">
              <div className="mx-auto w-full min-w-0 max-w-[1320px] px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div className="h-[108px]" />}>
                  <CategoryCarousel />
                </Suspense>
              </div>
            </div>
          ) : null}
          <main className="min-w-0 overflow-x-clip">{children}</main>
          <Footer />
          <CartDrawer />
        </>
      )}
    </DeliveryProvider>
  );
}
