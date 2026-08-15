import { Editorial } from "@/components/Editorial";

export const metadata = { title: "Mentions légales" };

export default function LegalPage() {
  return (
    <Editorial title="Mentions légales" kicker="Légal">
      <p>Quince — plats préparés frais livrés à domicile.</p>
      <p>Siège : 18 rue des Cuisines, 75011 Paris. Contact : bonjour@quince.fr</p>
      <p>Cette vitrine est une première version fonctionnelle, destinée à présenter l’expérience d’achat.</p>
    </Editorial>
  );
}
