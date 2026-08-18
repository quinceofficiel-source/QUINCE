import type { ReactNode } from "react";
import type { CategoryId } from "@/types/product";

function Ground() {
  return <ellipse cx="32" cy="58" rx="16" ry="3.2" fill="#111111" opacity="0.08" />;
}

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = ICONS[id];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <Icon />
    </svg>
  );
}

const ICONS: Record<CategoryId, () => ReactNode> = {
  maison: MaisonIcon,
  gourmand: GourmandIcon,
  leger: LegerIcon,
  proteine: ProteineIcon,
  vege: VegeIcon,
  decouverte: DecouverteIcon,
  express: ExpressIcon,
  famille: FamilleIcon,
  duo: DuoIcon,
  kids: KidsIcon,
  nouveau: NouveauIcon,
  favoris: FavorisIcon,
  sucre: SucreIcon,
};

function MaisonIcon() {
  return (
    <>
      <Ground />
      <path d="M12 30 L32 14 L52 30 V50 H12 Z" fill="#F4C95D" />
      <path d="M12 30 L32 14 L52 30 H12 Z" fill="#FFD400" />
      <rect x="26" y="36" width="12" height="14" rx="1.5" fill="#173C2B" />
      <circle cx="44" cy="38" r="3" fill="#fff" />
      <path d="M32 10 v6" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="9" r="2" fill="#E24B4A" />
    </>
  );
}

function GourmandIcon() {
  return (
    <>
      <Ground />
      <ellipse cx="32" cy="42" rx="18" ry="8" fill="#C45C26" />
      <ellipse cx="32" cy="38" rx="16" ry="7" fill="#E24B4A" />
      <ellipse cx="32" cy="34" rx="13" ry="6" fill="#F4A261" />
      <ellipse cx="32" cy="31" rx="10" ry="4.5" fill="#FFE8A3" />
      <circle cx="28" cy="30" r="1.6" fill="#E24B4A" />
      <circle cx="35" cy="32" r="1.4" fill="#2A9D8F" />
      <path d="M22 24c4-8 16-8 20 0" fill="none" stroke="#F4E3DC" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function LegerIcon() {
  return (
    <>
      <Ground />
      <ellipse cx="32" cy="44" rx="18" ry="7" fill="#F3EFE6" />
      <ellipse cx="32" cy="42" rx="16" ry="6" fill="#fff" stroke="#E7E1D6" />
      <path d="M20 38c6-10 10-12 14-4 4-9 12-8 16 2-8 2-20 4-30 2Z" fill="#7CB342" />
      <path d="M24 40c5-7 9-6 12 0" fill="#8BC34A" />
      <circle cx="38" cy="39" r="3.2" fill="#E24B4A" />
      <circle cx="28" cy="41" r="2.2" fill="#FFD400" />
      <path d="M42 36c4 0 7 3 7 6" fill="none" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function ProteineIcon() {
  return (
    <>
      <Ground />
      <ellipse cx="32" cy="46" rx="17" ry="6" fill="#F3EFE6" />
      <path d="M16 36c2-10 14-16 26-10 6 3 8 10 6 16-8 4-22 4-32-6Z" fill="#C45C26" />
      <path d="M20 35c3-7 12-10 20-6 3 2 5 6 4 10-7 3-18 2-24-4Z" fill="#E07A3D" />
      <path d="M26 32c4-2 10-1 12 3" stroke="#FFE8A3" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="40" y="22" width="8" height="3" rx="1.5" fill="#7CB342" transform="rotate(18 44 23.5)" />
    </>
  );
}

function VegeIcon() {
  return (
    <>
      <Ground />
      <ellipse cx="32" cy="46" rx="16" ry="6" fill="#E8F5E9" />
      <path d="M32 18c10 8 12 20 0 30C20 38 22 26 32 18Z" fill="#43A047" />
      <path d="M32 22c6 6 8 14 0 22" fill="#66BB6A" />
      <path d="M32 18 v22" stroke="#173C2B" strokeWidth="1.6" />
      <circle cx="44" cy="34" r="6" fill="#7CB342" />
      <path d="M44 28 v8" stroke="#173C2B" strokeWidth="1.2" />
    </>
  );
}

function DecouverteIcon() {
  return (
    <>
      <Ground />
      <circle cx="32" cy="32" r="16" fill="#4FC3F7" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="#173C2B" strokeWidth="1.5" />
      <ellipse cx="32" cy="32" rx="7" ry="16" fill="none" stroke="#173C2B" strokeWidth="1.4" />
      <path d="M16 32 h32 M18 24 h28 M18 40 h28" stroke="#173C2B" strokeWidth="1.3" />
      <path d="M24 20c8 4 12 10 16 22" stroke="#FFD400" strokeWidth="2" fill="none" />
    </>
  );
}

function ExpressIcon() {
  return (
    <>
      <Ground />
      <rect x="18" y="24" width="28" height="22" rx="3" fill="#FFD400" />
      <rect x="18" y="24" width="28" height="8" rx="3" fill="#111" />
      <path d="M32 18 l-6 14 h6 l-4 12 14-18 h-7 l5-8Z" fill="#FF6F00" />
    </>
  );
}

function FamilleIcon() {
  return (
    <>
      <Ground />
      <ellipse cx="32" cy="46" rx="20" ry="7" fill="#D7CCC8" />
      <path d="M14 34 h36 v8 H14 Z" fill="#8D6E63" />
      <path d="M18 22 h28 l4 12 H14 Z" fill="#A1887F" />
      <circle cx="24" cy="28" r="3" fill="#E24B4A" />
      <circle cx="32" cy="27" r="3.4" fill="#FFD400" />
      <circle cx="40" cy="28" r="3" fill="#7CB342" />
      <rect x="28" y="16" width="8" height="8" rx="1" fill="#5D4037" />
    </>
  );
}

function DuoIcon() {
  return (
    <>
      <Ground />
      <circle cx="24" cy="34" r="12" fill="#F8BBD0" />
      <circle cx="40" cy="34" r="12" fill="#BBDEFB" />
      <circle cx="24" cy="34" r="7" fill="#fff" />
      <circle cx="40" cy="34" r="7" fill="#fff" />
      <path d="M24 30c2 4 6 4 8 0" stroke="#E24B4A" strokeWidth="1.6" fill="none" />
      <path d="M36 30c2 4 6 4 8 0" stroke="#1E88E5" strokeWidth="1.6" fill="none" />
    </>
  );
}

function KidsIcon() {
  return (
    <>
      <Ground />
      <circle cx="32" cy="30" r="14" fill="#FFD400" />
      <circle cx="27" cy="27" r="2" fill="#111" />
      <circle cx="37" cy="27" r="2" fill="#111" />
      <path d="M26 35c3 4 9 4 12 0" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 18 l4 5 M44 18 l-4 5" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="16" r="2.2" fill="#E24B4A" />
      <circle cx="46" cy="16" r="2.2" fill="#7CB342" />
    </>
  );
}

function NouveauIcon() {
  return (
    <>
      <Ground />
      <rect x="18" y="20" width="28" height="28" rx="6" fill="#111" />
      <rect x="21" y="23" width="22" height="22" rx="4" fill="#FFD400" />
      <path d="M32 28 v12 M26 34 h12" stroke="#111" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="46" cy="18" r="4" fill="#E24B4A" />
      <path d="M46 15 v6 M43 18 h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

function FavorisIcon() {
  return (
    <>
      <Ground />
      <path
        d="M32 48 L16 32c-4-4-4-11 2-15 5-3 10-1 14 5 4-6 9-8 14-5 6 4 6 11 2 15Z"
        fill="#E24B4A"
      />
      <path d="M24 28c2-4 6-5 8-2" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function SucreIcon() {
  return (
    <>
      <Ground />
      <path d="M18 40 L32 18 L46 40 Z" fill="#F8BBD0" />
      <path d="M22 40 L32 24 L42 40 Z" fill="#fff" />
      <path d="M18 40 h28 v6 H18 Z" fill="#8D6E63" />
      <circle cx="32" cy="22" r="4" fill="#E24B4A" />
      <circle cx="28" cy="20" r="2.2" fill="#7CB342" />
      <path d="M32 16 c6-8 12 0 0 6" fill="#FFD400" />
    </>
  );
}
