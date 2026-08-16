import { getProductById } from "@/data/products";
import { getAdminStore } from "@/lib/admin/store";
import type { CheckoutAddress } from "@/types/product";

export type StorefrontOrderInput = {
  id: string;
  createdAt: string;
  lines: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  address: CheckoutAddress;
  slotLabel: string;
};

export function ingestCheckoutOrder(input: StorefrontOrderInput) {
  if (!input.lines.length || !input.address.firstName || !input.address.phone) {
    throw new Error("Commande incomplète.");
  }
  return getAdminStore().ingestStorefrontOrder({
    id: input.id,
    createdAt: input.createdAt,
    customerName: `${input.address.firstName} ${input.address.lastName}`.trim(),
    customerEmail: `${input.address.firstName}.${input.address.lastName}@client.quince.fr`
      .toLowerCase()
      .replace(/\s+/g, ""),
    customerPhone: input.address.phone,
    address: [input.address.street, input.address.complement].filter(Boolean).join(", "),
    city: input.address.city,
    zip: input.address.zip,
    instructions: input.address.instructions,
    slotLabel: input.slotLabel,
    lines: input.lines.map((line) => ({
      ...line,
      allergens: getProductById(line.productId)?.allergens ?? [],
    })),
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
  });
}
