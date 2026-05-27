// FILE: app/api/chat/route.js
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Actúas como un psicólogo profesional, empático, reflexivo y ético para MindEase AI.
Ofreces respuestas orientadas al bienestar, utilizando la escucha activa y técnicas de psicología cognitivo-conductual.
Validas emociones antes de ofrecer perspectiva. Nunca minimizas lo que siente el usuario.
Hablas en el idioma del usuario de forma natural y cálida.
Si detectas ideaciones autolíticas severas o crisis extremas, recomienda con cuidado buscar ayuda profesional.
Recuerda siempre: NO eres un sustituto de la terapia profesional.`;

export async function POST(request) {
  try {
    // 1. Evitamos que fallas de JSON rompan el servidor
    const body = await request.json().catch(() => null);
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "invalid_json_body", reply: null }, { status: 400 });
    }

    const { messages } = body;

    // 2. Limpieza estricta de mensajes para cumplir con el formato de Anthropic
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .slice(-16); // Limitamos el historial para optimizar tokens

    if (cleanMessages.length === 0) {
      return NextResponse.json({ error: "no_valid_messages", reply: null }, { status: 400 });
    }

    // 3. Verificación de la API Key en el entorno de ejecución
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[MindEase Backend] Error: ANTHROPIC_API_KEY no configurada en Vercel.");
      return NextResponse.json({ error: "missing_api_key", reply: "Lo siento, tengo un problema de configuración interna. Por favor, verifica las variables de entorno." }, { status: 500 });
    }

    // 4. Petición directa vía HTTP Fetch (Garantiza compatibilidad total en Vercel)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: cleanMessages,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[Anthropic API Error Details]:", data);
      return NextResponse.json({ 
        error: "anthropic_api_rejected", 
        reply: "En este momento no puedo procesar tu mensaje debido a un inconveniente con el proveedor de IA. Inténtalo de nuevo en unos instantes." 
      }, { status: response.status });
    }

    const reply = data.content?.[0]?.text ?? "";
    if (!reply) {
      return NextResponse.json({ error: "empty_response", reply: "No logré generar una respuesta. ¿Podrías repetirme lo que dijiste?" }, { status: 502 });
    }

    // 5. Respuesta exitosa con la estructura exacta que tu AIChat mapea
    return NextResponse.json({ reply, error: null }, { status: 200 });

  } catch (err) {
    console.error("[/api/chat] Error crítico en el servidor:", err);
    return NextResponse.json({ error: "internal_server_error", reply: "Siento interrumpir nuestra conversación, pero ha ocurrido un error inesperado en mi servidor." }, { status: 500 });
  }
}
