import { formatPrice } from "@/lib/format";
import { tierOf } from "@/lib/tiers";

/** The price as a shelf sticker in its price-point colour. */
export function PriceTag({ price, compareAt, size = "md", className = "" }: { price: number; compareAt?: number | null; size?: "sm" | "md" | "lg"; className?: string }) {
  const t = tierOf(price);
  const text = size === "lg" ? "text-[30px] md:text-[36px]" : size === "sm" ? "text-[14.5px]" : "text-[17px]";
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className="tag-edge">
        <span className={`tag ${text}`} style={{ "--bg": t.bg, "--fg": t.fg } as React.CSSProperties}>
          {formatPrice(price)}
        </span>
      </span>
      {compareAt != null && compareAt > price && <s className="text-[13px] font-bold text-mute">{formatPrice(compareAt)}</s>}
    </span>
  );
}
