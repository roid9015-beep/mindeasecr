"use client";
export default function PremiumModal({ t, onClose, onUpgrade }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass"
        style={{
          width: "100%", maxWidth: 420, padding: 32,
          position: "relative", border: "1px solid rgba(99,102,241,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 22 }}
        >×</button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>⭐</div>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t.unlockPremium}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t.premiumTagline}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
          {t.premiumFeatures.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
              <span style={{ color: "var(--success)" }}>✓</span>
              <span style={{ color: "var(--text-secondary)" }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <span style={{ fontFamily: "var(--font-main)", fontSize: 34, fontWeight: 700, color: "var(--accent)" }}>$9</span>
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>/mo</span>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "13px", marginBottom: 10 }}
          onClick={() => { onUpgrade(); onClose(); }}
        >
          {t.subscribePayPal}
        </button>
        <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onClose}>{t.maybeLater}</button>
        <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>{t.paypalNote}</p>
      </div>
    </div>
  );
}
