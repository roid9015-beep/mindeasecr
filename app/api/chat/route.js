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

    // LOG DE VALIDACIÓN: Esto aparecerá en los logs de Vercel
    console.log("DATOS RECIBIDOS DE ANTHROPIC:", JSON.stringify(data));

    // Si la respuesta es exitosa pero la estructura es diferente, 
    // intentamos extraer el texto de forma más flexible
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      const text = data.content[0].text || "Sin respuesta de texto";
      return NextResponse.json({ content: text });
    } 
    
    return NextResponse.json({ content: "Error: Estructura de respuesta no reconocida" });
    
  } catch (error) {
    console.error("ERROR DE EJECUCIÓN:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
