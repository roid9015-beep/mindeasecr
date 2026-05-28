import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // 1. Listamos los modelos permitidos para esta API Key
    const models = await anthropic.models.list();
    
    // 2. Imprimimos los IDs en el log para ver qué hay disponible
    const modelIds = models.data.map(m => m.id);
    console.log("MODELOS PERMITIDOS POR LA API:", JSON.stringify(modelIds));

    // 3. Intentamos usar el primero de la lista (el más compatible)
    const { messages } = await req.json();
    const response = await anthropic.messages.create({
      model: modelIds[0], 
      max_tokens: 1024,
      messages: messages,
    });

    return NextResponse.json({ content: response.content[0].text });
  } catch (error) {
    console.error("ERROR FINAL:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: "Error en conexión" }, { status: 500 });
  }
}
