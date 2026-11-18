import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { categories } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon, YoutubeIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-pink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_1.3fr] lg:gap-14">
        <div>
          <Image src="/brand/logo-white.png" alt="DAISO Japan" width={160} height={52} className="h-12 w-auto" />
          <p className="hand mt-5 text-[20px] leading-snug">
            {business.slogan[0]},
            <br />
            {business.slogan[1]}
          </p>
          <p className="mt-4 max-w-sm text-[14px] text-white/80">
            {business.company} · {business.since} оноос. {business.tagline}.
          </p>
          <div className="mt-6 flex gap-2.5">
            {[
              [business.facebook, "Facebook", <FacebookIcon key="f" size={20} />],
              [business.instagram, "Instagram", <InstagramIcon key="i" size={20} />],
              [business.youtube, "YouTube", <YoutubeIcon key="y" size={20} />],
            ].map(([href, label, icon]) => (
              <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white text-ink shadow-[2px_2px_0_var(--ink)] transition hover:-translate-y-0.5 hover:bg-sun">
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[13px] font-black tracking-widest text-sun uppercase">Ангилал</p>
          <ul className="mt-4 grid gap-1.5 text-[14.5px] font-bold">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop?c=${c.id}`} className="hover:text-sun">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[13px] font-black tracking-widest text-sun uppercase">Холбоо барих</p>
          <ul className="mt-4 grid gap-3 text-ink">
            <li className="rounded-2xl border-2 border-ink bg-white p-3.5 shadow-[3px_3px_0_var(--ink)]">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-mint">
                  <PhoneIcon size={18} />
                </span>
                <span className="text-[12px] font-black tracking-widest text-mute uppercase">Утас</span>
              </span>
              <span className="mt-2.5 flex flex-wrap gap-2">
                {[business.phone, business.phone2].map((ph) => (
                  <a key={ph.tel} href={`tel:${ph.tel}`} className="rounded-full border-2 border-ink bg-paper px-3.5 py-1 text-[16px] font-black tracking-wide transition hover:-translate-y-0.5 hover:bg-sun">
                    {ph.display}
                  </a>
                ))}
              </span>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="group flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-3.5 shadow-[3px_3px_0_var(--ink)] transition hover:-translate-y-0.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-sky">
                  <MailIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-black tracking-widest text-mute uppercase">Имэйл</span>
                  <span className="block truncate text-[15.5px] font-black group-hover:text-pink">{business.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={business.map} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-3.5 shadow-[3px_3px_0_var(--ink)] transition hover:-translate-y-0.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun">
                  <PinIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-black tracking-widest text-mute uppercase">Дэлгүүр</span>
                  <span className="block text-[15px] leading-snug font-black group-hover:text-pink">{business.address}</span>
                  <span className="hand text-[13px] text-pink">Газрын зураг дээр харах →</span>
                </span>
              </a>
            </li>
          </ul>
          <div className="mt-5 rounded-2xl border-2 border-dashed border-white/50 p-3.5">
            <p className="flex items-center gap-2 text-[12px] font-black tracking-widest text-sun uppercase">
              <TruckIcon size={16} /> Хүргэлт
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {business.delivery.map((d) => (
                <li key={d.id} className="rounded-full bg-white/15 px-3 py-1 text-[13px]">
                  {d.name.replace("Хот дотор · ", "")} <b className="text-sun">{formatPrice(d.fee)}</b>
                </li>
              ))}
            </ul>
            <Link href="/info" className="mt-3 inline-block text-[13.5px] font-extrabold underline decoration-sun decoration-2 underline-offset-4 hover:text-sun">
              Хүргэлт, төлбөр, түгээмэл асуулт →
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-ink/30">
        <p className="wrap py-5 text-[12.5px] text-white/75">
          © {new Date().getFullYear()} {business.company}. Daiso.mn нь {business.company}-ийн албан ёсны цахим дэлгүүр.
        </p>
      </div>
    </footer>
  );
}
