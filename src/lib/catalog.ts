import data from "@/data/catalog.json";

export type Img = { src: string; w: number; h: number };
export type Photo = Img & { thumb: Img };
export type Block = { t: "p" | "h" | "li"; x: string };

export type CategoryId = "kitchen" | "home" | "beauty" | "food" | "wear" | "stationery" | "toys" | "tools" | "garden";

export type Product = {
  /** Zochil product id (kept for the erxes product code and old-URL redirects). */
  id: number;
  slug: string;
  name: string;
  /** Colour / flavour / size moved out of the Zochil name («/Нэрс/» → «Нэрс»). */
  note: string | null;
  category: CategoryId;
  /** Zochil subcategory names. */
  subs: string[];
  sanrio: boolean;
  seasonal: boolean;
  brand: "Daiso" | "Threeppy" | null;
  /** JAN barcode from Zochil `sku`. */
  barcode: string | null;
  price: number;
  compareAt: number | null;
  /** Units in stock; null = not tracked; 0 = sold out. */
  stock: number | null;
  featured: boolean;
  createdAt: string;
  details: Block[];
  images: Photo[];
};

export type Category = { id: CategoryId; zochil: number; name: string; note: string; emoji: string; count: number };
export type Post = { id: number; slug: string; title: string; date: string; image: Img | null; body: Block[] };
export type Banner = Img & { title: string; href: string | null };

export const products = data.products as Product[];
export const categories = (data.categories as Category[]).filter((c) => c.count > 0);
export const faq = data.faq as { q: string; a: string }[];
export const about = data.about as Block[];
export const posts = data.posts as Post[];
export const banners = data.banners as Banner[];
export const catalogUpdatedAt = data.updatedAt;

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const soldOut = (p: { stock: number | null }) => p.stock === 0;
export const inStock = products.filter((p) => !soldOut(p));

/** The product a cart line points at (server side). */
export function resolveLine(slug: string) {
  const product = getProduct(slug);
  return product ? { product, price: product.price, stock: product.stock } : null;
}

/** erxes product code: DS-<zochil id>. */
export const sku = (p: Pick<Product, "id">) => `DS-${p.id}`;

/** A photo for a category tile: the newest in-stock product with a photo. */
export const coverOf = (id: CategoryId) => inStock.find((p) => p.category === id && p.images.length)?.images[0].thumb ?? null;
