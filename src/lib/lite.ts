import data from "@/data/lite.json";

/** Slim product record for client components: s slug, n name, p price, o price before discount, k stock, t thumbnail (null = no photo), c category. */
export type Lite = { s: string; n: string; p: number; o: number | null; k: number | null; t: string | null; c: string };

export const liteProducts = data as Lite[];
const bySlug = new Map(liteProducts.map((p) => [p.s, p]));

export const getLite = (slug: string) => bySlug.get(slug);

export function resolveLine(slug: string) {
  const product = bySlug.get(slug);
  return product ? { product, price: product.p, stock: product.k } : null;
}
