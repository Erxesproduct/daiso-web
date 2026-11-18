# daiso-web

Storefront for **Daiso Mongolia** (daiso.mn), replacing the Zochil shop 2366. Next.js 16 (App Router), Tailwind 4,
static product pages, orders to erxes 3.0.

- **Look «pop aisle»**: Daiso magenta on milky pink paper with a dot grid, ink outlines with offset shadows, one candy
  colour per price point (shelf stickers), M PLUS Rounded 1c + Balsamiq Sans (both with Ө ө Ү ү).
- **Pages**: home (the owner's banners, shop by price sticker, categories, «Азын капсул» random-pick machine, shelves,
  Sanrio corner, tips, delivery), `/shop` (search, category, price point, sort, sold-out toggle), `/p/[slug]`,
  `/cart` (checkout), `/info` (delivery, payment, FAQ, about, contact), `/tips/[slug]` (the shop's blog posts).
  Old Zochil URLs redirect.
- **Data**: `src/data/catalog.json` (827 products) and the slim `lite.json` for client components, built from Zochil by a
  scrape script (not in the repo). Business rules: `src/content/business.ts`.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000        # 25 order API checks
npm run sync:erxes     # prices from erxes (ERXES_API_URL + ERXES_APP_TOKEN)
```

Environment variables: see `.env.example`. Without `ERXES_*` the order API answers `503 not_configured` and the
checkout asks the customer to call.

erxes setup (manual steps, CSV imports, open questions): [`docs/erxes/MANUAL-STEPS.md`](docs/erxes/MANUAL-STEPS.md).
