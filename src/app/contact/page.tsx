"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Editorial } from "@/components/Editorial";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Editorial title="Message envoyé" kicker="Contact">
        <p>Merci. Notre équipe vous répondra sous 24 heures ouvrées.</p>
      </Editorial>
    );
  }

  return (
    <Editorial title="Nous contacter" kicker="Aide">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <label className="block text-sm font-medium">
          Nom
          <input required className="mt-1 h-11 w-full rounded-2xl border border-line bg-white px-3" />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input type="email" required className="mt-1 h-11 w-full rounded-2xl border border-line bg-white px-3" />
        </label>
        <label className="block text-sm font-medium">
          Message
          <textarea required className="mt-1 h-32 w-full rounded-2xl border border-line bg-white px-3 py-2" />
        </label>
        <Button type="submit" variant="dark">
          Envoyer
        </Button>
      </form>
    </Editorial>
  );
}
