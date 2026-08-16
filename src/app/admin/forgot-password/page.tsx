"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { requestPasswordReset, type AuthState } from "@/lib/admin/actions";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(requestPasswordReset, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-[1.75rem] bg-white p-8">
        <Image src="/logo.png" alt="Quince" width={915} height={284} className="h-8 w-auto" />
        <h1 className="mt-6 font-display text-3xl">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-muted">Indiquez votre email professionnel. Si le compte existe, un lien de réinitialisation sera envoyé.</p>
        {state?.sent ? (
          <p className="mt-6 rounded-2xl bg-sage px-4 py-3 text-sm">Si un compte correspond, le message est en route.</p>
        ) : (
          <form action={action} className="mt-6 space-y-4">
            <input required type="email" name="email" placeholder="Email" className="h-12 w-full rounded-2xl border border-line bg-cream px-4 text-sm" />
            {state?.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
            <button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white">
              Envoyer le lien
            </button>
          </form>
        )}
        <Link href="/admin/login" className="mt-6 inline-block text-sm text-muted hover:text-ink">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
