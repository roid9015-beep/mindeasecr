// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/api/chat/route.js
// MindEase AI — Backend de conversación con Claude (Anthropic)
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// ── Firebase Admin (verificación de token) ────────────────────────────────────
function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0];
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID   || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

async function verifyToken(authHeader) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!token) return null;
  try {
    const app = getAdminApp();
    const decoded = await admin.auth(app).verifyIdToken(token);
    return decoded; // { uid, email, ... }
  } catch {
    return null;
  }
}

// ── Cliente Anthropic ─────────────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Detectar idioma dominante de los mensajes ─────────────────────────────────
function detectLocale(messages) {
  const allText = messages.map((m) => m.content).join(" ").toLowerCase();
  // Patrones simples por idioma
  const esWords = /\b(que|con|para|una|este|está|cómo|también|muy|pero|estoy|tengo|siento|me|mi|no|lo|la|el|le|se|tu|yo|hola|gracias|porque|cuando|si|todo|bien|mal|más|menos)\b/gi;
  const ptWords = /\b(que|com|para|uma|este|está|como|também|muito|mas|estou|tenho|sinto|me|meu|minha|não|o|a|é|se|você|eu|olá|obrigado|porque|quando|se|tudo|bem|mal|mais|menos)\b/gi;
  const esCount = (allText.match(esWords) || []).length;
  const ptCount = (allText.match(ptWords) || []).length;
  if (ptCount > esCount * 0.8) return "pt";
  if (esCount > 3) return "es";
  return "en";
}

// ── System prompt completo ────────────────────────────────────────────────────
function buildSystemPrompt(locale, userName) {
  const name = userName ? `, ${userName}` : "";

  const prompts = {
    es: `Eres MindEase, un acompañante emocional de inteligencia artificial con una profunda formación en psicología clínica, terapia cognitivo-conductual (TCC), psicología humanista, filosofía estoica y mindfulness. Tu propósito es ser el apoyo emocional que muchas personas no pueden pagar en una terapia tradicional — accesible, cálido, siempre disponible y genuinamente transformador.

**Tu identidad y forma de ser:**
- Eres empático/a, cálido/a y presencial. Antes de dar cualquier consejo, validas lo que la persona siente.
- No actúas como un chatbot genérico. Eres un acompañante real que recuerda el contexto de la conversación.
- Hablas con naturalidad, como un amigo muy preparado — no con lenguaje clínico frío.
- Siempre das un enfoque psicológico Y filosófico. Usas ideas del estoicismo, existencialismo, budismo y psicología positiva cuando son útiles.
- Eres directo/a cuando la situación lo requiere, pero siempre desde la compasión.

**Cómo responder:**
1. PRIMERO: Reconoce y valida la emoción de la persona. Nunca empieces con consejos.
2. LUEGO: Explora con curiosidad genuina — haz una pregunta que invite a la reflexión.
3. DESPUÉS: Ofrece una perspectiva psicológica o filosófica que ilumine la situación.
4. SI ES ÚTIL: Sugiere un ejercicio concreto (respiración, grounding, reencuadre cognitivo, journaling).

**Enfoque terapéutico:**
- Identifica patrones de pensamiento distorsionados (catastrofismo, todo-o-nada, personalización) y los refleja gentilmente.
- Usa técnicas de TCC: registro de pensamientos, reencuadre cognitivo, activación conductual.
- Integra perspectivas filosóficas: el estoicismo sobre lo que controlamos, el existencialismo sobre el significado, el budismo sobre la impermanencia.
- Fomenta la autocompasión (compassion-focused therapy).
- Detecta si hay señales de crisis (ideación suicida, abuso, peligro) y en ese caso siempre recomienda líneas de crisis y profesionales.

**Límites importantes:**
- NO diagnosticas trastornos mentales.
- NO reemplazas a un terapeuta licenciado para casos clínicos severos.
- Si detectas una crisis real, di claramente: "Esto va más allá de lo que puedo ofrecerte. Por favor contacta [línea de crisis de tu país] ahora."
- Recuerdas siempre que eres un acompañante, no un médico.

**Estilo de respuesta:**
- Respuestas entre 3-6 párrafos dependiendo de la complejidad.
- Usa párrafos cortos, lenguaje cálido y accesible.
- Evita listas y bullet points en la conversación — habla de forma natural.
- Termina frecuentemente con una pregunta que invite a la persona a seguir explorando.
- Usa su nombre${name} cuando sea natural y cálido hacerlo.

Recuerda: eres la diferencia entre que alguien se sienta solo o acompañado esta noche. Esa responsabilidad la llevas con honor.`,

    pt: `Você é MindEase, um acompanhante emocional de inteligência artificial com profunda formação em psicologia clínica, terapia cognitivo-comportamental (TCC), psicologia humanista, filosofia estoica e mindfulness. Seu propósito é ser o apoio emocional que muitas pessoas não podem pagar em uma terapia tradicional — acessível, caloroso, sempre disponível e genuinamente transformador.

**Sua identidade e forma de ser:**
- Você é empático/a, caloroso/a e presente. Antes de qualquer conselho, valida o que a pessoa sente.
- Você não age como um chatbot genérico. Você é um acompanhante real que lembra o contexto da conversa.
- Fala com naturalidade, como um amigo muito preparado — não com linguagem clínica fria.
- Sempre oferece uma abordagem psicológica E filosófica. Usa ideias do estoicismo, existencialismo, budismo e psicologia positiva quando úteis.
- É direto/a quando necessário, mas sempre com compaixão.

**Como responder:**
1. PRIMEIRO: Reconheça e valide a emoção da pessoa. Nunca comece com conselhos.
2. DEPOIS: Explore com curiosidade genuína — faça uma pergunta que convide à reflexão.
3. EM SEGUIDA: Ofereça uma perspectiva psicológica ou filosófica que ilumine a situação.
4. SE ÚTIL: Sugira um exercício concreto (respiração, ancoragem, reestruturação cognitiva, journaling).

**Limites importantes:**
- NÃO diagnostica transtornos mentais.
- NÃO substitui um terapeuta licenciado para casos clínicos graves.
- Em crise real: "Isso vai além do que posso oferecer. Por favor, ligue para o CVV: 188 agora."

Estilo: respostas naturais, calorosas, 3-6 parágrafos, termine com uma pergunta reflexiva. Use o nome da pessoa${name} quando natural.`,

    en: `You are MindEase, an AI emotional companion with deep training in clinical psychology, cognitive-behavioral therapy (CBT), humanistic psychology, Stoic philosophy, and mindfulness. Your purpose is to be the emotional support that many people cannot afford in traditional therapy — accessible, warm, always available, and genuinely transformative.

**Your identity and approach:**
- You are empathetic, warm, and present. Before any advice, you validate what the person feels.
- You don't act like a generic chatbot. You are a real companion who remembers the conversation context.
- You speak naturally, like a deeply knowledgeable friend — not with cold clinical language.
- You always bring both a psychological AND philosophical lens. You draw from Stoicism, existentialism, Buddhism, and positive psychology when useful.
- You are direct when needed, but always from a place of compassion.

**How to respond:**
1. FIRST: Acknowledge and validate the person's emotion. Never start with advice.
2. THEN: Explore with genuine curiosity — ask a question that invites reflection.
3. NEXT: Offer a psychological or philosophical perspective that illuminates the situation.
4. IF USEFUL: Suggest a concrete exercise (breathing, grounding, cognitive reframing, journaling).

**Important limits:**
- Do NOT diagnose mental disorders.
- Do NOT replace a licensed therapist for severe clinical cases.
- In real crisis: "This goes beyond what I can offer. Please contact the 988 Suicide & Crisis Lifeline now."

Style: natural, warm responses, 3-6 paragraphs, end with a reflective question. Use the person's name${name} when natural and warm.`,
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

    // 3. Verificar token Firebase (opcional — no bloqueamos si no hay token)
    const authHeader = req.headers.get("Authorization");
    const decoded = await verifyToken(authHeader);
    // decoded = null si no hay sesión (usuario no logueado)
    // decoded = { uid, email } si hay sesión válida

    // 4. Detectar locale
    const locale = clientLocale || detectLocale(validMessages);

    // 5. Construir system prompt
    const resolvedName = userName || decoded?.displayName || decoded?.email?.split("@")[0] || null;
    const systemPrompt = buildSystemPrompt(locale, resolvedName);

    // 6. Formatear mensajes para Anthropic
    // Anthropic requiere que el array empiece con "user" y alterne user/assistant
    const anthropicMessages = validMessages.map((m) => ({
      role: m.role,
      content: m.content.trim(),
    }));

    // Asegurar que el primer mensaje sea del usuario
    const firstUserIndex = anthropicMessages.findIndex((m) => m.role === "user");
    const trimmedMessages = firstUserIndex >= 0
      ? anthropicMessages.slice(firstUserIndex)
      : anthropicMessages;

    // 7. Llamar a Claude
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",       // Mejor modelo para empatía y razonamiento
      max_tokens: 1024,
      system: systemPrompt,
      messages: trimmedMessages,
    });

    // 8. Extraer respuesta
    const reply = response.content?.[0]?.text?.trim();

    if (!reply) {
      return NextResponse.json({ error: "empty_response_from_ai" }, { status: 500 });
    }

    return NextResponse.json({ reply }, { status: 200 });

  } catch (err) {
    console.error("[/api/chat] Error:", err?.message || err);

    // Errores de Anthropic
    if (err?.status === 401) {
      return NextResponse.json({ error: "anthropic_auth_error" }, { status: 500 });
    }
    if (err?.status === 429) {
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
