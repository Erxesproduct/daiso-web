/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases (no order reaches erxes).
 * With --send it also places ONE real test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу» in the note.
 * Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const P = catalog.products;
// Daiso delivery fees (Zochil delivery options): A zone 6,600₮, B zone 8,800₮, countryside 13,200₮. No pick-up.
const FEES = { "zone-a": 6600, "zone-b": 8800, countryside: 13200 };
const orderable = (p) => p.stock == null || p.stock >= 1;

const cheap = P.filter(orderable).sort((a, b) => a.price - b.price);
const first = cheap.find((p) => p.stock == null || p.stock >= 2);
const second = cheap.find((p) => p !== first);
const big = [...P].filter(orderable).sort((a, b) => b.price - a.price)[0];
const soldout = P.find((p) => p.stock === 0);
const scarce = P.find((p) => p.stock != null && p.stock > 0 && p.stock < 20);

const SUBTOTAL = first.price * 2 + second.price;
const EXPECTED_TOTAL = SUBTOTAL + FEES["zone-a"];
const pocketItem = P.filter(orderable).find((p) => p.price * 5 >= 100000 && (p.stock == null || p.stock >= 5));

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  delivery: "zone-a",
  address: "Баянгол дүүрэг, 3-р хороо, тест хаяг, 1 тоот",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  items: [
    { slug: first.slug, qty: 2 },
    { slug: second.slug, qty: 1 },
  ],
};

async function post(body) {
  const res = await fetch(`${base}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

// valid = passed validation (200 when erxes is set, 503 not_configured otherwise)
const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected) => (r) => valid(r) && r.json?.total === expected;

const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown product is ignored (then empty)", { ...order, items: [{ slug: "no-such-product", qty: 1 }] }, rejects("items")],
  ...(soldout ? [[`sold-out product is not orderable (${soldout.slug})`, { ...order, items: [{ slug: soldout.slug, qty: 1 }] }, rejects("items")]] : []),
  ...(scarce ? [[`more than the stock is rejected (${scarce.slug}, stock ${scarce.stock})`, { ...order, items: [{ slug: scarce.slug, qty: scarce.stock + 1 }] }, rejects("items")]] : []),
  [`A zone order: ${SUBTOTAL}₮ + 6,600₮ delivery`, order, (r) => total(EXPECTED_TOTAL)(r) && r.json?.deliveryFee === 6600],
  ["B zone adds 8,800₮", { ...order, delivery: "zone-b" }, (r) => total(SUBTOTAL + 8800)(r) && r.json?.deliveryFee === 8800],
  ["countryside adds 13,200₮", { ...order, delivery: "countryside", address: "Дархан-Уул, Дархан сум, 5-р баг, шуудангаар" }, (r) => total(SUBTOTAL + 13200)(r) && r.json?.deliveryFee === 13200],
  ["pick-up is not offered (not enabled on Zochil)", { ...order, delivery: "pickup", address: "" }, rejects("delivery")],
  [`a big order (${big.slug} × 2)`, { ...order, items: [{ slug: big.slug, qty: 2 }] }, total(big.price * 2 + 6600)],
  ["address is required for city delivery", { ...order, address: "" }, rejects("address")],
  ["countryside needs an address", { ...order, delivery: "countryside", address: "" }, rejects("address")],
  ["QPay is accepted", order, valid],
  ["Pocket under 100,000₮ is rejected", { ...order, payment: "pocket" }, rejects("payment")],
  ...(pocketItem ? [[`Pocket from 100,000₮ passes (${pocketItem.slug} × 5)`, { ...order, payment: "pocket", items: [{ slug: pocketItem.slug, qty: 5 }] }, total(pocketItem.price * 5 + 6600)]] : []),
  ["bank transfer is not offered", { ...order, payment: "bank" }, rejects("payment")],
  ["HiPay is not offered (no erxes payment kind)", { ...order, payment: "hipay" }, rejects("payment")],
  ["unknown delivery option is rejected", { ...order, delivery: "drone" }, rejects("delivery")],
  ["unknown payment is rejected", { ...order, payment: "cash" }, rejects("payment")],
  ["company eBarimt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company eBarimt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 20 is ignored", { ...order, items: [{ slug: first.slug, qty: 21 }] }, rejects("items")],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true],
];

let failed = 0;
console.log(`Order API checks against ${base}\n`);
for (const [label, body, ok] of cases) {
  const r = await post(body);
  const pass = ok(r);
  if (!pass) failed++;
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""})`);
}

if (send) {
  const r = await post(order);
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order delivered to erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${EXPECTED_TOTAL})`);
    if (r.json.total !== EXPECTED_TOTAL) {
      failed++;
      console.log("✗ unexpected total");
    }
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : `\nall ${cases.length} checks passed`);
process.exit(failed ? 1 : 0);
