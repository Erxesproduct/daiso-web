import { NextResponse } from "next/server";
import { deliverOrder, makeReference } from "@/lib/orders/deliver";
import { validateOrder } from "@/lib/orders/schema";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const result = validateOrder(body);
  if (!result.ok) return NextResponse.json({ ok: false, error: "validation", errors: result.errors }, { status: 422 });

  const reference = makeReference();
  // Honeypot filled → pretend success, drop silently.
  if (result.order.website) return NextResponse.json({ ok: true, reference });

  const delivery = await deliverOrder(result.order, reference);
  // The totals go back either way, so the checkout (and scripts/test-order.mjs) can show what the order costs.
  if (!delivery.delivered) return NextResponse.json({ ok: false, error: delivery.reason, reference, total: result.order.total, deliveryFee: result.order.deliveryFee }, { status: 503 });
  return NextResponse.json({ ok: true, reference, subtotal: result.order.subtotal, deliveryFee: result.order.deliveryFee, total: result.order.total });
}
