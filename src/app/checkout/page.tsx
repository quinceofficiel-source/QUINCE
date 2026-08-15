import { CheckoutFlow } from "@/components/CheckoutFlow";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Commande",
};

export default function CheckoutPage() {
  return (
    <Container className="py-10 pb-20">
      <CheckoutFlow />
    </Container>
  );
}
