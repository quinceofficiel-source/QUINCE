import { Editorial } from "@/components/Editorial";

export const metadata = { title: "Notre histoire" };

export default function StoryPage() {
  return (
    <Editorial title="Notre histoire" kicker="Quince">
      <p>
        Tout est parti d’une cuisine trop petite et d’une semaine trop pleine. L’envie d’un vrai plat — pas d’un
        sandwich, pas d’un bol avalé devant l’écran — et pas le temps de le faire.
      </p>
      <p>
        Quince, c’est le fruit un peu oublié, parfumé, généreux. Un nom pour des recettes qui ont le goût d’avoir été
        cuisinées pour quelqu’un, pas pour une chaîne.
      </p>
    </Editorial>
  );
}
