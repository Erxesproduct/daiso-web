import "server-only";

import { deliveryOption, paymentOption } from "@/content/business";
import { sku } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Order } from "./schema";

/**
 * Sends a validated order to erxes as a form submission so staff see it in erxes
 * (Frontline → Forms, and as a Sales card once the form is set to create one).
 *
 *   ERXES_API_URL          https://<subdomain>.next.erxes.io/gateway
 *   ERXES_ORDER_FORM_ID    _id of the erxes form that receives website orders
 *   ERXES_ORDER_FIELD_IDS  JSON map of that form's field ids: {"name":"<id>","phone":"<id>","email":"<id>","message":"<id>"}
 *
 * Uses the public `widgetsSaveLead` mutation. Returns { delivered: false, reason: "not_configured" }
 * until configured, so the checkout tells the customer to call instead of silently losing the order.
 */
export async function deliverOrder(order: Order, reference: string) {
  const apiUrl = process.env.ERXES_API_URL?.replace(/\/$/, "");
  const formId = process.env.ERXES_ORDER_FORM_ID;
  const fieldIds = parseFieldIds(process.env.ERXES_ORDER_FIELD_IDS);
  const message = summarize(order, reference);

  if (!apiUrl || !formId || !fieldIds) {
    console.info(`[order] ${reference}: erxes not configured`);
    return { delivered: false as const, reason: "not_configured" as const };
  }

  const values: Record<string, string> = { name: order.name, phone: order.phone, email: order.email ?? "", message };
  const submissions = Object.entries(fieldIds)
    .filter(([key]) => values[key])
    .map(([key, _id]) => ({ _id, type: key === "phone" ? "phone" : key === "email" ? "email" : key === "message" ? "textarea" : "input", text: key, value: values[key] }));

  try {
    const res = await fetch(`${apiUrl}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation SaveLead($formId: String!, $submissions: [FieldValueInput], $browserInfo: JSON!) {
          widgetsSaveLead(formId: $formId, submissions: $submissions, browserInfo: $browserInfo) { status errors { text } }
        }`,
        variables: { formId, submissions, browserInfo: { url: "website", hostname: "daiso", language: "mn" } },
      }),
      cache: "no-store",
    });
    const json = (await res.json()) as { data?: { widgetsSaveLead?: { status: string } } };
    if (json.data?.widgetsSaveLead?.status === "ok") return { delivered: true as const };
    console.error(`[order] ${reference} erxes rejected`, JSON.stringify(json));
  } catch (error) {
    console.error(`[order] ${reference} erxes request failed`, error);
  }
  return { delivered: false as const, reason: "error" as const };
}

function parseFieldIds(raw?: string) {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    console.error("[order] ERXES_ORDER_FIELD_IDS is not valid JSON");
    return null;
  }
}

export function summarize(order: Order, reference: string) {
  const d = deliveryOption(order.delivery);
  const lines = [`[Захиалга] ${reference}`, `Захиалагч: ${order.name}, ${order.phone}${order.email ? `, ${order.email}` : ""}`, `Хүргэлт: ${d.name}, ${formatPrice(d.fee)} (${d.note})`];
  lines.push(`Хаяг: ${order.address}`);
  lines.push("Бараа:");
  for (const l of order.lines) lines.push(`  • ${l.product.name}${l.product.note ? ` (${l.product.note})` : ""} ${sku(l.product)} × ${l.qty} = ${formatPrice(l.lineTotal)}`);
  lines.push(`Барааны дүн: ${formatPrice(order.subtotal)}`);
  lines.push(`Хүргэлтийн төлбөр: ${formatPrice(order.deliveryFee)}`);
  lines.push(`НИЙТ: ${formatPrice(order.total)}`);
  lines.push(`Төлбөр: ${paymentOption(order.payment).name} (100% урьдчилгаа, 48 цагийн дотор)`);
  lines.push(`eBarimt: ${order.receipt.type === "company" ? `Байгууллага, РД ${order.receipt.regNo}` : `Хувь хүн (${order.phone})`}`);
  if (order.note) lines.push(`Тайлбар: ${order.note}`);
  return lines.join("\n");
}

export function makeReference() {
  const now = new Date();
  const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `DS-${date}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}
