import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      // Usamos el alias 'latest' para evitar el error de nombre de modelo
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error("ERROR FINAL:", JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: "anthropic_fallo_de_conexion",
      detalle: error.message 
    }, { status: 500 });
  }
}
