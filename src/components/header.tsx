import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { categories, products } from "@/lib/catalog";
import { countLabel } from "@/lib/format";
import { CartLink } from "./cart-link";
import { Scroller } from "./scroller";
import { SearchIcon, SparkIcon } from "./icons";

const ticker = [
  business.tagline,
  "Ихэнх бараа 5,999₮",
  `${countLabel(products.length)} онлайнаар`,
  "Төлбөр баталгаажсанаас хойш 24–48 цагт хүргэнэ",
  "QPay · Pocket зээл 100,000₮-өөс",
  business.slogan[1],
];

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden border-b-2 border-ink bg-pink py-1.5 text-[13px] font-bold text-white" aria-label="Мэдээлэл">
        <div className="marquee">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {ticker.map((t) => (
                <span key={t} className="flex items-center gap-4 px-4">
                  <SparkIcon size={11} className="text-sun" />
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="border-b-2 border-ink bg-white/95 backdrop-blur">
        <div className="wrap flex h-[68px] items-center gap-3 md:gap-6">
          <Link href="/" className="wobble shrink-0" aria-label={`${business.name}: нүүр`}>
            <Image src="/brand/logo-pink.png" alt="DAISO Japan" width={124} height={40} priority className="h-9 w-auto md:h-10" />
          </Link>
          <form action="/shop" role="search" className="relative hidden flex-1 md:block">
            <SearchIcon size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute" />
            <input name="q" type="search" placeholder="Юу хайж байна? «аяга», «Kuromi», «оймс»…" aria-label="Бараа хайх" className="h-12 w-full rounded-full border-2 border-ink bg-paper pr-4 pl-11 text-[15px] outline-none placeholder:text-mute focus:bg-white" />
          </form>
          <nav className="ml-auto flex items-center gap-1 text-[14.5px] font-extrabold md:ml-0" aria-label="Үндсэн цэс">
            <Link href="/shop" className="hidden rounded-full px-3 py-2 hover:bg-blush sm:block">
              Бүх бараа
            </Link>
            <Link href="/info" className="hidden rounded-full px-3 py-2 hover:bg-blush sm:block">
              Хүргэлт, мэдээлэл
            </Link>
            <Link href="/shop" className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink md:hidden" aria-label="Хайх">
              <SearchIcon size={19} />
            </Link>
            <CartLink />
          </nav>
        </div>
        <div className="wrap">
          <Scroller as="nav" label="Ангилал" small className="flex gap-2 overflow-x-auto pb-2.5 select-none [scrollbar-width:none]">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?c=${c.id}`} className="flex shrink-0 items-center gap-1.5 rounded-full bg-blush px-3 py-1 text-[13px] font-bold text-ink transition hover:bg-pink hover:text-white">
              <span aria-hidden>{c.emoji}</span>
              {c.name}
            </Link>
          ))}
          <Link href="/shop?tag=sanrio" className="flex shrink-0 items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-[13px] font-bold text-ink transition hover:bg-pink hover:text-white">
            <span aria-hidden>🎀</span>Sanrio
          </Link>
          </Scroller>
        </div>
      </div>
    </header>
  );
}
