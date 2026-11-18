import { Balsamiq_Sans, M_PLUS_Rounded_1c } from "next/font/google";

// Both carry Mongolian Ө ө Ү ү (checked against the Google Fonts cmap).
/** Rounded Japanese-store sans: headings, body, prices. */
export const rounded = M_PLUS_Rounded_1c({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "700", "800", "900"], variable: "--nf-rounded", display: "swap" });
/** Hand-written shelf notes and stickers. */
export const hand = Balsamiq_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "700"], variable: "--nf-hand", display: "swap" });
