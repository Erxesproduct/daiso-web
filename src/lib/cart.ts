"use client";

import { useSyncExternalStore } from "react";
import { resolveLine } from "@/lib/lite";

export type CartItem = { slug: string; qty: number };

const KEY = "daiso.cart.v1";
const EMPTY: CartItem[] = [];
export const MAX_QTY = 20;

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Most units of one product a customer can order: stock when tracked, never more than MAX_QTY. */
export function maxQty(slug: string) {
  const line = resolveLine(slug);
  if (!line) return 0;
  return line.stock == null ? MAX_QTY : Math.min(MAX_QTY, line.stock);
}

const isItem = (x: unknown): x is CartItem => {
  const i = x as CartItem;
  return !!i && typeof i.slug === "string" && Number.isInteger(i.qty) && i.qty > 0 && maxQty(i.slug) > 0;
};

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(parsed)) items = parsed.filter(isItem).map((i) => ({ slug: i.slug, qty: Math.min(i.qty, maxQty(i.slug)) }));
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: the cart still works for this page view */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => (load(), items),
    () => EMPTY,
  );
}

export const cart = {
  add(slug: string, qty = 1) {
    load();
    const cap = maxQty(slug);
    if (cap <= 0) return;
    const has = items.some((i) => i.slug === slug);
    commit(has ? items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(cap, i.qty + qty) } : i)) : [...items, { slug, qty: Math.min(cap, qty) }]);
  },
  setQty(slug: string, qty: number) {
    load();
    const cap = maxQty(slug);
    commit(qty <= 0 ? items.filter((i) => i.slug !== slug) : items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(cap, qty) } : i)));
  },
  clear() {
    commit(EMPTY);
  },
};

export const cartCount = (list: CartItem[]) => list.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (list: CartItem[]) => list.reduce((s, i) => s + (resolveLine(i.slug)?.price ?? 0) * i.qty, 0);
