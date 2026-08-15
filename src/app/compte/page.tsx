"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";

type Account = { name: string; email: string };

export default function AccountPage() {
  const [account, setAccount] = useStoredJson<Account | null>(STORAGE_KEYS.account, null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (account) {
    return (
      <Container className="py-12 pb-20">
        <h1 className="font-display text-4xl">Bonjour, {account.name}</h1>
        <p className="mt-3 text-muted">{account.email}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Button href="/favoris" variant="outline">
            Mes favoris
          </Button>
          <Button href="/checkout" variant="outline">
            Mon panier
          </Button>
        </div>
        <button type="button" className="mt-8 text-sm text-muted underline" onClick={() => setAccount(null)}>
          Se déconnecter
        </button>
      </Container>
    );
  }

  return (
    <Container className="py-12 pb-20">
      <div className="mx-auto max-w-md rounded-[1.5rem] bg-white p-8">
        <h1 className="font-display text-4xl">Mon compte</h1>
        <p className="mt-2 text-sm text-muted">Connexion simulée, stockée uniquement sur cet appareil.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setAccount({ name, email });
          }}
        >
          <input
            required
            placeholder="Prénom"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
          <Button type="submit" variant="dark" className="w-full">
            Continuer
          </Button>
        </form>
      </div>
    </Container>
  );
}
