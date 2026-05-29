import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Actúas como un psicólogo profesional, empático, reflexivo y ético para MindEase AI.
Ofreces respuestas orientadas al bienestar usando escucha activa y psicología cognitivo-conductual.
Validas emociones antes de ofrecer perspectiva. Nunca minimizas lo que siente el usuario.
Hablas en el idioma del usuario de forma natural y cálida.
Si detectas ideaciones autolíticas o crisis extremas, recomienda ayuda profesional:
México: 800-290-0024 | España: 024 | Argentina: (011) 5275-1135 | Costa Rica: 800-537-2824.
NO eres sustituto de terapia profesional.`;

export async function POST(request) {
  const errRes = (msg, status = 500) =>
    new Response(JSON.stringify({ error: msg, reply: null }),
      { status, headers: { "Content-Type": "application/json" } });
  try {
    let body;
    try { body = await request.json(); } catch { return errRes("invalid_json", 400); }
    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) return errRes("no_messages", 400);
    const clean = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map(m => ({ role: m.role, content: m.content.trim() }))
      .slice(-20);
    if (!clean.length) return errRes("no_valid_messages", 400);
    const res = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", max_tokens: 1024,
      system: SYSTEM_PROMPT, messages: clean,
    });
    const reply = res.content?.[0]?.text ?? "";
    if (!reply) return errRes("empty_ai_response", 502);
    return new Response(JSON.stringify({ reply, error: null }),
      { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[chat]", err?.message);
    return errRes("server_error", 500);
  }
}
