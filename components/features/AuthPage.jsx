"use client";
import { useState } from "react";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";
import LanguageBadge from "@/components/ui/LanguageBadge";
import Spinner from "@/components/ui/Spinner";

export default function AuthPage({ t, langInfo, onChangeLocale, onLogin }) {
  const [mode,     setMode]     = useState("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const submit = async () => {
    if (!email || !password) return setError(t.fillFields);
    if (mode === "signup" && !name) return setError(t.enterName);
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onLogin({ name: name || email.split("@")[0], email, isPremium: false });
  };

  const googleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: "Demo User", email: "demo@mindease.ai", isPremium: true });
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <BackgroundOrbs />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 430 }}>

        {/* Language badge */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <LanguageBadge langInfo={langInfo} onChangeLocale={onChangeLocale} />
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px", background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, animation: "pulseGlow 3s ease-in-out infinite" }}>🌿</div>
          <h1 className="logo-text" style={{ fontSize: 26, marginBottom: 6 }}>{t.appName}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t.tagline}</p>
        </div>

        <div className="glass" style={{ padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--bg-secondary)", borderRadius: 10, padding: 4 }}>
            {[["login", t.signInBtn], ["signup", t.createAccount]].map(([m, label]) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 500, background: mode === m ? "var(--accent)" : "transparent", color: mode === m ? "white" : "var(--text-muted)", transition: "all 0.2s" }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontFamily: "var(--font-main)" }}>{t.nameLabel}</label>
                <input className="custom-input" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontFamily: "var(--font-main)" }}>{t.emailLabel}</label>
              <input className="custom-input" type="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontFamily: "var(--font-main)" }}>{t.passwordLabel}</label>
              <input className="custom-input" type="password" placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "#f87171" }}>{error}</div>
            )}

            <button className="btn btn-primary" style={{ width: "100%", marginTop: 4, padding: "13px" }} onClick={submit} disabled={loading}>
              {loading ? <Spinner size={18} /> : (mode === "login" ? t.signInBtn : t.createAccount)}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.orDivider}</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={googleLogin} disabled={loading}>
              🔵 {t.googleBtn}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 18, lineHeight: 1.6 }}>
          {t.authDisclaimer}
        </p>
      </div>
    </div>
  );
}
