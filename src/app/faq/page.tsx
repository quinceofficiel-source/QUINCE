import { Editorial } from "@/components/Editorial";

export const metadata = { title: "FAQ" };

const faqs = [
  ["Faut-il s’abonner ?", "Non. Commandez à la carte ou composez une box, sans engagement."],
  ["Comment réchauffer les plats ?", "La plupart se réchauffent en 3 à 5 minutes au micro-ondes, ou au four. Les instructions sont sur chaque fiche."],
  ["Combien de temps se conservent-ils ?", "En général 2 à 3 jours au réfrigérateur, selon le plat. Voir la fiche produit."],
  ["Livrez-vous partout ?", "Nous livrons dans notre zone actuelle. Le détail est indiqué au checkout."],
  ["Puis-je commander pour une famille ?", "Oui. Plusieurs plats existent en 2 ou 4 portions, et une catégorie Famille / Kids est prévue."],
];

export default function FaqPage() {
  return (
    <Editorial title="FAQ" kicker="Aide">
      <div className="space-y-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-sm text-muted">{a}</p>
          </details>
        ))}
      </div>
    </Editorial>
  );
}
