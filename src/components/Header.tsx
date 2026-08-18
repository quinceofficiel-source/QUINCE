"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, MapPin, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { AddressModal } from "@/components/AddressModal";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/context/CartContext";
import { useDelivery } from "@/context/DeliveryContext";
import { NAV_LINKS } from "@/data/categories";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";
import { cn } from "@/lib/cn";
import { formatPrice, plural } from "@/lib/format";

type Account = { name: string; email: string };

export function Header() {
  const pathname = usePathname();
  return <HeaderBar key={pathname} />;
}

function HeaderBar() {
  const pathname = usePathname();
  const { itemCount, subtotal, openCart, lastAddedId } = useCart();
  const { location } = useDelivery();
  const [account] = useStoredJson<Account | null>(STORAGE_KEYS.account, null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full min-w-0 max-w-[1320px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo className="min-w-0" />

        {location ? (
          <button
            type="button"
            onClick={() => setAddressOpen(true)}
            className="ml-1 hidden min-w-0 max-w-[280px] items-center gap-2 rounded-full bg-white px-3 py-2 text-left shadow-sm hover:bg-cream-dark sm:inline-flex lg:max-w-[340px]"
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {location.street}
              <span className="text-muted"> · {location.whenLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
          </button>
        ) : null}

        <nav className="ml-2 hidden items-center gap-5 xl:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-ink/80 transition hover:text-ink",
                pathname === link.href && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden min-w-[160px] flex-1 max-w-sm lg:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-2 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:hidden"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </button>
          {location ? (
            <button
              type="button"
              onClick={() => setAddressOpen(true)}
              className="inline-flex h-10 max-w-[42vw] items-center gap-1 rounded-full bg-white px-2.5 text-xs font-medium sm:hidden"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location.zip} {location.city}</span>
            </button>
          ) : null}
          <Link
            href="/favoris"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink/80 hover:bg-white md:inline-flex"
          >
            <Heart className="h-4 w-4" />
            Favoris
          </Link>
          {account ? (
            <Link
              href="/compte"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink/80 hover:bg-white md:inline-flex"
            >
              <User className="h-4 w-4" />
              {account.name}
            </Link>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/compte?mode=connexion" className="rounded-full bg-white px-3 py-2 text-sm font-medium shadow-sm">
                Connexion
              </Link>
              <Link href="/compte?mode=inscription" className="rounded-full bg-ink px-3 py-2 text-sm font-medium text-white">
                Inscription
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={openCart}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-quince px-3 py-2 text-left text-ink transition hover:bg-quince-dark",
              lastAddedId && "scale-[1.03]",
            )}
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span className="hidden leading-tight sm:block">
              <span className="block text-xs font-semibold">{plural(itemCount, "plat", "plats")}</span>
              <span className="block text-sm font-semibold">{formatPrice(subtotal)}</span>
            </span>
            <span className="text-sm font-semibold sm:hidden">{itemCount}</span>
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-line px-4 py-3 lg:hidden">
          <SearchBar autoFocus />
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-ink/40" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 flex h-full w-[min(88vw,360px)] flex-col bg-cream p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fermer" className="h-10 w-10">
                <X className="mx-auto h-5 w-5" />
              </button>
            </div>
            {location ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAddressOpen(true);
                }}
                className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-3 text-left text-sm"
              >
                <MapPin className="h-4 w-4" />
                <span className="min-w-0 flex-1 truncate">
                  {location.street}, {location.city}
                </span>
              </button>
            ) : null}
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-white">
                  {link.label}
                </Link>
              ))}
              <Link href="/favoris" className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-white">
                Favoris
              </Link>
              {account ? (
                <Link href="/compte" className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-white">
                  Mon compte
                </Link>
              ) : (
                <>
                  <Link href="/compte?mode=connexion" className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-white">
                    Connexion
                  </Link>
                  <Link href="/compte?mode=inscription" className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-white">
                    Inscription
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      ) : null}

      <AddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </header>
  );
}
