import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { business } from "@/content/business";
import { categories, getCategory, products, soldOut, type Product } from "@/lib/catalog";
import { countLabel } from "@/lib/format";
import { TIERS, getTier, tierOf } from "@/lib/tiers";

type Search = { q?: string; c?: string; tier?: string; tag?: string; sort?: string; all?: string; page?: string };
const PER_PAGE = 48;

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const s = await searchParams;
  const c = getCategory(s.c ?? "");
  const title = c ? c.name : s.tag === "sanrio" ? "Sanrio" : s.q ? `«${s.q}» хайлт` : "Бүх бараа";
  return { title, alternates: { canonical: c ? `/shop?c=${c.id}` : "/shop" }, robots: s.q || s.page ? { index: false } : undefined };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
const haystack = new Map(products.map((p) => [p.id, norm([p.name, p.note, ...p.subs, getCategory(p.category)?.name, p.brand, p.sanrio ? "sanrio санрио" : ""].filter(Boolean).join(" "))]));

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await searchParams;
  const q = (s.q ?? "").slice(0, 60);
  const cat = getCategory(s.c ?? "");
  const tier = getTier(s.tier);
  const sanrio = s.tag === "sanrio";
  const showAll = s.all === "1";
  const sort = s.sort === "cheap" || s.sort === "dear" || s.sort === "new" ? s.sort : "default";

  const words = norm(q).split(" ").filter(Boolean);
  let list: Product[] = products.filter(
    (p) =>
      (!cat || p.category === cat.id) &&
      (!tier || tierOf(p.price).id === tier.id) &&
      (!sanrio || p.sanrio) &&
      (showAll || !soldOut(p)) &&
      words.every((w) => haystack.get(p.id)!.includes(w)),
  );
  if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "dear") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "new") list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
  // default: Zochil order (newest first), photos before the ones still waiting for a photo
  else list = [...list].sort((a, b) => Number(!a.images.length) - Number(!b.images.length));
  const hidden = showAll ? 0 : products.filter((p) => soldOut(p) && (!cat || p.category === cat.id) && (!tier || tierOf(p.price).id === tier.id) && (!sanrio || p.sanrio)).length;

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(s.page) || 1));
  const shown = list.slice(0, page * PER_PAGE);

  const href = (patch: Partial<Search>) => {
    const next = { ...s, ...patch };
    if (!("page" in patch)) delete next.page;
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/shop?${qs}` : "/shop";
  };
  const title = cat ? cat.name : sanrio ? "Sanrio" : tier ? tier.label : q ? `«${q}»` : "Бүх бараа";

  return (
    <div className="wrap pt-8 md:pt-12">
      <p className="hand text-[17px] text-pink">{cat ? `${cat.emoji} ${cat.note}` : sanrio ? "🎀 Kuromi, Cinnamoroll, Pompompurin…" : q ? "Хайлтын үр дүн" : business.tagline}</p>
      <h1 className="heading mt-1 text-[40px] md:text-[60px]">{title}</h1>

      <form action="/shop" role="search" className="relative mt-6 max-w-xl">
        {cat && <input type="hidden" name="c" value={cat.id} />}
        {tier && <input type="hidden" name="tier" value={tier.id} />}
        {sanrio && <input type="hidden" name="tag" value="sanrio" />}
        <SearchIcon size={19} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute" />
        <input name="q" type="search" defaultValue={q} placeholder="Бараа хайх…" aria-label="Бараа хайх" className="h-13 w-full rounded-full border-2 border-ink bg-white pr-28 pl-11 text-[16px] shadow-[3px_3px_0_var(--ink)] outline-none" />
        <button className="btn btn-pink absolute top-1/2 right-1.5 h-10 min-h-0 -translate-y-1/2 px-4 text-[14px] shadow-none">Хайх</button>
      </form>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Ангилал">
        <Link href={href({ c: undefined, tag: undefined })} className="chip" aria-current={!cat && !sanrio}>
          Бүгд
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={href({ c: c.id, tag: undefined })} className="chip" aria-current={cat?.id === c.id}>
            <span aria-hidden>{c.emoji}</span> {c.name}
          </Link>
        ))}
        <Link href={href({ c: undefined, tag: "sanrio" })} className="chip" aria-current={sanrio}>
          🎀 Sanrio
        </Link>
      </nav>
      <nav className="mt-3 flex flex-wrap items-center gap-2" aria-label="Үнэ">
        <Link href={href({ tier: undefined })} className="chip" aria-current={!tier}>
          Бүх үнэ
        </Link>
        {TIERS.map((t) => (
          <Link key={t.id} href={href({ tier: t.id })} className="chip" aria-current={tier?.id === t.id} style={tier?.id === t.id ? undefined : { background: t.bg, color: t.fg }}>
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-line pt-4 text-[14px]">
        <p className="font-bold">
          {countLabel(list.length)}
          {hidden > 0 && (
            <>
              {" · "}
              <Link href={href({ all: "1" })} className="text-pink underline underline-offset-2">
                дууссан {hidden}-г харуулах
              </Link>
            </>
          )}
          {showAll && (
            <>
              {" · "}
              <Link href={href({ all: undefined })} className="text-pink underline underline-offset-2">
                зөвхөн бэлэн байгаа
              </Link>
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-1.5" aria-label="Эрэмбэ">
          {(
            [
              ["default", "Санал болгох"],
              ["new", "Шинэ"],
              ["cheap", "Хямд нь эхэнд"],
              ["dear", "Үнэтэй нь эхэнд"],
            ] as const
          ).map(([id, label]) => (
            <Link key={id} href={href({ sort: id === "default" ? undefined : id })} className="chip min-h-8 px-3 text-[13px]" aria-current={sort === id}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {shown.length ? (
        <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((p, i) => (
            <li key={p.id}>
              <ProductCard p={p} priority={i < 5} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mx-auto mt-10 max-w-md p-8 text-center">
          <p className="text-[48px]" aria-hidden>
            🔍
          </p>
          <p className="mt-3 text-[20px] font-black">Олдсонгүй</p>
          <p className="mt-1 text-ink-2">Өөр үгээр хайж үзээрэй, эсвэл Facebook чатаар асуугаарай.</p>
          <Link href="/shop" className="btn btn-pink mt-5">
            Бүх бараа
          </Link>
        </div>
      )}

      {page < pages && (
        <div className="mt-12 text-center">
          <Link href={href({ page: String(page + 1) })} scroll={false} className="btn btn-sun h-14 px-8">
            Цааш үзэх ({list.length - shown.length})
          </Link>
        </div>
      )}
    </div>
  );
}
