"use client";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Toggle from "@/components/ui/Toggle";
import LanguageBadge from "@/components/ui/LanguageBadge";
import { REGIONAL_VOICES } from "@/lib/constants";

// ── Modal para configurar PIN ─────────────────────────────────────────────────
function PinSetupModal({ locale, onClose }) {
  const [step,    setStep]    = useState("set"); // "set" | "confirm"
  const [pin,     setPin]     = useState("");
  const [confirm, setConfirm] = useState("");
  const [error,   setError]   = useState("");

  const labels = {
    es: { title: "Configurar PIN", set: "Elige un PIN de 4 dígitos", confirm: "Confirma tu PIN", mismatch: "Los PINs no coinciden. Intenta de nuevo.", saved: "PIN guardado", remove: "Eliminar PIN", removeConfirm: "PIN eliminado" },
    pt: { title: "Configurar PIN", set: "Escolha um PIN de 4 dígitos", confirm: "Confirme seu PIN", mismatch: "Os PINs não coincidem.", saved: "PIN salvo", remove: "Remover PIN", removeConfirm: "PIN removido" },
    en: { title: "Set PIN", set: "Choose a 4-digit PIN", confirm: "Confirm your PIN", mismatch: "PINs don't match. Try again.", saved: "PIN saved", remove: "Remove PIN", removeConfirm: "PIN removed" },
  };
  const t = labels[locale] || labels.es;

  const current = step === "set" ? pin : confirm;
  const setter  = step === "set" ? setPin : setConfirm;

  const handleDigit = (d) => {
    if (current.length >= 4) return;
    const next = current + d;
    setter(next);
    setError("");

    if (next.length === 4) {
      if (step === "set") {
        setTimeout(() => setStep("confirm"), 300);
      } else {
        if (next === pin) {
          localStorage.setItem("mindease_pin", pin);
          onClose(true);
        } else {
          setError(t.mismatch);
          setTimeout(() => { setConfirm(""); setStep("set"); setPin(""); }, 800);
        }
      }
    }
  };

  const handleDelete = () => { setter((p) => p.slice(0, -1)); setError(""); };

  const handleRemove = () => {
    localStorage.removeItem("mindease_pin");
    onClose(false);
  };

  const hasPin = typeof window !== "undefined" && !!localStorage.getItem("mindease_pin");
  const digits = [["1","2","3"],["4","5","6"],["7","8","9"],["","0","⌫"]];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--bg-secondary,#1a1a2e)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 340, textAlign: "center" }}>
        <h3 style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t.title}</h3>
        <p style={{ color: "var(--text-muted,#64748b)", fontSize: 13, marginBottom: 24 }}>
          {step === "set" ? t.set : t.confirm}
        </p>

        {/* Puntos */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 24 }}>
          {[0,1,2,3].map((i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid", borderColor: i < current.length ? "var(--accent,#6366f1)" : "var(--border,rgba(255,255,255,0.2))", background: i < current.length ? "var(--accent,#6366f1)" : "transparent", transition: "all .15s" }} />
          ))}
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 16 }}>{error}</p>}

        {/* Teclado */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {digits.flat().map((d, i) => (
            d === "" ? <div key={i} /> :
            d === "⌫" ? (
              <button key={i} onClick={handleDelete} style={{ height: 56, borderRadius: 12, border: "1px solid var(--border,rgba(255,255,255,0.1))", background: "var(--bg-card,rgba(255,255,255,0.05))", color: "var(--text-secondary,#94a3b8)", fontSize: 18, cursor: "pointer" }}>⌫</button>
            ) : (
              <button key={i} onClick={() => handleDigit(d)} style={{ height: 56, borderRadius: 12, border: "1px solid var(--border,rgba(255,255,255,0.1))", background: "var(--bg-card,rgba(255,255,255,0.05))", color: "var(--text-primary,#f0f1fa)", fontSize: 20, fontWeight: 500, cursor: "pointer" }}>{d}</button>
            )
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hasPin && (
            <button onClick={handleRemove} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#f87171", fontSize: 13, cursor: "pointer" }}>
              {t.remove}
            </button>
          )}
          <button onClick={() => onClose(null)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border,rgba(255,255,255,0.1))", background: "transparent", color: "var(--text-muted,#64748b)", fontSize: 13, cursor: "pointer" }}>
            {locale === "es" ? "Cancelar" : locale === "pt" ? "Cancelar" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Settings principal ────────────────────────────────────────────────────────
export default function Settings({ t, user, onLogout, onUpgrade, onShowTerms,
  voiceEnabled, setVoiceEnabled, voiceKey,
  pushEnabled, setPushEnabled, reminderEnabled, setReminderEnabled,
  langInfo, onChangeLocale }) {

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinActive, setPinActive] = useState(
    typeof window !== "undefined" && !!localStorage.getItem("mindease_pin")
  );

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    onLogout();
  };

  const handlePinClose = (saved) => {
    setShowPinModal(false);
    if (saved === true)  setPinActive(true);
    if (saved === false) setPinActive(false);
  };

  const locale = langInfo?.locale || "es";
  const pinLabel = {
    es: { label: "PIN de privacidad", sub: pinActive ? "Activo — protege el chat" : "Protege tu conversación con PIN" },
    pt: { label: "PIN de privacidade", sub: pinActive ? "Ativo — protege o chat" : "Proteja sua conversa com PIN" },
    en: { label: "Privacy PIN", sub: pinActive ? "Active — chat is protected" : "Protect your conversation with a PIN" },
  }[locale] || { label: "Privacy PIN", sub: "" };

  const sections = [
    { title: t.account, items: [
      { icon:"👤", label: t.profileLabel, sub: user?.email },
    ]},
    { title: t.preferences, items: [
      { icon:"🔔", label: t.pushNotifications,  sub: t.pushNotifSub,    toggle: pushEnabled,    onToggle: () => setPushEnabled(!pushEnabled) },
      { icon:"⏰", label: t.dailyReminder,      sub: t.dailyReminderSub, toggle: reminderEnabled, onToggle: () => setReminderEnabled(!reminderEnabled) },
      { icon:"🔊", label: t.voiceEnabled,       sub: REGIONAL_VOICES[voiceKey]?.name, toggle: voiceEnabled, onToggle: () => setVoiceEnabled(!voiceEnabled) },
      { icon:"🔒", label: pinLabel.label,       sub: pinLabel.sub, action: () => setShowPinModal(true), badge: pinActive ? "✓" : null },
    ]},
    { title: t.languageLabel, items: [
      { icon: langInfo?.flag||"🌍", label: t.languageLabel, sub: langInfo?.country, custom: <LanguageBadge langInfo={langInfo} onChangeLocale={onChangeLocale} /> },
    ]},
    { title: t.subscriptionLabel, items: [
      { icon: user?.isPremium?"⭐":"🚀", label: user?.isPremium ? t.premiumPlan : t.upgradePremium,
        sub: user?.isPremium ? t.premiumPlanSub : t.upgradePremiumSub,
        action: !user?.isPremium ? onUpgrade : null },
    ]},
    { title: t.legalLabel, items: [
      { icon:"📋", label: t.termsOfService, action: onShowTerms },
      { icon:"📜", label: t.privacyPolicy,  action: () => window.open("https://mindeasecr.vercel.app/privacy", "_blank") },
      { icon:"⚕️", label: t.medDisclaimer,  action: () => alert(t.medDisclaimerText) },
    ]},
  ];

  return (
    <div style={{ animation:"fadeUp 0.4s ease", padding:"24px 0" }}>
      {showPinModal && <PinSetupModal locale={locale} onClose={handlePinClose} />}

      <h2 style={{ fontFamily:"var(--font-main)", fontSize:22, fontWeight:700, marginBottom:20 }}>{t.settingsTitle}</h2>

      {/* Avatar */}
      <div className="glass" style={{ padding:20, marginBottom:18, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-main)", fontWeight:600, fontSize:15 }}>{user?.name}</div>
          <div style={{ color:"var(--text-muted)", fontSize:12 }}>{user?.email}</div>
          <div style={{ marginTop:5, display:"inline-flex", padding:"3px 10px", borderRadius:20, fontSize:10, fontFamily:"var(--font-main)", background: user?.isPremium ? "rgba(99,102,241,0.15)" : "rgba(100,116,139,0.15)", color: user?.isPremium ? "var(--accent)" : "var(--text-muted)" }}>
            {user?.isPremium ? "⭐ Premium" : t.free}
          </div>
        </div>
      </div>

      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom:16 }}>
          <p style={{ fontSize:10, color:"var(--text-muted)", marginBottom:7, fontFamily:"var(--font-main)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", paddingLeft:4 }}>{sec.title}</p>
          <div className="glass" style={{ overflow:"hidden", padding:0 }}>
            {sec.items.map((item, i) => (
              <div key={i} onClick={item.action||undefined}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom: i < sec.items.length-1 ? "1px solid var(--border)" : "none", cursor: item.action?"pointer":"default", transition:"background .2s" }}
                onMouseEnter={e => item.action && (e.currentTarget.style.background="var(--bg-card-hover)")}
                onMouseLeave={e => item.action && (e.currentTarget.style.background="transparent")}>
                <span style={{ fontSize:18, width:26, textAlign:"center" }}>{item.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.sub}</div>}
                </div>
                {item.badge && <span style={{ fontSize:11, color:"#10b981", fontWeight:600 }}>{item.badge}</span>}
                {item.toggle !== undefined ? <Toggle on={item.toggle} onToggle={item.onToggle} />
                  : item.custom ? item.custom
                  : item.action ? <span style={{ color:"var(--text-muted)", fontSize:18 }}>›</span>
                  : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleLogout} style={{ width:"100%", marginTop:8, padding:"12px 24px", borderRadius:"var(--radius-sm)", background:"rgba(239,68,68,0.12)", color:"var(--danger,#f87171)", border:"1px solid rgba(239,68,68,0.2)", fontFamily:"var(--font-main)", fontSize:14, fontWeight:500, cursor:"pointer", transition:"all .2s" }}>
        {t.signOut}
  