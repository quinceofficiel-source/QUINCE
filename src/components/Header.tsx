"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, MapPin, Menu, ShoppingBag, User, X } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { AddressModal } from "@/components/AddressModal";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { ServingFormatSwitch } from "@/components/ServingFormatSwitch";
import { useCart } from "@/context/CartContext";
import { useDelivery } from "@/context/DeliveryContext";
import { MENU_LINKS } from "@/data/categories";
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
  const [account, setAccount] = useStoredJson<Account | null>(STORAGE_KEYS.account, null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  const addressLabel = location?.street ?? "Choisir une adresse";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow",
        scrolled ? "shadow-[0_10px_30px_-22px_rgba(17,17,17,0.45)]" : "border-b border-line/70",
      )}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[1320px] flex-col gap-2 px-4 py-2.5 sm:px-6 lg:h-[80px] lg:flex-row lg:items-center lg:gap-4 lg:px-8 lg:py-0">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-cream"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="min-w-0" />

          <div className="ml-1 hidden min-w-0 lg:block">
            <Suspense fallback={<div className="h-9 w-[280px] rounded-full bg-cream" />}>
              <ServingFormatSwitch />
            </Suspense>
          </div>

          <button
            type="button"
            onClick={() => setAddressOpen(true)}
            className="ml-1 hidden min-w-0 max-w-[220px] items-center gap-2 rounded-full border border-line/80 bg-cream px-3 py-2 text-left transition hover:bg-cream-dark xl:inline-flex"
            aria-label={location ? `Modifier l’adresse, ${location.street}` : "Choisir une adresse de livraison"}
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{addressLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden">
            <FavoritesLink account={account} iconOnly />
            <CartButton itemCount={itemCount} subtotal={subtotal} lastAddedId={lastAddedId} onClick={openCart} compact />
          </div>
        </div>

        <div className="lg:hidden">
          <Suspense fallback={<div className="h-9 w-full rounded-full bg-cream" />}>
            <ServingFormatSwitch variant="bar" />
          </Suspense>
        </div>

        <button
          type="button"
          onClick={() => setAddressOpen(true)}
          className="flex min-w-0 items-center gap-2 rounded-full border border-line/80 bg-cream px-3 py-2.5 text-left transition hover:bg-cream-dark xl:hidden"
          aria-label={location ? `Modifier l’adresse, ${location.street}` : "Choisir une adresse de livraison"}
        >
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{addressLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
        </button>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          <FavoritesLink account={account} />
          {account ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-cream"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{account.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
              {accountOpen ? (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-xl">
                  <MenuItem href="/compte" onClick={() => setAccountOpen(false)}>
                    Mon compte
                  </MenuItem>
                  <MenuItem href="/compte" onClick={() => setAccountOpen(false)}>
                    Mes commandes
                  </MenuItem>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm hover:bg-cream"
                    onClick={() => {
                      setAccountOpen(false);
                      setAddressOpen(true);
                    }}
                  >
                    Mes adresses
                  </button>
                  <MenuItem href="/favoris" onClick={() => setAccountOpen(false)}>
                    Mes favoris
                  </MenuItem>
                  <button
                    type="button"
                    className="block w-full border-t border-line px-4 py-2.5 text-left text-sm text-muted hover:bg-cream"
                    onClick={() => {
                      setAccount(null);
                      setAccountOpen(false);
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href={`/compte?mode=connexion&next=${encodeURIComponent(pathname)}`}
              className="inline-flex h-11 items-center rounded-full px-4 text-sm font-medium hover:bg-cream"
            >
              Connexion
            </Link>
          )}
          <CartButton itemCount={itemCount} subtotal={subtotal} lastAddedId={lastAddedId} onClick={openCart} />
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 flex h-full w-[min(88vw,360px)] flex-col bg-white p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {MENU_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-cream"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-line pt-4">
              {account ? (
                <Link href="/compte" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-medium hover:bg-cream">
                  Mon compte
                </Link>
              ) : (
                <Link href="/compte?mode=connexion" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-medium hover:bg-cream">
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <AddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </header>
  );
}

function FavoritesLink({ account, iconOnly = false }: { account: Account | null; iconOnly?: boolean }) {
  const href = account ? "/favoris" : "/compte?mode=connexion&next=%2Ffavoris";
  return (
    <Link
      href={href}
      aria-label="Favoris"
      className={cn(
        "group inline-flex h-11 items-center justify-center rounded-full text-sm font-medium text-ink hover:bg-cream",
        iconOnly ? "w-11" : "gap-2 px-3",
      )}
    >
      <Heart className="h-4 w-4 transition group-hover:fill-quince" />
      {iconOnly ? null : <span className="hidden xl:inline">Favoris</span>}
    </Link>
  );
}

function CartButton({
  itemCount,
  subtotal,
  lastAddedId,
  onClick,
  compact = false,
}: {
  itemCount: number;
  subtotal: number;
  lastAddedId: string | null;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-quince px-3 py-2 text-left text-ink transition hover:bg-quince-dark",
        lastAddedId && "scale-[1.03]",
      )}
      aria-label={`Ouvrir le panier, ${plural(itemCount, "plat", "plats")}, ${formatPrice(subtotal)}`}
    >
      <ShoppingBag className="h-4 w-4 shrink-0" />
      {compact ? (
        <span className="text-sm font-semibold">{itemCount}</span>
      ) : (
        <span className="leading-tight">
          <span className="block text-xs font-semibold">{plural(itemCount, "plat", "plats")}</span>
          <span className="block text-sm font-semibold">{formatPrice(subtotal)}</span>
        </span>
      )}
    </button>
  );
}

function MenuItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="block px-4 py-2.5 text-sm hover:bg-cream">
      {children}
    </Link>
  );
}
