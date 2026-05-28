import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const systemInstruction = "Eres un psicólogo clínico experto en filosofía existencial. Tu objetivo es escuchar, validar emociones y detectar la frustración subyacente. NUNCA ignores la carga emocional del usuario. Si el usuario intenta hablar de temas puramente técnicos, mantén el foco en su bienestar emocional: 'Veo que esto te frustra, ¿cómo te hace sentir esta situación en tu vida?'. Si detectas riesgo autolítico, sé compasivo y sugiere ayuda profesional inmediata.";

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
        system: systemInstruction,
        messages: messages,
      }),
    });

    const data = await response.json();

    // Verificación robusta: extraemos el texto de forma segura
    const aiResponse = data.content && data.content[0] ? data.content[0].text : "Lo siento, no pude procesar tu mensaje.";

    // Retorno simplificado para evitar errores de frontend
    return NextResponse.json({ content: aiResponse });
    
  } catch (error) {
    console.error("Error crítico:", error);
    return NextResponse.json({ content: "Hubo un error de conexión, intenta de nuevo." });
  }
}
