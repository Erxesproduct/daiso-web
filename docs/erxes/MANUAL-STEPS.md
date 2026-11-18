# Daiso Mongolia: erxes manual steps

Owner of every step below: **Terbish**, with Daiso Mongolia («Монова Трейд» ХХК) for credentials and decisions.

These steps happen inside the erxes 3.0 admin, not in code. The website reads the results through the
environment variables in `.env.example`. Never commit their values.

| Task | Status | What to do in erxes (admin path) |
| --- | --- | --- |
| [1.1] Import products, categories, prices | website done · manual import in erxes | Section 1.1 |
| [1.2] Payment setup (QPay) | website done · manual, blocked on QPay / Pocket merchant credentials | Section 1.2 |
| [1.3] eBarimt setup | website done · manual, blocked on PosAPI registration + TIN | Section 1.3 |
| [1.4] Delivery zones, fees, order statuses | website done · manual in erxes | Section 1.4 |
| [1.5] Test order from cart to receipt | validation verified · real order blocked on erxes env vars + 1.2 + 1.3 | Section 1.5 |

There is no erxes instance for Daiso yet ("erxes 3.0: NOT SET"). Create it first, then add the env vars under
**Vercel → daiso-web → Settings → Environment Variables**.

---

## 1.1 Import products, categories and prices

Source: daiso.mn (Zochil shop 2366), scraped 2026-11-18: **827 products** (897 photos), 356 Zochil categories,
the logo, 2 home banners (Daiso, Sanrio), the About page, 5 FAQ and 5 blog posts. Zochil reports 859 products, but its
listing only returns 827; the other 32 are not visible to shoppers on Zochil and are not on the website. The Facebook
page (facebook.com/daisomn.shop) gives no content without a login beyond its name and profile photo.

**316 products had no category on Zochil.** The website keeps the shop's 9 top-level Zochil categories and places
those 316 by name (ordered keyword rules in the build script, e.g. «харааны шил» → beauty before «шил» → kitchen).
Sanrio (Zochil 247626) and the seasonal categories (Шинэ жил, Halloween) are tags, not main categories.

| Code | Name | Products | Zochil id |
| --- | --- | --- | --- |
| `DS-kitchen` | Гал тогоо | 279 | 238228 |
| `DS-home` | Гэр ахуй | 153 | 238231 |
| `DS-beauty` | Гоо сайхан, эрүүл ахуй | 148 | 238229 |
| `DS-wear` | Хувцас, аяны хэрэгсэл | 78 | 238234 |
| `DS-food` | Хүнс | 69 | 238230 |
| `DS-tools` | Электроникс, багаж | 49 | 238232 |
| `DS-toys` | Тоглоом | 26 | 238235 |
| `DS-stationery` | Бичиг хэрэг | 13 | 238233 |
| `DS-garden` | Цэцэрлэг, тэжээвэр амьтан | 12 | 238236 |
| `DS-sanrio` | Sanrio (tag) | 20 | 247626 |

Files:

- `docs/erxes/daiso-categories.csv`: the parent `DS`, the 9 categories and the Sanrio collection.
- `docs/erxes/daiso-products.csv`: **827 rows**, code `DS-<zochilId>`, with price, JAN barcode (826 products),
  brand (Daiso 581, Threeppy 68), stock, status, the colour / flavour note, Zochil subcategories, tags, description and
  photo paths.

Steps:

1. **Products & services → Categories**: import `daiso-categories.csv`, or create the 9 by hand under «Daiso Mongolia».
2. **Settings → Import & Export → Import → Products**: upload `daiso-products.csv`. Map `code → Code`,
   `name → Name`, `categoryCode → Category code`, `unitPrice → Unit price`, `barcode → Barcodes`, `type → Type`,
   `uom → UOM`, `description → Description`. Keep the codes: the website and `npm run sync:erxes` match on them.
3. **Inventories → Remainders**: all 827 products track stock on Zochil (8,231 units); **215 are sold out (0)**. The
   website hides sold-out products by default («дууссан N-г харуулах» shows them) and never sells more than the stock.
   Until erxes stock is wired to the site, update `stock` in `src/data/catalog.json` and rebuild.
4. Upload the photos (`public/images/p/*.webp`) on the products. **77 products have no photo on Zochil**: the website
   shows a category doodle «Зураг удахгүй».
5. Run `npm run sync:erxes` once with a Client Portal token to confirm the codes match (it also refreshes
   `src/data/lite.json`, which the cart reads).

Changes on the website (facts unchanged):

- Names: the slash part moved to a note under the name («Сахаргүй хоолойн чихэр /Нэрс/ 43гр» → «Сахаргүй хоолойн
  чихэр 43гр» + «Нэрс»), 80 products.
- No product is on sale on Zochil (`sale_price` empty everywhere), so no discounts are shown.
- Prices are fixed price points (502 products at 5,999₮). The site colours each price point like a shelf sticker and
  lets customers shop by it.
