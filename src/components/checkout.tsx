"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business, deliveryFee, deliveryOption, paymentOption, type DeliveryId, type PaymentId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { resolveLine } from "@/lib/lite";
import type { OrderErrors } from "@/lib/orders/schema";
import { BasketIcon, ChatIcon, CheckIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

type Done = { reference: string; total: number; deliveryFee: number; delivery: DeliveryId; payment: PaymentId; lines: { name: string; qty: number; total: number }[] };

const field = "mt-1.5 w-full rounded-2xl border-2 border-ink/25 bg-paper px-4 py-3 text-[15.5px] outline-none transition focus:border-ink focus:bg-white aria-invalid:border-pink aria-invalid:bg-blush/50";

export function Checkout() {
  const items = useCart();
  const [delivery, setDelivery] = useState<DeliveryId>("zone-a");
  const [payment, setPayment] = useState<PaymentId>("qpay");
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const lines = items.flatMap((i) => {
    const l = resolveLine(i.slug);
    return l ? [{ ...i, line: l }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(delivery);
  const total = subtotal + fee;
  const pocketMin = paymentOption("pocket").min;

  if (done) return <Receipt done={done} />;

  if (!lines.length)
    return (
      <div className="card mx-auto max-w-lg px-8 py-14 text-center">
        <span className="float mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-ink bg-blush text-pink" style={{ "--r": "-6deg" } as React.CSSProperties}>
          <BasketIcon size={34} />
        </span>
        <p className="heading mt-6 text-[34px]">Сагс хоосон байна</p>
        <p className="hand mt-2 text-[17px] text-mute">5,999₮-ийн тавиураас эхлэх үү?</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-pink">
            Бүх бараа
          </Link>
          <Link href="/shop?tier=5999" className="btn btn-white">
            5,999₮ хүртэл
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          address: f.get("address") ?? "",
          payment,
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ slug, qty }) => ({ slug, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setDone({ reference: json.reference, total: json.total ?? total, deliveryFee: json.deliveryFee ?? fee, delivery, payment, lines: lines.map((l) => ({ name: l.line.product.n, qty: l.qty, total: l.line.price * l.qty })) });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалгын систем тохируулагдаж байна. Захиалгаа ${business.phone.display} дугаарт эсвэл Facebook чатаар өгнө үү (лавлах код ${json.reference}, нийт ${formatPrice(json.total ?? total)}).`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) => errors[k] && <p className="mt-1.5 text-[13.5px] font-bold text-pink">{errors[k]}</p>;
  const step = (n: number, t: string, color: string) => (
    <h2 className="flex items-center gap-3">
      <span className="grid h-10 w-10 -rotate-6 place-items-center rounded-full border-2 border-ink text-[16px] font-black" style={{ background: color }}>
        {n}
      </span>
      <span className="text-[22px] font-black">{t}</span>
    </h2>
  );
  const radio = (on: boolean) => (
    <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-ink bg-pink" : "border-ink/30 bg-white"}`}>{on && <span className="h-2 w-2 rounded-full bg-white" />}</span>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
      <div className="space-y-6">
        <section className="card overflow-hidden">
          <ul className="divide-y-2 divide-dashed divide-line">
            {lines.map(({ slug, qty, line }) => (
              <li key={slug} className="flex gap-4 p-4">
                <Link href={`/p/${slug}`} className="relative h-22 w-22 shrink-0 overflow-hidden rounded-2xl border-2 border-line bg-white">
                  {line.product.t ? <Image src={line.product.t} alt="" fill sizes="88px" className="object-contain p-1.5" /> : <span className="grid h-full place-items-center text-[28px]">🛍️</span>}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/p/${slug}`} className="line-clamp-2 leading-snug font-extrabold hover:text-pink">
                    {line.product.n}
                  </Link>
                  <span className="text-[13px] text-mute">{formatPrice(line.price)} / ш</span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full border-2 border-ink bg-white">
                      <button type="button" onClick={() => cart.setQty(slug, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-blush" aria-label="Цөөлөх">
                        <MinusIcon size={15} />
                      </button>
                      <span className="w-7 text-center text-sm font-black">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(slug, qty + 1)} disabled={qty >= maxQty(slug)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-blush disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={15} />
                      </button>
                    </div>
                    <span className="font-black">{formatPrice(line.price * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(slug, 0)} className="grid h-9 w-9 place-items-center rounded-full text-mute hover:bg-blush hover:text-pink" aria-label={`${line.product.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 md:p-7">
          {step(1, "Захиалагч", "var(--mint)")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-[14px] font-bold">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} className={field} />
              {err("name")}
            </label>
            <label className="text-[14px] font-bold">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} className={field} />
              {err("phone")}
            </label>
            <label className="text-[14px] font-bold sm:col-span-2">
              Имэйл <span className="font-normal text-mute">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className="card p-5 md:p-7">
          {step(2, "Хүргэлт", "var(--sun)")}
          <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label="Хүргэлтийн бүс">
            {business.delivery.map((d) => (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={delivery === d.id}
                onClick={() => setDelivery(d.id)}
                className="flex items-start gap-3 rounded-2xl border-2 border-ink/20 bg-white p-4 text-left transition hover:border-ink/50 aria-checked:border-ink aria-checked:bg-blush/40 aria-checked:shadow-[3px_3px_0_var(--ink)]"
              >
                {radio(delivery === d.id)}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 font-extrabold">
                    {d.name}
                    <span className="text-pink">{formatPrice(d.fee)}</span>
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-2">{d.note}</span>
                </span>
              </button>
            ))}
          </div>
          {errors.delivery && err("delivery")}
          <label className="mt-4 block text-[14px] font-bold">
            {delivery === "countryside" ? "Аймаг, сум, хүлээн авах хаяг" : "Хаяг"}
            <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder={delivery === "countryside" ? "Аймаг, сум, баг, хүлээн авах хүн" : "Дүүрэг, хороо, байр, орц, давхар, тоот"} className={field} />
            {err("address")}
          </label>
          <p className="hand mt-3 text-[14px] text-ink-2">{business.rules.delivery}</p>
        </section>

        <section className="card p-5 md:p-7">
          {step(3, "Төлбөр, и-баримт", "var(--sky)")}
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Төлбөрийн хэлбэр">
            {business.payments.map((m) => {
              const blocked = subtotal < m.min;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={payment === m.id}
                  disabled={blocked}
                  onClick={() => setPayment(m.id)}
                  className="flex items-start gap-3 rounded-2xl border-2 border-ink/20 bg-white p-4 text-left transition hover:border-ink/50 disabled:cursor-not-allowed disabled:opacity-50 aria-checked:border-ink aria-checked:bg-blush/40 aria-checked:shadow-[3px_3px_0_var(--ink)]"
                >
                  {radio(payment === m.id)}
                  <span>
                    <span className="block font-extrabold">{m.name}</span>
                    <span className="block text-[13px] leading-snug text-ink-2">{blocked ? `${formatPrice(m.min)}-өөс дээш захиалгад` : m.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {payment === "pocket" && subtotal < pocketMin && <p className="mt-2 text-[13.5px] font-bold text-pink">Pocket зээл {formatPrice(pocketMin)}-өөс эхэлнэ.</p>}
          {err("payment")}
          <div className="mt-6 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip aria-checked:bg-ink aria-checked:text-white">
                {label}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="mt-4 block text-[14px] font-bold">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className={field} />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-mute">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="mt-5 block text-[14px] font-bold">
            Нэмэлт тайлбар <span className="font-normal text-mute">(өнгө, хүргэх цаг гэх мэт)</span>
            <textarea name="note" rows={2} className={field} />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-40 lg:self-start">
        <div className="card relative overflow-hidden bg-pink p-6 text-white md:p-8">
          <span className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10" aria-hidden />
          <h2 className="heading text-[30px]">Төлөх дүн</h2>
          <dl className="mt-5 space-y-2.5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-white/75">Барааны дүн</dt>
              <dd className="font-bold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/75">{deliveryOption(delivery).name}</dt>
              <dd className="font-bold">{formatPrice(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t-2 border-dashed border-white/40 pt-3">
              <dt className="font-black">Нийт</dt>
              <dd className="text-[30px] font-black text-sun">{formatPrice(total)}</dd>
            </div>
          </dl>
          <div className="mt-5 rounded-2xl bg-white/12 p-4 text-[13px] leading-snug text-white/90">
            <p>{business.rules.payment}</p>
            <p className="mt-1.5">{business.rules.deadline}</p>
          </div>
          {notice && (
            <p role="alert" className="mt-4 rounded-2xl border-2 border-ink bg-sun px-4 py-3 text-[14px] font-bold text-ink">
              {notice}
            </p>
          )}
          {errors.items && <p className="mt-3 rounded-xl bg-white px-3 py-2 text-[14px] font-bold text-pink">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-sun mt-6 h-14 w-full text-[17px] disabled:cursor-wait disabled:opacity-70">
            {busy ? "Илгээж байна…" : "Захиалга өгөх"}
          </button>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-bold text-white/90">
            <a href={`tel:${business.phone.tel}`} className="inline-flex items-center gap-2 hover:text-sun">
              <PhoneIcon size={16} /> {business.phone.display}
            </a>
            <a href={business.messenger} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-sun">
              <ChatIcon size={16} /> Facebook чат
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Receipt({ done }: { done: Done }) {
  const option = deliveryOption(done.delivery);
  return (
    <div className="mx-auto max-w-lg">
      <div className="card pop-in overflow-hidden">
        <div className="bg-pink p-8 text-white">
          <span className="grid h-14 w-14 -rotate-6 place-items-center rounded-full border-2 border-ink bg-sun text-ink">
            <CheckIcon size={28} />
          </span>
          <h2 className="heading mt-5 text-[36px]">Захиалга хүлээн авлаа!</h2>
          <p className="mt-2 text-white/85">
            Захиалгын код: <b className="text-sun">{done.reference}</b>
          </p>
        </div>
        <div className="p-8">
          <ul className="space-y-2 text-[14.5px]">
            {done.lines.map((l) => (
              <li key={l.name} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name} × {l.qty}
                </span>
                <span className="shrink-0 font-bold">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">{option.name}</span>
              <span className="shrink-0 font-bold">{formatPrice(done.deliveryFee)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t-2 border-dashed border-line pt-3 text-lg font-black">
              <span>Нийт</span>
              <span>{formatPrice(done.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[14.5px] leading-relaxed text-ink-2">
            Бид {paymentOption(done.payment).name}-ийн нэхэмжлэлийг таны {done.payment === "pocket" ? "Pocket апп руу" : "утас руу"} илгээнэ. {business.rules.deadline} {business.rules.delivery} {business.rules.ebarimt}
          </p>
          <Link href="/" className="btn btn-pink mt-7">
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
