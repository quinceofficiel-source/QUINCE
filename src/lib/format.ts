const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatRating(value: number) {
  return value.toFixed(1).replace(".", ",");
}

export function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count > 1 ? pluralForm : singular}`;
}

export const FREE_SHIPPING_THRESHOLD = 60;
