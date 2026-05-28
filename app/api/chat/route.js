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
        // Usamos el ID exacto que aparece en tu lista de modelos en la consola
        model: "claude-opus-4-8",
        max_tokens: 1024,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR ANTHROPIC:", JSON.stringify(data));
      return NextResponse.json({ error: "Error de API", detalle: data }, { status: response.status });
    }

    return NextResponse.json({ content: data.content[0].text });
    
  } catch (error) {
    console.error("ERROR DE EJECUCIÓN:", error);
    return NextResponse.json({ error: "Error de servidor", detalle: error.message }, { status: 500 });
  }
}
