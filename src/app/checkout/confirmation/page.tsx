"use client";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { formatPrice } from "@/lib/format";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";
import type { Order } from "@/types/product";

export default function ConfirmationPage() {
  const [order] = useStoredJson<Order | null>(STORAGE_KEYS.order, null);

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-4xl">Aucune commande récente</h1>
        <Button href="/" className="mt-6">
          Voir les plats
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-12 pb-20">
      <div className="mx-auto max-w-xl rounded-[1.75rem] bg-white p-8 text-center">
        <p className="text-sm font-medium text-forest">Commande confirmée</p>
        <h1 className="mt-3 font-display text-4xl">Merci, {order.address.firstName}.</h1>
        <p className="mt-3 text-muted">
          Votre commande {order.id} sera livrée {order.slotLabel.toLowerCase()}.
        </p>
        <ul className="mt-8 space-y-2 text-left text-sm">
          {order.lines.map((line) => (
            <li key={`${line.productId}-${line.servings}`} className="flex justify-between">
              <span>
                {line.quantity} × {line.name}
              </span>
              <span>{formatPrice(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-semibold">Total {formatPrice(order.total)}</p>
        <Button href="/" className="mt-8">
          Retour à l’accueil
        </Button>
      </div>
    </Container>
  );
}
