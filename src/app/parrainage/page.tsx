"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Editorial } from "@/components/Editorial";
import { BANNER_IMAGES } from "@/data/products";
import Image from "next/image";

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const code = "QUINCE-AMIS";

  return (
    <Editorial title="Offrez 10 €, recevez 10 € !" kicker="Parrainage">
      <div className="relative mb-8 h-56 overflow-hidden rounded-[1.5rem]">
        <Image src={BANNER_IMAGES.referral} alt="Carte cadeau Quince" fill className="object-cover" />
      </div>
      <p>
        Invitez un ami à découvrir Quince. Il bénéficie de 10 € sur sa première commande, et vous recevez 10 € dès qu’elle
        est livrée.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-blush p-4">
        <code className="text-lg font-semibold">{code}</code>
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
          }}
        >
          {copied ? "Code copié" : "Copier le code"}
        </Button>
      </div>
    </Editorial>
  );
}
