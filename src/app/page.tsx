import Image from "next/image";
import Link from "next/link";
import { Gacha } from "@/components/gacha";
import { ArrowIcon, SparkIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { business } from "@/content/business";
import { banners, categories, coverOf, inStock, posts, products, type Product } from "@/lib/catalog";
import { countLabel, formatPrice } from "@/lib/format";
import { TIERS, tierOf } from "@/lib/tiers";

const withPhoto = inStock.filter((p) => p.images.length);
const newest = [...withPhoto].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
const sanrio = withPhoto.filter((p) => p.sanrio);
const shelf = (id: Product["category"]) => newest.filter((p) => p.category === id).slice(0, 12);
const at5999 = products.filter((p) => p.price === 5999).length;
// hero cut-outs: the newest photos from six different categories
const heroPicks = ["kitchen", "beauty", "food", "home", "wear", "toys"].map((c) => newest.find((p) => p.category === c)).filter(Boolean) as Product[];

export default function Home() {
  return (
    <>
      {/* the owner's own banners from Zochil, first */}
      <section className="wrap pt-5 md:pt-7" aria-label="Онцлох">
        <div className="grid gap-3 md:grid-cols-[1.75fr_1fr] md:gap-4">
          {[...banners].reverse().map((b, i) => {
            const img = <Image src={b.src} alt={b.title} width={b.w} height={b.h} priority={i === 0} sizes="(min-width: 768px) 60vw, 100vw" className="h-full w-full object-cover" />;
            return b.href ? (
              <Link key={b.src} href={b.href} className="card block overflow-hidden transition hover:-translate-y-1">
                {img}
              </Link>
            ) : (
              <div key={b.src} className="card overflow-hidden">
                {img}
              </div>
            );
          })}
        </div>
      </section>

      {/* hero */}
      <section className="wrap relative pt-10 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="hand inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-ink bg-sun px-4 py-1 text-[15px] shadow-[2px_2px_0_var(--ink)]">
              <SparkIcon size={14} className="text-pink" /> {business.tagline}
            </p>
            <h1 className="heading mt-6 text-[44px] sm:text-[58px] lg:text-[72px]">
              {business.slogan[0]},{" "}
              <span className="relative inline-block text-pink">
                төсөөлснөөс илүүг
                <svg className="absolute -bottom-2 left-0 h-3 w-full text-sun" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 8c40-6 80-6 120-2s56 3 76-2" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              Дайсогоос
            </h1>
            <p className="mt-6 max-w-lg text-[17px] text-ink-2">Гал тогоо, гэр ахуй, гоо сайхан, япон амттан, бичиг хэрэг, тоглоом. Жижиг ч гэсэн өдөр бүр хэрэг болох зүйлс нэг дэлгүүрт.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-pink h-14 px-7 text-[17px]">
                Бүх бараа <ArrowIcon size={19} />
              </Link>
              <Link href="/shop?tier=5999" className="btn btn-white h-14 px-6">
                5,999₮-ийн тавиур
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-3">
              {[
                [countLabel(products.length), "онлайнаар"],
                [countLabel(at5999), "яг 5,999₮"],
                ["24–48 цаг", "төлбөрийн дараа хүргэнэ"],
              ].map(([a, b], i) => (
                <div key={a} className="card-soft px-4 py-2.5" style={{ rotate: `${[-1.5, 1, -0.5][i]}deg` }}>
                  <dt className="text-[20px] font-black">{a}</dt>
                  <dd className="text-[13px] text-mute">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto grid w-full max-w-[520px] grid-cols-3 gap-3 sm:gap-4" aria-hidden>
            {heroPicks.map((p, i) => (
              <Link
                key={p.id}
                href={`/p/${p.slug}`}
                tabIndex={-1}
                className="card float relative block aspect-square overflow-hidden"
                style={{ "--r": `${[-5, 4, -2, 3, -4, 5][i]}deg`, animationDelay: `${i * -0.8}s`, marginTop: i % 3 === 1 ? 28 : 0 } as React.CSSProperties}
              >
                <Image src={p.images[0].thumb.src} alt="" width={p.images[0].thumb.w} height={p.images[0].thumb.h} sizes="170px" className="h-full w-full object-contain p-2" />
                <span className="absolute right-1.5 bottom-1.5 rounded-full border-2 border-ink px-2 text-[11.5px] font-black" style={{ background: tierOf(p.price).bg, color: tierOf(p.price).fg }}>
                  {formatPrice(p.price)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* shop by price sticker */}
      <section className="wrap mt-20 md:mt-28" aria-labelledby="tiers">
        <Reveal>
          <p className="hand text-[18px] text-pink">Дэлгүүрийн тавиур шиг</p>
          <h2 id="tiers" className="heading mt-1 text-[34px] md:text-[46px]">
            Үнийн шошгоор шилэх
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 md:gap-4">
          {TIERS.map((t, i) => {
            const n = products.filter((p) => tierOf(p.price).id === t.id).length;
            return (
              <Reveal key={t.id} delay={i * 60}>
                <Link href={`/shop?tier=${t.id}`} className="card group flex h-full flex-col justify-between gap-6 p-5 transition hover:-translate-y-1 hover:-rotate-1" style={{ background: t.bg, color: t.fg }}>
                  <span className="text-[13px] font-black tracking-widest uppercase opacity-80">{t.id === "plus" ? "Том бараа" : "Хүртэл"}</span>
                  <span className="text-[26px] leading-none font-black sm:text-[30px] md:text-[34px]">{t.id === "plus" ? "22,000₮+" : formatPrice(t.max)}</span>
                  <span className="flex items-center justify-between text-[14px] font-bold">
                    {countLabel(n)}
                    <ArrowIcon size={18} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* categories */}
      <section className="wrap mt-20 md:mt-28" aria-labelledby="cats">
        <Reveal>
          <h2 id="cats" className="heading text-[34px] md:text-[46px]">
            Ангиллууд
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {categories.map((c, i) => {
            const cover = coverOf(c.id);
            return (
              <Reveal key={c.id} delay={(i % 5) * 50}>
                <Link href={`/shop?c=${c.id}`} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1">
                  <span className="relative block aspect-[4/3] shrink-0 bg-blush/50">
                    {cover && (
                      <span className="absolute inset-0 overflow-hidden rounded-t-[20px]">
                        <Image src={cover.src} alt="" fill sizes="240px" className="object-contain p-3 transition group-hover:scale-105" />
                      </span>
                    )}
                    <span className="absolute -bottom-5 left-4 grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white text-[22px] transition group-hover:rotate-12">{c.emoji}</span>
                  </span>
                  <span className="flex flex-1 flex-col px-4 pt-7 pb-4">
                    <span className="leading-tight font-black">{c.name}</span>
                    <span className="mt-1 text-[12.5px] leading-snug text-mute">{c.note}</span>
                    <span className="hand mt-auto pt-2 text-[14px] text-pink">{countLabel(c.count)}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal delay={200}>
            <Link href="/shop?tag=sanrio" className="card group flex h-full flex-col justify-between overflow-hidden bg-blush-2 p-5 transition hover:-translate-y-1">
              <span className="text-[44px] transition group-hover:rotate-12">🎀</span>
              <span>
                <span className="block text-[22px] leading-tight font-black">Sanrio</span>
                <span className="mt-1 block text-[13px] text-ink-2">Kuromi, Cinnamoroll, Pompompurin…</span>
                <span className="hand mt-2 block text-[14px] text-pink-deep">{countLabel(products.filter((p) => p.sanrio).length)}</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* gacha */}
      <section className="mt-20 border-y-2 border-ink bg-blush py-14 md:mt-28 md:py-20" aria-label="Азын капсул">
        <div className="wrap">
          <Gacha />
        </div>
      </section>

      {/* shelves */}
      <Shelf title="Шинээр ирсэн" note="Хамгийн сүүлд нэмэгдсэн" href="/shop?sort=new" items={newest.slice(0, 14)} />
      <Shelf title="Гал тогоо" note="Таваг, аяга, хадгалах сав" href="/shop?c=kitchen" items={shelf("kitchen")} />
      <Shelf title="Гоо сайхан, эрүүл ахуй" note="Арьс арчилгаа, сойз, гоёл" href="/shop?c=beauty" items={shelf("beauty")} />
      <Shelf title="Япон амттан" note="Желли, чихэр, ундаа" href="/shop?c=food" items={shelf("food")} />

      {/* sanrio */}
      {sanrio.length > 0 && (
        <section className="wrap mt-20 md:mt-24" aria-labelledby="sanrio">
          <div className="card overflow-hidden bg-blush-2 p-5 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="hand text-[18px] text-pink-deep">🎀 Sanrio corner</p>
                <h2 id="sanrio" className="heading mt-1 text-[32px] md:text-[42px]">
                  Хөөрхөн найзууд
                </h2>
              </div>
              <Link href="/shop?tag=sanrio" className="btn btn-white">
                Бүгдийг үзэх <ArrowIcon size={18} />
              </Link>
            </div>
            <div className="scroller mt-6">
              {sanrio.slice(0, 12).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* tips from the shop's blog */}
      {posts.length > 0 && (
        <section className="wrap mt-20 md:mt-28" aria-labelledby="tips">
          <Reveal>
            <p className="hand text-[18px] text-pink">Daiso-гийн зөвлөгөө</p>
            <h2 id="tips" className="heading mt-1 text-[34px] md:text-[46px]">
              Уншаад авах
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link href={`/tips/${p.slug}`} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1">
                  {p.image && (
                    <span className="block aspect-[4/3] overflow-hidden border-b-2 border-ink">
                      <Image src={p.image.src} alt="" width={p.image.w} height={p.image.h} sizes="(min-width: 1024px) 230px, 50vw" className="h-full w-full object-cover transition group-hover:scale-105" />
                    </span>
                  )}
                  <span className="p-4 leading-snug font-extrabold group-hover:text-pink">{p.title}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* delivery */}
      <section className="wrap mt-20 md:mt-28" aria-labelledby="delivery">
        <div className="card grid gap-6 bg-sun p-6 md:grid-cols-[1fr_2fr] md:p-9">
          <div>
            <TruckIcon size={36} />
            <h2 id="delivery" className="heading mt-3 text-[30px] md:text-[38px]">
              Хүргэлт
            </h2>
            <p className="mt-2 text-[15px]">{business.rules.delivery}</p>
            <Link href="/info#delivery" className="mt-4 inline-flex items-center gap-1.5 font-extrabold underline decoration-2 underline-offset-4">
              Дэлгэрэнгүй <ArrowIcon size={17} />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {business.delivery.map((d) => (
              <li key={d.id} className="rounded-2xl border-2 border-ink bg-white p-4">
                <p className="text-[14px] font-extrabold">{d.name}</p>
                <p className="mt-1 text-[26px] font-black text-pink">{formatPrice(d.fee)}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-ink-2">{d.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Shelf({ title, note, href, items }: { title: string; note: string; href: string; items: Product[] }) {
  if (!items.length) return null;
  return (
    <section className="wrap mt-20 md:mt-24" aria-label={title}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="hand text-[16px] text-pink">{note}</p>
          <h2 className="heading mt-1 text-[30px] md:text-[40px]">{title}</h2>
        </div>
        <Link href={href} className="inline-flex items-center gap-1.5 font-extrabold hover:text-pink">
          Бүгд <ArrowIcon size={18} />
        </Link>
      </div>
      <div className="scroller mt-6">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
