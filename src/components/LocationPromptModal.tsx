"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, MapPin, X } from "lucide-react";
import { reverseAddress, type BanSuggestion } from "@/lib/ban";

export function LocationPromptModal({
  open,
  onClose,
  onLocated,
}: {
  open: boolean;
  onClose: () => void;
  onLocated: (suggestion: BanSuggestion) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function authorize() {
    if (!navigator.geolocation) {
      setError("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }
    setBusy(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const found = await reverseAddress(position.coords.latitude, position.coords.longitude);
        setBusy(false);
        if (!found) {
          setError("Adresse introuvable autour de vous. Saisissez-la à la main.");
          return;
        }
        onLocated(found);
        onClose();
      },
      () => {
        setBusy(false);
        setError("Impossible d’accéder à votre position. Saisissez votre adresse.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" className="absolute inset-0 bg-ink/45" aria-label="Fermer" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-prompt-title"
        className="relative w-[min(92vw,420px)] rounded-[1.5rem] bg-white px-6 py-7 text-center shadow-[0_30px_80px_-24px_rgba(17,17,17,0.5)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 hover:bg-[#f3f3f3]"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="location-prompt-title" className="px-8 font-display text-[1.65rem] leading-tight tracking-tight">
          Autoriser le partage de position
        </h2>
        <div className="mx-auto mt-6 flex h-[92px] w-[92px] items-center justify-center rounded-2xl bg-[#e8f5e9]">
          <MapPin className="h-10 w-10 text-ink" strokeWidth={2.2} />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Ne perdez plus de temps à taper et découvrez les plats livrés près de chez vous.
        </p>
        {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
        <button
          type="button"
          onClick={authorize}
          disabled={busy}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
          Autoriser
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-ink hover:bg-[#f3f3f3]"
        >
          Saisir l’adresse de livraison
        </button>
      </div>
    </div>
  );
}
