"use client";
import { useState, useEffect } from "react";
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveTermsAcceptance } from "@/lib/firestore";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";
import LanguageBadge  from "@/components/ui/LanguageBadge";
import Spinner        from "@/components/ui/Spinner";
import TermsModal     from "@/components/ui/TermsModal";

export default function AuthPage({ t, langInfo, onChangeLocale, onLogin }) {
  const [mode,          setMode]         = useState("login");
  const [name,          setName]         = useState("");
  const [email,         setEmail]        = useState("");
  const [password,      setPassword]     = useState("");
  const [loading,       setLoading]      = useState(false);
  const [error,         setError]        = useState("");
  const [termsAccepted, setTermsAccepted]= useState(false);
  const [showTerms,     setShowTerms]    = useState(false);
  const [rememberMe,    setRememberMe]   = useState(true);
  const [resetSent,     setResetSent]    = useState(false);

  const locale = langInfo?.locale || "es";

  const termsLabel = {
    es: { text: "He leído y acepto los", link: "Términos de Uso y Política de Privacidad", required: "Debes aceptar los términos para continuar." },
    pt: { text: "Li e aceito os", link: "Termos de Uso e Política de Privacidade", required: "Você deve aceitar os termos para continuar." },
    en: { text: "I have read and agree to the", link: "Terms of Use and Privacy Policy", required: "You must accept the terms to continue." },
  }[locale] || { text: "He leído y acepto los", link: "Términos de Uso", required: "Debes aceptar los términos." };

  // ── Procesar resultado de login con Google vía redirect (web/PWA) ────────
  // Los popups de Google son bloqueados por la mayoría de navegadores móviles,
  // por lo que el flujo web usa signInWithRedirect. Al volver del redirect,
  // recogemos aquí el resultado (o el error) para mostrarlo/aplicarlo.
  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (Capacitor.isNativePlatform()) return;

        const result = await getRedirectResult(auth);
        if (result?.user) {
          const firebaseUser = result.user;
          const wasSignup = sessionStorage.getItem("mindease_google_signup") === "1";
          const savedLocale = sessionStorage.getItem("mindease_google_locale") || locale;
          if (wasSignup) {
            await saveTermsAcceptance(firebaseUser.uid, savedLocale);
          }
          sessionStorage.removeItem("mindease_google_signup");
          sessionStorage.removeItem("mindease_google_locale");
          onLogin({
            name:      firebaseUser.displayName || firebaseUser.email.split("@")[0],
            email:     firebaseUser.email,
            uid:       firebaseUser.uid,
            // isPremium NO se fija aquí: el listener onAuthStateChanged en
            // MindEaseApp.jsx lo trae de Firestore poco después. Si lo
            // forzamos a false aquí, gana la carrera y sobrescribe el valor
            // real (bug que hacía que Premium nunca se reflejara en pantalla).
          });
        }
      } catch (err) {
        sessionStorage.removeItem("mindease_google_signup");
        sessionStorage.removeItem("mindease_google_locale");
        setError("Error al iniciar con Google: " + (err.code || err.message));
      }
    })();
  }, []); // eslint-disable-line

  // ── Persistencia de sesión (Recordarme) ──────────────────────────────────
  const applyPersistence = async () => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    } catch {
      // Si falla (p.ej. plataforma nativa sin soporte), seguimos con el valor por defecto
    }
  };

  // ── Restablecer contraseña ───────────────────────────────────────────────
  const resetPassword = async () => {
    if (!email) return setError(t.enterEmailFirst);
    setError("");
    setResetSent(false);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      const msg = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/invalid-email":  "El correo no es válido.",
      };
      setError(msg[err.code] || "No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Login / Registro con email ─────────────────────────────────────────────
  const submit = async () => {
    if (!email || !password) return setError(t.fillFields);
    if (mode === "signup" && !name) return setError(t.enterName);
    if (mode === "signup" && !termsAccepted) return setError(termsLabel.required);
    setError("");
    setLoading(true);
    try {
      await applyPersistence();
      let firebaseUser;
      if (mode === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = result.user;
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = result.user;
        await updateProfile(firebaseUser, { displayName: name });
        // Guardar aceptación de términos en Firestore
        await saveTermsAcceptance(firebaseUser.uid, locale);
      }
      onLogin({
        name:      firebaseUser.displayName || name || email.split("@")[0],
        email:     firebaseUser.email,
        uid:       firebaseUser.uid,
        // isPremium NO se fija aquí: ver nota arriba.
      });
    } catch (err) {
      const msg = {
        "auth/user-not-found":       "No existe una cuenta con ese correo.",
        "auth/wrong-password":       "Contraseña incorrecta.",
        "auth/email-already-in-use": "Ese correo ya tiene una cuenta. Inicia sesión.",
        "auth/weak-password":        "La contraseña debe tener al menos 6 caracteres.",
        "auth/invalid-email":        "El correo no es válido.",
        "auth/invalid-credential":   "Correo o contraseña incorrectos.",
      };
      setError(msg[err.code] || "Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Login con Google ──────────────────────────────────────────────────────
  const googleLogin = async () => {
    if (mode === "signup" && !termsAccepted) return setError(termsLabel.required);
    setError("");
    setLoading(true);
    try {
      await applyPersistence();
      let firebaseUser;
      const { Capacitor } = await import("@capacitor/core");

      if (Capacitor.isNativePlatform()) {
        // Flujo nativo (Android/iOS): evita el popup de Google bloqueado en WebView
        const { FirebaseAuthentication } = await import("@capacitor-firebase/authentication");
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(result.credential?.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        firebaseUser = userCredential.user;
      } else {
        // Flujo web/PWA: signInWithRedirect (los popups son bloqueados por la
        // mayoría de navegadores móviles). El resultado se procesa en el
        // useEffect de arriba cuando la página vuelve a cargar.
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
          sessionStorage.setItem("mindease_google_signup", mode === "signup" ? "1" : "0");
          sessionStorage.setItem("mindease_google_locale", locale);
        } catch {}
        await signInWithRedirect(auth, provider);
        return;
      }

      if (mode === "signup") {
        await saveTermsAcceptance(firebaseUser.uid, locale);
      }
      onLogin({
        name:      firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email:     firebaseUser.email,
        uid:       firebaseUser.uid,
        // isPremium NO se fija aquí: ver nota arriba.
      });
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Cerraste la ventana de Google. Intenta de nuevo.");
      } else {
        setError("Error al iniciar con Google: " + (err.code || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", position:"relative", boxSizing:"border-box" }}>
      <BackgroundOrbs />

      {showTerms && (
        <TermsModal locale={locale} onClose={() => setShowTerms(false)} />
      )}

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:430 }}>

        {/* Language badge */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
          <LanguageBadge langInfo={langInfo} onChangeLocale={onChangeLocale} />
        </div>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:16, margin:"0 auto 14px", background:"linear-gradient(135deg,#6366f1,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🌿</div>
          <h1 className="logo-text" style={{ fontSize:26, marginBottom:6 }}>{t.appName}</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14 }}>{t.tagline}</p>
        </div>

        <div className="glass" style={{ padding:"28px clamp(16px, 5vw, 32px)" }}>
          {/* Tabs */}
          {mode !== "reset" && (
            <div style={{ display:"flex", gap:4, marginBottom:24, background:"var(--bg-secondary)", borderRadius:10, padding:4 }}>
              {[["login", t.signInBtn], ["signup", t.createAccount]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setError(""); setTermsAccepted(false); }} style={{
                  flex:1, padding:"8px", borderRadius:7, border:"none", cursor:"pointer",
                  fontFamily:"var(--font-main)", fontSize:13, fontWeight:500,
                  background: mode === m ? "var(--accent)" : "transparent",
                  color:      mode === m ? "white" : "var(--text-muted)",
                  transition:"all 0.2s",
                }}>{label}</button>
              ))}
            </div>
          )}

          {mode === "reset" ? (
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div style={{ textAlign:"center", marginBottom:4 }}>
              <h2 style={{ fontSize:18, marginBottom:6, fontFamily:"var(--font-main)" }}>{t.resetPasswordTitle}</h2>
              <p style={{ color:"var(--text-muted)", fontSize:13 }}>{t.resetPasswordDesc}</p>
            </div>

            <div>
              <label style={{ display:"block", fontSize:11, color:"var(--text-muted)", marginBottom:5, fontFamily:"var(--font-main)" }}>{t.emailLabel}</label>
              <input className="custom-input" type="email" placeholder={t.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && resetPassword()} />
            </div>

            {error && (
              <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#f87171" }}>
                {error}
              </div>
            )}

            {resetSent && (
              <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#4ade80" }}>
                {t.resetEmailSent}
              </div>
            )}

            <button className="btn btn-primary" style={{ width:"100%", marginTop:4, padding:"13px" }}
              onClick={resetPassword} disabled={loading}>
              {loading ? <Spinner size={18} /> : t.sendResetLink}
            </button>

            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setResetSent(false); }}
              style={{ background:"none", border:"none", color:"var(--accent,#6366f1)", fontSize:13, cursor:"pointer", padding:0, textDecoration:"underline", fontFamily:"inherit", textAlign:"center" }}>
              {t.backToLogin}
            </button>
          </div>
          ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {mode === "signup" && (
              <div>
                <label style={{ display:"block", fontSize:11, color:"var(--text-muted)", marginBottom:5, fontFamily:"var(--font-main)" }}>{t.nameLabel}</label>
                <input className="custom-input" placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ display:"block", fontSize:11, color:"var(--text-muted)", marginBottom:5, fontFamily:"var(--font-main)" }}>{t.emailLabel}</label>
              <input className="custom-input" type="email" placeholder={t.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, color:"var(--text-muted)", marginBottom:5, fontFamily:"var(--font-main)" }}>{t.passwordLabel}</label>
              <input className="custom-input" type="password" placeholder={t.passwordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>

            {/* Recordarme + Olvidé mi contraseña — solo en login */}
            {mode === "login" && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:-4 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-secondary)", cursor:"pointer", fontFamily:"var(--font-main)" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width:14, height:14, accentColor:"var(--accent,#6366f1)", cursor:"pointer" }}
                  />
                  {t.rememberMe}
                </label>
                <button
                  type="button"
                  onClick={() => { setMode("reset"); setError(""); setResetSent(false); }}
                  style={{ background:"none", border:"none", color:"var(--accent,#6366f1)", fontSize:12, cursor:"pointer", padding:0, textDecoration:"underline", fontFamily:"inherit" }}>
                  {t.forgotPassword}
                </button>
              </div>
            )}

            {/* Checkbox T&C — solo en registro */}
            {mode === "signup" && (
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px", background:"var(--bg-secondary)", borderRadius:10, border: `1px solid ${termsAccepted ? "var(--accent)" : "var(--border)"}`, transition:"border-color .2s" }}>
                <input
                  type="checkbox"
                  id="terms-check"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  style={{ width:16, height:16, marginTop:2, accentColor:"var(--accent,#6366f1)", flexShrink:0, cursor:"pointer" }}
                />
                <label htmlFor="terms-check" style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.5, cursor:"pointer" }}>
                  {termsLabel.text}{" "}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                    style={{ background:"none", border:"none", color:"var(--accent,#6366f1)", fontSize:12, cursor:"pointer", padding:0, textDecoration:"underline", fontFamily:"inherit" }}>
                    {termsLabel.link}
                  </button>
                </label>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#f87171" }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary" style={{ width:"100%", marginTop:4, padding:"13px" }}
              onClick={submit} disabled={loading || (mode === "signup" && !termsAccepted)}>
              {loading ? <Spinner size={18} /> : (mode === "login" ? t.signInBtn : t.createAccount)}
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, height:1, background:"var(--border)" }} />
              <span style={{ fontSize:12, color:"var(--text-muted)" }}>{t.orDivider}</span>
              <div style={{ flex:1, height:1, background:"var(--border)" }} />
            </div>

            <button className="btn btn-ghost" style={{ width:"100%" }}
              onClick={googleLogin} disabled={loading || (mode === "signup" && !termsAccepted)}>
              {loading ? <Spinner size={18} /> : <>{`🔵 ${t.googleBtn}`}</>}
            </button>
          </div>
          )}
        </div>

        <p style={{ textAlign:"center", fontSize:11, color:"var(--text-muted)", marginTop:18, lineHeight:1.6 }}>
          {t.authDisclaimer}
        </p>
      </div>

      <style>{`
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:10px;font-family:var(--font-main);font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;border:none;outline:none;white-space:nowrap}
        .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:white;box-shadow:0 4px 16px rgba(99,102,241,.3)}
        .btn-primary:hover{transform:translateY(-2px)}
        .btn-ghost{background:var(--bg-card);color:var(--text-secondary);border:1px solid var(--border)}
        .btn-ghost:hover{background:var(--bg-card-hover);color:var(--text-primary)}
        .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
        .custom-input{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary);font-size:14px;font-family:var(--font-main);outline:none;box-sizing:border-box;transition:border-color .2s}
        .custom-input:focus{border-color:var(--accent)}
        @media(max-width:400px){.glass{border-radius:16px!important}}
      `}</style>
    </div>
  );
}
