import { Suspense } from "react";
import { CatalogView } from "@/components/CatalogView";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Nos plats",
};

export default function PlatsPage() {
  return (
    <Container className="py-10">
      <Suspense>
        <CatalogView
          title="Nos plats"
          subtitle="Des recettes généreuses, cuisinées chaque jour. Filtrez selon votre envie du moment."
        />
      </Suspense>
    </Container>
  );
}
