"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { liteProducts, type Lite } from "@/lib/lite";
import { TIERS, tierOf } from "@/lib/tiers";
import { AddButton } from "./add-button";
import { ShuffleIcon } from "./icons";

const BALLS = ["var(--mint)", "var(--sun)", "var(--sky)", "var(--tangerine)", "var(--grape)", "#fff", "var(--mint)", "var(--sun)", "var(--sky)", "#ffc9e3", "var(--tangerine)", "#fff"];

/**
 * «Азын капсул»: a capsule-toy machine that drops one random in-stock product (with a photo) from the chosen price
 * point. Pure fun on top of the real catalog: the pick is a link to the product and can go straight into the cart.
 */
export function Gacha() {
  const [tier, setTier] = useState<string>("5999");
  const [pick, setPick] = useState<Lite | null>(null);
  const [spin, setSpin] = useState(0);
  const [busy, setBusy] = useState(false);

  const pool = liteProducts.filter((p) => p.k !== 0 && p.t && tierOf(p.p).id === tier);

  function turn() {
    if (busy || !pool.length) return;
    setBusy(true);
    setPick(null);
    setSpin((s) => s + 1);
    const candidates = pool.length > 1 && pick ? pool.filter((p) => p.s !== pick.s) : pool;
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    window.setTimeout(() => {
      setPick(next);
      setBusy(false);
    }, 900);
  }

  const color = TIERS.find((t) => t.id === tier)!.bg;

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,330px)_1fr] md:gap-12">
      {/* the machine */}
      <div className="relative mx-auto w-full max-w-[330px]" aria-hidden>
        <div className={`relative ${busy ? "animate-[shake_0.3s_ease-in-out_3]" : ""}`}>
          <div className="relative mx-auto aspect-square w-[88%] overflow-hidden rounded-full border-[3px] border-ink bg-white/70 shadow-[inset_-14px_-14px_0_rgba(230,0,126,0.08)]">
            {BALLS.map((c, i) => (
              <span
                key={i}
                className="absolute h-[23%] w-[23%] rounded-full border-2 border-ink"
                style={{
                  background: `linear-gradient(180deg, ${c} 50%, #fff 50%)`,
                  left: `${[8, 30, 54, 72, 14, 40, 64, 4, 24, 48, 70, 36][i]}%`,
                  top: `${[58, 66, 62, 52, 38, 44, 30, 18, 14, 22, 10, 2][i] + (busy ? (i % 2 ? -6 : 6) : 0)}%`,
                  transform: `rotate(${i * 37}deg)`,
                  transition: "top .25s ease",
                }}
              />
            ))}
            <span className="absolute top-[12%] left-[16%] h-[14%] w-[8%] -rotate-30 rounded-full bg-white/80" />
          </div>
          <div className="relative -mt-3 rounded-[26px] border-[3px] border-ink bg-pink px-5 pt-6 pb-5 shadow-[5px_5px_0_var(--ink)]">
            <p className="text-center text-[13px] font-black tracking-[0.2em] text-white">DAISO · GACHA</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-ink bg-white" style={{ transform: `rotate(${spin * 360}deg)`, transition: "transform .9s cubic-bezier(.3,1.3,.5,1)" }}>
                <span className="h-2.5 w-11 rounded-full bg-ink" />
              </span>
              <span className="grid h-16 w-20 place-items-end justify-center rounded-t-[14px] rounded-b-[30px] border-[3px] border-ink bg-ink/85 pb-1.5">
                {pick && <span className="pop-in h-9 w-9 rounded-full border-2 border-white" style={{ background: `linear-gradient(180deg, ${color} 50%, #fff 50%)` }} />}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* controls + result */}
      <div>
        <p className="hand text-[18px] text-pink">Юу авахаа мэдэхгүй байна уу?</p>
        <h2 className="heading mt-1 text-[36px] md:text-[48px]">Азын капсул</h2>
        <p className="mt-2 max-w-md text-ink-2">Үнээ сонгоод бариулыг эргүүл: машин танд нэг бараа санал болгоно.</p>
        <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Үнийн шошго">
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={tier === t.id}
              onClick={() => {
                setTier(t.id);
                setPick(null);
              }}
              className="chip aria-checked:ring-2 aria-checked:ring-ink aria-checked:ring-offset-2"
              style={{ background: t.bg, color: t.fg }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={turn} disabled={busy || !pool.length} className="btn btn-pink mt-6 h-14 px-8 text-[17px] disabled:opacity-60">
          <ShuffleIcon size={20} /> {busy ? "Эргэж байна…" : pick ? "Дахин эргүүлэх" : "Бариулыг эргүүлэх"}
        </button>
        <div className="mt-6 min-h-[124px]" aria-live="polite">
          {pick ? (
            <div key={pick.s} className="card flex animate-[drop_.7s_cubic-bezier(.3,1.2,.5,1)] items-center gap-4 p-3 pr-4">
              <Link href={`/p/${pick.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-line bg-white">
                <Image src={pick.t!} alt="" fill sizes="96px" className="object-contain p-1.5" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/p/${pick.s}`} className="line-clamp-2 leading-snug font-extrabold hover:text-pink">
                  {pick.n}
                </Link>
                <p className="mt-1 text-[15px] font-black text-pink">{formatPrice(pick.p)}</p>
              </div>
              <AddButton slug={pick.s} name={pick.n} />
            </div>
          ) : (
            <p className="hand text-[15px] text-mute">{busy ? "Капсул унаж байна…" : `${pool.length} бараанаас нэгийг сонгоно.`}</p>
          )}
        </div>
      </div>
    </div>
  );
}
