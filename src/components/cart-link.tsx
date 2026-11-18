"use client";

import Link from "next/link";
import { cartCount, useCart } from "@/lib/cart";
import { BasketIcon } from "./icons";

export function CartLink() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-pink text-white shadow-[2px_2px_0_var(--ink)] transition hover:-translate-y-0.5" aria-label={n ? `Сагс, ${n} бараа` : "Сагс"}>
      <BasketIcon size={20} />
      {n > 0 && (
        <span key={n} className="pop-in absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full border-2 border-ink bg-sun px-1 text-[11.5px] font-black text-ink">
          {n}
        </span>
      )}
    </Link>
  );
}
