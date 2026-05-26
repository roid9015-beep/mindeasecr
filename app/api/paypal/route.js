import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("PayPal webhook:", body.event_type);
    // TODO: update Firebase user isPremium based on body.resource?.custom_id
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
