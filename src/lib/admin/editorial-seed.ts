import { BANNER_IMAGES } from "@/data/products";
import type { EditorialCampaign } from "@/lib/admin/types";

export function seedEditorialCampaigns(now = new Date()): EditorialCampaign[] {
  const start = new Date(now.getTime() - 2 * 86400000).toISOString();
  const end = new Date(now.getTime() + 120 * 86400000).toISOString();

  return [
    {
      id: "edit-weekly",
      title: "Quince chaque semaine.",
      subtitle: "Vos plats préférés reviennent chez vous, sans avoir à y penser.",
      buttonLabel: "Découvrir l’abonnement",
      buttonLink: "/composer-ma-box",
      image: BANNER_IMAGES.box,
      backgroundColor: "#111111",
      textColor: "#ffffff",
      badge: "Routine",
      campaignType: "subscription",
      startsAt: start,
      endsAt: end,
      order: 1,
      active: true,
    },
    {
      id: "edit-sharing",
      title: "Le repas du dimanche est prêt.",
      subtitle: "Découvrez nos grands plats à partager pour toute la famille.",
      buttonLabel: "Voir les repas à partager",
      buttonLink: "/?format=partage",
      image: BANNER_IMAGES.family,
      backgroundColor: "#ffd400",
      textColor: "#111111",
      badge: "",
      campaignType: "sharing",
      startsAt: start,
      endsAt: end,
      order: 2,
      active: false,
    },
    {
      id: "edit-new",
      title: "Nouveau cette semaine.",
      subtitle: "Découvrez les dernières recettes préparées par nos cuisines.",
      buttonLabel: "Découvrir",
      buttonLink: "/?nouveautes=1",
      image: BANNER_IMAGES.pleasure,
      backgroundColor: "#111111",
      textColor: "#ffffff",
      badge: "Nouveauté",
      campaignType: "menu",
      startsAt: start,
      endsAt: end,
      order: 3,
      active: false,
    },
    {
      id: "edit-referral",
      title: "Invitez un proche.",
      subtitle: "Parrainez un ami et profitez tous les deux d’un avantage Quince.",
      buttonLabel: "Parrainer",
      buttonLink: "/parrainage",
      image: BANNER_IMAGES.referral,
      backgroundColor: "#ffffff",
      textColor: "#111111",
      badge: "Parrainage",
      campaignType: "referral",
      startsAt: start,
      endsAt: end,
      order: 4,
      active: false,
    },
  ];
}
