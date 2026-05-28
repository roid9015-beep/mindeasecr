import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  // Verificación crítica: ¿Existe la llave?
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NO API KEY FOUND" }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    const anthropic = new Anthropic({ apiKey });

    // Vamos a forzar un modelo que sabemos que existe en la mayoría de cuentas
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    // Si el error es un objeto vacío, vamos a convertirlo a string manualmente
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("DEBUG_LOG_CRITICO:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
