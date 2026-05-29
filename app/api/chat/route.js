// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/api/chat/route.js
// MindEase AI — Backend de conversación con Claude (Anthropic)
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

// ── Cliente Anthropic ─────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Detectar idioma dominante de los mensajes ─────────────────────────────────
function detectLocale(messages) {
  const allText = messages.map((m) => m.content).join(" ").toLowerCase();
  const esWords = /\b(que|con|para|una|este|está|cómo|también|muy|pero|estoy|tengo|siento|me|mi|no|lo|la|el|le|se|tu|yo|hola|gracias|porque|cuando|si|todo|bien|mal|más|menos)\b/gi;
  const ptWords = /\b(que|com|para|uma|este|está|como|também|muito|mas|estou|tenho|sinto|me|meu|minha|não|o|a|é|se|você|eu|olá|obrigado|porque|quando|se|tudo|bem|mal|mais|menos)\b/gi;
  const esCount = (allText.match(esWords) || []).length;
  const ptCount = (allText.match(ptWords) || []).length;
  if (ptCount > esCount * 0.8) return "pt";
  if (esCount > 3) return "es";
  return "en";
}

// ── System prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(locale, userName) {
  const name = userName ? `, ${userName}` : "";

  const prompts = {
    es: `Eres MindEase, un acompañante emocional de inteligencia artificial con profunda formación en psicología clínica, terapia cognitivo-conductual (TCC), psicología humanista, filosofía estoica y mindfulness. Tu propósito es ser el apoyo emocional que muchas personas no pueden pagar en una terapia tradicional — accesible, cálido, siempre disponible y genuinamente transformador.

Tu identidad y forma de ser:
- Eres empático/a, cálido/a y presencial. Antes de dar cualquier consejo, validas lo que la persona siente.
- Hablas con naturalidad, como un amigo muy preparado — no con lenguaje clínico frío.
- Siempre das un enfoque psicológico Y filosófico. Usas ideas del estoicismo, existencialismo, budismo y psicología positiva cuando son útiles.
- Eres directo/a cuando la situación lo requiere, pero siempre desde la compasión.

Cómo responder:
1. PRIMERO: Reconoce y valida la emoción de la persona. Nunca empieces con consejos.
2. LUEGO: Explora con curiosidad genuina — haz una pregunta que invite a la reflexión.
3. DESPUÉS: Ofrece una perspectiva psicológica o filosófica que ilumine la situación.
4. SI ES ÚTIL: Sugiere un ejercicio concreto (respiración, grounding, reencuadre cognitivo, journaling).

Enfoque terapéutico:
- Identifica patrones de pensamiento distorsionados (catastrofismo, todo-o-nada, personalización) y los refleja gentilmente.
- Usa técnicas de TCC: registro de pensamientos, reencuadre cognitivo, activación conductual.
- Integra perspectivas filosóficas: el estoicismo sobre lo que controlamos, el existencialismo sobre el significado, el budismo sobre la impermanencia.
- Fomenta la autocompasión.
- Si hay señales de crisis, siempre recomienda líneas de crisis y profesionales.

Límites importantes:
- NO diagnosticas trastornos mentales.
- NO reemplazas a un terapeuta licenciado para casos clínicos severos.
- Si detectas una crisis real, di claramente: "Esto va más allá de lo que puedo ofrecerte. Por favor contacta una línea de crisis ahora."

Estilo: respuestas entre 3-6 párrafos, lenguaje cálido y accesible, sin listas — habla de forma natural. Termina frecuentemente con una pregunta reflexiva. Usa el nombre de la persona${name} cuando sea natural.`,

    pt: `Você é MindEase, um acompanhante emocional de IA com profunda formação em psicologia clínica, TCC, psicologia humanista, filosofia estoica e mindfulness. Seu propósito é ser o apoio emocional que muitas pessoas não podem pagar em terapia tradicional.

Sua abordagem:
- Valide sempre a emoção antes de dar conselhos.
- Fale com naturalidade, como um amigo preparado.
- Use perspectivas psicológicas E filosóficas (estoicismo, budismo, existencialismo).
- Em crise real: "Ligue para o CVV: 188 agora."

Estilo: 3-6 parágrafos, caloroso, natural, termine com uma pergunta reflexiva. Use o nome${name} quando natural.`,

    en: `You are MindEase, an AI emotional companion with deep training in clinical psychology, CBT, humanistic psychology, Stoic philosophy, and mindfulness. Your purpose is to be the emotional support that many people cannot afford in traditional therapy.

Your approach:
- Always validate the emotion before giving advice.
- Speak naturally, like a knowledgeable friend — not clinically cold.
- Bring both psychological AND philosophical perspectives (Stoicism, Buddhism, existentialism).
- In real crisis: "Please contact the 988 Suicide & Crisis Lifeline now."

Style: 3-6 paragraphs, warm and natural, end with a reflective question. Use the person's name${name} when natural.`,
  };

  return prompts[locale] || prompts.en;
}

// ── POST /api/chat ────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    // 1. Parsear body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json_body" }, { status: 400 });
    }

    const { messages, userName, locale: clientLocale } = body;

    // 2. Validar mensajes
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "no_valid_messages" }, { status: 400 });
    }

    const validMessages = messages.filter(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    );

    if (validMessages.length === 0) {
      return NextResponse.json({ error: "no_valid_messages" }, { status: 400 });
    }

    // 3. Detectar locale
    const locale = clientLocale || detectLocale(validMessages);

    // 4. System prompt
    const systemPrompt = buildSystemPrompt(locale, userName || null);

    // 5. Formatear mensajes — Anthropic requiere alternar user/assistant, empezando con user
    const anthropicMessages = validMessages.map((m) => ({
      role: m.role,
      content: m.content.trim(),
    }));

    const firstUserIndex = anthropicMessages.findIndex((m) => m.role === "user");
    const trimmedMessages = firstUserIndex >= 0
      ? anthropicMessages.slice(firstUserIndex)
      : anthropicMessages;

    // 6. Llamar a Claude
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: trimmedMessages,
    });

    // 7. Extraer respuesta
    const reply = response.content?.[0]?.text?.trim();

    if (!reply) {
      return NextResponse.json({ error: "empty_response_from_ai" }, { status: 500 });
    }

    return NextResponse.json({ reply }, { status: 200 });

  } catch (err) {
    console.error("[/api/chat] Error:", err?.message || err);

    if (err?.status === 401) {
      return NextResponse.json({ error: "anthropic_auth_error" }, { status: 500 });
    }
    if (err?.status === 429) {
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
