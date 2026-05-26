"use client";
import { DIFFERENTIATORS, PREMIUM_PRICE } from "@/lib/constants";

export default function PremiumModal({ t, locale, onClose, onUpgrade }) {
  const diff = DIFFERENTIATORS;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass"
        style={{ width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto",
          padding:32, position:"relative", border:"1px solid rgba(99,102,241,0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14,
          background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:22 }}>×</button>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:44, marginBottom:10 }}>⭐</div>
          <h2 style={{ fontFamily:"var(--font-main)", fontSize:22, fontWeight:700, marginBottom:8 }}>
            {t.unlockPremium}
          </h2>
          <p style={{ color:"var(--text-secondary)", fontSize:14 }}>{t.premiumTagline}</p>
        </div>

        {/* Why not ChatGPT — differentiator section */}
        <div style={{ background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)",
          borderRadius:12, padding:"16px 18px", marginBottom:22 }}>
          <p style={{ fontSize:11, color:"var(--accent)", fontFamily:"var(--font-main)", fontWeight:600,
            textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>
            {locale==="es" ? "¿Por qué no simplemente ChatGPT?" : locale==="pt" ? "Por que não o ChatGPT?" : "Why not just use ChatGPT?"}
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {diff.map((d, i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, fontFamily:"var(--font-main)", marginBottom:2 }}>
                    {locale==="es" ? d.es : locale==="pt" ? d.pt : d.en}
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.5 }}>
                    {locale==="es" ? d.descEs : locale==="pt" ? d.descPt : d.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features list */}
        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:22 }}>
          {t.premiumFeatures.map((f) => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:9, fontSize:13 }}>
              <span style={{ color:"var(--success)", fontSize:15 }}>✓</span>
              <span style={{ color:"var(--text-secondary)" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div style={{ textAlign:"center", marginBottom:18 }}>
          <span style={{ fontFamily:"var(--font-main)", fontSize:40, fontWeight:700, color:"var(--accent)" }}>
            ${PREMIUM_PRICE}
          </span>
          <span style={{ color:"var(--text-muted)", fontSize:14 }}>
            {locale==="es" ? "/mes" : locale==="pt" ? "/mês" : "/month"}
          </span>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:4 }}>
            {locale==="es" ? "Cancela cuando quieras" : locale==="pt" ? "Cancele quando quiser" : "Cancel anytime"}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width:"100%", padding:"14px", marginBottom:10, fontSize:15 }}
          onClick={() => { onUpgrade(); onClose(); }}>
          {t.subscribePayPal}
        </button>
        <button className="btn btn-ghost" style={{ width:"100%" }} onClick={onClose}>{t.maybeLater}</button>
        <p style={{ fontSize:10, color:"var(--text-muted)", textAlign:"center", marginTop:12, lineHeight:1.5 }}>
          {t.paypalNote}
        </p>
      </div>
    </div>
  );
}
