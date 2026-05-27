// FILE: app/api/chat/route.js
// DESCRIPTION: Código definitivo para arquitectura App Router en MindEase AI

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({ error: "messages_must_be_array", reply: null }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { messages } = body;

    // Limpieza de mensajes para Anthropic
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .slice(-20);

    if (cleanMessages.length === 0) {
      return new Response(JSON.stringify({ error: "no_valid_messages", reply: null }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "missing_api_key_in_vercel", reply: null }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const SYSTEM_PROMPT = `Actúas como un psicólogo profesional, empático, reflexivo y ético para MindEase AI.
Ofreces respuestas orientadas al bienestar, utilizando la escucha activa y técnicas de psicología cognitivo-conductual.
Validas emociones antes de ofrecer perspectiva. Nunca minimizas lo que siente el usuario.
Hablas en el idioma del usuario de forma natural y cálida.
Recuerda siempre: NO eres un sustituto de la terapia profesional.`;

    // Conexión directa ultra-segura por Fetch
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: cleanMessages
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[Anthropic API Error]:", errData);
      return new Response(JSON.stringify({ error: "anthropic_error", reply: null }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "";

    if (!reply) {
      return new Response(JSON.stringify({ error: "empty_response_from_ai", reply: null }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Respuesta limpia con la variable "reply" que el frontend necesita
    return new Response(JSON.stringify({ reply, error: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("[/api/chat] Error crítico:", err);
    return new Response(JSON.stringify({ error: "server_error", reply: null }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
