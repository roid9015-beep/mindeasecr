"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useVoice } from "@/hooks/useVoice";
import { loadConversation, saveMessage } from "@/lib/firestore";
import PinLock from "@/components/ui/PinLock";

// ── Sistema de créditos ────────────────────────────────────────────────────────
const FIRST_SESSION_KEY  = "mindease_first_session_done";
const FIRST_SESSION_USED = "mindease_first_session_credits"; // cuántos usó
const FIRST_SESSION_MAX  = 5;  // intercambios con Opus en primera sesión
const FREE_DAILY_MAX     = 3;  // intercambios/día con Haiku después

function getTodayKey() {
  return `mindease_daily_${new Date().toISOString().slice(0, 10)}`;
}
function isFirstSession() {
  if (typeof window === "undefined") return true;
  return !localStorage.getItem(FIRST_SESSION_KEY);
}
function getFirstSessionCreditsUsed() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(FIRST_SESSION_USED) || "0", 10);
}
function incrementFirstSessionCredits() {
  if (typeof window === "undefined") return;
  const next = getFirstSessionCreditsUsed() + 1;
  localStorage.setItem(FIRST_SESSION_USED, String(next));
  if (next >= FIRST_SESSION_MAX) {
    localStorage.setItem(FIRST_SESSION_KEY, "done");
  }
}
function getDailyCreditsUsed() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(getTodayKey()) || "0", 10);
}
function incrementDailyCredits() {
  if (typeof window === "undefined") return;
  localStorage.setItem(getTodayKey(), String(getDailyCreditsUsed() + 1));
}
function getVoiceUsedToday() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(`mindease_voice_${new Date().toISOString().slice(0, 10)}`) || "0", 10);
}
function incrementVoiceUsed() {
  if (typeof window === "undefined") return;
  const key = `mindease_voice_${new Date().toISOString().slice(0, 10)}`;
  localStorage.setItem(key, String(getVoiceUsedToday() + 1));
}

// ── Helpers UI ─────────────────────────────────────────────────────────────────
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
      <style>{`@keyframes mindease-typing{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-8px);opacity:1}}`}</style>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function AIChat({ user, locale = "es", voiceEnabled = false, voiceKey = "es-MX", onUpgrade }) {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [isLoading,   setIsLoading]   = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error,       setError]       = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false); // upgrade emocional
  const [upgradeMode, setUpgradeMode] = useState("soft"); // "soft" | "hard"

  const [pinUnlocked, setPinUnlocked] = useState(
    typeof window === "undefined" ? true : !localStorage.getItem("mindease_pin")
  );

  const hasOpened      = useRef(false);
  const endRef         = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);

  const voiceEnabledRef = useRef(voiceEnabled);
  const localeRef       = useRef(locale);
  const userNameRef     = useRef("");

  voiceEnabledRef.current = voiceEnabled;
  localeRef.current       = locale;
  userNameRef.current     = user?.name || user?.displayName || user?.email?.split("@")[0]
    || auth.currentUser?.displayName
    || auth.currentUser?.email?.split("@")[0] || "";

  const isPremium       = user?.isPremium || false;
  const firstSession    = isFirstSession();
  const fsCreditsUsed   = getFirstSessionCreditsUsed();
  const dailyUsed       = getDailyCreditsUsed();

  // Créditos restantes según estado
  const creditsLeft = isPremium
    ? Infinity
    : firstSession
      ? Math.max(0, FIRST_SESSION_MAX - fsCreditsUsed)
      : Math.max(0, FREE_DAILY_MAX - dailyUsed);

  // ¿Puede hablar por voz? Primera sesión o premium
  const canUseVoice = isPremium || firstSession;

  const { speak, stop, speaking } = useVoice(voiceKey, canUseVoice && voiceEnabled);
  const speakRef = useRef(speak);
  speakRef.current = speak;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Llamada al API pasando contexto de plan ───────────────────────────────
  const doFetch = async (body) => {
    const token = await auth.currentUser?.getIdToken(true).catch(() => null);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ...body,
        userName:       userNameRef.current || undefined,
        locale:         localeRef.current,
        isPremium:      isPremium,
        isFirstSession: firstSession && fsCreditsUsed < FIRST_SESSION_MAX,
      }),
    });
    let data;
    try { data = await response.json(); } catch { data = { error: "invalid_server_response" }; }
    return data;
  };

  const addAIMessage = (text, uid) => {
    const aiMsg = { role: "assistant", content: text, timestamp: Date.now() };
    setMessages((prev) => Array.isArray(prev) ? [...prev, aiMsg] : [aiMsg]);
    try {
      if (canUseVoice && voiceEnabledRef.current && speakRef.current) {
        if (isPremium || getVoiceUsedToday() < 3) {
          speakRef.current(text);
          if (!isPremium) incrementVoiceUsed();
        }
      }
    } catch { /* voz no crítica */ }
    if (uid) saveMessage(uid, aiMsg);
  };

  // ── callAPI ──────────────────────────────────────────────────────────────
  const callAPI = useCallback(async (messagesPayload, isOpening = false) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await doFetch({ messages: messagesPayload, isOpening });
      if (data?.reply?.trim()) {
        addAIMessage(data.reply.trim(), auth.currentUser?.uid);
      } else {
        setError(getFriendlyError(data?.error ?? "unknown_error", localeRef.current));
      }
    } catch {
      setError(getFriendlyError("network_error", localeRef.current));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []); // eslint-disable-line

  const callAPIReturn = useCallback(async (recentHistory, uid) => {
    setIsLoading(true);
    try {
      const validHistory = recentHistory
        .filter((m) => (m.role === "user" || m.role === "assistant")
          && typeof m.content === "string"
          && m.content.trim()
          && m.content !== "__OPENING__");

      const data = await doFetch({
        messages: validHistory.length > 0
          ? validHistory.map((m) => ({ role: m.role, content: m.content }))
          : [{ role: "user", content: "El usuario regresó." }],
        isReturn: true,
      });

      if (data?.reply?.trim()) addAIMessage(data.reply.trim(), uid);
    } catch { /* silencioso */ }
    finally { setIsLoading(false); }
  }, []); // eslint-disable-line

  // ── Efecto de apertura ───────────────────────────────────────────────────
  useEffect(() => {
    if (hasOpened.current) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (hasOpened.current) return;
      hasOpened.current = true;
      const uid = firebaseUser?.uid;
      if (uid) {
        try {
          const history = await loadConversation(uid);
          if (history && history.length > 0) {
            setMessages(history);
            callAPIReturn(history.slice(-6), uid);
          } else {
            callAPI([{ role: "user", content: "__OPENING__" }], true);
          }
        } catch {
          callAPI([{ role: "user", content: "__OPENING__" }], true);
        }
      } else {
        callAPI([{ role: "user", content: "__OPENING__" }], true);
      }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line

  // ── Enviar mensaje con control de créditos ───────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Verificar créditos
    if (!isPremium) {
      if (creditsLeft <= 0) {
        setUpgradeMode("hard");
        setShowUpgrade(true);
        return;
      }
      // Mostrar upgrade suave en el último crédito (después de enviarlo)
      if (creditsLeft === 1) {
        setTimeout(() => { setUpgradeMode("soft"); setShowUpgrade(true); }, 3000);
      }
      // Descontar crédito
      if (firstSession) incrementFirstSessionCredits();
      else incrementDailyCredits();
    }

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    const uid = auth.currentUser?.uid || user?.uid;
    if (uid) saveMessage(uid, userMsg);

    const payload = updatedMessages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content !== "__OPENING__")
      .map((m) => ({ role: m.role, content: m.content }));

    await callAPI(payload, false);
  }, [input, isLoading, messages, callAPI, user?.uid, isPremium, creditsLeft, firstSession]); // eslint-disable-line

  // ── Voz entrada ──────────────────────────────────────────────────────────
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
      const uid = auth.currentUser?.uid || user?.uid;
      const userMsg = { role: "user", content: transcript, timestamp: Date.now() };
      if (uid) saveMessage(uid, userMsg);
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
  }, [locale, callAPI, user?.uid]);

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

  if (!pinUnlocked) {
    return <PinLock locale={locale} onUnlock={() => setPinUnlocked(true)} />;
  }

  // ── Textos según estado ──────────────────────────────────────────────────
  const creditLabel = isPremium ? null
    : firstSession
      ? `✨ Probando Premium — ${creditsLeft} de ${FIRST_SESSION_MAX} conversaciones restantes hoy`
      : `${creditsLeft} de ${FREE_DAILY_MAX} mensajes gratuitos hoy`;

  const upgradeTexts = {
    soft: {
      title: "Hoy fue una buena sesión ✨",
      body: "Notamos que conectaste bien hoy. Con Premium podés seguir así todos los días — sin límites, con voz y análisis de tu evolución.",
      cta: "Seguir con Premium — $2.99/mes",
      skip: "Continuar gratis mañana",
    },
    hard: {
      title: "Usaste tus mensajes de hoy",
      body: firstSession
        ? "Tu primera sesión fue especial. Para seguir mañana tenés 3 mensajes gratis, o podés pasarte a Premium y no perder este hilo."
        : "Alcanzaste el límite de hoy. Volvés mañana con 3 mensajes nuevos, o con Premium es ilimitado.",
      cta: "Hacerme Premium — $2.99/mes",
      skip: "Volver mañana",
    },
  };
  const ut = upgradeTexts[upgradeMode];

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
        {canUseVoice && voiceEnabled && (
          <button onClick={speaking ? stop : undefined}
            style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: speaking ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.1)", color: speaking ? "#818cf8" : "var(--text-muted,#64748b)", cursor: speaking ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all .2s", animation: speaking ? "pulse-voice 1.5s ease-in-out infinite" : "none" }}>
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
            <div key={`${msg.timestamp ?? index}-${index}`} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 10, marginBottom: 22 }}>
              {!isUser && <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌿</div>}
              <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4 }}>
                <div style={{ padding: "15px 20px", fontSize: 15.5, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word", ...(isUser ? {
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", borderRadius: "20px 20px 5px 20px",
                  } : {
                    background: "rgba(255,255,255,0.07)", color: "#e2e8f0", borderRadius: "20px 20px 20px 5px",
                  }) }}>
                  {msg.content}
                </div>
                {msg.timestamp && <span style={{ fontSize: 11, color: "var(--text-muted,#64748b)", padding: "0 4px" }}>{formatTime(msg.timestamp)}</span>}
              </div>
            </div>
          );
        })}
        {isLoading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Contador de créditos */}
      {creditLabel && !showUpgrade && (
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 4, marginBottom: 4 }}>
          {creditLabel}
          {" · "}
          <button onClick={onUpgrade} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 11, padding: 0, textDecoration: "underline" }}>
            Hacerme Premium
          </button>
        </div>
      )}

      {/* Upgrade modal suave */}
      {showUpgrade && (
        <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "18px 20px", marginTop: 8, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}>
            {ut.title}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.6 }}>
            {ut.body}
          </p>
          <button className="btn btn-primary" style={{ padding: "10px 22px", fontSize: 13, marginBottom: 10, width: "100%" }}
            onClick={() => { setShowUpgrade(false); onUpgrade?.(); }}>
            {ut.cta}
          </button>
          <button onClick={() => setShowUpgrade(false)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12 }}>
            {ut.skip}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#f87171", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span>{error}</span>
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Input */}
      {!showUpgrade && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border,rgba(255,255,255,0.08))", alignItems: "flex-end" }}>
          {canUseVoice && (
            <button onClick={isListening ? stopListening : startListening} disabled={isLoading}
              style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: isListening ? "rgba(239,68,68,0.15)" : "var(--bg-card,rgba(255,255,255,0.05))", border: isListening ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border,rgba(255,255,255,0.1))", color: isListening ? "#f87171" : "var(--text-muted,#64748b)", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all .2s", animation: isListening ? "pulse-mic 1s ease-in-out infinite" : "none", opacity: isLoading ? 0.5 : 1 }}>
              {isListening ? "⏹" : "🎙️"}
            </button>
          )}

          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={isListening ? (locale === "es" ? "Escuchando..." : locale === "pt" ? "Ouvindo..." : "Listening...") : (placeholders[locale] ?? placeholders.es)}
            rows={1} disabled={isLoading || isListening}
            style={{ flex: 1, resize: "none", maxHeight: 120, overflow: input.length > 100 ? "auto" : "hidden", background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 14, color: "#e2e8f0", fontFamily: "var(--font-body,'DM Sans',sans-serif)", fontSize: 15.5, padding: "13px 18px", outline: "none", transition: "all .2s", opacity: (isLoading || isListening) ? 0.6 : 1 }}
          />

          <button onClick={sendMessage} disabled={isLoading || !input.trim() || isListening}
            style={{ width: 44, height: 44, borderRadius: 10, border: "none", flexShrink: 0, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: "pointer", transition: "all .2s", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", opacity: (isLoading || !input.trim() || isListening) ? 0.5 : 1 }}
            onMouseEnter={(e) => { if (!isLoading && input.trim()) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
            {isLoading ? <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin .7s linear infinite" }} /> : "→"}
          </button>
        </div>
      )}

      <p style={{ fontSize: 12, color: "var(--text-muted,#64748b)", textAlign: "center", marginTop: 10 }}>
        {locale === "es" ? "MindEase es un acompañante IA, no reemplaza la terapia profesional."
          : locale === "pt" ? "MindEase é um acompanhante de IA, não substitui a terapia profissional."
          : "MindEase is an AI companion, not a replacement for professional therapy."}
      </p>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse-voice{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)}50%{box-shadow:0 0 0 8px rgba(99,102,241,0)}}
        @keyframes pulse-mic{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
      `}</style>
    </div>
  );
}

function getFriendlyError(code, locale = "es") {
  const errors = {
    es: { unauthorized_no_token: "Necesitas iniciar sesión. 🔐", network_error: "Sin conexión.", default: "Algo salió mal. Intenta de nuevo." },
    pt: { unauthorized_no_token: "Você precisa fazer login. 🔐", network_error: "Sem conexão.", default: "Algo deu errado." },
    en:  { unauthorized_no_token: "You need to log in. 🔐", network_error: "No connection.", default: "Something went wrong." },
  };
  const map = errors[locale] ?? errors.es;
  return map[code] ?? map.default;
}
