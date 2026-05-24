"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useVoice } from "@/hooks/useVoice";
import VoiceButton from "@/components/ui/VoiceButton";
import Spinner from "@/components/ui/Spinner";
import { FREE_MESSAGE_LIMIT } from "@/lib/constants";
import { REGIONAL_VOICES } from "@/lib/constants";
import { formatTime } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🌿</div>
      <div className="bubble-ai" style={{ padding: "12px 18px" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[0, 0.15, 0.3].map((d, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", animation: `typing 1.2s ease-in-out ${d}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIChat({ t, locale, countryInfo, user, messages, setMessages, voiceKey, voiceEnabled }) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const endRef   = useRef(null);
  const inputRef = useRef(null);

  const { speak, stop, speaking } = useVoice(voiceKey, voiceEnabled);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userCount = messages.filter((m) => m.role === "user").length;
    if (!user?.isPremium && userCount >= FREE_MESSAGE_LIMIT) {
      setError(t.limitReached);
      return;
    }

    setError("");
    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:    newMessages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
          locale,
          countryInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "API error");

      const aiMsg = { role: "assistant", content: data.content, timestamp: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
      if (voiceEnabled) setTimeout(() => speak(data.content), 300);
    } catch {
      const fallback =
        locale === "es" ? "Tengo problemas para conectarme. Pero aquí sigo contigo — respira despacio. 🌿"
        : locale === "pt" ? "Estou com problemas de conexão. Mas ainda estou aqui — respire devagar. 🌿"
        : "I'm having trouble connecting. But I'm still here — take a slow breath. 🌿";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const userMsgCount = messages.filter((m) => m.role === "user").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", animation: "fadeUp 0.4s ease" }}>

      {/* Chat header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--border)", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌿</div>
        <div>
          <div style={{ fontFamily: "var(--font-main)", fontWeight: 600 }}>MindEase</div>
          <div style={{ fontSize: 11, color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
            {t.hereForYou}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {voiceEnabled && (
            <div style={{ padding: "4px 10px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 20, fontSize: 10, color: "var(--accent-3)", fontFamily: "var(--font-main)" }}>
              🔊 {REGIONAL_VOICES[voiceKey]?.name || voiceKey}
            </div>
          )}
          {!user?.isPremium && (
            <div style={{ padding: "4px 10px", background: "var(--accent-soft)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-main)" }}>
              {Math.max(0, FREE_MESSAGE_LIMIT - userMsgCount)} {t.msgsLeft}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ paddingBottom: 20 }}>
            <div style={{ textAlign: "center", padding: "28px 0 20px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🌿</div>
              <h3 style={{ fontFamily: "var(--font-main)", fontWeight: 600, marginBottom: 8 }}>{t.listeningTitle}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 280, margin: "0 auto", lineHeight: 1.6 }}>{t.listeningDesc}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {t.starters.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  style={{ padding: "9px 12px", borderRadius: 11, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "var(--font-body)", lineHeight: 1.4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)";  e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
            {msg.role !== "user" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
            )}
            <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", gap: 4, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div className={msg.role === "user" ? "bubble-user" : "bubble-ai"} style={{ padding: "11px 15px", fontSize: 14, lineHeight: 1.65 }}>
                {msg.content}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {msg.timestamp && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{formatTime(msg.timestamp)}</span>}
                {msg.role === "assistant" && voiceEnabled && (
                  <VoiceButton text={msg.content} speak={speak} stop={stop} speaking={speaking} t={t} />
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9, padding: "9px 13px", fontSize: 13, color: "#f87171", marginTop: 8 }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 9, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        <textarea
          ref={inputRef}
          className="custom-input"
          placeholder={t.chatPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          rows={1}
          style={{ resize: "none", flex: 1, maxHeight: 120, overflow: input.length > 80 ? "auto" : "hidden" }}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ padding: "12px 18px", flexShrink: 0 }}
        >
          {loading ? <Spinner size={16} /> : "→"}
        </button>
      </div>
      <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 6 }}>{t.chatDisclaimer}</p>
    </div>
  );
}
