export type ProductKind = "plat" | "accompagnement" | "dessert";

export type Cuisine = "france" | "italie" | "maghreb" | "afrique" | "asie" | "inde";

export type CategoryId =
  | "maison"
  | "gourmand"
  | "leger"
  | "proteine"
  | "vege"
  | "decouverte"
  | "express"
  | "famille"
  | "duo"
  | "kids"
  | "nouveau"
  | "favoris"
  | "sucre";

export type PortionOption = {
  servings: 1 | 2 | 4;
  price: number;
  label: string;
};

export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  salt: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  category: CategoryId;
  tags: string[];
  calories: number;
  protein: number;
  rating: number;
  reviews: number;
  ingredients: string[];
  allergens: string[];
  portions: PortionOption[];
  isNew: boolean;
  isPopular: boolean;
  kind: ProductKind;
  cuisine?: Cuisine;
  isVegetarian: boolean;
  isComplete: boolean;
  reheating: string;
  conservation: string;
  nutrition: Nutrition;
  extras: string[];
  related: string[];
};

export type CartLine = {
  productId: string;
  servings: 1 | 2 | 4;
  quantity: number;
};

export type BoxFormula = 5 | 10 | 14;

export type DeliverySlot = {
  id: string;
  label: string;
  day: string;
  hours: string;
};

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  street: string;
  complement: string;
  zip: string;
  city: string;
  phone: string;
  instructions: string;
};

export type Order = {
  id: string;
  createdAt: string;
  lines: Array<CartLine & { name: string; unitPrice: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  address: CheckoutAddress;
  slotId: string;
  slotLabel: string;
};
