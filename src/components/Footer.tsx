import Link from "next/link";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Quince",
    links: [
      { href: "/notre-histoire", label: "Notre histoire" },
      { href: "/nos-cuisines", label: "Nos cuisines" },
      { href: "/nos-engagements", label: "Nos engagements" },
    ],
  },
  {
    title: "Commander",
    links: [
      { href: "/plats", label: "Nos plats" },
      { href: "/composer-ma-box", label: "Composer ma box" },
      { href: "/livraison", label: "Livraison" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Nous contacter" },
      { href: "/allergenes", label: "Allergènes" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/cgv", label: "CGV" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/mentions-legales", label: "Mentions légales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Des plats maison, préparés chaque jour, livrés chez vous au frais.
            </p>
            <form className="mt-6" action="/contact" method="get">
              <label htmlFor="newsletter" className="text-sm font-semibold">
                Recevez les nouveautés Quince
              </label>
              <div className="mt-2 flex min-w-0 gap-2">
                <input
                  id="newsletter"
                  name="email"
                  type="email"
                  required
                  placeholder="Votre email"
                  className="h-11 min-w-0 flex-1 rounded-full border border-line bg-cream px-4 text-sm"
                />
                <button type="submit" className="h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-medium text-white">
                  S’inscrire
                </button>
              </div>
            </form>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a href="https://facebook.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-dark" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1Z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold">{column.title}</p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs text-muted">© {new Date().getFullYear()} Quince. Tous droits réservés.</p>
      </Container>
    </footer>
  );
}
