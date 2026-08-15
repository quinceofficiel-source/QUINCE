# Quince

Site e-commerce de plats préparés frais, livrés à domicile.

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Stack

Next.js, React, TypeScript, Tailwind CSS.

Le panier, les favoris et le builder de box sont persistés dans `localStorage`. Les données produits sont mockées dans `src/data/products.ts`, prêtes à être remplacées par une API via `src/lib/catalog.ts`.
