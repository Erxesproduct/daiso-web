import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/add-button";
import { Gallery } from "@/components/gallery";
import { ChatIcon, TruckIcon } from "@/components/icons";
import { PriceTag } from "@/components/price-tag";
import { NoPhoto, ProductCard } from "@/components/product-card";
import { business } from "@/content/business";
import { getCategory, getProduct, inStock, products, soldOut } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";
import { tierOf } from "@/lib/tiers";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const description = `${p.name}${p.note ? ` (${p.note})` : ""}: ${formatPrice(p.price)}. ${business.tagline}. ${business.rules.delivery}`;
  const img = p.images[0];
  return {
    title: p.name,
    description,
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { title: p.name, description, images: img ? [{ url: img.src, width: img.w, height: img.h }] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const out = soldOut(p);
  const tier = tierOf(p.price);
  const related = inStock.filter((x) => x.category === p.category && x.id !== p.id && x.images.length).sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price) || b.id - a.id).slice(0, 10);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: `DS-${p.id}`,
    gtin13: p.barcode?.length === 13 ? p.barcode : undefined,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    image: p.images.map((m) => absoluteUrl(m.src)),
    category: cat.name,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: p.price, availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <div className="wrap pt-6 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="flex flex-wrap items-center gap-1.5 text-[13.5px] font-bold text-mute" aria-label="Зам">
        <Link href="/" className="hover:text-pink">
          Нүүр
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/shop?c=${cat.id}`} className="hover:text-pink">
          {cat.name}
        </Link>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-14">
        <div className="relative">
          {p.images.length ? (
            <Gallery images={p.images} name={p.name} />
          ) : (
            <div className="card aspect-square overflow-hidden">
              <NoPhoto category={p.category} big />
            </div>
          )}
          {p.sanrio && <span className="hand absolute top-4 left-4 -rotate-6 rounded-full border-2 border-ink bg-blush-2 px-3 py-1 text-[14px] font-bold">🎀 Sanrio</span>}
        </div>

        <div className="lg:pt-3">
          <p className="hand text-[16px] text-pink">
            {cat.emoji} {p.subs[0] ?? cat.name}
          </p>
          <h1 className="heading mt-2 text-[32px] md:text-[44px]">{p.name}</h1>
          {p.note && <p className="mt-2 text-[16px] font-bold text-ink-2">{p.note}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <PriceTag price={p.price} compareAt={p.compareAt} size="lg" />
            <Link href={`/shop?tier=${tier.id}`} className="hand text-[14px] text-mute underline decoration-dotted underline-offset-4 hover:text-pink">
              {tier.label} бараанууд →
            </Link>
          </div>
          <div className="mt-7">
            <BuyBox slug={p.slug} name={p.name} />
          </div>

          <ul className="mt-7 grid gap-2.5 text-[14.5px]">
            <li className="card-soft flex gap-3 p-4">
              <TruckIcon size={22} className="shrink-0 text-pink" />
              <span>
                <b>{business.rules.delivery}</b> Хот дотор {formatPrice(business.delivery[0].fee)}-с, орон нутагт {formatPrice(business.delivery[2].fee)}.{" "}
                <Link href="/info#delivery" className="font-bold text-pink underline underline-offset-2">
                  Бүсүүд
                </Link>
              </span>
            </li>
            <li className="card-soft flex gap-3 p-4">
              <ChatIcon size={22} className="shrink-0 text-pink" />
              <span>
                Асуух зүйл байвал{" "}
                <a href={business.messenger} target="_blank" rel="noreferrer" className="font-bold text-pink underline underline-offset-2">
                  Facebook чат
                </a>{" "}
                эсвэл{" "}
                <a href={`tel:${business.phone.tel}`} className="font-bold whitespace-nowrap">
                  {business.phone.display}
                </a>
              </span>
            </li>
          </ul>

          {p.details.length > 0 && (
            <section className="prose-daiso mt-8" aria-label="Тайлбар">
              <h2 className="text-[20px] font-black">Тайлбар</h2>
              {p.details.map((b, i) => (b.t === "h" ? <h3 key={i}>{b.x}</h3> : b.t === "li" ? <li key={i}>{b.x}</li> : <p key={i}>{b.x}</p>))}
            </section>
          )}
          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-t-2 border-dashed border-line pt-5 text-[13.5px]">
            <dt className="text-mute">Ангилал</dt>
            <dd className="font-bold">{[cat.name, ...p.subs.filter((s) => s !== cat.name)].join(" · ")}</dd>
            {p.brand && (
              <>
                <dt className="text-mute">Брэнд</dt>
                <dd className="font-bold">{p.brand}</dd>
              </>
            )}
            {p.barcode && (
              <>
                <dt className="text-mute">Баркод</dt>
                <dd className="font-bold tracking-wider">{p.barcode}</dd>
              </>
            )}
            <dt className="text-mute">Код</dt>
            <dd className="font-bold">DS-{p.id}</dd>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-label="Төстэй бараа">
          <p className="hand text-[16px] text-pink">Ойролцоо үнэтэй</p>
          <h2 className="heading mt-1 text-[28px] md:text-[36px]">{cat.name}-с</h2>
          <div className="scroller mt-6">
            {related.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
