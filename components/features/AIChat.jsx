"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { useVoice } from "@/hooks/useVoice";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
      <div style={{ padding: "12px 18px", background: "var(--bg-card,rgba(255,255,255,0.06))", border: "1px solid var(--border,rgba(255,255,255,0.1))", borderRadius: "18px 18px 18px 4px" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent,#6366f1)", animation: `mindease-typing 1.2s ease-in-out ${delay}s infinite` }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes mindease-typing { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-8px);opacity:1} }`}</style>
    </div>
  );
}

export default function AIChat({ user, locale = "es", voiceEnabled = false, voiceKey = "es-MX" }) {
  const [messages,   setMessages]  = useState([]);
  const [input,      setInput]     = useState("");
  const [isLoading,  setIsLoading] = useState(false);
  const [isListening,setIsListening] = useState(false);
  const [error,      setError]     = useState("");

  const hasOpened      = useRef(false);
  const endRef         = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);

  const userName = user?.name || user?.displayName
    || auth.currentUser?.displayName
    || auth.currentUser?.email?.split("@")[0] || "";

  const { speak, stop, speaking } = useVoice(voiceKey, voiceEnabled);

  // Scroll automático
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── callAPI — definido PRIMERO para que las funciones que lo usen puedan referenciarlo ──
  const callAPI = useCallback(async (messagesPayload, isOpening = false) => {
    setIsLoading(true);
    setError("");
    try {
      const token = await auth.currentUser?.getIdToken(true).catch(() => null);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: messagesPayload,
          userName: userName || undefined,
          locale,
          isOpening,
        }),
      });

      let data;
      try { data = await response.json(); } catch { data = { error: "invalid_server_response" }; }
      if (!data || typeof data !== "object") data = { error: "malformed_response" };

      if (data.reply && typeof data.reply === "string" && data.reply.trim()) {
        const aiMsg = { role: "assistant", content: data.reply.trim(), timestamp: Date.now() };
        setMessages((prev) => Array.isArray(prev) ? [...prev, aiMsg] : [aiMsg]);
        if (voiceEnabled) speak(data.reply.trim());
      } else {
        setError(getFriendlyError(data.error ?? "unknown_error", locale));
      }
    } catch {
      setError(getFriendlyError("network_error", locale));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [userName, locale, voiceEnabled, speak]);

  // ── Apertura automática ───────────────────────────────────────────────────
  useEffect(() => {
    if (hasOpened.current) return;
    hasOpened.current = true;
    callAPI([{ role: "user", content: "__OPENING__" }], true);
  }, []); // eslint-disable-line

  // ── Enviar mensaje de texto ───────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    const payload = updatedMessages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content !== "__OPENING__")
      .map((m) => ({ role: m.role, content: m.content }));

    await callAPI(payload, false);
  }, [input, isLoading, messages, callAPI]);

  // ── Reconocimiento de voz — definido DESPUÉS de callAPI ──────────────────
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognitionRef.current = recognition;

    const langMap = { es: "es-MX", pt: "pt-BR", en: "en-US" };
    recognition.lang = langMap[locale] || "es-MX";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript?.trim();
      if (!transcript) return;
      const userMsg = { role: "user", content: transcript, timestamp: Date.now() };
      setMessages((prev) => {
        const updated = Array.isArray(prev) ? [...prev, userMsg] : [userMsg];
        const payload = updated
          .filter((m) => (m.role === "user" || m.role === "assistant") && m.content !== "__OPENING__")
          .map((m) => ({ role: m.role, content: m.content }));
        callAPI(payload, false);
        return updated;
      });
    };

    recognition.start();
  }, [locale, callAPI]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  const placeholders = {
    es: "Escribe lo que quieras contarme...",
    pt: "Escreva o que quiser me contar...",
    en: "Write whatever you want to share...",
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", animation: "fadeUp 0.4s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--border,rgba(255,255,255,0.08))", marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌿</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontWeight: 600, fontSize: 15 }}>MindEase</div>
          <div style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            {locale === "es" ? "Aquí para ti" : locale === "pt" ? "Aqui para você" : "Here for you"}
          </div>
        </div>
        {voiceEnabled && (
          <button onClick={speaking ? stop : undefined} title={speaking ? "Detener" : "Voz activa"}
            style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: speaking ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.1)", color: speaking ? "#818cf8" : "var(--text-muted)", cursor: speaking ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all .2s", animation: speaking ? "pulse-voice 1.5s ease-in-out infinite" : "none" }}>
            {speaking ? "🔊" : "🔈"}
          </button>
        )}
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
        {Array.isArray(messages) && messages.map((msg, index) => {
          if (!msg || typeof msg !== "object") return null;
          if (msg.role !== "user" && msg.role !== "assistant") return null;
          if (typeof msg.content !== "string" || msg.content === "__OPENING__") return null;
          const isUser = msg.role === "user";
          return (
            <div key={`${msg.timestamp ?? index}-${index}`} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
              {!isUser && <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌿</div>}
              <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4 }}>
                <div style={{ padding: "13px 18px", fontSize: 14.5, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", ...(isUser ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", borderRadius: "18px 18px 4px 18px" } : { background: "var(--bg-card,rgba(255,255,255,0.05))", border: "1px solid var(--border,rgba(255,255,255,0.08))", color: "var(--text-primary,#f0f1fa)", borderRadius: "18px 18px 18px 4px" }) }}>
                  {msg.content}
                </div>
                {msg.timestamp && <span style={{ fontSize: 10, color: "var(--text-muted,#4a4d64)", padding: "0 2px" }}>{formatTime(msg.timestamp)}</span>}
              </div>
            </div>
          );
        })}
        {isLoading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#f87171", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span>{error}</span>
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border,rgba(255,255,255,0.08))", alignItems: "flex-end" }}>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
          title={isListening ? (locale === "es" ? "Detener" : "Stop") : (locale === "es" ? "Hablar" : "Speak")}
          style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: isListening ? "rgba(239,68,68,0.15)" : "var(--bg-card,rgba(255,255,255,0.05))", border: isListening ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border,rgba(255,255,255,0.1))", color: isListening ? "#f87171" : "var(--text-muted)", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all .2s", animation: isListening ? "pulse-mic 1s ease-in-out infinite" : "none", opacity: isLoading ? 0.5 : 1 }}>
          {isListening ? "⏹" : "🎙️"}
        </button>

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? (locale === "es" ? "Escuchando..." : locale === "pt" ? "Ouvindo..." : "Listening...") : (placeholders[locale] ?? placeholders.es)}
          rows={1}
          disabled={isLoading || isListening}
          style={{ flex: 1, resize: "none", maxHeight: 120, overflow: input.length > 100 ? "auto" : "hidden", background: "var(--bg-card,rgba(255,255,255,0.05))", border: "1px solid var(--border,rgba(255,255,255,0.1))", borderRadius: 10, color: "var(--text-primary,#f0f1fa)", fontFamily: "var(--font-body,'DM Sans',sans-serif)", fontSize: 15, padding: "12px 16px", outline: "none", transition: "border-color .2s", opacity: (isLoading || isListening) ? 0.6 : 1 }}
          onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
          onBlur={(e)  => (e.target.style.borderColor = "var(--border,rgba(255,255,255,0.1))")}
        />

        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim() || isListening}
          style={{ width: 44, height: 44, borderRadius: 10, border: "none", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", transition: "all .2s", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", opacity: (isLoading || !input.trim() || isListening) ? 0.5 : 1 }}
          onMouseEnter={(e) => { if (!isLoading && input.trim()) e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          {isLoading ? <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin .7s linear infinite" }} /> : "→"}
        </button>
      </div>

      <p style={{ fontSize: 10, color: "var(--text-muted,#4a4d64)", textAlign: "center", marginTop: 8 }}>
        {locale === "es" ? "MindEase es un acompañante IA, no reemplaza la terapia profesional."
          : locale === "pt" ? "MindEase é um acompanhante de IA, não substitui a terapia profissional."
          : "MindEase is an AI companion, not a replacement for professional therapy."}
      </p>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse-voice { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 50%{box-shadow:0 0 0 8px rgba(99,102,241,0)} }
        @keyframes pulse-mic { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }
      `}</style>
    </div>
  );
}

function getFriendlyError(code, locale = "es") {
  const errors = {
    es: { unauthorized_no_token: "Necesitas iniciar sesión. 🔐", network_error: "Sin conexión. Verifica tu internet.", default: "Algo salió mal. Intenta de nuevo." },
    pt: { unauthorized_no_token: "Você precisa fazer login. 🔐", network_error: "Sem conexão.", default: "Algo deu errado. Tente novamente." },
    en:  { unauthorized_no_token: "You need to log in. 🔐", network_error: "No connection.", default: "Something went wrong. Try again." },
  };
  const map = errors[locale] ?? errors.es;
  return map[code] ?? map.default;
}
