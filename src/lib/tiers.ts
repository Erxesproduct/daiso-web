/**
 * Daiso prices sit on fixed price points (827 products: 502 at 5,999₮, 109 at 13,999₮, 107 at 9,999₮, 74 at 21,999₮…).
 * Each price point gets its own price-tag colour, like the coloured stickers on a store shelf.
 */
export type Tier = { id: string; label: string; min: number; max: number; bg: string; fg: string };

export const TIERS: Tier[] = [
  { id: "5999", label: "5,999₮ хүртэл", min: 0, max: 5999, bg: "var(--mint)", fg: "var(--ink)" },
  { id: "9999", label: "9,999₮ хүртэл", min: 6000, max: 9999, bg: "var(--sun)", fg: "var(--ink)" },
  { id: "13999", label: "13,999₮ хүртэл", min: 10000, max: 13999, bg: "var(--sky)", fg: "var(--ink)" },
  { id: "21999", label: "21,999₮ хүртэл", min: 14000, max: 21999, bg: "var(--tangerine)", fg: "var(--ink)" },
  { id: "plus", label: "22,000₮-өөс дээш", min: 22000, max: Infinity, bg: "var(--grape)", fg: "#fff" },
];

export const tierOf = (price: number) => TIERS.find((t) => price >= t.min && price <= t.max) ?? TIERS[TIERS.length - 1];
export const getTier = (id: string | undefined) => TIERS.find((t) => t.id === id);
