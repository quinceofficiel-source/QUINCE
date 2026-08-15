import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="font-display text-5xl">Page introuvable</h1>
      <p className="mt-3 text-muted">Ce plat-là n’est plus à la carte — ou cette page n’existe pas.</p>
      <Button href="/" className="mt-8">
        Retour à l’accueil
      </Button>
    </Container>
  );
}
