import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const eventType = body.event_type;
    console.log("PayPal webhook:", eventType);
    // Add Firebase update logic here with uid from body.resource?.custom_id
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
