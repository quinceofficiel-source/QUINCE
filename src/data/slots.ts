import type { DeliverySlot } from "@/types/product";

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: "today-18", label: "Aujourd’hui · 18h – 20h", day: "Aujourd’hui", hours: "18h – 20h" },
  { id: "today-20", label: "Aujourd’hui · 20h – 22h", day: "Aujourd’hui", hours: "20h – 22h" },
  { id: "tomorrow-12", label: "Demain · 12h – 14h", day: "Demain", hours: "12h – 14h" },
  { id: "tomorrow-18", label: "Demain · 18h – 20h", day: "Demain", hours: "18h – 20h" },
  { id: "tomorrow-20", label: "Demain · 20h – 22h", day: "Demain", hours: "20h – 22h" },
  { id: "sat-11", label: "Samedi · 11h – 13h", day: "Samedi", hours: "11h – 13h" },
  { id: "sat-18", label: "Samedi · 18h – 20h", day: "Samedi", hours: "18h – 20h" },
];
