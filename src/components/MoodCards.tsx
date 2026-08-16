import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { BANNER_IMAGES } from "@/data/products";

const moods = [
  { href: "/plats?categorie=gourmand", label: "Me faire plaisir", emoji: "😋", image: BANNER_IMAGES.pleasure },
  { href: "/plats?categorie=maison", label: "Manger maison", emoji: "🏠", image: BANNER_IMAGES.kitchen },
  { href: "/plats?categorie=leger", label: "Manger léger", emoji: "🥗", image: BANNER_IMAGES.light },
  { href: "/plats?categorie=decouverte", label: "Découvrir de nouvelles saveurs", emoji: "🌍", image: BANNER_IMAGES.world },
];

export function MoodCards() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h2 className="font-display text-[1.65rem] tracking-tight sm:text-4xl">Aujourd’hui, j’ai envie de...</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moods.map((mood) => (
            <Link
              key={mood.label}
              href={mood.href}
              className="group relative min-h-[220px] overflow-hidden rounded-[1.5rem]"
            >
              <Image
                src={mood.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-lg font-medium">
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
