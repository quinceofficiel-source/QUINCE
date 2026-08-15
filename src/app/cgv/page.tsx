import { Editorial } from "@/components/Editorial";

export const metadata = { title: "Conditions générales de vente" };

export default function CgvPage() {
  return (
    <Editorial title="Conditions générales de vente" kicker="Légal">
      <p>
        Les présentes CGV régissent les commandes passées sur quince.fr. Quince propose des plats préparés frais, livrés
        à domicile dans la zone desservie.
      </p>
      <p>
        Les prix sont indiqués en euros TTC. Le paiement est exigible à la commande. En l’absence d’intégration Stripe
        dans cette version de démonstration, aucun débit réel n’est effectué.
      </p>
      <p>
        Vous pouvez modifier ou annuler une commande tant qu’elle n’est pas partie en cuisine. Les plats étant périssables,
        le droit de rétractation ne s’applique pas aux denrées livrées.
      </p>
    </Editorial>
  );
}
