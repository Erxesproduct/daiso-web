"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/catalog";

export function Gallery({ images, name }: { images: Photo[]; name: string }) {
  const [i, setI] = useState(0);
  const img = images[i] ?? images[0];
  return (
    <div>
      <div className="card relative aspect-square overflow-hidden">
        <Image key={img.src} src={img.src} alt={name} width={img.w} height={img.h} priority sizes="(min-width: 1024px) 560px, 100vw" className="pop-in h-full w-full object-contain p-5" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Зургууд">
          {images.map((m, k) => (
            <button key={m.src} type="button" role="tab" aria-selected={k === i} aria-label={`Зураг ${k + 1}`} onClick={() => setI(k)} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-line bg-white transition aria-selected:border-ink aria-selected:shadow-[2px_2px_0_var(--ink)]">
              <Image src={m.thumb.src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
