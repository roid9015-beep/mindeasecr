"use client";
import { useState } from "react";
import { useVoice } from "@/hooks/useVoice";

export default function GroundingExercise({ t, voiceKey, voiceEnabled }) {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const { speak } = useVoice(voiceKey, voiceEnabled);
  const SENSES = t.groundSenses;

  const reset = () => { setStep(-1); setDone(false); };

  const goNext = () => {
    if (step < SENSES.length - 1) {
      const next = step + 1;
      setStep(next);
      if (voiceEnabled) speak(`${SENSES[next].num} — ${SENSES[next].sense}`);
    } else {
      setDone(true);
      if (voiceEnabled) speak(t.groundingDoneTitle);
    }
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease", padding: "24px 0" }}>
      <h2 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🎯 {t.groundingTitle}</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 13 }}>{t.groundingSubtitle}</p>

      {/* Intro */}
      {step === -1 && !done && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🧘</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>{t.groundingIntro}</p>
          <button
            className="btn btn-primary"
            style={{ padding: "13px 32px" }}
            onClick={() => { setStep(0); if (voiceEnabled) speak(`${SENSES[0].num} — ${SENSES[0].sense}`); }}
          >
            {t.beginExercise}
          </button>
        </div>
      )}

      {/* Steps */}
      {step >= 0 && step < SENSES.length && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", margin: "0 auto 20px", background: "var(--accent-soft)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
            {SENSES[step].icon}
          </div>
          <div style={{ fontFamily: "var(--font-main)", fontSize: 60, fontWeight: 800, color: "var(--accent)", marginBottom: 8 }}>{SENSES[step].num}</div>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", marginBottom: 10 }}>{SENSES[step].sense}</p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 36, maxWidth: 260, margin: "0 auto 36px", lineHeight: 1.6 }}>
            {t.groundingPrompt} {SENSES[step].num.toLowerCase()} {SENSES[step].sense.toLowerCase()}.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {step > 0 && (
              <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>{t.backStep}</button>
            )}
            <button className="btn btn-primary" style={{ padding: "11px 28px" }} onClick={goNext}>
              {step < SENSES.length - 1 ? t.nextStep : t.completeStep}
            </button>
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28 }}>
            {SENSES.map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= step ? "var(--accent)" : "var(--border)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
      )}

      {/* Completion */}
      {done && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🌸</div>
          <h3 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{t.groundingDoneTitle}</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, maxWidth: 300, margin: "0 auto 28px" }}>{t.groundingDoneDesc}</p>
          <button className="btn btn-ghost" onClick={reset}>{t.doItAgain}</button>
        </div>
      )}
    </div>
  );
}
