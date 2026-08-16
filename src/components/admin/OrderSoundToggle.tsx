"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { disableOrderSound, enableOrderSound, isOrderSoundEnabled } from "@/components/admin/orderSound";

export function OrderSoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isOrderSoundEnabled());
    const sync = () => setOn(isOrderSoundEnabled());
    window.addEventListener("quince:order-sound", sync);
    return () => window.removeEventListener("quince:order-sound", sync);
  }, []);

  async function toggle() {
    if (on) {
      disableOrderSound();
      setOn(false);
      return;
    }
    try {
      await enableOrderSound();
      setOn(true);
    } catch {
      setOn(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream"
      aria-label={on ? "Couper le son des commandes" : "Activer le son des commandes"}
      title={on ? "Son des commandes activé" : "Activer le son des commandes"}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted" />}
    </button>
  );
}
