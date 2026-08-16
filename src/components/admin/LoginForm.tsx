"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginAdmin, type AuthState } from "@/lib/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAdmin, undefined);

  return (
    <div className="mx-auto w-full max-w-md rounded-[1.75rem] bg-white p-8 shadow-[0_20px_60px_-36px_rgba(17,17,17,0.35)]">
      <Image src="/logo.png" alt="Quince" width={870} height={252} className="h-8 w-auto" />
      <h1 className="mt-6 font-display text-3xl tracking-tight">Back-office</h1>
      <p className="mt-2 text-sm text-muted">Accès réservé à l’équipe Quince.</p>
      <form action={action} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="username"
            placeholder="prenom@quince.fr"
            className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Mot de passe</span>
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm"
          />
        </label>
        {state?.error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        <Link href="/admin/forgot-password" className="text-muted underline-offset-2 hover:text-ink hover:underline">
          Mot de passe oublié
        </Link>
      </p>
    </div>
  );
}
