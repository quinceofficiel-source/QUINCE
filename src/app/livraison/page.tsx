import { Editorial } from "@/components/Editorial";
import { BANNER_IMAGES } from "@/data/products";
import Image from "next/image";

export const metadata = { title: "Livraison" };

export default function DeliveryPage() {
  return (
    <Editorial title="Livraison gratuite dès 60 €" kicker="Chez vous, au frais">
      <div className="relative mb-8 h-56 overflow-hidden rounded-[1.5rem]">
        <Image src={BANNER_IMAGES.delivery} alt="Sac Quince rempli de produits frais" fill className="object-cover" />
      </div>
      <p>
        Nous livrons dans notre zone, en créneaux de deux heures, dans une box isolée. Les plats restent au froid jusqu’à
        votre porte.
      </p>
      <p>
        La livraison est offerte dès 60 € d’achat. En dessous, une participation de 5,90 € s’applique. Sans abonnement,
        sans engagement.
      </p>
    </Editorial>
  );
}
