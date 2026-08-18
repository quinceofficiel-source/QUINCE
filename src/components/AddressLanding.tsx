"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Box, Clock, Truck, UtensilsCrossed } from "lucide-react";
import { AddressSearch } from "@/components/AddressSearch";
import { saveDeliveryLocation } from "@/lib/delivery-actions";
import { coverageFor, SERVED_CITIES } from "@/lib/delivery-zones";
import { useDelivery } from "@/context/DeliveryContext";
import type { BanSuggestion } from "@/lib/ban";
import { BANNER_IMAGES, getPopular } from "@/data/products";
import { Logo } from "@/components/Logo";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";

type Account = { name: string; email: string };

export function AddressLanding({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();
  const { setLocation } = useDelivery();
  const [account] = useStoredJson<Account | null>(STORAGE_KEYS.account, null);
  const [picked, setPicked] = useState<BanSuggestion | null>(null);
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
    <div className="min-h-screen bg-cream">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            {account ? (
              <Link href="/compte" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm">
                Bonjour, {account.name}
              </Link>
            ) : (
              <>
                <Link href="/compte?mode=connexion" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm">
                  Connexion
                </Link>
                <Link href="/compte?mode=inscription" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute -left-24 top-0 h-[520px] w-[70%] -skew-x-12 bg-quince" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-16">
          <div className="relative hidden h-[340px] lg:block">
            <Image
              src={BANNER_IMAGES.delivery}
              alt="Courses et plats Quince prêts à livrer"
              fill
              className="rounded-[2rem] object-cover shadow-[0_30px_80px_-40px_rgba(17,17,17,0.5)]"
              sizes="420px"
              priority
            />
          </div>
          <div>
            <div className="relative mb-6 hidden overflow-hidden rounded-[2rem] lg:block">
              <Image
                src="/hero-banner.jpg"
                alt="Plat maison Quince"
                width={900}
                height={280}
                className="h-40 w-full object-cover"
                priority
              />
            </div>
            <h1 className="font-display text-[2.1rem] leading-[1.1] tracking-tight sm:text-5xl">
              Vos plats maison préférés, livrés chez vous.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-ink/70 sm:text-base">
              Entrez votre adresse exacte pour voir si Quince livre dans votre ville, et les options disponibles.
            </p>
            <div className="mt-6 rounded-[1.6rem] bg-white p-4 shadow-[0_24px_60px_-32px_rgba(17,17,17,0.35)] sm:p-5">
              <p className="mb-3 text-sm font-medium">Entrez une adresse pour découvrir vos options</p>
              <AddressSearch autoFocus onSelect={setPicked} />
              {picked && coverage ? (
                <div className="mt-5 border-t border-line pt-4">
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
                          onClick={() => enter("/plats", "now")}
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
              <p className="mt-4 text-sm text-ink/70">
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

      <section className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6 lg:px-8">
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
