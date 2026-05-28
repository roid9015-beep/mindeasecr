import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    // ESTO VA A LOS LOGS DE VERCEL (Pestaña "Logs" en tu despliegue)
    console.error("LOG DETALLADO DE ANTHROPIC:", JSON.stringify(error, null, 2));
    
    return NextResponse.json({ 
      error: "anthropic_fallo_de_conexion",
      // Intentamos pasar el mensaje aunque sea corto
      detalle: error.message 
    }, { status: 500 });
  }
}
