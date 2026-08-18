"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DeliveryLocation } from "@/lib/delivery-zones";

type DeliveryContextValue = {
  location: DeliveryLocation | null;
  setLocation: (location: DeliveryLocation | null) => void;
};

const DeliveryContext = createContext<DeliveryContextValue>({
  location: null,
  setLocation: () => undefined,
});

export function DeliveryProvider({
  initial,
  children,
}: {
  initial: DeliveryLocation | null;
  children: ReactNode;
}) {
  const [location, setLocation] = useState(initial);
  useEffect(() => {
    setLocation(initial);
  }, [initial]);
  const value = useMemo(() => ({ location, setLocation }), [location]);
  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}

export function useDelivery() {
  return useContext(DeliveryContext);
}
