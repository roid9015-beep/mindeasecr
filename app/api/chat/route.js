// FILE: app/api/chat/route.js
// REPLACE: Borra todo el contenido actual y pega esto.

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Actúas como un psicólogo profesional, empático, reflexivo y ético para MindEase AI.
Ofreces respuestas orientadas al bienestar, utilizando la escucha activa y técnicas de psicología cognitivo-conductual.
Validas emociones antes de ofrecer perspectiva. Nunca minimizas lo que siente el usuario.
Hablas en el idioma del usuario de forma natural y cálida.
Si detectas ideaciones autolíticas severas o crisis extremas, recomienda con cuidado buscar ayuda profesional
o líneas de atención: en México 800-290-0024, en España 024, en Argentina (011) 5275-1135.
Recuerda siempre: NO eres un sustituto de la terapia profesional.`;

export async function POST(request) {
  const errorResponse = (msg, status = 500) =>
    new Response(
      JSON.stringify({ error: msg, reply: null }),
      { status, headers: { "Content-Type": "application/json" } }
    );

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("invalid_json_body", 400);
    }

    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return errorResponse("messages_must_be_array", 400);
    }

    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .slice(-20);

    if (cleanMessages.length === 0) {
      return errorResponse("no_valid_messages", 400);
    }

    const response = await anthropic.messages.create({
      model:      "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   cleanMessages,
    });

    const reply = response.content?.[0]?.text ?? "";

    if (!reply) return errorResponse("empty_response_from_ai", 502);

    return new Response(
      JSON.stringify({ reply, error: null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[/api/chat] Error:", err?.message ?? err);
    return errorResponse("server_error", 500);
  }
}
