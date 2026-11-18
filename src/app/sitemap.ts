import type { MetadataRoute } from "next";
import { catalogUpdatedAt, categories, posts, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogUpdatedAt);
  return [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, priority: 0.8 },
    ...categories.map((c) => ({ url: absoluteUrl(`/shop?c=${c.id}`), lastModified, priority: 0.7 })),
    ...products.map((p) => ({ url: absoluteUrl(`/p/${p.slug}`), lastModified, priority: 0.7 })),
    { url: absoluteUrl("/shop?tag=sanrio"), lastModified, priority: 0.6 },
    ...posts.map((p) => ({ url: absoluteUrl(`/tips/${p.slug}`), lastModified: new Date(p.date || catalogUpdatedAt), priority: 0.4 })),
    { url: absoluteUrl("/info"), lastModified, priority: 0.5 },
  ];
}
