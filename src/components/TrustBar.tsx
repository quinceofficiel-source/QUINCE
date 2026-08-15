import { Container } from "@/components/Container";
import { Leaf, Lock, MessageCircle, RefreshCcw } from "lucide-react";

const items = [
  { icon: RefreshCcw, title: "Sans engagement", text: "Commandez quand vous voulez" },
  { icon: Lock, title: "Paiement sécurisé", text: "Vos données restent protégées" },
  { icon: Leaf, title: "Fabriqué en France", text: "Cuisiné dans nos ateliers" },
  { icon: MessageCircle, title: "Service client", text: "Une équipe à votre écoute" },
];

export function TrustBar() {
  return (
    <section className="border-y border-line bg-white/60 py-8">
      <Container>
        <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <item.icon className="mt-0.5 h-5 w-5 text-forest" />
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
