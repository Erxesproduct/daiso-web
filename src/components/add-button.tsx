"use client";

import { useState } from "react";
import { cart, maxQty, useCart } from "@/lib/cart";
import { BasketIcon, CheckIcon, MinusIcon, PlusIcon } from "./icons";

/** Round «+» on a product card: adds one, then shows the quantity stepper. */
export function AddButton({ slug, name }: { slug: string; name: string }) {
  const items = useCart();
  const qty = items.find((i) => i.slug === slug)?.qty ?? 0;
  const cap = maxQty(slug);
  if (cap <= 0) return <span className="hand rounded-full bg-ink px-3 py-1 text-[13px] text-white">Дууссан</span>;
  if (!qty)
    return (
      <button type="button" onClick={() => cart.add(slug)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-pink text-white shadow-[2px_2px_0_var(--ink)] transition hover:rotate-90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none" aria-label={`${name}: сагсанд нэмэх`}>
        <PlusIcon size={20} />
      </button>
    );
  return (
    <span className="pop-in flex items-center rounded-full border-2 border-ink bg-sun">
      <button type="button" onClick={() => cart.setQty(slug, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/60" aria-label={`${name}: цөөлөх`}>
        <MinusIcon size={15} />
      </button>
      <span className="w-5 text-center text-[14px] font-black" aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={() => cart.add(slug)} disabled={qty >= cap} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/60 disabled:opacity-30" aria-label={`${name}: нэмэх`}>
        <PlusIcon size={15} />
      </button>
    </span>
  );
}

/** Big «Сагсанд хийх» on the product page. */
export function BuyBox({ slug, name }: { slug: string; name: string }) {
  const items = useCart();
  const inCart = items.find((i) => i.slug === slug)?.qty ?? 0;
  const cap = maxQty(slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (cap <= 0)
    return (
      <div className="card-soft bg-blush p-4">
        <p className="font-extrabold">Энэ бараа одоогоор дууссан</p>
        <p className="mt-1 text-[14px] text-ink-2">Дахин ирэх эсэхийг Facebook чатаар асуугаарай.</p>
      </div>
    );
  const left = cap - inCart;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border-2 border-ink bg-white">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-blush" aria-label="Цөөлөх">
          <MinusIcon size={18} />
        </button>
        <span className="w-8 text-center text-lg font-black">{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(Math.max(1, left), q + 1))} disabled={qty >= left} className="grid h-12 w-12 place-items-center rounded-full hover:bg-blush disabled:opacity-30" aria-label="Нэмэх">
          <PlusIcon size={18} />
        </button>
      </div>
      <button
        type="button"
        disabled={left <= 0}
        onClick={() => {
          cart.add(slug, qty);
          setAdded(true);
          setQty(1);
          window.setTimeout(() => setAdded(false), 1800);
        }}
        className="btn btn-pink h-14 flex-1 text-[17px] disabled:opacity-50"
        aria-label={`${name}: сагсанд хийх`}
      >
        {added ? <CheckIcon size={20} /> : <BasketIcon size={20} />}
        {added ? "Сагсанд орлоо!" : left <= 0 ? "Үлдэгдэл дууссан" : "Сагсанд хийх"}
      </button>
      {inCart > 0 && <p className="hand w-full text-[14px] text-pink">Сагсанд {inCart} ширхэг байна</p>}
    </div>
  );
}
