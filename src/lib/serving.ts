import type { Product, ServingType } from "@/types/product";

export type ServingFormat = "individuel" | "partage";

export function parseServingFormat(value: string | null | undefined): ServingFormat {
  return value === "partage" ? "partage" : "individuel";
}

export function servingTypeFromFormat(format: ServingFormat): ServingType {
  return format === "partage" ? "sharing" : "individual";
}

export function isSharing(product: Product) {
  return product.servingType === "sharing";
}

export function peopleLabel(min = 4, max = min) {
  if (min === max) return `Pour ${min} personnes`;
  return `Pour ${min} à ${max} personnes`;
}

export function productPeopleLabel(product: Product) {
  if (!isSharing(product)) return null;
  return peopleLabel(product.servingsMin ?? 4, product.servingsMax ?? product.servingsMin ?? 4);
}

export function cartLineLabel(product: Product, servings: 1 | 2 | 4) {
  if (isSharing(product)) return productPeopleLabel(product) ?? "Repas à partager";
  return `${servings} portion${servings > 1 ? "s" : ""}`;
}

export function pricePerPerson(product: Product) {
  if (!isSharing(product)) return null;
  const people = product.servingsMax ?? product.servingsMin;
  if (!people) return null;
  return product.price / people;
}

export function withServingFormat(href: string, format: ServingFormat) {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("format", format);
  return `${path}?${params.toString()}`;
}

export function catalogFormatHref(format: ServingFormat, pathname: string, search: string) {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  params.set("format", format);
  if (pathname === "/plats" || pathname === "/recherche") {
    return `${pathname}?${params.toString()}`;
  }
  return `/plats?format=${format}`;
}
