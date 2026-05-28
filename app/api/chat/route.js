import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/firebase"; // Import ajustado a tu estructura actual

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: messages,
      system: "Eres MindEase AI, un asistente empático enfocado en bienestar emocional. Habla de forma cercana y cálida.",
    });

    return NextResponse.json({ content: response.content[0].text });

  } catch (error) {
    console.error("Error en API Chat:", error);
    return NextResponse.json({ error: "anthropic_api_rejected" }, { status: 500 });
  }
}
