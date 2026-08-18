"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AddressSearch } from "@/components/AddressSearch";
import { saveDeliveryLocation, updateDeliveryWhen } from "@/lib/delivery-actions";
import { coverageFor } from "@/lib/delivery-zones";
import { useDelivery } from "@/context/DeliveryContext";
import type { BanSuggestion } from "@/lib/ban";

export function AddressModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { location, setLocation } = useDelivery();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function apply(suggestion: BanSuggestion) {
    const coverage = coverageFor(suggestion.zip, suggestion.city);
    if (coverage.status !== "available") {
      setMessage(coverage.note);
      return;
    }
    setBusy(true);
    const result = await saveDeliveryLocation({
      label: suggestion.label,
      street: suggestion.street,
      zip: suggestion.zip,
      city: suggestion.city,
      lat: suggestion.lat,
      lon: suggestion.lon,
      when: location?.when ?? "now",
    });
    setBusy(false);
    if (!result.ok) {
      setMessage(result.coverage.note);
      return;
    }
    setLocation(result.location);
    onClose();
    router.refresh();
  }

  async function setWhen(when: "now" | "later") {
    const result = await updateDeliveryWhen(when);
    if (result.ok) setLocation(result.location);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Fermer" onClick={onClose} />
      <div className="absolute top-[12%] left-1/2 w-[min(92vw,560px)] -translate-x-1/2 rounded-[1.6rem] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">{location ? "Modifier l’adresse" : "Choisir une adresse"}</h2>
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <AddressSearch size="md" onSelect={apply} autoFocus submitLabel="OK" />
        {busy ? <p className="mt-3 text-sm text-muted">Enregistrement…</p> : null}
        {message ? <p className="mt-3 text-sm text-rose-700">{message}</p> : null}
        {location ? (
          <div className="mt-5">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Quand livrer</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setWhen("now")}
                className={`h-10 rounded-full px-4 text-sm ${location.when === "now" ? "bg-ink text-white" : "bg-cream"}`}
              >
                Maintenant
              </button>
              <button
                type="button"
                onClick={() => setWhen("later")}
                className={`h-10 rounded-full px-4 text-sm ${location.when === "later" ? "bg-ink text-white" : "bg-cream"}`}
              >
                Plus tard
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
