import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "NO API KEY" }, { status: 500 });

  try {
    const { messages } = await req.json();
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      // Cambiamos al modelo Haiku que es universalmente aceptado
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error("ERROR FINAL:", error);
    return NextResponse.json({ error: "Fallo en Claude" }, { status: 500 });
  }
}
