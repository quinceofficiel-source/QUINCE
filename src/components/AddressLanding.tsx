"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Box, Clock, Truck, User, UtensilsCrossed } from "lucide-react";
import { AddressSearch } from "@/components/AddressSearch";
import { LocationPromptModal } from "@/components/LocationPromptModal";
import { saveDeliveryLocation } from "@/lib/delivery-actions";
import { coverageFor, SERVED_CITIES } from "@/lib/delivery-zones";
import { useDelivery } from "@/context/DeliveryContext";
import type { BanSuggestion } from "@/lib/ban";
import { getPopular } from "@/data/products";
import { Logo } from "@/components/Logo";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";

type Account = { name: string; email: string };

export function AddressLanding({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();
  const { setLocation } = useDelivery();
  const [account] = useStoredJson<Account | null>(STORAGE_KEYS.account, null);
  const [picked, setPicked] = useState<BanSuggestion | null>(null);
  const [locationPromptOpen, setLocationPromptOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [waitlist, setWaitlist] = useState("");
  const [waited, setWaited] = useState(false);
  const coverage = picked ? coverageFor(picked.zip, picked.city) : null;
  const dishes = getPopular().slice(0, 8);

  async function enter(href: string, when: "now" | "later" = "now") {
    if (!picked) return;
    setBusy(true);
    const result = await saveDeliveryLocation({
      label: picked.label,
      street: picked.street,
      zip: picked.zip,
      city: picked.city,
      lat: picked.lat,
      lon: picked.lon,
      when,
    });
    setBusy(false);
    if (!result.ok) return;
    setLocation(result.location);
    router.push(href);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo variant="landing" />
          <div className="flex items-center gap-2">
            {account ? (
              <Link href="/compte" className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-medium text-ink shadow-sm">
                Bonjour, {account.name}
              </Link>
            ) : (
              <>
                <Link
                  href="/compte?mode=connexion"
                  className="inline-flex h-10 w-10 items-center justify-center text-ink md:hidden"
                  aria-label="Connexion"
                >
                  <User className="h-6 w-6" strokeWidth={2.25} />
                </Link>
                <Link
                  href="/compte?mode=connexion"
                  className="hidden h-10 items-center rounded-full bg-white px-4 text-sm font-medium text-ink shadow-sm md:inline-flex"
                >
                  Connexion
                </Link>
                <Link
                  href="/compte?mode=inscription"
                  className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative min-h-[100svh] overflow-hidden">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/landing-hero.png" />
          <img
            src="/landing-hero-mobile.png"
            alt="Plat maison Quince, quinoa, poulet et légumes"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[center_12%] lg:object-[72%_center]"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/35 lg:via-transparent lg:to-transparent" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1320px] items-start px-5 pb-10 pt-[4.75rem] sm:px-6 lg:items-center lg:px-8 lg:pb-16 lg:pt-24">
          <div className="w-full max-w-[560px] lg:mx-0">
            <h1 className="font-display text-[2.15rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.35rem]">
              Vos plats maison préférés, livrés chez vous.
            </h1>
            <div className="mt-6 lg:mt-7 lg:rounded-[1.6rem] lg:bg-white lg:p-5 lg:shadow-[0_24px_60px_-32px_rgba(17,17,17,0.35)]">
              <p className="mb-3 hidden text-sm font-medium lg:block">Entrez une adresse pour découvrir vos options</p>
              <AddressSearch
                variant="hero"
                autoFocus={!locationPromptOpen}
                selected={picked}
                onSelect={setPicked}
              />
              {picked && coverage ? (
                <div className="mt-4 rounded-[1.4rem] bg-white p-4 shadow-[0_16px_40px_-24px_rgba(17,17,17,0.35)] lg:mt-5 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:border-t lg:border-line lg:pt-4">
                  {coverage.status === "available" ? (
                    <div>
                      <p className="text-sm font-semibold text-forest">
                        Quince est disponible à {picked.city}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {coverage.note} Délai estimé {coverage.eta}.
                      </p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <OptionCard
                          icon={Truck}
                          title="Livraison"
                          text="À domicile, au frais"
                          disabled={busy}
                          onClick={() => enter(nextPath || "/", "now")}
                        />
                        <OptionCard
                          icon={Box}
                          title="Box"
                          text="5, 10 ou 14 plats"
                          disabled={busy}
                          onClick={() => enter("/composer-ma-box", "later")}
                        />
                        <OptionCard
                          icon={UtensilsCrossed}
                          title="À l’unité"
                          text="Nos plats du jour"
                          disabled={busy}
                          onClick={() => enter("/", "now")}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold">
                        {coverage.status === "soon" ? `Bientôt à ${picked.city}` : `Pas encore à ${picked.city}`}
                      </p>
                      <p className="mt-1 text-sm text-muted">{coverage.note}</p>
                      <p className="mt-3 text-xs text-muted">Villes déjà livrées : {SERVED_CITIES.join(", ")}.</p>
                      {waited ? (
                        <p className="mt-3 text-sm text-forest">Merci, on vous écrit dès que Quince arrive.</p>
                      ) : (
                        <form
                          className="mt-4 flex gap-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            if (!waitlist.includes("@")) return;
                            setWaited(true);
                          }}
                        >
                          <input
                            type="email"
                            required
                            value={waitlist}
                            onChange={(event) => setWaitlist(event.target.value)}
                            placeholder="Votre email"
                            className="h-11 flex-1 rounded-2xl border border-line bg-cream px-3 text-sm"
                          />
                          <button type="submit" className="h-11 rounded-2xl bg-ink px-4 text-sm font-medium text-white">
                            Prévenez-moi
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {!account ? (
              <p className="mt-4 text-sm text-ink/80">
                Ou{" "}
                <Link href="/compte?mode=connexion" className="font-semibold underline underline-offset-2">
                  Connexion
                </Link>{" "}
                vers les adresses enregistrées.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted">
          <Clock className="h-4 w-4" />
          Plats cuisinés chaque jour · livraison dans une box isolée
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {dishes.map((dish) => (
            <article key={dish.id} className="w-[160px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm sm:w-[180px]">
              <div className="relative h-28">
                <Image src={dish.image} alt={dish.name} fill className="object-cover" sizes="180px" />
              </div>
              <p className="truncate px-3 py-2 text-xs font-medium">{dish.name}</p>
            </article>
          ))}
        </div>
      </section>

      <LocationPromptModal
        open={locationPromptOpen}
        onClose={() => setLocationPromptOpen(false)}
        onLocated={setPicked}
      />
    </div>
  );
}

function OptionCard({
  icon: Icon,
  title,
  text,
  onClick,
  disabled,
}: {
  icon: typeof Truck;
  title: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl border border-line bg-cream px-3 py-3 text-left transition hover:border-ink hover:bg-white disabled:opacity-60"
    >
      <Icon className="h-4 w-4" />
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted">{text}</p>
    </button>
  );
}
