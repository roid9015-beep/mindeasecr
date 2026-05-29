"use client";
import { useState } from "react";

export default function PinLock({ onUnlock, locale = "es" }) {
  const [pin,     setPin]     = useState("");
  const [error,   setError]   = useState(false);
  const [shake,   setShake]   = useState(false);

  const labels = {
    es: { title: "Conversación privada", sub: "Ingresa tu PIN para continuar", wrong: "PIN incorrecto. Intenta de nuevo.", dot: "•" },
    pt: { title: "Conversa privada",     sub: "Digite seu PIN para continuar",  wrong: "PIN incorreto. Tente novamente.",   dot: "•" },
    en: { title: "Private conversation", sub: "Enter your PIN to continue",     wrong: "Incorrect PIN. Try again.",         dot: "•" },
  };
  const t = labels[locale] || labels.es;

  const handleDigit = (digit) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);

    if (next.length === 4) {
      // Verificar contra el PIN guardado
      const saved = localStorage.getItem("mindease_pin");
      if (saved && next === saved) {
        onUnlock();
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => { setPin(""); setShake(false); }, 700);
      }
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  const digits = [["1","2","3"],["4","5","6"],["7","8","9"],["","0","⌫"]];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "var(--bg-primary, #0f0f1a)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 32, padding: 24,
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
        <h2 style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          {t.title}
        </h2>
        <p style={{ color: "var(--text-muted, #64748b)", fontSize: 14 }}>{t.sub}</p>
      </div>

      {/* Indicadores de PIN */}
      <div style={{
        display: "flex", gap: 16, animation: shake ? "pin-shake 0.5s ease" : "none",
      }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: "50%",
            border: "2px solid",
            borderColor: error ? "#f87171" : (i < pin.length ? "var(--accent,#6366f1)" : "var(--border,rgba(255,255,255,0.2))"),
            background: i < pin.length ? (error ? "#f87171" : "var(--accent,#6366f1)") : "transparent",
            transition: "all 0.15s",
          }} />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: "#f87171", fontSize: 13, marginTop: -16 }}>{t.wrong}</p>
      )}

      {/* Teclado numérico */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 260, width: "100%" }}>
        {digits.flat().map((d, i) => (
          d === "" ? <div key={i} /> :
          d === "⌫" ? (
            <button key={i} onClick={handleDelete}
              style={{ height: 64, borderRadius: 14, border: "1px solid var(--border,rgba(255,255,255,0.1))", background: "var(--bg-card,rgba(255,255,255,0.05))", color: "var(--text-secondary,#94a3b8)", fontSize: 20, cursor: "pointer", transition: "all .15s", fontFamily: "var(--font-main,'Sora',sans-serif)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-card-hover,rgba(255,255,255,0.1))"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-card,rgba(255,255,255,0.05))"}>
              ⌫
            </button>
          ) : (
            <button key={i} onClick={() => handleDigit(d)}
              style={{ height: 64, borderRadius: 14, border: "1px solid var(--border,rgba(255,255,255,0.1))", background: "var(--bg-card,rgba(255,255,255,0.05))", color: "var(--text-primary,#f0f1fa)", fontSize: 22, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "var(--font-main,'Sora',sans-serif)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-card-hover,rgba(255,255,255,0.1))"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-card,rgba(255,255,255,0.05))"}>
              {d}
            </button>
          )
        ))}
      </div>

      <style>{`
        @keyframes pin-shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
