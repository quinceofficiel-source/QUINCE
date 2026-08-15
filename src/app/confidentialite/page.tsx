import { Editorial } from "@/components/Editorial";

export const metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <Editorial title="Confidentialité" kicker="Légal">
      <p>
        Quince ne collecte, dans cette version, que les informations nécessaires à la démonstration du parcours
        (panier, favoris, dernière commande) via le stockage local de votre navigateur.
      </p>
      <p>
        Aucune donnée n’est envoyée à un serveur tiers. Lorsque le paiement Stripe sera branché, les données bancaires
        transiteront exclusivement par Stripe, jamais par nos serveurs.
      </p>
    </Editorial>
  );
}
