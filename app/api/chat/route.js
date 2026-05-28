import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Llamada directa sin la librería de Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", // Usando el modelo que vimos en tu consola
        max_tokens: 1024,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Error de API", detalle: data }, { status: response.status });
    }

    return NextResponse.json({ content: data.content[0].text });
  } catch (error) {
    return NextResponse.json({ error: "Error de red", detalle: error.message }, { status: 500 });
  }
}
