"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LoaderCircle, LocateFixed, MapPin, Search } from "lucide-react";
import { reverseAddress, searchAddresses, type BanSuggestion } from "@/lib/ban";
import { cn } from "@/lib/cn";

export function AddressSearch({
  onSelect,
  autoFocus,
  selected,
  size = "lg",
  variant = "default",
  placeholder = "Saisissez votre adresse",
  submitLabel = "Chercher",
}: {
  onSelect: (suggestion: BanSuggestion) => void;
  autoFocus?: boolean;
  selected?: BanSuggestion | null;
  size?: "lg" | "md";
  variant?: "default" | "hero";
  placeholder?: string;
  submitLabel?: string;
}) {
  const listId = useId();
  const [query, setQuery] = useState(selected?.label ?? "");
  const [suggestions, setSuggestions] = useState<BanSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selected) {
      setQuery(selected.label);
      setSuggestions([]);
      setOpen(false);
    }
  }, [selected]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3 || (selected && q === selected.label)) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const results = await searchAddresses(q);
      setSuggestions(results);
      setOpen(true);
      setLoading(false);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, selected]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  function choose(item: BanSuggestion) {
    setQuery(item.label);
    setOpen(false);
    onSelect(item);
  }

  async function locate() {
    if (!navigator.geolocation) {
      setError("La géolocalisation n’est pas disponible.");
      return;
    }
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const found = await reverseAddress(position.coords.latitude, position.coords.longitude);
        setGeoLoading(false);
        if (!found) {
          setError("Adresse introuvable autour de vous.");
          return;
        }
        choose(found);
      },
      () => {
        setGeoLoading(false);
        setError("Impossible d’accéder à votre position.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  const large = size === "lg";
  const hero = variant === "hero";

  return (
    <div ref={boxRef} className="relative">
      <div
        className={cn(
          "flex items-stretch gap-2",
          hero ? "flex-col gap-3 lg:flex-row lg:gap-2" : large ? "flex-col sm:flex-row" : "flex-row",
        )}
      >
        <div
          className={cn(
            "relative flex min-w-0 flex-1 items-center bg-white",
            hero ? "h-14 rounded-xl border border-ink lg:rounded-2xl lg:border-line" : "rounded-2xl border border-line",
            !hero && (large ? "h-14" : "h-12"),
          )}
        >
          <MapPin className="ml-4 h-5 w-5 shrink-0 text-ink/50" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setError("");
            }}
            onFocus={() => suggestions.length && setOpen(true)}
            autoFocus={autoFocus}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listId}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={locate}
            className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 hover:bg-cream"
            aria-label="Utiliser ma position"
          >
            {geoLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={() => suggestions[0] && choose(suggestions[0])}
          className={cn(
            "inline-flex items-center justify-center gap-2 bg-ink font-medium text-white hover:bg-neutral-800",
            hero
              ? "h-14 w-full rounded-xl px-6 lg:w-auto lg:rounded-2xl"
              : large
                ? "h-14 rounded-2xl px-6"
                : "h-12 rounded-2xl px-4 text-sm",
          )}
        >
          <Search className="h-4 w-4" />
          {submitLabel}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
      {open && (suggestions.length || loading) ? (
        <ul
          id={listId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-[0_18px_50px_-24px_rgba(17,17,17,0.45)]"
        >
          {loading ? <li className="px-4 py-3 text-sm text-muted">Recherche d’adresses…</li> : null}
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => choose(item)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-cream"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
                <span>
                  <span className="block font-medium">{item.street}</span>
                  <span className="text-muted">
                    {item.zip} {item.city}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
