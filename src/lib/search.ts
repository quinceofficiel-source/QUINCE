import { CATEGORIES } from "@/data/categories";
import { products } from "@/data/products";
import type { CategoryId, Cuisine, Product } from "@/types/product";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function searchProducts(query: string, list: Product[] = products): Product[] {
  const q = normalize(query.trim());
  if (!q) return list;

  const words = q.split(/\s+/).filter(Boolean);

  return list.filter((product) => {
    const haystack = normalize(
      [
        product.name,
        product.description,
        product.shortDescription,
        product.category,
        product.cuisine ?? "",
        ...product.tags,
        ...product.ingredients,
      ].join(" "),
    );

    return words.every((word) => haystack.includes(word));
  });
}

export type CatalogFilters = {
  category?: CategoryId;
  cuisine?: Cuisine;
  vegetarian?: boolean;
  isNew?: boolean;
  popular?: boolean;
  maxPrice?: number;
  maxCalories?: number;
  minProtein?: number;
  query?: string;
};

export function filterProducts(filters: CatalogFilters, list: Product[] = products): Product[] {
  let result = list;

  if (filters.query) {
    result = searchProducts(filters.query, result);
  }

  if (filters.category && filters.category !== "favoris" && filters.category !== "nouveau") {
    result = result.filter(
      (product) => product.category === filters.category || product.tags.includes(filters.category!),
    );
  }

  if (filters.cuisine) {
    result = result.filter((product) => product.cuisine === filters.cuisine);
  }

  if (filters.vegetarian) {
    result = result.filter((product) => product.isVegetarian);
  }

  if (filters.isNew) {
    result = result.filter((product) => product.isNew);
  }

  if (filters.popular) {
    result = result.filter((product) => product.isPopular);
  }

  if (filters.maxPrice) {
    result = result.filter((product) => product.price <= filters.maxPrice!);
  }

  if (filters.maxCalories) {
    result = result.filter((product) => product.calories <= filters.maxCalories!);
  }

  if (filters.minProtein) {
    result = result.filter((product) => product.protein >= filters.minProtein!);
  }

  return result;
}

export function getCategoryLabel(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id;
}
