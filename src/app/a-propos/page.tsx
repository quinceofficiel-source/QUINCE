import { Editorial } from "@/components/Editorial";
import { Button } from "@/components/Button";

export const metadata = { title: "À propos de nous" };

export default function AboutPage() {
  return (
    <Editorial title="À propos de nous" kicker="Quince">
      <p>
        Quince est né d’une idée simple : retrouver le goût d’un vrai plat maison, même les soirs trop remplis. Pas un
        régime. Pas une marketplace. Une cuisine.
      </p>
      <p>
        Nous cuisinons chaque jour des recettes généreuses — traditionnelles, gourmandes, légères, du monde, pour la
        famille ou pour deux — et nous les livrons au frais, chez vous.
      </p>
      <Button href="/notre-histoire" className="mt-4">
        Lire notre histoire
      </Button>
    </Editorial>
  );
}
