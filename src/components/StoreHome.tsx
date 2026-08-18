import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { MoodCards } from "@/components/MoodCards";
import { ProductCarousel } from "@/components/ProductCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { ReferralCard } from "@/components/ReferralCard";
import { TrustBar } from "@/components/TrustBar";
import { WorldSection } from "@/components/WorldSection";
import { BANNER_IMAGES, getDesserts, getFamilyDishes, getNewDishes, getPopular, getProteinRich } from "@/data/products";

export function StoreHome() {
  return (
    <>
      <Hero />
      <ProductCarousel title="Les plats les plus aimés" href="/plats?populaires=1" products={getPopular()} />
      <Container className="grid gap-5 pb-6 lg:grid-cols-3">
        <PromoBanner
          tone="sage"
          title="Composez votre semaine"
          text="Choisissez vos plats préférés et créez votre box sur mesure."
          cta="Composer ma box"
          href="/composer-ma-box"
          image={BANNER_IMAGES.box}
          imageAlt="Box Quince et plats préparés"
        />
        <PromoBanner
          tone="yellow"
          title="Livraison gratuite dès 60 € d’achat"
          text="Livraison rapide et fraîche partout dans la zone desservie."
          cta="En savoir plus"
          href="/livraison"
          image={BANNER_IMAGES.delivery}
          imageAlt="Sac Quince rempli de produits frais"
        />
        <ReferralCard />
      </Container>
      <MoodCards />
      <ProductCarousel title="Nouveautés de la semaine" href="/plats?nouveautes=1" products={getNewDishes()} />
      <ProductCarousel
        title="Pour toute la famille"
        subtitle="Plats à partager, recettes réconfortantes et menus enfants."
        href="/plats?categorie=famille"
        products={getFamilyDishes()}
      />
      <WorldSection />
      <ProductCarousel
        title="Riche en protéines"
        subtitle="Des repas plus protéinés, sans jamais transformer le dîner en séance de sport."
        href="/plats?categorie=proteine"
        products={getProteinRich()}
      />
      <ProductCarousel title="Une petite douceur ?" href="/plats?categorie=sucre" products={getDesserts()} />
      <TrustBar />
    </>
  );
}
