export type Badge = "" | "bestseller" | "chef_choice" | "new";

export type MenuCategory = { id: number; name: string; slug: string };

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  badge: Badge;
  note: string;
  is_popular: boolean;
  category: string;
};

export type Menu = { categories: MenuCategory[]; items: MenuItem[] };

/** DRF validation errors: field name (or non_field_errors) -> messages. */
export type FieldErrors = Record<string, string[]>;
