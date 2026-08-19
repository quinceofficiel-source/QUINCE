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
        <CatalogView />
      </Suspense>
    </Container>
  );
}
