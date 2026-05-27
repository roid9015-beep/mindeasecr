// FILE: app/api/chat/route.js
// REPLACE: Borra todo el contenido actual y pega esto.

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

    // Limpiamos y preparamos los mensajes en el formato exacto que pide Anthropic
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .slice(-20);

    if (cleanMessages.length === 0) {
      return errorResponse("no_valid_messages", 400);
    }

    // Verificamos que la API Key esté presente en Vercel
    if (!process.env.ANTHROPIC_API_KEY) {
      return errorResponse("missing_api_key_in_vercel", 500);
    }

    const SYSTEM_PROMPT = `Actúas como un psicólogo profesional, empático, reflexivo y ético para MindEase AI.
Ofreces respuestas orientadas al bienestar, utilizando la escucha activa y técnicas de psicología cognitivo-conductual.
Validas emociones antes de ofrecer perspectiva. Nunca minimizas lo que siente el usuario.
Hablas en el idioma del usuario de forma natural y cálida.
Si detectas ideaciones autolíticas severas o crisis extremas, recomienda con cuidado buscar ayuda profesional
o líneas de atención. Recuerda siempre: NO eres un sustituto de la terapia profesional.`;

    // Conexión directa y segura con Anthropic usando fetch nativo
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Modelo rápido, económico y con acceso garantizado
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: cleanMessages
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[Anthropic API Error]:", errData);
      return errorResponse("anthropic_rejected_request", response.status);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "";

    if (!reply) return errorResponse("empty_response_from_ai", 502);

    // Devolvemos la respuesta manteniendo exactamente tu formato original
    return new Response(
      JSON.stringify({ reply, error: null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[/api/chat] Error crítico:", err?.message ?? err);
    return errorResponse("server_error", 500);
  }
}
