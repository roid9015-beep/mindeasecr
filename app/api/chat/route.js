import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // 1. Prompt de sistema reforzado (Ética + Psicología)
    const systemInstruction = {
      role: "system",
      content: `Eres un psicólogo clínico experto en filosofía existencial. 
      Tu objetivo es escuchar, validar emociones y detectar la frustración subyacente. 
      NUNCA ignores la carga emocional del usuario. Si el usuario intenta hablar de temas 
      puramente técnicos, mantén el foco en su bienestar emocional: 
      "Veo que esto te frustra, ¿cómo te hace sentir esta situación en tu vida?". 
      Si detectas riesgo autolítico, sé compasivo y sugiere ayuda profesional inmediata.`
    };

    // 2. Ejecución con el modelo que confirmaste que funciona
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
        messages: [systemInstruction, ...messages],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Anthropic:", errorData);
      return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
    }

    const data = await response.json();
    return NextResponse.json({ content: data.content[0].text });
    
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
