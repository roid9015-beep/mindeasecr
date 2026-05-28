"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useVoice } from "@/hooks/useVoice";
import VoiceButton from "@/components/ui/VoiceButton";
import Spinner from "@/components/ui/Spinner";
import { formatTime, getSessionStatus } from "@/lib/utils";

export default function AIChat({ t, locale, countryInfo, user, messages = [], setMessages, voiceKey, voiceEnabled, sessionLog, startSession, onUpgrade }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTopic, setActiveTopic] = useState(null);

  const endRef = useRef(null);
  const inputRef = useRef(null);
  const { speak, stop, speaking } = useVoice(voiceKey, voiceEnabled);

  const validMessages = Array.isArray(messages) ? messages : [];
  const isPremium = !!user?.isPremium || user?.email === "roid9015@gmail.com" || !user;

  let sessionStatus = { canChat: true, resetDate: "" };
  if (sessionLog && Object.keys(sessionLog).length > 0) {
    try {
      const status = getSessionStatus(sessionLog);
      if (status) sessionStatus = status;
    } catch (e) { console.error(e); }
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [validMessages, loading]);

  const handleStartSession = useCallback((topic) => {
    setActiveTopic(topic);
    if (startSession) startSession(topic);
    const seedMsg = {
      role: "assistant",
      content: locale === "es" ? `Me alegra que estés aquí. Vamos a explorar juntos "${topic}" — cuéntame, ¿qué está pasando?` : `I'm glad you're here. Let's explore "${topic}" together — tell me, what's been going on?`,
      timestamp: Date.now(),
    };
    setMessages([seedMsg]);
  }, [locale, startSession, setMessages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    
    setError("");
    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const newMessages = [...validMessages, userMsg];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-16).map(m => ({ role: m.role, content: m.content })),
          locale,
          countryInfo,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.content) throw new Error("No response");

      const aiMsg = { role: "assistant", content: data.content, timestamp: Date.now() };
      setMessages(prev => [...(Array.isArray(prev) ? prev : []), aiMsg]);
      if (voiceEnabled) setTimeout(() => speak(data.content), 300);
      
    } catch (err) {
      console.error("Chat Error:", err);
      const fallback = locale === "es" ? "Tengo un problema de conexión temporal. Respira profundo y vuelve a intentarlo. 🌿" : "Having trouble with the AI response. Please retry. 🌿";
      setMessages(prev => [...(Array.isArray(prev) ? prev : []), { role: "assistant", content: fallback, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  // UI RENDERING
  if (activeTopic || validMessages.length > 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
          {validMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
              <div className={msg.role === "user" ? "bubble-user" : "bubble-ai"} style={{ padding: "11px 15px", maxWidth: "80%" }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ padding: 10, color: "var(--text-muted)" }}>Pensando...</div>}
          <div ref={endRef} />
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 10 }}>
          <textarea ref={inputRef} className="custom-input" placeholder={t?.chatPlaceholder || "Escribe..."} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} style={{ flex: 1, resize: "none" }} />
          <button className="btn btn-primary" onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? <Spinner size={16} /> : "→"}
          </button>
        </div>
      </div>
    );
  }

  if (!isPremium && sessionStatus.canChat === false) return <div>Sesión terminada.</div>;
  return <div>Selecciona un tema para comenzar.</div>;
}
