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
    // AQUÍ ESTÁ EL BACKUP DE INFORMACIÓN QUE NECESITAMOS
    console.error("DETALLE DEL ERROR DE ANTHROPIC:", error.error?.message || error.message);
    
    // Devolvemos al cliente el mensaje real de Anthropic para verlo en la consola
    return NextResponse.json({ 
      error: "anthropic_fallo_de_conexion", 
      detalle: error.error?.message || error.message 
    }, { status: 500 });
  }
}
