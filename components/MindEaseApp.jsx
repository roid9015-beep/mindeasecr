"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getTranslation } from "@/lib/i18n";
import { detectRegion } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";

// Layout
import Sidebar   from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

// UI
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";
import PremiumModal   from "@/components/ui/PremiumModal";
import LanguageBadge  from "@/components/ui/LanguageBadge";

// Pages
import LandingPage       from "@/components/features/LandingPage";
import AuthPage          from "@/components/features/AuthPage";
import Dashboard         from "@/components/features/Dashboard";
import AIChat            from "@/components/features/AIChat";
import Relief            from "@/components/features/Relief";
import Insights          from "@/components/features/Insights";
import Settings          from "@/components/features/Settings";
import TermsModal        from "@/components/ui/TermsModal";

export default function MindEaseApp() {
  const {
    user, setUser, clearUser, upgradeToPremium,
    locale, voiceKey, langInfo, countryInfo, setRegion,
    voiceEnabled, setVoiceEnabled,
    messages, setMessages,
    page, setPage,
    screen, setScreen,
    pushEnabled, setPushEnabled,
    reminderEnabled, setReminderEnabled,
    sessionLog, startSession,
  } = useAppStore();

  const [showPremium, setShowPremium] = useState(false);
  const [showTerms,   setShowTerms]   = useState(false);
  const [detecting,   setDetecting]   = useState(true);

  // ── Detectar región automáticamente ─────────────────────────────────────────
  useEffect(() => {
    if (langInfo) { setDetecting(false); return; }
    detectRegion().then((result) => {
      setRegion({
        locale:      result.locale,
        voiceKey:    result.voiceKey,
        langInfo:    { flag: result.flag, country: result.country, locale: result.locale },
        countryInfo: result,
      });
      setDetecting(false);
    });
  }, []); // eslint-disable-line

  // ── Escuchar estado real de Firebase Auth ────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name:      firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
          email:     firebaseUser.email,
          uid:       firebaseUser.uid,
          isPremium: user?.isPremium || false,
        });
        if (screen === "landing" || screen === "auth") {
          setScreen("app");
          setPage("dashboard");
        }
      } else {
        // No hay sesión activa — mostrar landing
        if (screen === "app") {
          clearUser();
          setScreen("landing");
        }
      }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line

  const t = getTranslation(locale);

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen("app");
    setPage("dashboard");
  };

  const handleLogout = () => {
    clearUser();
    setScreen("landing");
    setPage("dashboard");
  };

  const handleUpgrade = () => {
    upgradeToPremium();
    setShowPremium(false);
  };

  const handleChangeLocale = (newLocale, newVoice, info) => {
    setRegion({
      locale:      newLocale,
      voiceKey:    newVoice,
      langInfo:    { flag: info.flag, country: info.country, locale: newLocale },
      countryInfo: info,
    });
  };

  // ── Loading splash ────────────────────────────────────────────────────────────
  if (detecting) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"var(--bg-primary)" }}>
        <div style={{ fontSize:52 }}>🌿</div>
        <div className="spinner" style={{ width:28, height:28 }} />
        <p style={{ color:"var(--text-muted)", fontSize:13 }}>Cargando MindEase…</p>
      </div>
    );
  }

  // ── Landing ───────────────────────────────────────────────────────────────────
  if (screen === "landing") {
    return (
      <>
        <LandingPage
          t={t} locale={locale} langInfo={langInfo}
          onChangeLocale={handleChangeLocale}
          onGetStarted={() => setScreen("auth")}
          onShowTerms={() => setShowTerms(true)}
        />
        {showTerms && <TermsModal locale={locale} onClose={() => setShowTerms(false)} />}
      </>
    );
  }

  // ── Auth ──────────────────────────────────────────────────────────────────────
  if (screen === "auth") {
    return (
      <AuthPage
        t={t} langInfo={langInfo}
        onChangeLocale={handleChangeLocale}
        onLogin={handleLogin}
      />
    );
  }

  // ── App principal ─────────────────────────────────────────────────────────────
  const renderPage = () => {
    const common = { t, locale, voiceKey, voiceEnabled };
    switch (page) {
      case "dashboard":
        return <Dashboard {...common} user={user} onNavigate={setPage} messages={messages} />;
      case "chat":
        return (
          <AIChat
            {...common} countryInfo={countryInfo} user={user}
            messages={messages} setMessages={setMessages}
            sessionLog={sessionLog} startSession={startSession}
            onUpgrade={() => setShowPremium(true)}
          />
        );
      case "relief":
      case "breathing": // backward-compat redirect
      case "grounding": // backward-compat redirect
        return <Relief {...common} />;
      case "insights":
        return <Insights t={t} />;
      case "settings":
        return (
          <Settings
            t={t} user={user}
            onLogout={handleLogout}
            onUpgrade={() => setShowPremium(true)}
            onShowTerms={() => setShowTerms(true)}
            voiceEnabled={voiceEnabled}   setVoiceEnabled={setVoiceEnabled}
            voiceKey={voiceKey}
            pushEnabled={pushEnabled}     setPushEnabled={setPushEnabled}
            reminderEnabled={reminderEnabled} setReminderEnabled={setReminderEnabled}
            langInfo={langInfo}           onChangeLocale={handleChangeLocale}
          />
        );
      default:
        return <Dashboard {...common} user={user} onNavigate={setPage} messages={messages} />;
    }
  };

  return (
    <>
      <BackgroundOrbs />

      {showPremium && (
        <PremiumModal t={t} locale={locale}
          onClose={() => setShowPremium(false)}
          onUpgrade={handleUpgrade}
        />
      )}

      {showTerms && <TermsModal locale={locale} onClose={() => setShowTerms(false)} />}

      <div style={{ minHeight:"100vh", display:"flex", position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto" }}>
        <Sidebar
          t={t} user={user} page={page} setPage={setPage}
          voiceEnabled={voiceEnabled} voiceKey={voiceKey}
          langInfo={langInfo} onChangeLocale={handleChangeLocale}
          onShowPremium={() => setShowPremium(true)}
        />

        <main style={{ flex:1, padding:"0 18px 110px", overflowX:"hidden", minHeight:"100vh" }}>
          <div style={{ maxWidth:660, margin:"0 auto", paddingTop:22 }}>

            {/* Header móvil */}
            <div className="mobile-only" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, paddingBottom:14, borderBottom:"1px solid var(--border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:20 }}>🌿</span>
                <span className="logo-text" style={{ fontSize:17 }}>MindEase AI</span>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <LanguageBadge langInfo={langInfo} onChangeLocale={handleChangeLocale} />
                {!user?.isPremium && (
                  <button className="btn btn-primary" style={{ padding:"5px 12px", fontSize:11 }}
                    onClick={() => setShowPremium(true)}>
                    ⭐ $5/mo
                  </button>
                )}
              </div>
            </div>

            {renderPage()}
          </div>
        </main>
      </div>

      <BottomNav t={t} page={page} setPage={setPage} />

      <style>{`
        @media(max-width:768px){.desktop-only{display:none!important}.mobile-only{display:flex!important}}
        @media(min-width:769px){.mobile-only{display:none!important}.mobile-nav{display:none!important}}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:10px;font-family:var(--font-main);font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;border:none;outline:none;white-space:nowrap}
        .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:white;box-shadow:0 4px 16px rgba(99,102,241,.3)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,102,241,.45)}
        .btn-ghost{background:var(--bg-card);color:var(--text-secondary);border:1px solid var(--border)}
        .btn-ghost:hover{background:var(--bg-card-hover);color:var(--text-primary);border-color:var(--border-hover)}
        .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
        .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
      `}</style>
    </>
  );
}
