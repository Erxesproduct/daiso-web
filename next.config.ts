import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Old Zochil URLs keep working: /products/<categoryId|null>/<productId> → /p/<slug>, /products/<categoryId> → /shop?c=<id>.
const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")) as { products: { id: number; slug: string }[] };
const productRedirects = catalog.products.map((p) => ({ source: `/products/:category/${p.id}`, destination: `/p/${p.slug}`, permanent: true }));
// Zochil top-level category ids (shop 2366) → the same categories on the new site
const catalogCats = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")).categories as { id: string; zochil: number }[];
const ZOCHIL_CATEGORIES: Record<string, string> = Object.fromEntries(catalogCats.map((c) => [String(c.zochil), c.id]));
const posts = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")).posts as { id: number; slug: string }[];
const categoryRedirects = [
  ...Object.entries(ZOCHIL_CATEGORIES).map(([id, c]) => ({ source: `/products/${id}`, destination: `/shop?c=${c}`, permanent: true })),
  { source: "/products/247626", destination: "/shop?tag=sanrio", permanent: true },
];
const postRedirects = posts.map((p) => ({ source: `/posts/${p.id}`, destination: `/tips/${p.slug}`, permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos are pre-sized WebP (480 px thumbs, 1000 px large), so they are served as-is.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      ...productRedirects,
      ...categoryRedirects,
      ...postRedirects,
      { source: "/products/:category(\\d+|null)", destination: "/shop", permanent: false },
      { source: "/category/:path*", destination: "/shop", permanent: false },
      { source: "/saled-products", destination: "/shop", permanent: true },
      { source: "/brands/:path*", destination: "/shop", permanent: false },
      { source: "/posts/:path*", destination: "/", permanent: false },
      { source: "/shopping-cart", destination: "/cart", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: true },
      { source: "/about", destination: "/info#about", permanent: true },
      { source: "/faq", destination: "/info#faq", permanent: true },
      { source: "/terms", destination: "/info#payment", permanent: true },
      { source: "/contact", destination: "/info#contact", permanent: true },
      { source: "/accounts/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/images/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;
