// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/features/AIChat.jsx
// REPLACE: Borra todo el contenido del archivo actual y pega esto completo.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "@/lib/firebase";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Indicador de escritura animado
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>🌿</div>
      <div style={{
        padding: "12px 18px", background: "var(--bg-card,rgba(255,255,255,0.06))",
        border: "1px solid var(--border,rgba(255,255,255,0.1))",
        borderRadius: "18px 18px 18px 4px",
      }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent,#6366f1)",
              animation: `mindease-typing 1.2s ease-in-out ${delay}s infinite`,
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes mindease-typing {
          0%,60%,100% { transform: translateY(0); opacity: .4; }
          30%          { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function AIChat({
  // Props opcionales para integración con el resto del app
  user,
  locale = "es",
  voiceEnabled = false,
}) {
  // ── Estado — siempre inicializado como array ──────────────────────────────
  const [messages,  setMessages]  = useState([]); // NUNCA null/undefined
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState("");

  const endRef   = useRef(null);
  const inputRef = useRef(null);

  // ── Scroll automático cuando llega un mensaje ─────────────────────────────
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Foco en input al cargar ───────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Obtener token de Firebase fresco ─────────────────────────────────────
  const getFirebaseToken = useCallback(async () => {
    try {
      
      const token = await auth.currentUser?.getIdToken(true); // true = fuerza refresh
      return token ?? null;
    } catch (e) {
      console.warn("[AIChat] No se pudo obtener token Firebase:", e?.message);
      return null;
    }
  }, []);

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setError("");

    // 1. Agregar mensaje del usuario al estado local
    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Token de Firebase (si no hay usuario logueado, token = null)
      const token = await getFirebaseToken();

      // 3. Preparar payload — solo roles válidos para Anthropic
      const payload = updatedMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      // 4. Fetch a la API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: payload }),
      });

      // 5. Parsear respuesta — blindado contra respuestas no-JSON
      let data;
      try {
        data = await response.json();
      } catch {
        data = { reply: null, error: "invalid_server_response" };
      }

      // 6. Verificar que data sea un objeto válido
      if (!data || typeof data !== "object") {
        data = { reply: null, error: "malformed_response" };
      }

      // 7. Si hay reply válido, agregar al chat
      if (data.reply && typeof data.reply === "string" && data.reply.trim()) {
        const aiMsg = {
          role:      "assistant",
          content:   data.reply.trim(),
          timestamp: Date.now(),
        };
        setMessages((prev) =>
          Array.isArray(prev) ? [...prev, aiMsg] : [aiMsg]
        );
      } else {
        // Error controlado — mostrar mensaje amigable sin romper el array
        const code = data.error ?? "unknown_error";
        setError(getFriendlyError(code, locale));

        // Si fue 401, agregar aviso en el chat
        if (response.status === 401) {
          setMessages((prev) => Array.isArray(prev) ? [...prev, {
            role: "assistant",
            content: locale === "es"
              ? "Necesitas iniciar sesión para continuar la conversación. 🔐"
              : "You need to be logged in to continue. 🔐",
            timestamp: Date.now(),
            isSystem: true,
          }] : []);
        }
      }

    } catch (networkErr) {
      console.error("[AIChat] Network error:", networkErr?.message);
      setError(getFriendlyError("network_error", locale));
    } finally {
      setIsLoading(false);
      // Pequeño delay antes de reenfocar para que el scroll termine
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, messages, getFirebaseToken, locale]);

  // ── Enter para enviar (Shift+Enter = nueva línea) ─────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // ── Mensajes de bienvenida por locale ────────────────────────────────────
  const placeholders = {
    es: "Cuéntame cómo te sientes hoy...",
    pt: "Me conta como você está se sentindo...",
    en: "Tell me how you're feeling today...",
  };
  const placeholder = placeholders[locale] ?? placeholders.es;

  const emptyTitles = {
    es: "Estoy aquí para escucharte",
    pt: "Estou aqui para ouvir você",
    en: "I'm here to listen",
  };
  const emptyDesc = {
    es: "Este es un espacio seguro. Comparte lo que tengas en mente, sin filtros ni juicios.",
    pt: "Este é um espaço seguro. Compartilhe o que estiver na sua mente.",
    en: "This is a safe space. Share whatever is on your mind, without filters or judgment.",
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 140px)",
      animation: "fadeUp 0.4s ease",
    }}>

      {/* ── Header del chat ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        paddingBottom: 14, borderBottom: "1px solid var(--border,rgba(255,255,255,0.08))",
        marginBottom: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>🌿</div>
        <div>
          <div style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontWeight: 600, fontSize: 15 }}>
            MindEase
          </div>
          <div style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            {locale === "es" ? "Aquí para ti" : locale === "pt" ? "Aqui para você" : "Here for you"}
          </div>
        </div>
      </div>

      {/* ── Área de mensajes ── */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>

        {/* Estado vacío */}
        {/* ⚠️ BLINDAJE: Array.isArray() antes de .length y .map() */}
        {Array.isArray(messages) && messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <h3 style={{
              fontFamily: "var(--font-main,'Sora',sans-serif)",
              fontWeight: 600, fontSize: 18, marginBottom: 8,
              color: "var(--text-primary,#f0f1fa)",
            }}>
              {emptyTitles[locale] ?? emptyTitles.es}
            </h3>
            <p style={{ color: "var(--text-muted,#4a4d64)", fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
              {emptyDesc[locale] ?? emptyDesc.es}
            </p>
          </div>
        )}

        {/* Lista de mensajes — BLINDADA con Array.isArray */}
        {Array.isArray(messages) && messages.map((msg, index) => {
          // Validar que cada msg sea un objeto con role y content válidos
          if (!msg || typeof msg !== "object") return null;
          if (msg.role !== "user" && msg.role !== "assistant") return null;
          if (typeof msg.content !== "string") return null;

          const isUser = msg.role === "user";

          return (
            <div
              key={`${msg.timestamp ?? index}-${index}`}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {/* Avatar IA */}
              {!isUser && (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                }}>🌿</div>
              )}

              <div style={{
                maxWidth: "76%",
                display: "flex", flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                gap: 4,
              }}>
                {/* Burbuja */}
                <div style={{
                  padding: "11px 16px",
                  fontSize: 14, lineHeight: 1.65,
                  ...(isUser ? {
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "white",
                    borderRadius: "18px 18px 4px 18px",
                  } : {
                    background: msg.isSystem
                      ? "rgba(245,158,11,0.12)"
                      : "var(--bg-card,rgba(255,255,255,0.05))",
                    border: `1px solid ${msg.isSystem ? "rgba(245,158,11,0.3)" : "var(--border,rgba(255,255,255,0.08))"}`,
                    color: "var(--text-primary,#f0f1fa)",
                    borderRadius: "18px 18px 18px 4px",
                  }),
                }}>
                  {msg.content}
                </div>

                {/* Timestamp */}
                {msg.timestamp && (
                  <span style={{ fontSize: 10, color: "var(--text-muted,#4a4d64)", padding: "0 2px" }}>
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Indicador "Pensando..." */}
        {isLoading && <TypingIndicator />}

        {/* Anchor para scroll automático */}
        <div ref={endRef} />
      </div>

      {/* ── Error inline ── */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 10, padding: "9px 14px",
          fontSize: 13, color: "#f87171", marginTop: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>
          <span>{error}</span>
          <button onClick={() => setError("")} style={{
            background: "none", border: "none", color: "#f87171",
            cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0,
          }}>×</button>
        </div>
      )}

      {/* ── Área de input ── */}
      <div style={{
        display: "flex", gap: 10, marginTop: 12,
        paddingTop: 12, borderTop: "1px solid var(--border,rgba(255,255,255,0.08))",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1, resize: "none", maxHeight: 120,
            overflow: input.length > 100 ? "auto" : "hidden",
            background: "var(--bg-card,rgba(255,255,255,0.05))",
            border: "1px solid var(--border,rgba(255,255,255,0.1))",
            borderRadius: 10, color: "var(--text-primary,#f0f1fa)",
            fontFamily: "var(--font-body,'DM Sans',sans-serif)", fontSize: 15,
            padding: "12px 16px", outline: "none", transition: "border-color .2s",
            opacity: isLoading ? 0.6 : 1,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e)  => (e.target.style.borderColor = "var(--border,rgba(255,255,255,0.1))")}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            padding: "12px 20px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "white", cursor: "pointer", flexShrink: 0,
            transition: "all .2s", fontSize: 18,
            opacity: (isLoading || !input.trim()) ? 0.5 : 1,
            transform: "none",
          }}
          onMouseEnter={(e) => { if (!isLoading && input.trim()) e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          {isLoading ? (
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              animation: "spin .7s linear infinite",
            }} />
          ) : "→"}
        </button>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 10, color: "var(--text-muted,#4a4d64)", textAlign: "center", marginTop: 8 }}>
        {locale === "es"
          ? "MindEase es un acompañante IA, no reemplaza la terapia profesional."
          : locale === "pt"
          ? "MindEase é um acompanhante de IA, não substitui a terapia profissional."
          : "MindEase is an AI companion, not a replacement for professional therapy."}
      </p>

      {/* Keyframes globales para este componente */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Helper: mensajes de error amigables por código ────────────────────────────
function getFriendlyError(code, locale = "es") {
  const errors = {
    es: {
      unauthorized_no_token:     "Necesitas iniciar sesión para chatear. 🔐",
      unauthorized_invalid_token:"Tu sesión expiró, vuelve a iniciar sesión. 🔐",
      invalid_json_body:         "Hubo un error al enviar el mensaje. Intenta de nuevo.",
      no_valid_messages:         "El mensaje está vacío o no es válido.",
      empty_response_from_ai:    "La IA no respondió. Intenta de nuevo.",
      server_error:              "Error interno. Intenta en unos segundos.",
      network_error:             "Sin conexión. Verifica tu internet.",
      default:                   "Algo salió mal. Intenta de nuevo.",
    },
    pt: {
      unauthorized_no_token:     "Você precisa fazer login para conversar. 🔐",
      unauthorized_invalid_token:"Sua sessão expirou, faça login novamente. 🔐",
      network_error:             "Sem conexão. Verifique sua internet.",
      default:                   "Algo deu errado. Tente novamente.",
    },
    en: {
      unauthorized_no_token:     "You need to log in to chat. 🔐",
      unauthorized_invalid_token:"Your session expired. Please log in again. 🔐",
      network_error:             "No connection. Check your internet.",
      default:                   "Something went wrong. Try again.",
    },
  };
  const map = errors[locale] ?? errors.es;
  return map[code] ?? map.default;
}
