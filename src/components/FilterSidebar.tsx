"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CUISINES } from "@/data/categories";
import { cn } from "@/lib/cn";

const PRICE_OPTIONS = [
  { label: "Tous les prix", value: "" },
  { label: "Moins de 8 €", value: "8" },
  { label: "Moins de 10 €", value: "10" },
  { label: "Moins de 12 €", value: "12" },
];

const CALORIE_OPTIONS = [
  { label: "Toutes", value: "" },
  { label: "Moins de 450 kcal", value: "450" },
  { label: "Moins de 550 kcal", value: "550" },
];

const PROTEIN_OPTIONS = [
  { label: "Toutes", value: "" },
  { label: "20 g et +", value: "20" },
  { label: "30 g et +", value: "30" },
];

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function toggleFlag(key: string) {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === "1") next.delete(key);
    else next.set(key, "1");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const category = params.get("categorie") ?? "";

  return (
    <aside className="space-y-6 rounded-[1.5rem] bg-white p-5 lg:sticky lg:top-24">
      <div>
        <p className="text-sm font-semibold">Catégorie</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.filter((item) => item.id !== "favoris").map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setParam("categorie", category === item.id ? "" : item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                category === item.id || (item.id === "nouveau" && params.get("nouveautes") === "1")
                  ? "border-ink bg-ink text-white"
                  : "border-line hover:bg-cream",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-semibold">
        Prix
        <select
          className="mt-2 h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm font-normal"
          value={params.get("prix") ?? ""}
          onChange={(event) => setParam("prix", event.target.value)}
        >
          {PRICE_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold">
        Calories
        <select
          className="mt-2 h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm font-normal"
          value={params.get("calories") ?? ""}
          onChange={(event) => setParam("calories", event.target.value)}
        >
          {CALORIE_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold">
        Protéines
        <select
          className="mt-2 h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm font-normal"
          value={params.get("proteines") ?? ""}
          onChange={(event) => setParam("proteines", event.target.value)}
        >
          {PROTEIN_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold">
        Cuisine du monde
        <select
          className="mt-2 h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm font-normal"
          value={params.get("cuisine") ?? ""}
          onChange={(event) => setParam("cuisine", event.target.value)}
        >
          <option value="">Toutes</option>
          {CUISINES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={params.get("vege") === "1"} onChange={() => toggleFlag("vege")} />
          Végétarien
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={params.get("nouveautes") === "1"} onChange={() => toggleFlag("nouveautes")} />
          Nouveautés
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={params.get("populaires") === "1"} onChange={() => toggleFlag("populaires")} />
          Populaires
        </label>
      </div>
    </aside>
  );
}
