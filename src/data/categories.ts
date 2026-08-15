import type { CategoryId, Cuisine } from "@/types/product";

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  href: string;
};

export const CATEGORIES: Category[] = [
  { id: "maison", label: "Maison", emoji: "🏠", href: "/plats?categorie=maison" },
  { id: "gourmand", label: "Gourmand", emoji: "😋", href: "/plats?categorie=gourmand" },
  { id: "leger", label: "Léger", emoji: "🥗", href: "/plats?categorie=leger" },
  { id: "proteine", label: "Protéiné", emoji: "💪", href: "/plats?categorie=proteine" },
  { id: "vege", label: "Végé", emoji: "🌱", href: "/plats?categorie=vege" },
  { id: "decouverte", label: "Découverte", emoji: "🌍", href: "/plats?categorie=decouverte" },
  { id: "express", label: "Express", emoji: "⚡", href: "/plats?categorie=express" },
  { id: "famille", label: "Famille", emoji: "👨‍👩‍👧", href: "/plats?categorie=famille" },
  { id: "duo", label: "Duo", emoji: "💕", href: "/plats?categorie=duo" },
  { id: "kids", label: "Kids", emoji: "👶", href: "/plats?categorie=kids" },
  { id: "nouveau", label: "Nouveau", emoji: "✨", href: "/plats?nouveautes=1" },
  { id: "favoris", label: "Favoris", emoji: "❤️", href: "/favoris" },
  { id: "sucre", label: "Sucré", emoji: "🍰", href: "/plats?categorie=sucre" },
];

export const CUISINES: { id: Cuisine; label: string; flag: string }[] = [
  { id: "france", label: "France", flag: "🇫🇷" },
  { id: "italie", label: "Italie", flag: "🇮🇹" },
  { id: "maghreb", label: "Maghreb", flag: "🇲🇦" },
  { id: "afrique", label: "Afrique", flag: "🌍" },
  { id: "asie", label: "Asie", flag: "🌏" },
  { id: "inde", label: "Inde", flag: "🇮🇳" },
];

export const NAV_LINKS = [
  { href: "/plats", label: "Nos plats" },
  { href: "/composer-ma-box", label: "Composer ma box" },
  { href: "/comment-ca-marche", label: "Comment ça marche ?" },
  { href: "/a-propos", label: "À propos de nous" },
] as const;
