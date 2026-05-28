import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. Log para confirmar que el servidor recibe el mensaje
    console.log("MENSAJE RECIBIDO:", JSON.stringify(body));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: body.messages,
      }),
    });

    const data = await response.json();
    
    // 2. Log para ver qué responde exactamente Anthropic
    console.log("RESPUESTA DE ANTHROPIC:", JSON.stringify(data));

    if (!response.ok) {
      return NextResponse.json({ error: "Error de Anthropic", detalle: data }, { status: response.status });
    }

    return NextResponse.json({ content: data.content[0].text });
  } catch (error) {
    console.error("ERROR DE SERVIDOR:", error);
    return NextResponse.json({ error: "Error de ejecución", detalle: error.message }, { status: 500 });
  }
}
