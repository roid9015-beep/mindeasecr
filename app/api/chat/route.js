import { NextResponse } from "next/server";

function buildSystemPrompt(locale, countryInfo) {
  const country = countryInfo?.country || "";
  const base = `You are MindEase, a deeply empathetic AI companion specialized in emotional support, stress relief, and mental clarity. NOT a therapist or medical professional.${country ? ` The user is in ${country}.` : ""}

Key traits:
- Warm, calm, non-judgmental
- Validate emotions BEFORE offering any perspective
- Never give toxic positivity
- Remember the conversation topic and stay focused on it
- Gently guide toward clarity, suggest breathing/grounding when relevant
- 2-4 paragraphs per response, end with a soft open question
- If someone seems in crisis, compassionately recommend professional help`;

  if (locale === "es") return base.replace("You are MindEase", "Eres MindEase").replace("NOT a therapist", "NO eres terapeuta") + "\n\nResponde SIEMPRE en español.";
  if (locale === "pt") return base.replace("You are MindEase", "Você é MindEase").replace("NOT a therapist", "NÃO é terapeuta") + "\n\nResponda SEMPRE em português.";
  return base + "\n\nAlways respond in English.";
}

export async function POST(request) {
  try {
    const { messages, locale, countryInfo } = await request.json();
    if (!messages || !Array.isArray(messages))
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: buildSystemPrompt(locale || "en", countryInfo),
        messages: messages.slice(-16).map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content).slice(0, 2000),
        })),
      }),
    });

    if (!response.ok) return NextResponse.json({ error: "AI error" }, { status: 502 });
    const data = await response.json();
    const content = data.content?.map((b) => b.text || "").join("") || "";
    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
