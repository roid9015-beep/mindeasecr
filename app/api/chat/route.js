import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // 1. Obtenemos la lista de modelos disponibles para TU cuenta real
    const models = await anthropic.models.list();
    
    // 2. Buscamos el modelo más reciente que contenga "sonnet" en el nombre
    // Esto es mucho más robusto que adivinar el nombre
    const sonnetModel = models.data
      .filter(m => m.id.includes("sonnet"))
      .sort((a, b) => b.id.localeCompare(a.id))[0]; // Cogemos el más reciente alfabéticamente

    if (!sonnetModel) {
      throw new Error("No se encontró ningún modelo 'sonnet' disponible en tu cuenta.");
    }

    // 3. Usamos el modelo encontrado dinámicamente
    const response = await anthropic.messages.create({
      model: sonnetModel.id,
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error("ERROR CRÍTICO:", JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: "anthropic_fallo_de_conexion",
      detalle: error.message 
    }, { status: 500 });
  }
}
