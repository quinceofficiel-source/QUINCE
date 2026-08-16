"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX, X } from "lucide-react";
import type { AdminNotification } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";
import { enableOrderSound, isOrderSoundEnabled, playOrderSound } from "@/components/admin/orderSound";

const FRESH_MS = 2 * 60 * 1000;

export function OrderAlert() {
  const router = useRouter();
  const seen = useRef(new Set<string>());
  const [toast, setToast] = useState<AdminNotification | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    setSoundOn(isOrderSoundEnabled());
    const sync = () => setSoundOn(isOrderSoundEnabled());
    window.addEventListener("quince:order-sound", sync);
    return () => window.removeEventListener("quince:order-sound", sync);
  }, []);

  const showOrder = useCallback(
    (item: AdminNotification) => {
      setToast(item);
      if (isOrderSoundEnabled()) {
        void playOrderSound().catch(() => undefined);
      }
      router.refresh();
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setToast(null), 10000);
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    async function tick(isFirst: boolean) {
      const response = await fetch("/api/admin/live-orders", { cache: "no-store" });
      if (!response.ok || cancelled) return;
      const data = (await response.json()) as { notifications: AdminNotification[] };
      const now = Date.now();
      const incoming = data.notifications.filter((item) => item.type === "order");

      if (isFirst) {
        incoming.forEach((item) => {
          const age = now - new Date(item.at).getTime();
          if (Number.isNaN(age) || age > FRESH_MS) seen.current.add(item.id);
        });
      }

      const fresh = incoming.filter((item) => !seen.current.has(item.id));
      if (!fresh.length) return;
      fresh.forEach((item) => seen.current.add(item.id));
      showOrder(fresh[0]!);
    }

    void tick(true);
    const id = window.setInterval(() => void tick(false), 1500);
    const onVisible = () => {
      if (document.visibilityState === "visible") void tick(false);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [showOrder]);

  async function turnSoundOn() {
    try {
      await enableOrderSound();
      setSoundOn(true);
    } catch {
      setSoundOn(false);
    }
  }

  return (
    <>
      {!soundOn ? (
        <button
          type="button"
          onClick={() => void turnSoundOn()}
          className="fixed bottom-6 left-6 z-[70] inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-lg print:hidden lg:left-[calc(15rem+1.5rem)]"
        >
          <VolumeX className="h-4 w-4 text-quince" />
          Activer le son des commandes
        </button>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-6 z-[80] w-[min(100%-2rem,22rem)] print:hidden lg:left-[calc(15rem+1.5rem)]">
          <div className="pointer-events-auto overflow-hidden rounded-2xl bg-ink text-white shadow-[0_24px_60px_-20px_rgba(17,17,17,0.55)]">
            <div className="h-1 bg-quince" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-quince uppercase">Nouvelle commande</p>
                <button type="button" onClick={() => setToast(null)} className="rounded-full p-1 text-white/70 hover:text-white" aria-label="Fermer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{toast.amount != null ? formatPrice(toast.amount) : toast.orderId}</p>
              <p className="mt-1 text-sm text-white/75">{toast.customerName ?? toast.body}</p>
              <p className="mt-1 text-xs text-white/50">{toast.orderId}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={toast.href}
                  onClick={() => setToast(null)}
                  className="inline-flex h-10 items-center rounded-full bg-quince px-4 text-sm font-semibold text-ink"
                >
                  Voir la commande
                </Link>
                {!soundOn ? (
                  <button type="button" onClick={() => void turnSoundOn()} className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-white/80 hover:text-white">
                    <Volume2 className="h-4 w-4" />
                    Écouter
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
