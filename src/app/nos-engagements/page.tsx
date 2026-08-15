import { Editorial } from "@/components/Editorial";

export const metadata = { title: "Nos engagements" };

export default function ValuesPage() {
  return (
    <Editorial title="Nos engagements" kicker="Quince">
      <p>Ingrédients frais, cuisinés le jour, livrés au froid. Sans abonnement forcé. Sans surpromesse santé.</p>
      <p>
        Nous travaillons avec des producteurs français dès que la saison le permet, et nous indiquons clairement les
        allergènes, les calories et les instructions de réchauffage.
      </p>
    </Editorial>
  );
}
