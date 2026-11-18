import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { categories } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { FacebookIcon, InstagramIcon, PhoneIcon, PinIcon, YoutubeIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-pink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
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
          <ul className="mt-4 grid gap-3 text-[14.5px] font-bold">
            <li>
              <a href={`tel:${business.phone.tel}`} className="inline-flex items-center gap-2 hover:text-sun">
                <PhoneIcon size={17} /> {business.phone.display}
              </a>
              <span className="text-white/70"> · </span>
              <a href={`tel:${business.phone2.tel}`} className="hover:text-sun">
                {business.phone2.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-sun">
                {business.email}
              </a>
            </li>
            <li className="flex gap-2">
              <PinIcon size={17} className="mt-1 shrink-0" /> {business.address}
            </li>
          </ul>
          <ul className="mt-6 grid gap-1 text-[13.5px] text-white/85">
            {business.delivery.map((d) => (
              <li key={d.id}>
                {d.name}: <b>{formatPrice(d.fee)}</b>
              </li>
            ))}
          </ul>
          <Link href="/info" className="mt-5 inline-block text-[14px] font-extrabold underline decoration-sun decoration-2 underline-offset-4">
            Хүргэлт, төлбөр, түгээмэл асуулт
          </Link>
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
