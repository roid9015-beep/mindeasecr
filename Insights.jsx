"use client";
export default function VoiceButton({ text, speak, stop, speaking, t }) {
  return (
    <button
      onClick={() => (speaking ? stop() : speak(text))}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
        background: speaking ? "var(--accent-soft)" : "transparent",
        border: "1px solid", borderColor: speaking ? "var(--accent)" : "var(--border)",
        borderRadius: 20, cursor: "pointer", fontSize: 11,
        color: speaking ? "var(--accent)" : "var(--text-muted)",
        transition: "all 0.2s", fontFamily: "var(--font-main)",
      }}
    >
      {speaking ? (
        <>
          <div className="voice-wave">
            {[0.1, 0.3, 0.2, 0.4, 0.15].map((d, i) => (
              <div key={i} className="voice-bar" style={{ height: `${8 + d * 20}px`, animationDelay: `${d}s` }} />
            ))}
          </div>
          {t.voiceStopBtn}
        </>
      ) : (
        <>{`🔊 ${t.voiceReadBtn}`}</>
      )}
    </button>
  );
}
