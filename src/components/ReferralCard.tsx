import { BANNER_IMAGES } from "@/data/products";
import { PromoBanner } from "@/components/PromoBanner";

export function ReferralCard() {
  return (
    <PromoBanner
      tone="blush"
      title="Parrainage"
      text="Offrez 10 €, recevez 10 € ! Partagez Quince avec un ami, vous y gagnez tous les deux."
      cta="Parrainer un ami"
      href="/parrainage"
      image={BANNER_IMAGES.referral}
      imageAlt="Carte cadeau Quince échangée entre deux mains"
    />
  );
}
