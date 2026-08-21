"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, MapPin, Menu, ShoppingBag, User, X } from "lucide-react";
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

  const next = encodeURIComponent(pathname);
  const addressText = location
    ? `${location.city} • ${location.whenLabel}`
    : "Choisir une adresse";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow",
        scrolled ? "shadow-[0_8px_24px_-18px_rgba(0,0,0,0.35)]" : "border-b border-black/5",
      )}
    >
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-2.5 pb-1">
          <button
            type="button"
            onClick={() => setAddressOpen(true)}
            className="min-w-0 text-left"
            aria-label={location ? `Lieu actuel, ${location.street}` : "Choisir une adresse de livraison"}
          >
            <span className="inline-flex items-center gap-1 text-[17px] font-bold leading-none tracking-tight">
              Lieu actuel
              <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
            </span>
            {location ? (
              <span className="mt-1 block truncate text-xs text-muted">
                {location.street}, {location.city}
              </span>
            ) : (
              <span className="mt-1 block text-xs text-muted">Choisir une adresse</span>
            )}
          </button>
          <Link
            href={account ? "/compte" : `/compte?mode=connexion&next=${next}`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-[#f3f3f3]"
            aria-label="Notifications"
          >
            <Bell className="h-[22px] w-[22px]" strokeWidth={2} />
          </Link>
        </div>
        <div className="px-4 pb-2.5">
          <Suspense fallback={<div className="h-9 w-full rounded-full bg-[#eee]" />}>
            <ServingFormatSwitch variant="bar" />
          </Suspense>
        </div>
      </div>

      <div className="mx-auto hidden w-full min-w-0 max-w-[1320px] items-center gap-5 px-8 lg:flex lg:h-[72px]">
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-[#f3f3f3]"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo className="min-w-0" />

        <div className="ml-2 min-w-0">
          <Suspense fallback={<div className="h-9 w-[260px] rounded-full bg-[#eee]" />}>
            <ServingFormatSwitch />
          </Suspense>
        </div>

        <AddressLine
          className="ml-1 hidden min-w-0 max-w-[220px] xl:inline-flex"
          label={addressText}
          ariaLabel={location ? `Modifier l’adresse, ${location.street}` : "Choisir une adresse de livraison"}
          onClick={() => setAddressOpen(true)}
        />

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CartButton itemCount={itemCount} subtotal={subtotal} lastAddedId={lastAddedId} onClick={openCart} />
          {account ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-[#f3f3f3]"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{account.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
              {accountOpen ? (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-black/8 bg-white py-1 shadow-xl">
                  <MenuItem href="/compte" onClick={() => setAccountOpen(false)}>
                    Mon compte
                  </MenuItem>
                  <MenuItem href="/compte" onClick={() => setAccountOpen(false)}>
                    Mes commandes
                  </MenuItem>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm hover:bg-[#f3f3f3]"
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
                    className="block w-full border-t border-black/8 px-4 py-2.5 text-left text-sm text-muted hover:bg-[#f3f3f3]"
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
            <>
              <Link
                href={`/compte?mode=connexion&next=${next}`}
                className="inline-flex h-10 items-center px-2 text-sm font-medium text-ink hover:opacity-70"
              >
                Connexion
              </Link>
              <Link
                href={`/compte?mode=inscription&next=${next}`}
                className="inline-flex h-10 items-center rounded-full bg-[#eee] px-4 text-sm font-medium text-ink hover:bg-[#e4e4e4]"
              >
                Inscription
              </Link>
            </>
          )}
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#f3f3f3]"
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
                  className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-[#f3f3f3]"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/favoris" onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-3 text-lg font-medium hover:bg-[#f3f3f3]">
                Favoris
              </Link>
            </nav>
            <div className="mt-auto space-y-1 border-t border-black/8 pt-4">
              {account ? (
                <Link href="/compte" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-medium hover:bg-[#f3f3f3]">
                  Mon compte
                </Link>
              ) : (
                <>
                  <Link href={`/compte?mode=connexion&next=${next}`} onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-medium hover:bg-[#f3f3f3]">
                    Connexion
                  </Link>
                  <Link href={`/compte?mode=inscription&next=${next}`} onClick={() => setMenuOpen(false)} className="block rounded-2xl bg-[#eee] px-3 py-3 text-sm font-medium hover:bg-[#e4e4e4]">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <AddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </header>
  );
}

function AddressLine({
  label,
  ariaLabel,
  onClick,
  className,
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex min-w-0 items-center gap-1.5 text-left text-sm font-medium text-ink hover:opacity-70", className)}
      aria-label={ariaLabel}
    >
      <MapPin className="h-4 w-4 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
    </button>
  );
}

function CartButton({
  itemCount,
  subtotal,
  lastAddedId,
  onClick,
}: {
  itemCount: number;
  subtotal: number;
  lastAddedId: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-[#f3f3f3]",
        lastAddedId && "scale-[1.04]",
      )}
      aria-label={`Ouvrir le panier, ${plural(itemCount, "plat", "plats")}, ${formatPrice(subtotal)}`}
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute top-0.5 right-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">
        {itemCount}
      </span>
    </button>
  );
}

function MenuItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="block px-4 py-2.5 text-sm hover:bg-[#f3f3f3]">
      {children}
    </Link>
  );
}
