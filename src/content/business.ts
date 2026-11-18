/**
 * Business facts from daiso.mn (Zochil shop 2366: shop settings, payment / delivery rules, delivery options, terms,
 * About, FAQ) and the Facebook page facebook.com/daisomn.shop, read on 2026-11-18. Nothing here is invented; open
 * questions (e.g. the three different city-zone descriptions) are listed in docs/erxes/MANUAL-STEPS.md.
 */
export const business = {
  name: "Daiso Mongolia",
  /** Zochil shop description. */
  tagline: "Япон гэр ахуйн барааны дэлгүүр",
  /** About page «УРИА ҮГ». */
  slogan: ["Амьдралд тань ая тух нэмье", "Төсөөлснөөс илүүг Дайсогоос"],
  company: "«Монова Трейд» ХХК",
  since: 2014,
  description: "Daiso Mongolia: Япон гэр ахуйн бараа. Гал тогоо, гэр ахуй, гоо сайхан, хүнс, бичиг хэрэг, тоглоом. Ихэнх бараа 5,999₮.",
  phone: { display: "9956-1248", tel: "+97699561248" },
  /** FAQ: «9402-8548, 9956-1248 дугаарын утсаар холбогдож…». */
  phone2: { display: "9402-8548", tel: "+97694028548" },
  email: "sales@daiso.mn",
  address: "СБД, Гурван гал худалдааны төв",
  /** Map search for the store address. */
  map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Гурван гал худалдааны төв, Улаанбаатар"),
  facebook: "https://www.facebook.com/daisomn.shop",
  messenger: "https://m.me/daisomn.shop",
  instagram: "https://www.instagram.com/daiso_mongolia/",
  youtube: "https://www.youtube.com/@daisomongolia4462/featured",
  /**
   * Zochil payment methods: QPay (qpay2), Pocket and HiPay. erxes 3.0 has QPay and Pocket payment kinds (HiPay is not
   * one), so the website offers those two. FAQ: Pocket loans start at 100,000₮, no prepayment, no fee.
   */
  payments: [
    { id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө", min: 0 },
    { id: "pocket", name: "Pocket", note: "Зээлээр: 100,000₮-өөс, урьдчилгаагүй, шимтгэлгүй", min: 100_000 },
  ],
  /**
   * Zochil delivery options (fees as set there). Pick-up is not enabled on Zochil, so it is not offered.
   * The A-zone border is written three different ways on Zochil (option, delivery rule, FAQ): the option text is used.
   */
  delivery: [
    { id: "zone-a", name: "Хот дотор · А бүс", fee: 6600, needsAddress: true, note: "5 шар – 7 буудал – Офицеруудын ордон – Нисэх хүртэл" },
    { id: "zone-b", name: "Хот дотор · Б бүс", fee: 8800, needsAddress: true, note: "А бүсээс цааш: км тутамд хүргэлтийн үнэ нэмэгдэж болно" },
    { id: "countryside", name: "Орон нутаг", fee: 13200, needsAddress: true, note: "Монгол шуудангаар: ажлын 3 хоногт илгээж, 7–10 хоногт хүргэгдэнэ. Бүсээс хамаарч нэмэгдэж болно" },
  ],
  rules: {
    delivery: "Төлбөр баталгаажсаны дараа 24–48 цагт хүргэнэ.",
    payment: "Захиалсан барааны төлбөрийг 100% урьдчилан төлснөөр захиалга баталгаажна. Төлбөр дутуу бол хүргэлт хийгдэхгүй.",
    deadline: "Захиалга хийснээс хойш 48 цагийн дотор төлбөрөө бүрэн төлөөгүй бол захиалга цуцлагдана.",
    returns: "Барааны мэдээлэлтэй сайтар танилцаж захиална уу: хүргэгдсэн барааг зөвхөн нөхцөлд заасан тохиолдолд буцаана.",
    ebarimt: "Бүх захиалгад и-баримт олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;
export const deliveryFee = (id: DeliveryId): number => deliveryOption(id).fee;
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;
