export const DELIVERY_COOKIE = "quince_delivery";
export const DELIVERY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type DeliveryStatus = "available" | "soon" | "unavailable";
export type DeliveryWhen = "now" | "later";

export type DeliveryLocation = {
  label: string;
  street: string;
  zip: string;
  city: string;
  lat: number;
  lon: number;
  status: DeliveryStatus;
  when: DeliveryWhen;
  whenLabel: string;
};

export type DeliveryCoverage = {
  status: DeliveryStatus;
  eta: string;
  note: string;
};

const ALLOWED_ZIPS = new Set([
  "92100",
  "92110",
  "92120",
  "92130",
  "92150",
  "92170",
  "92200",
  "92210",
  "92240",
  "92300",
  "92400",
  "92800",
  "93100",
  "93170",
  "93200",
  "93260",
  "93300",
  "93310",
  "93500",
  "94110",
  "94160",
  "94200",
  "94220",
  "94250",
  "94270",
  "94300",
]);

export const SERVED_CITIES = [
  "Paris",
  "Boulogne-Billancourt",
  "Neuilly-sur-Seine",
  "Levallois-Perret",
  "Issy-les-Moulineaux",
  "Montreuil",
  "Saint-Denis",
  "Pantin",
  "Vincennes",
  "Saint-Mandé",
  "Ivry-sur-Seine",
];

export function coverageFor(zip: string, city: string): DeliveryCoverage {
  const code = zip.replace(/\s/g, "");
  if (code.startsWith("75")) {
    return { status: "available", eta: "45–75 min", note: "Livraison fraîche à domicile, offerte dès 60 €." };
  }
  if (ALLOWED_ZIPS.has(code)) {
    return { status: "available", eta: "50–90 min", note: `Quince livre ${city || "votre ville"} dès aujourd’hui.` };
  }
  if (code.startsWith("92") || code.startsWith("93") || code.startsWith("94") || code.startsWith("78") || code.startsWith("91")) {
    return {
      status: "soon",
      eta: "",
      note: `Pas encore à ${city || "vous"}, mais on s’en rapproche. Laissez votre email pour être prévenu.`,
    };
  }
  return {
    status: "unavailable",
    eta: "",
    note: `Quince n’est pas encore disponible à ${city || "cette adresse"}.`,
  };
}

export function serializeDelivery(location: DeliveryLocation) {
  return encodeURIComponent(JSON.stringify(location));
}

export function parseDelivery(value?: string | null): DeliveryLocation | null {
  if (!value) return null;
  try {
    const raw = value.startsWith("%") || value.includes("%7B") ? decodeURIComponent(value) : value;
    const data = JSON.parse(raw) as DeliveryLocation;
    if (!data?.zip || !data?.city || !data?.street) return null;
    return data;
  } catch {
    try {
      const data = JSON.parse(decodeURIComponent(value)) as DeliveryLocation;
      if (!data?.zip || !data?.city || !data?.street) return null;
      return data;
    } catch {
      return null;
    }
  }
}

export function shortAddress(location: DeliveryLocation) {
  return `${location.street}, ${location.zip} ${location.city}`;
}

export function headerAddress(location: DeliveryLocation) {
  const street = location.street.length > 28 ? `${location.street.slice(0, 26)}…` : location.street;
  return `${street} · ${location.whenLabel}`;
}

export const OPEN_WITHOUT_ADDRESS = [
  "/",
  "/compte",
  "/mentions-legales",
  "/confidentialite",
  "/cgv",
  "/contact",
  "/faq",
  "/allergenes",
];

export function isOpenWithoutAddress(pathname: string) {
  return OPEN_WITHOUT_ADDRESS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
