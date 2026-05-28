import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Usamos el ID exacto que aparece en tu lista desplegable de Workbench
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    // Si falla, mostramos el error completo en log para depurar
    console.error("ERROR FINAL:", error);
    return NextResponse.json({ 
      error: "anthropic_error_modelo",
      detalle: error.message 
    }, { status: 500 });
  }
}
