import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    // 1. Verificación básica: ¿La clave llega a la API?
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { messages } = await req.json();

    // 2. Intento de conexión pura con Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [{ role: "user", content: "Hola" }],
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    return NextResponse.json({ 
      error: "anthropic_error", 
      details: error.message 
    }, { status: 500 });
  }
}
