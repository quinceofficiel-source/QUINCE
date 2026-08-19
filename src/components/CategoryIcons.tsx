import type { ReactNode } from "react";
import type { CategoryId } from "@/types/product";

function Shadow() {
  return <ellipse cx="32" cy="57" rx="17" ry="3.4" fill="#111" opacity="0.1" />;
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
      <defs>
        <linearGradient id="m-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6C177" />
          <stop offset="55%" stopColor="#D9822B" />
          <stop offset="100%" stopColor="#A85A14" />
        </linearGradient>
      </defs>
      <Shadow />
      <ellipse cx="32" cy="48" rx="20" ry="6.5" fill="#F4EFE6" />
      <ellipse cx="32" cy="47" rx="18" ry="5.2" fill="#fff" />
      <ellipse cx="22" cy="45" rx="5" ry="3.2" fill="#E8A23A" />
      <ellipse cx="42" cy="45" rx="5.5" ry="3.4" fill="#C97820" />
      <path d="M18 36c1-10 10-16 22-12 8 3 12 10 10 16-3 6-16 9-26 4-4-2-6-5-6-8Z" fill="url(#m-skin)" />
      <path d="M24 32c4-6 14-7 20-1" stroke="#FFE3A8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="28" cy="30" rx="3.2" ry="2.2" fill="#8B3A12" opacity="0.35" />
      <path d="M38 24c4-1 7 1 8 4" stroke="#5D8A3A" strokeWidth="1.6" fill="none" />
      <ellipse cx="44" cy="23" rx="2.2" ry="1.4" fill="#5D8A3A" />
    </>
  );
}

function GourmandIcon() {
  return (
    <>
      <defs>
        <linearGradient id="g-pasta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3C96B" />
          <stop offset="100%" stopColor="#C98A2A" />
        </linearGradient>
        <linearGradient id="g-sauce" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E24B4A" />
          <stop offset="100%" stopColor="#9B1D1C" />
        </linearGradient>
      </defs>
      <Shadow />
      <ellipse cx="32" cy="46" rx="18" ry="8" fill="#D9D3C7" />
      <ellipse cx="32" cy="42" rx="16" ry="7" fill="#fff" />
      <ellipse cx="32" cy="40" rx="13.5" ry="6" fill="url(#g-pasta)" />
      <path d="M22 38c4 4 8 1 12 3 5 2 8-1 12 2 0 3-8 6-18 4-5-1-8-4-6-9Z" fill="url(#g-sauce)" />
      <path d="M24 36c6 3 10-1 16 2" stroke="#FFF1C2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="37" r="1.3" fill="#FFF6D6" />
      <circle cx="36" cy="39" r="1.1" fill="#FFE08A" />
      <ellipse cx="40" cy="34" rx="2.4" ry="1.5" fill="#F7E7C6" />
    </>
  );
}

function LegerIcon() {
  return (
    <>
      <Shadow />
      <ellipse cx="32" cy="47" rx="18" ry="7" fill="#E7E1D6" />
      <ellipse cx="32" cy="44" rx="16.5" ry="6.5" fill="#fff" />
      <path d="M20 40c5-11 9-13 13-5 3-10 11-9 16 1-7 3-20 6-29 4Z" fill="#6BBF4A" />
      <path d="M23 41c5-8 10-7 13 1" fill="#8FD36A" />
      <path d="M30 36c4-7 10-5 12 2" fill="#4E9A34" />
      <circle cx="26" cy="41" r="2.6" fill="#E24B4A" />
      <circle cx="38" cy="39" r="2.3" fill="#F2A65A" />
      <ellipse cx="33" cy="42" rx="2.4" ry="1.6" fill="#F6D15A" />
      <path d="M42 36c5 1 8 4 8 7" fill="none" stroke="#C97820" strokeWidth="1.8" strokeLinecap="round" />
    </>
  );
}

function ProteineIcon() {
  return (
    <>
      <defs>
        <linearGradient id="p-fish" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4A07A" />
          <stop offset="45%" stopColor="#E26A4A" />
          <stop offset="100%" stopColor="#C44B32" />
        </linearGradient>
      </defs>
      <Shadow />
      <ellipse cx="32" cy="48" rx="19" ry="6" fill="#F4EFE6" />
      <ellipse cx="32" cy="47" rx="17" ry="5" fill="#fff" />
      <path d="M14 36c3-9 14-14 26-8 7 4 12 10 10 15-4 6-18 8-28 2-5-3-8-6-8-9Z" fill="url(#p-fish)" />
      <path d="M22 34c6-3 14-2 18 4" stroke="#FFD0B8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M26 32c5 0 10 2 12 6" stroke="#FFB08A" strokeWidth="1.2" fill="none" />
      <ellipse cx="44" cy="28" rx="4.5" ry="4.5" fill="#FFE566" />
      <ellipse cx="44" cy="28" rx="3" ry="3" fill="#FFF3A8" />
      <path d="M44 24 v8 M40 28 h8" stroke="#E2C84A" strokeWidth="0.7" />
    </>
  );
}

function VegeIcon() {
  return (
    <>
      <Shadow />
      <ellipse cx="32" cy="47" rx="18" ry="7" fill="#E8F0E4" />
      <ellipse cx="32" cy="44" rx="16" ry="6.2" fill="#F7FBF4" />
      <ellipse cx="32" cy="42" rx="12" ry="5" fill="#F4E4B8" />
      <circle cx="24" cy="40" r="4.2" fill="#7CB342" />
      <circle cx="32" cy="38" r="4.8" fill="#43A047" />
      <circle cx="40" cy="40" r="3.8" fill="#F2A65A" />
      <circle cx="28" cy="43" r="2.4" fill="#E24B4A" />
      <ellipse cx="37" cy="43" rx="3" ry="2" fill="#8D6E63" />
      <path d="M22 34c3-6 8-6 10 0" fill="#66BB6A" />
      <circle cx="41" cy="36" r="2" fill="#FFD400" />
    </>
  );
}

function DecouverteIcon() {
  return (
    <>
      <defs>
        <linearGradient id="d-broth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7A04A" />
          <stop offset="100%" stopColor="#B45A1A" />
        </linearGradient>
      </defs>
      <Shadow />
      <ellipse cx="32" cy="48" rx="18" ry="6.5" fill="#D7D0C6" />
      <ellipse cx="32" cy="44" rx="16" ry="8" fill="#2B2B2B" />
      <ellipse cx="32" cy="42" rx="13.5" ry="6.5" fill="url(#d-broth)" />
      <path d="M22 41c4 2 8-2 12 0s8 3 12 0" stroke="#F1D39A" strokeWidth="1.4" fill="none" />
      <path d="M24 40c5 3 9-1 14 1" stroke="#C98A2A" strokeWidth="1.2" fill="none" />
      <ellipse cx="26" cy="39" rx="3.2" ry="2.4" fill="#F6E2B3" />
      <ellipse cx="26" cy="38.4" rx="2.2" ry="1.5" fill="#F3C96B" />
      <path d="M38 36c4-1 7 2 6 5-3 2-7 2-8-1" fill="#5D8A3A" />
      <rect x="44" y="18" width="2.2" height="22" rx="1" fill="#111" transform="rotate(18 45 29)" />
      <rect x="48" y="17" width="2.2" height="22" rx="1" fill="#111" transform="rotate(18 49 28)" />
    </>
  );
}

function ExpressIcon() {
  return (
    <>
      <Shadow />
      <path d="M16 40 L32 24 L50 40 L32 48 Z" fill="#E7D7B1" />
      <path d="M18 39 L32 26 L48 39 L32 46 Z" fill="#F4E4C3" />
      <path d="M20 38 L32 28 L44 38 L32 44 Z" fill="#7CB342" />
      <path d="M22 37 L32 30 L42 37 L32 42 Z" fill="#E24B4A" />
      <path d="M24 36 L32 31 L40 36 L32 40 Z" fill="#F6DFA8" />
      <path d="M16 40 L32 48 L50 40" fill="none" stroke="#C8B48A" strokeWidth="1.2" />
    </>
  );
}

function FamilleIcon() {
  return (
    <>
      <defs>
        <linearGradient id="f-chicken" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0C078" />
          <stop offset="100%" stopColor="#C56A20" />
        </linearGradient>
      </defs>
      <Shadow />
      <ellipse cx="32" cy="48" rx="21" ry="6" fill="#D7CCC8" />
      <ellipse cx="32" cy="44" rx="20" ry="8" fill="#A1887F" />
      <ellipse cx="32" cy="42" rx="17" ry="6.5" fill="#fff8ee" />
      <path d="M20 34c2-8 10-12 20-8 7 3 10 9 8 14-4 5-16 7-24 2-3-2-5-5-4-8Z" fill="url(#f-chicken)" />
      <ellipse cx="18" cy="40" rx="4" ry="2.6" fill="#E24B4A" />
      <ellipse cx="44" cy="40" rx="4.2" ry="2.8" fill="#7CB342" />
      <ellipse cx="32" cy="41" rx="4" ry="2.4" fill="#F2A65A" />
    </>
  );
}

function DuoIcon() {
  return (
    <>
      <Shadow />
      <ellipse cx="24" cy="46" rx="12" ry="5" fill="#E7E1D6" />
      <ellipse cx="24" cy="43" rx="10.5" ry="5.5" fill="#fff" />
      <ellipse cx="24" cy="41" rx="8" ry="4" fill="#C45C26" />
      <ellipse cx="24" cy="39.5" rx="6" ry="2.8" fill="#E07A3D" />
      <ellipse cx="40" cy="46" rx="12" ry="5" fill="#E7E1D6" />
      <ellipse cx="40" cy="43" rx="10.5" ry="5.5" fill="#fff" />
      <ellipse cx="40" cy="41" rx="8" ry="4" fill="#7CB342" />
      <ellipse cx="40" cy="39.5" rx="6" ry="2.8" fill="#A5D66A" />
      <circle cx="22" cy="39" r="1.2" fill="#FFD400" />
      <circle cx="42" cy="39" r="1.2" fill="#E24B4A" />
    </>
  );
}

function KidsIcon() {
  return (
    <>
      <Shadow />
      <ellipse cx="32" cy="48" rx="16" ry="5" fill="#F4EFE6" />
      <ellipse cx="22" cy="40" rx="7" ry="5.5" fill="#E2A04A" />
      <ellipse cx="22" cy="39" rx="5.5" ry="4" fill="#F2C36B" />
      <ellipse cx="32" cy="38" rx="7.5" ry="6" fill="#D9822B" />
      <ellipse cx="32" cy="37" rx="6" ry="4.4" fill="#E8A23A" />
      <ellipse cx="43" cy="40" rx="7" ry="5.5" fill="#E2A04A" />
      <ellipse cx="43" cy="39" rx="5.5" ry="4" fill="#F2C36B" />
      <circle cx="20" cy="38" r="0.8" fill="#111" opacity="0.25" />
      <circle cx="34" cy="36" r="0.8" fill="#111" opacity="0.25" />
    </>
  );
}

function NouveauIcon() {
  return (
    <>
      <Shadow />
      <ellipse cx="32" cy="48" rx="17" ry="5.5" fill="#E7E1D6" />
      <ellipse cx="32" cy="45" rx="15" ry="6" fill="#fff" />
      <ellipse cx="32" cy="42" rx="11" ry="8" fill="#7CB342" />
      <ellipse cx="32" cy="40" rx="8" ry="5.5" fill="#F4A07A" />
      <ellipse cx="32" cy="38" rx="6" ry="3.5" fill="#FFF3A8" />
      <circle cx="28" cy="39" r="1.4" fill="#E24B4A" />
      <circle cx="36" cy="40" r="1.2" fill="#43A047" />
      <path d="M46 18 l1.6 4.4 4.4 1.6-4.4 1.6L46 30 l-1.6-4.4-4.4-1.6 4.4-1.6Z" fill="#FFD400" />
    </>
  );
}

function FavorisIcon() {
  return (
    <>
      <defs>
        <linearGradient id="fav-berry" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
      </defs>
      <Shadow />
      <ellipse cx="32" cy="48" rx="14" ry="5" fill="#F4EFE6" />
      <path d="M32 46 C18 34 16 22 24 18c5-2 8 1 8 6 0-5 3-8 8-6 8 4 6 16-8 28Z" fill="url(#fav-berry)" />
      <path d="M26 24c3-4 7-3 8 1" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="28" cy="22" rx="3" ry="2" fill="#FFD0D0" opacity="0.7" />
    </>
  );
}

function SucreIcon() {
  return (
    <>
      <defs>
        <linearGradient id="s-cake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8D7C8" />
          <stop offset="50%" stopColor="#E8A090" />
          <stop offset="100%" stopColor="#C97860" />
        </linearGradient>
      </defs>
      <Shadow />
      <path d="M18 42 L32 20 L48 42 Z" fill="url(#s-cake)" />
      <path d="M22 42 L32 26 L44 42 Z" fill="#FFF6F0" />
      <path d="M18 42 h30 v7 H18 Z" fill="#8D6E63" />
      <path d="M18 42 h30" stroke="#6D4C41" />
      <ellipse cx="32" cy="22" rx="4.5" ry="3.2" fill="#E24B4A" />
      <path d="M32 16c5-7 10 0 0 6" fill="#FF4D6D" />
      <circle cx="26" cy="28" r="1.4" fill="#7CB342" />
      <circle cx="38" cy="30" r="1.3" fill="#FFD400" />
      <circle cx="30" cy="34" r="1.1" fill="#E24B4A" />
    </>
  );
}
