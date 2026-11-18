import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { getPost, posts } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  const description = p.body.find((b) => b.t === "p")?.x.slice(0, 160);
  return { title: p.title, description, alternates: { canonical: `/tips/${p.slug}` }, openGraph: { title: p.title, description, images: p.image ? [{ url: p.image.src, width: p.image.w, height: p.image.h }] : undefined } };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const others = posts.filter((x) => x.slug !== p.slug);
  return (
    <article className="wrap max-w-3xl pt-8 md:pt-12">
      <p className="hand text-[17px] text-pink">Daiso-гийн зөвлөгөө{p.date && ` · ${formatDate(p.date)}`}</p>
      <h1 className="heading mt-1 text-[34px] md:text-[50px]">{p.title}</h1>
      {p.image && (
        <div className="card mt-8 overflow-hidden">
          <Image src={p.image.src} alt="" width={p.image.w} height={p.image.h} priority sizes="(min-width: 800px) 760px, 100vw" className="h-auto w-full" />
        </div>
      )}
      <div className="prose-daiso mt-8 text-[16.5px]">
        {p.body.map((b, i) => (b.t === "h" ? <h3 key={i}>{b.x}</h3> : b.t === "li" ? <li key={i}>{b.x}</li> : <p key={i}>{b.x}</p>))}
      </div>
      <div className="mt-14 border-t-2 border-dashed border-line pt-8">
        <p className="font-black">Бусад зөвлөгөө</p>
        <ul className="mt-4 grid gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/tips/${o.slug}`} className="inline-flex items-center gap-2 font-bold hover:text-pink">
                <ArrowIcon size={16} className="text-pink" /> {o.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/shop" className="btn btn-pink mt-8">
          Дэлгүүр хэсэх
        </Link>
      </div>
    </article>
  );
}
