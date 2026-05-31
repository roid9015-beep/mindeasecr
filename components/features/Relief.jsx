"use client";
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/hooks/useVoice";

// ── Textos por idioma ─────────────────────────────────────────────────────────
const TX = {
  es: {
    title: "Alivio inmediato",
    sub: "Estás en el lugar correcto. Elige lo que necesitás ahora.",
    breatheTitle: "Respiración",
    breatheSub: "Calma tu sistema nervioso en 2 minutos",
    groundTitle: "Anclaje 5-4-3-2-1",
    groundSub: "Volvé al presente ahora mismo",
    chatTitle: "Hablar con MindEase",
    chatSub: "Contame qué está pasando",
    // Respiración
    inhale: "Inhala", hold: "Aguanta", exhale: "Exhala", ready: "Listo",
    start: "Comenzar", stop: "Detener",
    cycle: "ciclo", cycles: "ciclos",
    // Grounding
    groundPrompt: "Tomá tu tiempo. Mirá a tu alrededor y encontrá",
    next: "Siguiente →", back: "← Atrás", done: "Listo ✓",
    doneTitle: "Muy bien.", doneDesc: "Estás presente. Estás a salvo.",
    again: "Repetir",
    senses: [
      { num: "5", sense: "cosas que podés VER",      icon: "👁️" },
      { num: "4", sense: "cosas que podés TOCAR",    icon: "✋" },
      { num: "3", sense: "cosas que podés ESCUCHAR", icon: "👂" },
      { num: "2", sense: "cosas que podés OLER",     icon: "👃" },
      { num: "1", sense: "cosa que podés SABOREAR",  icon: "👅" },
    ],
  },
  pt: {
    title: "Alívio imediato",
    sub: "Você está no lugar certo. Escolha o que precisa agora.",
    breatheTitle: "Respiração",
    breatheSub: "Acalme seu sistema nervoso em 2 minutos",
    groundTitle: "Ancoragem 5-4-3-2-1",
    groundSub: "Volte ao presente agora mesmo",
    chatTitle: "Falar com MindEase",
    chatSub: "Me conta o que está acontecendo",
    inhale: "Inspire", hold: "Segure", exhale: "Expire", ready: "Pronto",
    start: "Iniciar", stop: "Parar",
    cycle: "ciclo", cycles: "ciclos",
    groundPrompt: "Tome seu tempo. Olhe ao redor e encontre",
    next: "Próximo →", back: "← Voltar", done: "Concluir ✓",
    doneTitle: "Muito bem.", doneDesc: "Você está presente. Você está seguro/a.",
    again: "Repetir",
    senses: [
      { num: "5", sense: "coisas que você pode VER",     icon: "👁️" },
      { num: "4", sense: "coisas que você pode TOCAR",   icon: "✋" },
      { num: "3", sense: "coisas que você pode OUVIR",   icon: "👂" },
      { num: "2", sense: "coisas que você pode CHEIRAR", icon: "👃" },
      { num: "1", sense: "coisa que você pode SABOREAR", icon: "👅" },
    ],
  },
  en: {
    title: "Immediate relief",
    sub: "You're in the right place. Choose what you need right now.",
    breatheTitle: "Breathing",
    breatheSub: "Calm your nervous system in 2 minutes",
    groundTitle: "5-4-3-2-1 Grounding",
    groundSub: "Come back to the present right now",
    chatTitle: "Talk to MindEase",
    chatSub: "Tell me what's going on",
    inhale: "Inhale", hold: "Hold", exhale: "Exhale", ready: "Ready",
    start: "Start", stop: "Stop",
    cycle: "cycle", cycles: "cycles",
    groundPrompt: "Take your time. Look around and find",
    next: "Next →", back: "← Back", done: "Done ✓",
    doneTitle: "Well done.", doneDesc: "You're present. You're safe.",
    again: "Again",
    senses: [
      { num: "5", sense: "things you can SEE",   icon: "👁️" },
      { num: "4", sense: "things you can TOUCH",  icon: "✋" },
      { num: "3", sense: "things you can HEAR",   icon: "👂" },
      { num: "2", sense: "things you can SMELL",  icon: "👃" },
      { num: "1", sense: "thing you can TASTE",   icon: "👅" },
    ],
  },
};

// ── Respiración en caja ───────────────────────────────────────────────────────
const PHASES = ["inhale","hold","exhale","hold2"];
const DURATIONS = { inhale:4, hold:4, exhale:6, hold2:2 };

function BreathingSection({ t, voiceKey, voiceEnabled }) {
  const [running,  setRunning]  = useState(false);
  const [phase,    setPhase]    = useState("ready");
  const [count,    setCount]    = useState(0);
  const [cycles,   setCycles]   = useState(0);
  const timerRef = useRef(null);
  const { speak } = useVoice(voiceKey, voiceEnabled);

  const phaseLabel = { inhale: t.inhale, hold: t.hold, exhale: t.exhale, hold2: t.hold, ready: t.ready };
  const phaseColor = { inhale:"#6366f1", hold:"#8b5cf6", exhale:"#06b6d4", hold2:"#8b5cf6", ready:"#64748b" };

  useEffect(() => {
    if (!running) return;
    let pIdx = 0, seconds = 0;
    setPhase(PHASES[0]);
    setCount(DURATIONS[PHASES[0]]);
    if (voiceEnabled) speak(t.inhale);

    timerRef.current = setInterval(() => {
      seconds++;
      const dur = DURATIONS[PHASES[pIdx]];
      const rem = dur - (seconds % dur === 0 ? dur : seconds % dur);
      setCount(rem);

      if (seconds % dur === 0) {
        pIdx = (pIdx + 1) % PHASES.length;
        if (pIdx === 0) setCycles(c => c + 1);
        setPhase(PHASES[pIdx]);
        if (voiceEnabled) speak(phaseLabel[PHASES[pIdx]]);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  const toggle = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      setPhase("ready");
      setCount(0);
    } else {
      setCycles(0);
      setRunning(true);
    }
  };

  const color = phaseColor[phase] || "#6366f1";

  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      {/* Círculo animado */}
      <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%",
          border: `3px solid ${color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 2,
          background: `${color}15`,
          transition: "all 0.8s ease",
          animation: running ? (phase === "inhale" ? "breathe-in 4s ease-in-out" : phase === "exhale" ? "breathe-out 6s ease-in-out" : "none") : "none",
        }}>
          <span style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 14, fontWeight: 700, color }}>
            {phaseLabel[phase]}
          </span>
          {running && <span style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 26, fontWeight: 800, color }}>{count}</span>}
        </div>
      </div>

      {running && cycles > 0 && (
        <p style={{ fontSize: 13, color: "#10b981", marginBottom: 12 }}>
          {cycles} {cycles === 1 ? t.cycle : t.cycles}
        </p>
      )}

      <button onClick={toggle} className="btn btn-primary" style={{ padding: "11px 28px" }}>
        {running ? t.stop : t.start}
      </button>

      <style>{`
        @keyframes breathe-in  { from{transform:scale(1)} to{transform:scale(1.15)} }
        @keyframes breathe-out { from{transform:scale(1.15)} to{transform:scale(1)} }
      `}</style>
    </div>
  );
}

// ── Grounding ─────────────────────────────────────────────────────────────────
function GroundingSection({ t, voiceKey, voiceEnabled }) {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const { speak } = useVoice(voiceKey, voiceEnabled);
  const SENSES = t.senses;

  const reset = () => { setStep(-1); setDone(false); };

  const goNext = () => {
    if (step < SENSES.length - 1) {
      const next = step + 1;
      setStep(next);
      if (voiceEnabled) speak(`${SENSES[next].num} — ${SENSES[next].sense}`);
    } else {
      setDone(true);
      if (voiceEnabled) speak(t.doneTitle);
    }
  };

  if (step === -1 && !done) return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 20, maxWidth: 280, margin: "0 auto 20px" }}>
        {t.groundPrompt} {SENSES[0]?.num} {SENSES[0]?.sense.toLowerCase()}...
      </p>
      <button className="btn btn-primary" style={{ padding: "11px 28px" }}
        onClick={() => { setStep(0); if (voiceEnabled) speak(`${SENSES[0].num} — ${SENSES[0].sense}`); }}>
        {t.start}
      </button>
    </div>
  );

  if (done) return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>🌸</div>
      <h4 style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t.doneTitle}</h4>
      <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 260, margin: "0 auto 20px" }}>{t.doneDesc}</p>
      <button className="btn btn-ghost" onClick={reset}>{t.again}</button>
    </div>
  );

  return (
    <div style={{ textAlign: "center", padding: "16px 0", animation: "fadeUp 0.3s ease" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 14px", background: "var(--accent-soft,rgba(99,102,241,0.1))", border: "2px solid var(--accent,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
        {SENSES[step].icon}
      </div>
      <div style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 48, fontWeight: 800, color: "var(--accent,#6366f1)", marginBottom: 6 }}>{SENSES[step].num}</div>
      <p style={{ fontSize: 16, color: "#cbd5e1", marginBottom: 24 }}>{SENSES[step].sense}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>{t.back}</button>}
        <button className="btn btn-primary" style={{ padding: "11px 24px" }} onClick={goNext}>
          {step < SENSES.length - 1 ? t.next : t.done}
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {SENSES.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= step ? "var(--accent,#6366f1)" : "var(--border,rgba(255,255,255,0.1))", transition: "background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Relief({ locale = "es", voiceKey = "es-MX", voiceEnabled = false, onNavigateChat }) {
  const [tab, setTab] = useState("breathe"); // "breathe" | "ground"
  const t = TX[locale] || TX.es;

  const tabs = [
    { id: "breathe", label: `🫁 ${t.breatheTitle}` },
    { id: "ground",  label: `🎯 ${t.groundTitle}` },
  ];

  return (
    <div style={{ padding: "24px 0", animation: "fadeUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          🆘 {t.title}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>{t.sub}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--bg-secondary,rgba(255,255,255,0.04))", borderRadius: 12, padding: 4 }}>
        {tabs.map(tab_ => (
          <button key={tab_.id} onClick={() => setTab(tab_.id)} style={{
            flex: 1, padding: "10px 8px", borderRadius: 9, border: "none", cursor: "pointer",
            fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 13, fontWeight: 500,
            background: tab === tab_.id ? "var(--accent,#6366f1)" : "transparent",
            color: tab === tab_.id ? "white" : "var(--text-muted,#64748b)",
            transition: "all 0.2s",
          }}>{tab_.label}</button>
        ))}
      </div>

      {/* Contenido del tab */}
      <div className="glass" style={{ padding: "20px 16px", marginBottom: 16, minHeight: 220 }}>
        {tab === "breathe" ? (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginBottom: 16 }}>{t.breatheSub}</p>
            <BreathingSection t={t} voiceKey={voiceKey} voiceEnabled={voiceEnabled} />
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginBottom: 16 }}>{t.groundSub}</p>
            <GroundingSection t={t} voiceKey={voiceKey} voiceEnabled={voiceEnabled} />
          </>
        )}
      </div>

      {/* Botón al chat */}
      <button onClick={onNavigateChat} style={{
        width: "100%", padding: "16px 20px", borderRadius: 16, cursor: "pointer",
        background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))",
        border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center",
        justifyContent: "space-between", transition: "all .2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))"}
        onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))"}>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontWeight: 700, fontSize: 14, color: "#f0f1fa", marginBottom: 3 }}>
            💬 {t.chatTitle}
          </p>
          <p style={{ fontSize: 12, color: "var(--accent,#6366f1)" }}>{t.chatSub}</p>
        </div>
        <span style={{ fontSize: 20, color: "var(--accent,#6366f1)" }}>›</span>
      </button>
    </div>
  );
}
