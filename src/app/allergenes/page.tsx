import { Editorial } from "@/components/Editorial";
import { products } from "@/data/products";

export const metadata = { title: "Allergènes" };

export default function AllergensPage() {
  return (
    <Editorial title="Allergènes" kicker="Aide">
      <p>
        Chaque fiche produit liste les allergènes. Voici un aperçu des mentions les plus fréquentes dans nos recettes :
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {[...new Set(products.flatMap((product) => product.allergens))].sort().map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>En cas de doute, écrivez-nous avant de commander. Nos équipes croisent les fiches en cuisine.</p>
    </Editorial>
  );
}
