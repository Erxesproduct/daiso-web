import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid place-items-center pt-16 md:pt-24">
      <div className="card max-w-md p-10 text-center">
        <p className="float text-[64px] leading-none" style={{ "--r": "-8deg" } as React.CSSProperties} aria-hidden>
          🧺
        </p>
        <h1 className="heading mt-5 text-[34px]">Энэ тавиур хоосон</h1>
        <p className="hand mt-2 text-[17px] text-mute">Хайсан хуудас олдсонгүй.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-pink">
            Нүүр хуудас
          </Link>
          <Link href="/shop" className="btn btn-white">
            Бүх бараа
          </Link>
        </div>
      </div>
    </div>
  );
}
