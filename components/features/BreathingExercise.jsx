"use client";
import { useState, useEffect, useRef } from "react";
import { useVoice } from "@/hooks/useVoice";
import { BREATHING_DURATIONS, BREATHING_COLORS } from "@/lib/constants";

export default function BreathingExercise({ t, voiceKey, voiceEnabled }) {
  const [active, setActive] = useState(false);
  const [phase,  setPhase]  = useState(0);
  const [count,  setCount]  = useState(BREATHING_DURATIONS[0]);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  const { speak } = useVoice(voiceKey, voiceEnabled);

  const STEPS = [
    { label: t.inhale,  duration: BREATHING_DURATIONS[0], color: BREATHING_COLORS[0] },
    { label: t.hold,    duration: BREATHING_DURATIONS[1], color: BREATHING_COLORS[1] },
    { label: t.exhale,  duration: BREATHING_DURATIONS[2], color: BREATHING_COLORS[2] },
    { label: t.hold,    duration: BREATHING_DURATIONS[3], color: BREATHING_COLORS[3] },
  ];

  const start = () => {
    setActive(true); setPhase(0); setCount(STEPS[0].duration); setCycles(0);
    if (voiceEnabled) speak(STEPS[0].label);
  };
  const stop = () => { setActive(false); clearInterval(timerRef.current); };

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          setPhase((p) => {
            const next = (p + 1) % STEPS.length;
            if (next === 0) setCycles((c) => c + 1);
            setCount(STEPS[next].duration);
            if (voiceEnabled) setTimeout(() => speak(STEPS[next].label), 200);
            return next;
          });
          return STEPS[0].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active, voiceEnabled]);

  const step     = STEPS[phase];
  const progress = active ? ((step.duration - count) / step.duration) * 100 : 0;
  const R = 90;
  const C = 2 * Math.PI * R;

  return (
    <div style={{ animation: "fadeUp 0.4s ease", padding: "24px 0" }}>
      <h2 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🫁 {t.breathingTitle}</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 13 }}>{t.breathingSubtitle}</p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {/* Ring */}
        <div style={{ position: "relative", width: 210, height: 210 }}>
          <svg width="210" height="210" style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx="105" cy="105" r={R} fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle
              cx="105" cy="105" r={R} fill="none" stroke={step.color} strokeWidth="3"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress / 100)}
              strokeLinecap="round"
              className="progress-ring-track"
              style={{ transformOrigin: "105px 105px", transform: "rotate(-90deg)" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 20, borderRadius: "50%", background: `radial-gradient(circle,${step.color}33 0%,${step.color}11 70%)`, border: `2px solid ${step.color}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "background 0.5s" }}>
            <div style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-main)", color: step.color }}>{active ? count : "✦"}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-main)", fontWeight: 500 }}>{active ? step.label : t.ready}</div>
          </div>
        </div>

        {/* Phase tabs */}
        {active && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ padding: "5px 12px", borderRadius: 20, background: i === phase ? s.color : "var(--bg-card)", color: i === phase ? "white" : "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-main)", fontWeight: 500, transition: "all 0.3s" }}>
                {s.label} {s.duration}s
              </div>
            ))}
          </div>
        )}

        {active && cycles > 0 && (
          <div style={{ padding: "4px 12px", background: "var(--accent-soft)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-main)" }}>
            ✓ {cycles} {cycles > 1 ? t.cyclesComplete : t.cycleComplete}
          </div>
        )}

        <button className={active ? "btn btn-danger" : "btn btn-primary"} style={{ padding: "13px 36px", fontSize: 14 }} onClick={active ? stop : start}>
          {active ? t.stopBtn : t.startBreathing}
        </button>

        {!active && (
          <div className="glass" style={{ padding: 22, width: "100%", maxWidth: 380 }}>
            <h4 style={{ fontFamily: "var(--font-main)", fontSize: 13, marginBottom: 12 }}>{t.howItWorks}</h4>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.color + "33", border: `1px solid ${s.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "var(--font-main)", flexShrink: 0 }}>{s.duration}</div>
                <span style={{ fontFamily: "var(--font-main)", fontSize: 13 }}>{s.label}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>— {s.duration} {t.seconds}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
