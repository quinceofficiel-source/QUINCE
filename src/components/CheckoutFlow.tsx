"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import { getLineUnitPrice, useCart } from "@/context/CartContext";
import { useDelivery } from "@/context/DeliveryContext";
import { DELIVERY_SLOTS } from "@/data/slots";
import { getProductById } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cartLineLabel } from "@/lib/serving";
import { STORAGE_KEYS, writeJson } from "@/lib/storage";
import { LIVE_ORDER_CHANNEL } from "@/lib/admin/live-message";
import type { CheckoutAddress, Order } from "@/types/product";
import { cn } from "@/lib/cn";

const emptyAddress: CheckoutAddress = {
  firstName: "",
  lastName: "",
  street: "",
  complement: "",
  zip: "",
  city: "",
  phone: "",
  instructions: "",
};

const steps = ["Panier", "Livraison", "Paiement", "Confirmation"];

export function CheckoutFlow() {
  const router = useRouter();
  const { lines, subtotal, shipping, total, setQuantity, clearCart } = useCart();
  const { location } = useDelivery();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<CheckoutAddress>(emptyAddress);
  const [slotId, setSlotId] = useState(DELIVERY_SLOTS[2].id);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!location) return;
    setAddress((current) => ({
      ...current,
      street: current.street || location.street,
      zip: current.zip || location.zip,
      city: current.city || location.city,
    }));
  }, [location]);

  const slot = useMemo(() => DELIVERY_SLOTS.find((item) => item.id === slotId)!, [slotId]);

  function updateAddress<K extends keyof CheckoutAddress>(key: K, value: CheckoutAddress[K]) {
    setAddress((current) => ({ ...current, [key]: value }));
  }

  const addressValid =
    address.firstName && address.lastName && address.street && address.zip && address.city && address.phone;

  async function pay(event: React.FormEvent) {
    event.preventDefault();
    setPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const order: Order = {
      id: `QX-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      lines: lines.map((line) => ({
        ...line,
        name: getProductById(line.productId)?.name ?? "Plat",
        unitPrice: getLineUnitPrice(line),
      })),
      subtotal,
      shipping,
      total,
      address,
      slotId,
      slotLabel: slot.label,
    };
    writeJson(STORAGE_KEYS.order, order);
    const customerName = `${order.address.firstName} ${order.address.lastName}`.trim();
    try {
      const channel = new BroadcastChannel(LIVE_ORDER_CHANNEL);
      channel.postMessage({
        type: "order",
        notification: {
          id: `ntf-order-${order.id}`,
          type: "order",
          title: "Nouvelle commande",
          body: `${customerName} · ${order.total.toFixed(2).replace(".", ",")} €`,
          href: `/admin/orders/${order.id}`,
          at: order.createdAt,
          read: false,
          orderId: order.id,
          customerName,
          amount: order.total,
        },
      });
      channel.close();
    } catch {
      /* BroadcastChannel indisponible */
    }
    try {
      await fetch("/api/storefront/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          createdAt: order.createdAt,
          lines: order.lines.map((line) => ({
            productId: line.productId,
            name: line.name,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          address: order.address,
          slotLabel: order.slotLabel,
        }),
      });
    } catch {
      /* le paiement client reste validé même si le back-office est indisponible */
    }
    clearCart();
    router.push("/checkout/confirmation");
  }

  if (lines.length === 0 && step < 3) {
    return (
      <div className="rounded-[1.75rem] bg-white px-6 py-16 text-center">
        <h1 className="font-display text-4xl">Votre panier est vide</h1>
        <p className="mt-3 text-muted">Ajoutez quelques plats avant de passer commande.</p>
        <Button href="/" className="mt-6">
          Voir les plats
        </Button>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <ol className="mb-8 flex gap-2 text-sm">
          {steps.map((label, index) => (
            <li
              key={label}
              className={cn(
                "rounded-full px-3 py-1.5",
                index === step ? "bg-ink text-white" : index < step ? "bg-quince text-ink" : "bg-white text-muted",
              )}
            >
              {index + 1}. {label}
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <section className="rounded-[1.5rem] bg-white p-6">
            <h1 className="font-display text-3xl">Panier</h1>
            <ul className="mt-6 space-y-4">
              {lines.map((line) => {
                const product = getProductById(line.productId);
                if (!product) return null;
                return (
                  <li key={`${line.productId}-${line.servings}`} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted">
                        {cartLineLabel(product, line.servings)} · {formatPrice(getLineUnitPrice(line))}
                      </p>
                    </div>
                    <QuantitySelector
                      value={line.quantity}
                      min={0}
                      onChange={(value) => setQuantity(line.productId, line.servings, value)}
                    />
                  </li>
                );
              })}
            </ul>
            <Button className="mt-8" variant="dark" onClick={() => setStep(1)}>
              Continuer vers la livraison
            </Button>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="rounded-[1.5rem] bg-white p-6">
            <h1 className="font-display text-3xl">Livraison</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" value={address.firstName} onChange={(v) => updateAddress("firstName", v)} />
              <Field label="Nom" value={address.lastName} onChange={(v) => updateAddress("lastName", v)} />
              <Field label="Adresse" value={address.street} onChange={(v) => updateAddress("street", v)} className="sm:col-span-2" />
              <Field label="Complément" value={address.complement} onChange={(v) => updateAddress("complement", v)} className="sm:col-span-2" />
              <Field label="Code postal" value={address.zip} onChange={(v) => updateAddress("zip", v)} />
              <Field label="Ville" value={address.city} onChange={(v) => updateAddress("city", v)} />
              <Field label="Téléphone" value={address.phone} onChange={(v) => updateAddress("phone", v)} className="sm:col-span-2" />
              <label className="sm:col-span-2 text-sm font-medium">
                Instructions
                <textarea
                  value={address.instructions}
                  onChange={(event) => updateAddress("instructions", event.target.value)}
                  className="mt-1 h-24 w-full rounded-2xl border border-line bg-cream px-3 py-2 text-sm font-normal"
                />
              </label>
            </div>
            <h2 className="mt-8 font-display text-2xl">Créneau</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {DELIVERY_SLOTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSlotId(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm",
                    slotId === item.id ? "border-ink bg-cream" : "border-line",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>
                Retour
              </Button>
              <Button variant="dark" disabled={!addressValid} onClick={() => setStep(2)}>
                Continuer vers le paiement
              </Button>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <form className="rounded-[1.5rem] bg-white p-6" onSubmit={pay}>
            <h1 className="font-display text-3xl">Paiement</h1>
            <p className="mt-2 text-sm text-muted">
              Architecture prête pour Stripe Elements. Aucune clé API n’est utilisée ici — le paiement est simulé.
            </p>
            <div className="mt-6 grid gap-4">
              <Field label="Nom sur la carte" value="Marie Dupont" onChange={() => undefined} />
              <Field label="Numéro de carte" value="4242 4242 4242 4242" onChange={() => undefined} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiration" value="12 / 28" onChange={() => undefined} />
                <Field label="CVC" value="123" onChange={() => undefined} />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button type="submit" variant="dark" disabled={paying}>
                {paying ? "Paiement en cours..." : `Payer ${formatPrice(total)}`}
              </Button>
            </div>
          </form>
        ) : null}
      </div>

      <aside className="h-fit rounded-[1.5rem] bg-white p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl">Résumé</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((line) => {
            const product = getProductById(line.productId);
            if (!product) return null;
            return (
              <li key={`${line.productId}-${line.servings}`} className="flex justify-between gap-3">
                <span>
                  {line.quantity} × {product.name}
                </span>
                <span>{formatPrice(getLineUnitPrice(line) * line.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between text-sm">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-muted">
          <span>Livraison</span>
          <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
        </div>
        <div className="mt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {step > 0 ? <p className="mt-4 text-xs text-muted">{slot.label}</p> : null}
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm font-medium", className)}>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-2xl border border-line bg-cream px-3 text-sm font-normal"
      />
    </label>
  );
}
