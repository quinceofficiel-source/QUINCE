"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { AddressModal } from "@/components/AddressModal";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/cn";

export function MobileStoreDock() {
  const pathname = usePathname();
  const { itemCount, openCart, isOpen } = useCart();
  const [addressOpen, setAddressOpen] = useState(false);

  if (pathname.startsWith("/checkout") || isOpen) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-2.5 px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
          {itemCount > 0 ? (
            <button
              type="button"
              onClick={openCart}
              className="pointer-events-auto inline-flex h-[52px] items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
              Voir le panier
              <span className="text-white/40">·</span>
              {itemCount}
            </button>
          ) : null}

          <nav
            aria-label="Navigation principale"
            className="pointer-events-auto flex w-full items-center gap-1 rounded-full bg-white/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.16)] ring-1 ring-black/5 backdrop-blur-xl"
          >
            <DockLink href="/" label="Accueil" active={pathname === "/"}>
              <Home className="h-5 w-5" strokeWidth={2.2} />
            </DockLink>
            <button
              type="button"
              onClick={() => setAddressOpen(true)}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink hover:bg-[#f3f3f3]"
              aria-label="Lieu actuel"
            >
              <MapPin className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <Link
              href="/recherche"
              className={cn(
                "flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full px-4 text-sm font-medium",
                pathname.startsWith("/recherche") ? "bg-ink text-white" : "bg-[#eee] text-ink",
              )}
            >
              <Search className="h-4 w-4 shrink-0" strokeWidth={2.2} />
              <span className="truncate">Rechercher</span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink hover:bg-[#f3f3f3]"
              aria-label={itemCount ? `Panier, ${itemCount}` : "Panier"}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
              {itemCount > 0 ? (
                <span className="absolute top-1 right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#06C167] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
            <DockLink href="/compte" label="Compte" active={pathname.startsWith("/compte")}>
              <User className="h-5 w-5" strokeWidth={2.2} />
            </DockLink>
          </nav>
        </div>
      </div>
      <AddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </>
  );
}

function DockLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
        active ? "bg-ink text-white" : "text-ink hover:bg-[#f3f3f3]",
      )}
    >
      {children}
    </Link>
  );
}
