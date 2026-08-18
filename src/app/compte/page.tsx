"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";
import { cn } from "@/lib/cn";

type Account = { name: string; email: string };

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/admin")) return "/";
  return value;
}

function compteHref(mode: "connexion" | "inscription", nextPath: string) {
  const params = new URLSearchParams({ mode });
  if (nextPath && nextPath !== "/") params.set("next", nextPath);
  return `/compte?${params.toString()}`;
}

export default function AccountPage() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("mode") === "inscription" ? "inscription" : "connexion";
  const nextPath = safeNext(params.get("next"));
  const [account, setAccount] = useStoredJson<Account | null>(STORAGE_KEYS.account, null);
  const mode = requested;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        <div className="flex rounded-full bg-cream p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => router.replace(compteHref("connexion", nextPath))}
            className={cn("flex-1 rounded-full py-2", mode === "connexion" && "bg-ink text-white")}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => router.replace(compteHref("inscription", nextPath))}
            className={cn("flex-1 rounded-full py-2", mode === "inscription" && "bg-ink text-white")}
          >
            Inscription
          </button>
        </div>
        <h1 className="mt-6 font-display text-3xl">{mode === "connexion" ? "Connexion" : "Créer un compte"}</h1>
        <p className="mt-2 text-sm text-muted">Compte enregistré sur cet appareil, pour retrouver vos adresses plus vite.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            if (mode === "inscription") {
              if (!name.trim()) {
                setError("Indiquez votre prénom.");
                return;
              }
              setAccount({ name: name.trim(), email });
              router.push(nextPath);
              return;
            }
            const stored = window.localStorage.getItem(STORAGE_KEYS.account);
            if (stored) {
              const existing = JSON.parse(stored) as Account;
              if (existing.email.toLowerCase() !== email.toLowerCase()) {
                setError("Aucun compte avec cet email sur cet appareil.");
                return;
              }
              setAccount(existing);
              router.push(nextPath);
              return;
            }
            setAccount({ name: email.split("@")[0] || "Client", email });
            router.push(nextPath);
          }}
        >
          {mode === "inscription" ? (
            <input
              required
              placeholder="Prénom"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-2xl border border-line bg-cream px-3"
            />
          ) : null}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-2xl border border-line bg-cream px-3"
          />
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <Button type="submit" variant="dark" className="w-full">
            {mode === "connexion" ? "Se connecter" : "Créer mon compte"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
