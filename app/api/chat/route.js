// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/api/chat/route.js
// REPLACE: Borra todo el contenido del archivo actual y pega esto completo.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ── Firebase Admin (inicialización segura, solo una vez) ──────────────────────
function getFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId:    process.env.FIREBASE_PROJECT_ID,
      clientEmail:  process.env.FIREBASE_CLIENT_EMAIL,
      // La private key viene con \n literal desde Vercel env vars
      privateKey:   process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// ── Anthropic client ──────────────────────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── System prompt blindado ────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Actúas como un psicólogo profesional, empático, reflexivo y ético para MindEase AI.
Ofreces respuestas orientadas al bienestar, utilizando la escucha activa y técnicas de psicología cognitivo-conductual.
Validas emociones antes de ofrecer perspectiva. Nunca minimizas lo que siente el usuario.
Hablas en el idioma del usuario de forma natural.
Si detectas ideaciones autolíticas severas o crisis extremas, recomienda con cuidado buscar ayuda profesional
o líneas de atención: en México 800-290-0024, en España 024, en Argentina (011) 5275-1135.
Recuerda siempre: NO eres un sustituto de la terapia profesional.`;

// ── Handler principal ─────────────────────────────────────────────────────────
export async function POST(request) {
  // Respuesta de error estándar — siempre JSON válido, nunca rompe el frontend
  const errorResponse = (msg, status = 500) =>
    new Response(
      JSON.stringify({ error: msg, reply: null }),
      { status, headers: { "Content-Type": "application/json" } }
    );

  try {
    // 1. Validar token de Firebase ─────────────────────────────────────────────
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return errorResponse("unauthorized_no_token", 401);
    }

    try {
      getFirebaseAdmin();
      await getAuth().verifyIdToken(token);
    } catch {
      return errorResponse("unauthorized_invalid_token", 401);
    }

    // 2. Parsear body ──────────────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("invalid_json_body", 400);
    }

    const { messages } = body;

    // Validar que messages sea un array con al menos un elemento
    if (!Array.isArray(messages) || messages.length === 0) {
      return errorResponse("messages_must_be_array", 400);
    }

    // Limpiar mensajes: solo roles válidos y contenido string
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .slice(-20); // máximo últimos 20 mensajes para controlar tokens

    if (cleanMessages.length === 0) {
      return errorResponse("no_valid_messages", 400);
    }

    // 3. Llamar a Anthropic ────────────────────────────────────────────────────
    const response = await anthropic.messages.create({
      model:      "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   cleanMessages,
    });

    const reply = response.content?.[0]?.text ?? "";

    if (!reply) {
      return errorResponse("empty_response_from_ai", 502);
    }

    // 4. Devolver respuesta limpia ─────────────────────────────────────────────
    return new Response(
      JSON.stringify({ reply, error: null }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[/api/chat] Unexpected error:", err?.message ?? err);
    return errorResponse("server_error", 500);
  }
}
