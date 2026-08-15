import { Editorial } from "@/components/Editorial";

export const metadata = { title: "Comment ça marche ?" };

export default function HowPage() {
  return (
    <Editorial title="Comment ça marche ?" kicker="Simple, flexible, sans engagement">
      <ol className="space-y-6">
        <li>
          <strong>1. Choisissez vos plats.</strong> Parcourez le catalogue, filtrez selon votre envie, ou composez une
          box de 5, 10 ou 14 plats.
        </li>
        <li>
          <strong>2. On cuisine le jour même.</strong> Nos équipes préparent vos recettes avec des ingrédients frais, dans
          nos cuisines en France.
        </li>
        <li>
          <strong>3. Livraison au frais.</strong> Choisissez un créneau. Vos plats arrivent dans une box isolée, prêts à
          réchauffer.
        </li>
        <li>
          <strong>4. Réchauffez, dégustez.</strong> 3 à 5 minutes. Comme si c’était les vôtres.
        </li>
      </ol>
    </Editorial>
  );
}
