"use client";
import { useState, useEffect, useRef } from "react";

// ─── Breathing patterns ────────────────────────────────────────────────────────
const BREATHING_PATTERNS = [
  { id: "box",      label: "Caja (4-4-4-4)",   inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  { id: "478",      label: "4-7-8 Relajante",  inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  { id: "coherent", label: "Coherente (5-5)",   inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
];

// ─── Grounding items ───────────────────────────────────────────────────────────
const GROUNDING_STEPS = [
  { count: 5, sense: "VER",    emoji: "👁️",  prompt: "Nombrá 5 cosas que podés VER ahora mismo" },
  { count: 4, sense: "TOCAR",  emoji: "✋",  prompt: "Nombrá 4 cosas que podés TOCAR o sentir físicamente" },
  { count: 3, sense: "OÍR",    emoji: "👂",  prompt: "Nombrá 3 cosas que podés OÍR en este momento" },
  { count: 2, sense: "OLER",   emoji: "👃",  prompt: "Nombrá 2 cosas que podés OLER (o que te gustan)" },
  { count: 1, sense: "GUSTAR", emoji: "👅",  prompt: "Nombrá 1 cosa que podés SABOREAR o que te encanta comer" },
];

// ─── Breathing component ───────────────────────────────────────────────────────
function BreathingTab({ t, voiceEnabled, voiceKey }) {
  const [patternId, setPatternId] = useState("box");
  const [running, setRunning]     = useState(false);
  const [phase, setPhase]         = useState("inhale");
  const [count, setCount]         = useState(0);
  const [cycle, setCycle]         = useState(0);
  const intervalRef               = useRef(null);
  const utterRef                  = useRef(null);

  const pattern = BREATHING_PATTERNS.find((p) => p.id === patternId);

  const PHASES = [
    { key: "inhale",  label: "Inhalá",   duration: pattern.inhale },
    { key: "holdIn",  label: "Sostené",  duration: pattern.holdIn },
    { key: "exhale",  label: "Exhalá",   duration: pattern.exhale },
    { key: "holdOut", label: "Descansá", duration: pattern.holdOut },
  ].filter((p) => p.duration > 0);

  const speak = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceKey || "es-ES";
    u.rate = 0.85;
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (!running) return;
    let phaseIdx = 0;
    let remaining = PHASES[0].duration;
    setPhase(PHASES[0].key);
    setCount(PHASES[0].duration);
    speak(PHASES[0].label);

    intervalRef.current = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        phaseIdx = (phaseIdx + 1) % PHASES.length;
        if (phaseIdx === 0) setCycle((c) => c + 1);
        remaining = PHASES[phaseIdx].duration;
        setPhase(PHASES[phaseIdx].key);
        speak(PHASES[phaseIdx].label);
      }
      setCount(remaining);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, patternId]); // eslint-disable-line

  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    window.speechSynthesis?.cancel();
    setPhase("inhale");
    setCount(0);
    setCycle(0);
  };

  const phaseLabel = PHASES.find((p) => p.key === phase)?.label || "Inhalá";
  const phaseDuration = PHASES.find((p) => p.key === phase)?.duration || 4;
  const progress = running ? ((phaseDuration - count) / phaseDuration) * 100 : 0;

  const circleStyle = {
    width: 180, height: 180, borderRadius: "50%",
    border: "3px solid var(--accent)",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    margin: "0 auto",
    background: `conic-gradient(var(--accent) ${progress * 3.6}deg, var(--bg-card) 0deg)`,
    transition: "background 0.8s linear",
    boxShadow: running ? "0 0 40px rgba(99,102,241,0.3)" : "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Pattern selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {BREATHING_PATTERNS.map((p) => (
          <button key={p.id} onClick={() => { if (!running) setPatternId(p.id); }}
            style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: running ? "not-allowed" : "pointer",
              background: patternId === p.id ? "var(--accent)" : "var(--bg-card)",
              color: patternId === p.id ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border)", opacity: running && patternId !== p.id ? 0.4 : 1,
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Circle */}
      <div style={circleStyle}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
          {running ? phaseLabel : "Listo"}
        </span>
        {running && (
          <span style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
            {count}
          </span>
        )}
        {cycle > 0 && (
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            ciclo {cycle}
          </span>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {!running ? (
          <button className="btn btn-primary" onClick={() => setRunning(true)}>
            ▶ Comenzar
          </button>
        ) : (
          <button className="btn btn-ghost" onClick={stop}>
            ⏹ Detener
          </button>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
        Respirá siguiendo el ritmo. Después de 3-5 ciclos vas a sentir la diferencia.
      </p>
    </div>
  );
}

// ─── Grounding component ───────────────────────────────────────────────────────
function GroundingTab({ t, voiceEnabled, voiceKey }) {
  const [stepIdx, setStepIdx]   = useState(0);
  const [items, setItems]       = useState([]);
  const [input, setInput]       = useState("");
  const [done, setDone]         = useState(false);
  const inputRef                = useRef(null);

  const step = GROUNDING_STEPS[stepIdx];

  useEffect(() => {
    inputRef.current?.focus();
    if (voiceEnabled && typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(step.prompt);
      u.lang = voiceKey || "es-ES";
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }, [stepIdx]); // eslint-disable-line

  const addItem = () => {
    const val = input.trim();
    if (!val) return;
    const next = [...items, val];
    setItems(next);
    setInput("");
    if (next.length >= step.count) {
      setTimeout(() => {
        if (stepIdx < GROUNDING_STEPS.length - 1) {
          setStepIdx((i) => i + 1);
          setItems([]);
        } else {
          setDone(true);
        }
      }, 400);
    }
  };

  const reset = () => {
    setStepIdx(0); setItems([]); setInput(""); setDone(false);
  };

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🌟</div>
        <h3 style={{ color: "var(--text-primary)", marginBottom: 8 }}>¡Bien hecho!</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Completaste el ejercicio 5-4-3-2-1. Tu mente volvió al presente.
        </p>
        <button className="btn btn-primary" onClick={reset}>Repetir ejercicio</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {GROUNDING_STEPS.map((s, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i < stepIdx ? "var(--accent)" : i === stepIdx ? "var(--accent-2)" : "var(--border)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Prompt */}
      <div style={{
        background: "var(--bg-card)", borderRadius: 14, padding: "20px 22px",
        border: "1px solid var(--border)", textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{step.emoji}</div>
        <h3 style={{ color: "var(--text-primary)", fontSize: 16, marginBottom: 4 }}>
          {step.prompt}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {items.length}/{step.count} anotados
        </p>
      </div>

      {/* Items so far */}
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {items.map((item, i) => (
            <span key={i} style={{
              background: "var(--bg-card-hover)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "var(--text-secondary)",
            }}>
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder={`Escribí algo que podés ${step.sense.toLowerCase()}…`}
          style={{
            flex: 1, padding: "11px 14px", borderRadius: 10, fontSize: 14,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            color: "var(--text-primary)", outline: "none",
          }}
        />
        <button className="btn btn-primary" onClick={addItem} style={{ padding: "11px 18px" }}>
          +
        </button>
      </div>
    </div>
  );
}

// ─── Main Relief page ──────────────────────────────────────────────────────────
export default function Relief({ t, locale, voiceKey, voiceEnabled }) {
  const [tab, setTab] = useState("breathing");

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
          🫁 Alivio inmediato
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Ejercicios para calmar el sistema nervioso ahora mismo
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: "flex", gap: 4, background: "var(--bg-card)", borderRadius: 12,
        padding: 4, marginBottom: 28, border: "1px solid var(--border)",
      }}>
        {[
          { id: "breathing", label: "💨 Respiración" },
          { id: "grounding", label: "🌍 Grounding 5-4-3-2-1" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 500,
            cursor: "pointer", border: "none", transition: "all .2s",
            background: tab === t.id ? "var(--accent)" : "transparent",
            color: tab === t.id ? "white" : "var(--text-secondary)",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "breathing"
        ? <BreathingTab voiceEnabled={voiceEnabled} voiceKey={voiceKey} />
        : <GroundingTab voiceEnabled={voiceEnabled} voiceKey={voiceKey} />
      }
    </div>
  );
}
