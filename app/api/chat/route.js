import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    // Verificamos si Anthropic devolvió contenido
    if (data.content && data.content[0] && data.content[0].text) {
      return NextResponse.json({ content: data.content[0].text });
    } else {
      // Si llega algo pero no el texto esperado, devolvemos el error crudo
      console.error("RESPUESTA INESPERADA:", JSON.stringify(data));
      return NextResponse.json({ error: "Respuesta vacía de Anthropic", detalle: data }, { status: 500 });
    }
    
  } catch (error) {
    console.error("ERROR DE EJECUCIÓN:", error);
    return NextResponse.json({ error: "Error de servidor", detalle: error.message }, { status: 500 });
  }
}
