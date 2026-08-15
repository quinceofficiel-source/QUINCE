import { Container } from "@/components/Container";
import { MealBoxBuilder } from "@/components/MealBoxBuilder";

export const metadata = {
  title: "Composer ma box",
};

export default function BoxPage() {
  return (
    <Container className="py-10 pb-20">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Composez votre semaine</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Choisissez une formule, puis sélectionnez vos plats. La barre de progression vous guide jusqu’à une box prête à
        livrer.
      </p>
      <div className="mt-10">
        <MealBoxBuilder />
      </div>
    </Container>
  );
}
