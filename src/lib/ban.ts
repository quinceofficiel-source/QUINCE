export type BanSuggestion = {
  id: string;
  label: string;
  street: string;
  zip: string;
  city: string;
  lat: number;
  lon: number;
};

type BanFeature = {
  properties?: {
    id?: string;
    label?: string;
    name?: string;
    housenumber?: string;
    street?: string;
    postcode?: string;
    city?: string;
  };
  geometry?: { coordinates?: [number, number] };
};

async function fromBan(url: string): Promise<BanSuggestion[]> {
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = (await response.json()) as { features?: BanFeature[] };
  return (data.features ?? [])
    .map((feature) => {
      const props = feature.properties ?? {};
      const [lon, lat] = feature.geometry?.coordinates ?? [0, 0];
      const street = [props.housenumber, props.street || props.name].filter(Boolean).join(" ") || props.name || "";
      const zip = props.postcode ?? "";
      const city = props.city ?? "";
      if (!street || !zip || !city) return null;
      return {
        id: props.id || `${street}-${zip}`,
        label: props.label || `${street}, ${zip} ${city}`,
        street,
        zip,
        city,
        lat,
        lon,
      };
    })
    .filter((item): item is BanSuggestion => Boolean(item));
}

export async function searchAddresses(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];
  return fromBan(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(trimmed)}&limit=6&autocomplete=1`);
}

export async function reverseAddress(lat: number, lon: number) {
  const results = await fromBan(`https://api-adresse.data.gouv.fr/reverse/?lat=${lat}&lon=${lon}`);
  return results[0] ?? null;
}
