import Image from "next/image";
import Link from "next/link";
import { getCategory, soldOut, type Product } from "@/lib/catalog";
import { AddButton } from "./add-button";
import { PriceTag } from "./price-tag";

/** A product as a shelf item: white photo card, sticker price, round «+». */
export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const img = p.images[0]?.thumb;
  const out = soldOut(p);
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/p/${p.slug}`} className="card relative block aspect-square overflow-hidden transition group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0_var(--ink)]">
        {img ? (
          <Image src={img.src} alt={p.name} width={img.w} height={img.h} priority={priority} sizes="(min-width: 1024px) 230px, 45vw" className={`h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105 ${out ? "opacity-45 grayscale" : ""}`} />
        ) : (
          <NoPhoto category={p.category} />
        )}
        {p.sanrio && <span className="hand absolute top-2.5 left-2.5 rounded-full bg-blush-2 px-2.5 py-0.5 text-[12px] font-bold text-pink-deep">Sanrio</span>}
        {out && <span className="hand absolute top-2.5 right-2.5 rotate-6 rounded-full bg-ink px-2.5 py-0.5 text-[12px] text-white">Дууссан</span>}
      </Link>
      <div className="mt-3 flex flex-1 flex-col px-1">
        <Link href={`/p/${p.slug}`} className="line-clamp-2 text-[14.5px] leading-snug font-bold hover:text-pink">
          {p.name}
        </Link>
        {p.note && <span className="mt-0.5 line-clamp-1 text-[12.5px] text-mute">{p.note}</span>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <PriceTag price={p.price} compareAt={p.compareAt} size="sm" />
          <AddButton slug={p.slug} name={p.name} />
        </div>
      </div>
    </article>
  );
}

/** 77 products have no photo on Zochil: a category doodle instead of an empty box. */
export function NoPhoto({ category, big = false }: { category: string; big?: boolean }) {
  const c = getCategory(category);
  return (
    <span className="grid h-full w-full place-items-center bg-blush/60 text-center">
      <span>
        <span className={`block ${big ? "text-[96px]" : "text-[54px]"} leading-none`} aria-hidden>
          {c?.emoji ?? "🛍️"}
        </span>
        <span className="hand mt-2 block text-[13px] text-pink-deep">Зураг удахгүй</span>
      </span>
    </span>
  );
}
