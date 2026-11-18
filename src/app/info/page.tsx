import type { Metadata } from "next";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { business } from "@/content/business";
import { about, faq } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, мэдээлэл",
  description: `Daiso Mongolia: хүргэлтийн бүс, төлбөр (QPay, Pocket), түгээмэл асуулт, холбоо барих. ${business.address}.`,
  alternates: { canonical: "/info" },
};

// The About page is a list of short headings, each followed by one paragraph («АЛСЫН ХАРАА:» → «Монголоос…»).
const aboutIntro = about.filter((b) => b.t !== "h").slice(0, 1);
const aboutPairs = about.flatMap((b, i) => (b.t === "h" && about[i + 1] && about[i + 1].t !== "h" ? [{ h: b.x.replace(/:$/, ""), p: about[i + 1].x }] : []));

export default function InfoPage() {
  return (
    <div className="wrap pt-8 md:pt-12">
      <p className="hand text-[17px] text-pink">{business.company}</p>
      <h1 className="heading mt-1 text-[44px] md:text-[64px]">Хүргэлт, мэдээлэл</h1>
      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Хэсгүүд">
        {[
          ["#delivery", "Хүргэлт"],
          ["#payment", "Төлбөр"],
          ["#faq", "Түгээмэл асуулт"],
          ["#about", "Бидний тухай"],
          ["#contact", "Холбоо барих"],
        ].map(([h, t]) => (
          <a key={h} href={h} className="chip">
            {t}
          </a>
        ))}
      </nav>

      <section id="delivery" className="mt-12 scroll-mt-40">
        <h2 className="heading text-[30px] md:text-[40px]">Хүргэлт</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {business.delivery.map((d, i) => (
            <div key={d.id} className="card p-5" style={{ background: ["var(--mint)", "var(--sun)", "var(--sky)"][i] }}>
              <p className="font-extrabold">{d.name}</p>
              <p className="mt-1 text-[34px] font-black">{formatPrice(d.fee)}</p>
              <p className="mt-2 text-[14px] leading-snug">{d.note}</p>
            </div>
          ))}
        </div>
        <ul className="prose-daiso mt-5 max-w-3xl">
          <li>{business.rules.delivery}</li>
          <li>Хот доторх хүргэлтийн хязгаар: Толгойт, 32, Амгалан, Нисэх, Зайсан (дэлгүүрийн хүргэлтийн нөхцөлөөс). Хязгаараас гадагш бол нэмэлт хөлсийг захиалагч хариуцна.</li>
          <li>Барааны төрөл, жин, овор хэмжээ, баяр ёслол, цаг агаараас шалтгаалан хүргэлт удааширвал бид тань руу нэн даруй мэдэгдэнэ.</li>
        </ul>
      </section>

      <section id="payment" className="mt-16 scroll-mt-40">
        <h2 className="heading text-[30px] md:text-[40px]">Төлбөр</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {business.payments.map((m) => (
            <div key={m.id} className="card p-5">
              <p className="text-[22px] font-black">{m.name}</p>
              <p className="mt-1 text-ink-2">{m.note}</p>
            </div>
          ))}
        </div>
        <ul className="prose-daiso mt-5 max-w-3xl">
          <li>{business.rules.payment}</li>
          <li>{business.rules.deadline}</li>
          <li>{business.rules.ebarimt}</li>
          <li>{business.rules.returns}</li>
        </ul>
      </section>

      <section id="faq" className="mt-16 scroll-mt-40">
        <h2 className="heading text-[30px] md:text-[40px]">Түгээмэл асуулт</h2>
        <div className="mt-6 grid max-w-3xl gap-3">
          {faq.map((f, i) => (
            <details key={f.q} className="card-soft group p-5 open:border-ink open:shadow-[3px_3px_0_var(--ink)]" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun text-lg transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section id="about" className="mt-16 scroll-mt-40">
        <h2 className="heading text-[30px] md:text-[40px]">Бидний тухай</h2>
        {aboutIntro.map((b) => (
          <p key={b.x} className="mt-4 max-w-3xl text-[17px] leading-relaxed text-ink-2">
            {b.x}
          </p>
        ))}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {aboutPairs.map((a, i) => (
            <div key={a.h} className="card p-5" style={{ rotate: `${[-0.6, 0.5, 0.4, -0.4][i % 4]}deg` }}>
              <p className="hand text-[15px] text-pink">{a.h}</p>
              <p className="mt-1.5 leading-relaxed font-bold">{a.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-16 scroll-mt-40">
        <h2 className="heading text-[30px] md:text-[40px]">Холбоо барих</h2>
        <div className="card mt-6 grid gap-5 bg-blush p-6 md:grid-cols-2 md:p-8">
          <ul className="grid gap-3 font-bold">
            <li className="flex gap-2.5">
              <PinIcon size={20} className="mt-0.5 shrink-0 text-pink" /> {business.address}
            </li>
            <li className="flex flex-wrap gap-2.5">
              <PhoneIcon size={20} className="mt-0.5 shrink-0 text-pink" />
              <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>·<a href={`tel:${business.phone2.tel}`}>{business.phone2.display}</a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="underline underline-offset-4">
                {business.email}
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap items-start gap-3">
            <a href={business.messenger} target="_blank" rel="noreferrer" className="btn btn-pink">
              <FacebookIcon size={19} /> Facebook чат
            </a>
            <a href={business.instagram} target="_blank" rel="noreferrer" className="btn btn-white">
              <InstagramIcon size={19} /> Instagram
            </a>
            <Link href="/shop" className="btn btn-sun">
              Дэлгүүр хэсэх
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
