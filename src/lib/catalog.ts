import {
  getDesserts,
  getFamilyDishes,
  getMains,
  getNewDishes,
  getPopular,
  getProductById,
  getProductBySlug,
  getProteinRich,
  getSharingMeals,
  products,
} from "@/data/products";
import { filterProducts, searchProducts, type CatalogFilters } from "@/lib/search";
import type { Product } from "@/types/product";

/** Abstraction catalogue. Remplacer les imports de données par des appels API ici. */
export const catalog = {
  list(): Product[] {
    return products;
  },
  mains(): Product[] {
    return getMains();
  },
  bySlug(slug: string) {
    return getProductBySlug(slug);
  },
  byId(id: string) {
    return getProductById(id);
  },
  search(query: string) {
    return searchProducts(query, products);
  },
  filter(filters: CatalogFilters) {
    return filterProducts(filters, products);
  },
  popular: getPopular,
  news: getNewDishes,
  desserts: getDesserts,
  family: getFamilyDishes,
  sharing: getSharingMeals,
  protein: getProteinRich,
};
