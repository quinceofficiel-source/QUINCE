"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { AdminNotification } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  const AudioCtor =
    window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioCtx) audioCtx = new AudioCtor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function playChaChing() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const ding = (freq: number, start: number, duration: number, gain: number) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + start);
    amp.gain.setValueAtTime(0.0001, now + start);
    amp.gain.exponentialRampToValueAtTime(gain, now + start + 0.018);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + duration + 0.04);
  };

  ding(1318.51, 0, 0.14, 0.11);
  ding(1760, 0.09, 0.28, 0.13);
  ding(2093, 0.16, 0.4, 0.07);
}

export function OrderAlert() {
  const router = useRouter();
  const seen = useRef(new Set<string>());
  const [toast, setToast] = useState<AdminNotification | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const unlock = () => {
      getAudioContext();
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function tick(isFirst: boolean) {
      const response = await fetch("/api/admin/live-orders", { cache: "no-store" });
      if (!response.ok || cancelled) return;
      const data = (await response.json()) as { notifications: AdminNotification[] };
      if (isFirst) {
        data.notifications.forEach((item) => seen.current.add(item.id));
        return;
      }
      const fresh = data.notifications.filter((item) => item.type === "order" && !seen.current.has(item.id));
      if (!fresh.length) return;
      fresh.forEach((item) => seen.current.add(item.id));
      const latest = fresh[0]!;
      setToast(latest);
      playChaChing();
      router.refresh();
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setToast(null), 8000);
    }

    void tick(true);
    const id = window.setInterval(() => void tick(false), 3000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [router]);

  if (!toast) return null;

  return (
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
          <Link
            href={toast.href}
            onClick={() => setToast(null)}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-quince px-4 text-sm font-semibold text-ink"
          >
            Voir la commande
          </Link>
        </div>
      </div>
    </div>
  );
}
