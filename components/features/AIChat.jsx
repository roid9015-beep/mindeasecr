"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useVoice } from "@/hooks/useVoice";
import VoiceButton from "@/components/ui/VoiceButton";
import Spinner from "@/components/ui/Spinner";
import { REGIONAL_VOICES } from "@/lib/constants";
import { formatTime, getSessionStatus } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🌿</div>
      <div className="bubble-ai" style={{ padding:"12px 18px" }}>
        <div style={{ display:"flex", gap:6 }}>
          {[0,0.15,0.3].map((d,i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)", animation:`typing 1.2s ease-in-out ${d}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Topic Picker (shown to free users before starting) ───────────────────────
function TopicPicker({ t, locale, onStart }) {
  const [custom, setCustom] = useState("");
  const suggestions = {
    en: ["Work stress & burnout","Anxiety & overthinking","Relationship struggles","Feeling lonely","Low motivation","Grief or loss"],
    es: ["Estrés laboral y agotamiento","Ansiedad y pensamientos en bucle","Problemas de relaciones","Sentirse solo/a","Poca motivación","Duelo o pérdida"],
    pt: ["Estresse no trabalho","Ansiedade e pensamentos em loop","Problemas de relacionamento","Solidão","Falta de motivação","Luto ou perda"],
  };
  const topics = suggestions[locale] || suggestions.en;

  return (
    <div style={{ animation:"fadeUp 0.4s ease", padding:"8px 0" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:44, marginBottom:12 }}>🌿</div>
        <h3 style={{ fontFamily:"var(--font-main)", fontSize:20, fontWeight:700, marginBottom:8 }}>
          {locale==="es" ? "¿Sobre qué quieres hablar hoy?" : locale==="pt" ? "Sobre o que você quer conversar hoje?" : "What would you like to talk about?"}
        </h3>
        <p style={{ color:"var(--text-muted)", fontSize:13, lineHeight:1.6, maxWidth:320, margin:"0 auto" }}>
          {locale==="es"
            ? "Tu sesión gratuita mensual te da una conversación profunda y enfocada sobre un tema."
            : locale==="pt"
            ? "Sua sessão gratuita mensal oferece uma conversa profunda e focada sobre um tema."
            : "Your free monthly session gives you one deep, focused conversation on a topic of your choice."}
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {topics.map((topic) => (
          <button key={topic} onClick={() => onStart(topic)}
            style={{ padding:"12px 14px", borderRadius:12, border:"1px solid var(--border)",
              background:"var(--bg-card)", color:"var(--text-secondary)", fontSize:13,
              cursor:"pointer", textAlign:"left", transition:"all 0.2s", fontFamily:"var(--font-body)", lineHeight:1.4 }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--text-primary)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-secondary)"}}>
            {topic}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", gap:8 }}>
        <input className="custom-input" placeholder={locale==="es"?"Escribe tu propio tema...":locale==="pt"?"Escreva seu próprio tema...":"Write your own topic..."}
          value={custom} onChange={e=>setCustom(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&custom.trim()&&onStart(custom.trim())} />
        <button className="btn btn-primary" style={{ flexShrink:0, padding:"12px 18px" }}
          onClick={()=>custom.trim()&&onStart(custom.trim())} disabled={!custom.trim()}>→</button>
      </div>
    </div>
  );
}

// ─── Session limit wall (free plan exhausted) ─────────────────────────────────
function SessionWall({ t, locale, sessionStatus, onUpgrade }) {
  const displayDate = sessionStatus?.resetDate || (locale === "es" ? "el 1 de junio" : "1st of June");
  return (
    <div style={{ textAlign:"center", padding:"40px 20px", animation:"fadeUp 0.4s ease" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🌙</div>
      <h3 style={{ fontFamily:"var(--font-main)", fontSize:20, fontWeight:700, marginBottom:10 }}>
        {locale==="es" ? "Tu sesión de este mes ha terminado"
          : locale==="pt" ? "Sua sessão deste mês acabou"
          : "Your session for this month is complete"}
      </h3>
      <p style={{ color:"var(--text-secondary)", fontSize:14, lineHeight:1.7, maxWidth:320, margin:"0 auto 8px" }}>
        {locale==="es"
          ? `El plan gratuito incluye 1 conversación profunda por mes. Tu próxima sesión se abre el ${displayDate}.`
          : locale==="pt"
          ? `O plano gratuito incluye 1 conversa profunda por mês. Sua próxima sessão abre em ${displayDate}.`
          : `The free plan includes 1 deep conversation per month. Your next session opens on ${displayDate}.`}
      </p>
      <p style={{ color:"var(--text-muted)", fontSize:12, marginBottom:28 }}>
        {locale==="es" ? "Las herramientas de respiración y anclaje siguen disponibles."
          : locale==="pt" ? "As ferramentas de respiração e ancoragem continuam disponíveis."
          : "Breathing and grounding tools are always available."}
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:280, margin:"0 auto" }}>
        <button className="btn btn-primary" style={{ padding:"14px", fontSize:15 }} onClick={onUpgrade}>
          ⭐ {locale==="es" ? "Actualizar a Premium — $5/mes"
            : locale==="pt" ? "Ir para Premium — $5/mês"
            : "Upgrade to Premium — $5/month"}
        </button>
        <div style={{ fontSize:12, color:"var(--text-muted)" }}>
          {locale==="es" ? "Conversaciones ilimitadas + memoria emocional"
            : locale==="pt" ? "Conversas ilimitadas + memória emocional"
            : "Unlimited conversations + emotional memory"}
        </div>
      </div>
    </div>
  );
}

// ─── Main Chat ─────────────────────────────────────────────────────────────────
export default function AIChat({ t, locale, countryInfo, user, messages = [], setMessages, voiceKey, voiceEnabled, sessionLog, startSession, onUpgrade }) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [activeTopic, setActiveTopic] = useState(null);

  const endRef   = useRef(null);
  const inputRef = useRef(null);
  const { speak, stop, speaking } = useVoice(voiceKey, voiceEnabled);

  // 1. Control de seguridad para evitar caídas si messages no es un arreglo válido
  const validMessages = Array.isArray(messages) ? messages : [];

  // 2. Control seguro del estado de consumo mensual
  let sessionStatus = { canChat: true, resetDate: "" };
  try {
    if (sessionLog) {
      sessionStatus = getSessionStatus(sessionLog);
    }
  } catch (e) {
    console.error("Error leyendo logs de sesión:", e);
  }

  const isPremium = !!user?.isPremium;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [validMessages, loading]);

  const handleStartSession = useCallback((topic) => {
    setActiveTopic(topic);
    startSession(topic);
    
    const seedMsg = {
      role: "assistant",
      content: locale==="es"
        ? `Me alegra que estés aquí. Vamos a explorar juntos "${topic}" — cuéntame, ¿qué está pasando?`
        : locale==="pt"
        ? `Fico feliz que você esteja aqui. Vamos explorar juntos "${topic}" — me conte, o que está acontecendo?`
        : `I'm glad you're here. Let's explore "${topic}" together — tell me, what's been going on?`,
      timestamp: Date.now(),
    };
    setMessages([seedMsg]);
  }, [locale, startSession, setMessages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    
    const userMsg = { role:"user", content:text, timestamp:Date.now() };
    const newMessages = [...validMessages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-16).map(m=>({ role:m.role, content:m.content })),
          locale,
          countryInfo,
        }),
      });
      
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) throw new Error(data?.error || "api_error");
      
      const aiMsg = { role:"assistant", content:data.content, timestamp:Date.now() };
      setMessages(prev => [...(Array.isArray(prev) ? prev : []), aiMsg]);
      if (voiceEnabled) setTimeout(()=>speak(data.content), 300);
    } catch (err) {
      console.error("Error en la llamada de chat:", err);
      const fallback = locale==="es" ? "Tengo problemas de conexión. Respira despacio — aquí sigo. 🌿"
        : locale==="pt" ? "Estou com problemas de conexão. Respire devagar — ainda estou aqui. 🌿"
        : "Having trouble connecting. Take a slow breath — I'm still here. 🌿";
      setMessages(prev => [...(Array.isArray(prev) ? prev : []), { role:"assistant", content:fallback, timestamp:Date.now() }]);
    } finally {
      setLoading(false);
      setTimeout(()=>inputRef.current?.focus(), 100);
    }
  };

  // ── Render states estructurados correctamente sin falsos positivos ──────────

  // Estado A: Usuario gratuito, sin tema iniciado y tiene créditos -> Elige tema
  if (!isPremium && !activeTopic && sessionStatus.canChat) {
    return <TopicPicker t={t} locale={locale} onStart={handleStartSession} />;
  }

  // Estado B: Usuario gratuito, SIN tema activo y ya agotó el límite real mensual -> Bloqueo
  if (!isPremium && !activeTopic && !sessionStatus.canChat) {
    return <SessionWall t={t} locale={locale} sessionStatus={sessionStatus} onUpgrade={onUpgrade} />;
  }

  // Estado C: Interfaz de chat abierta (Para usuarios Premium o Gratis que tienen una sesión activa corriendo)
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)", animation:"fadeUp 0.4s ease" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:14, borderBottom:"1px solid var(--border)", marginBottom:14 }}>
        <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"var(--font-main)", fontWeight:600 }}>MindEase AI</div>
          {activeTopic && (
            <div style={{ fontSize:11, color:"var(--accent-3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              🎯 {activeTopic}
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {voiceEnabled && (
            <div style={{ padding:"3px 9px", background:"rgba(6,182,212,0.1)", border:"1px solid rgba(6,182,212,0.2)", borderRadius:20, fontSize:10, color:"var(--accent-3)" }}>
              🔊 {REGIONAL_VOICES[voiceKey]?.name || voiceKey}
            </div>
          )}
          {!isPremium && activeTopic && (
            <div style={{ padding:"3px 10px", background:"var(--accent-soft)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:20, fontSize:10, color:"var(--accent)", fontFamily:"var(--font-main)" }}>
              {locale==="es"?"Sesión activa":locale==="pt"?"Sessão ativa":"Active session"}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {validMessages.map((msg,i) => (
          <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8, marginBottom:12 }}>
            {msg.role!=="user" && (
              <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🌿</div>
            )}
            <div style={{ maxWidth:"76%", display:"flex", flexDirection:"column", gap:4, alignItems:msg.role==="user"?"flex-end":"flex-start" }}>
              <div className={msg.role==="user"?"bubble-user":"bubble-ai"} style={{ padding:"11px 15px", fontSize:14, lineHeight:1.65 }}>
                {msg.content}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {msg.timestamp && <span style={{ fontSize:10, color:"var(--text-muted)" }}>{formatTime(msg.timestamp)}</span>}
                {msg.role==="assistant" && voiceEnabled && (
                  <VoiceButton text={msg.content} speak={speak} stop={stop} speaking={speaking} t={t} />
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {error && (
        <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:9, padding:"9px 13px", fontSize:13, color:"#f87171", marginTop:8 }}>{error}</div>
      )}

      {/* Input */}
      <div style={{ display:"flex", gap:9, marginTop:10, paddingTop:10, borderTop:"1px solid var(--border)" }}>
        <textarea ref={inputRef} className="custom-input" placeholder={t?.chatPlaceholder || "Cuéntame cómo te sientes hoy..."}
          value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} }}
          rows={1} style={{ resize:"none", flex:1, maxHeight:120 }} />
        <button className="btn btn-primary" onClick={sendMessage} disabled={loading||!input.trim()}
          style={{ padding:"12px 18px", flexShrink:0 }}>
          {loading ? <Spinner size={16} /> : "→"}
        </button>
      </div>
      <p style={{ fontSize:10, color:"var(--text-muted)", textAlign:"center", marginTop:6 }}>{t?.chatDisclaimer || "MindEase es un acompañante IA, no reemplaza la terapia profesional."}</p>
    </div>
  );
}
