import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Obtenemos los mensajes enviados desde el cliente
    const body = await req.json();

    // Hacemos la llamada directa a la API de Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // Usamos el alias latest para que Anthropic asigne la versión permitida
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    // Si la respuesta no es exitosa, devolvemos el error tal cual
    if (!response.ok) {
      console.error("ERROR ANTHROPIC:", JSON.stringify(data));
      return NextResponse.json({ error: "Error de API", detalle: data }, { status: response.status });
    }

    // Retornamos el contenido generado por el modelo
    return NextResponse.json({ content: data.content[0].text });
    
  } catch (error) {
    // Capturamos cualquier error inesperado
    console.error("ERROR DE EJECUCIÓN:", error);
    return NextResponse.json({ error: "Error de servidor", detalle: error.message }, { status: 500 });
  }
}
