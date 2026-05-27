import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/firebaseAdmin"; // Asegúrate de tener configurado tu admin de Firebase

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, locale, countryInfo, userId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // 1. VALIDACIÓN EN PRODUCCIÓN: Control de Créditos Gratuitos / Premium
    if (userId) {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Si no es Premium, verificamos su uso mensual
        if (!userData.isPremium) {
          const currentMonth = new Date().toISOString().slice(0, 7); // Ejemplo: "2026-05"
          const sessionLogRef = db.collection("users").doc(userId).collection("sessionLogs").doc(currentMonth);
          const sessionLogDoc = await sessionLogRef.get();

          if (sessionLogDoc.exists) {
            const logData = sessionLogDoc.data();
            // Si ya consumió su sesión gratuita mensual
            if (logData.usedSessions >= 1) {
              return NextResponse.json({ error: "free_limit_reached" }, { status: 403 });
            }
          }
        }
      }
    }

    // 2. LLAMADA A LA API DE ANTHROPIC CLAUDE
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // O el modelo que estés usando
      max_tokens: 1024,
      messages: messages,
      system: "Eres MindEase AI, un asistente empático enfocado en bienestar emocional. Habla de forma cercana y cálida.",
    });

    const reply = response.content[0].text;

    // 3. REGISTRO DE CONSUMO: Guardar el uso si el usuario es gratuito
    if (userId) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const sessionLogRef = db.collection("users").doc(userId).collection("sessionLogs").doc(currentMonth);
      
      await sessionLogRef.set({
        usedSessions: 1,
        lastUsed: Date.now(),
        resetDate: "01/06/2026" // Dinámico según tu lógica de utils
      }, { merge: true });
    }

    return NextResponse.json({ content: reply });

  } catch (error) {
    console.error("Error en la ruta del Chat:", error);
    
    // Si Anthropic rechaza la clave en el servidor, devolvemos una alerta limpia controlada
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json({ error: "anthropic_api_rejected" }, { status: 500 });
    }
    
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
