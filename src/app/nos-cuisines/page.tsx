import { Editorial } from "@/components/Editorial";
import { BANNER_IMAGES } from "@/data/products";
import Image from "next/image";

export const metadata = { title: "Nos cuisines" };

export default function KitchensPage() {
  return (
    <Editorial title="Nos cuisines" kicker="Quince">
      <div className="relative mb-8 h-56 overflow-hidden rounded-[1.5rem]">
        <Image src={BANNER_IMAGES.kitchen} alt="Cuisine Quince" fill className="object-cover" />
      </div>
      <p>
        Nous cuisinons chaque jour dans nos ateliers en France. Pas d’usine anonyme : des brigades, des saisons, des
        fournisseurs choisis, des recettes écrites pour être réchauffées sans perdre leur goût.
      </p>
    </Editorial>
  );
}
