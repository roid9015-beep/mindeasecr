"use client";
import { useState, useEffect } from "react";
import { getGreeting } from "@/lib/utils";
import { getStats, saveMood } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import Garden   from "@/components/ui/Garden";
import LetterModal from "@/components/ui/LetterModal";

export default function Dashboard({ t, locale, user, onNavigate }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSaved,    setMoodSaved]    = useState(false);
  const [stats,        setStats]        = useState({ totalMessages: 0, daysActive: 0, streak: 0, lastMood: null });
  const [showLetter,   setShowLetter]   = useState(false);
  const [letterReady,  setLetterReady]  = useState(false);

  const greeting = getGreeting(locale);

  // Cargar stats reales de Firestore
  useEffect(() => {
    const uid = auth.currentUser?.uid || user?.uid;
    if (!uid) return;
    getStats(uid).then((s) => {
      setStats(s);
      if (s.lastMood) {
        setSelectedMood(s.lastMood);
        setMoodSaved(true);
      }
    });
  }, [user?.uid]);

  // Guardar mood en Firestore
  const handleSaveMood = async () => {
    const uid = auth.currentUser?.uid || user?.uid;
    if (uid && selectedMood) await saveMood(uid, selectedMood);
    setMoodSaved(true);
    setStats(prev => ({ ...prev, lastMood: selectedMood }));
  };

  const streak = stats.streak || 0;
  const streakMsg = {
    es: streak === 0 ? null : streak === 1 ? "¡Empezaste tu racha! 🔥" : streak < 7 ? `${streak} días seguidos cuidándote 🔥` : `${streak} días. Eso es dedicación real. 🔥`,
    pt: streak === 0 ? null : streak === 1 ? "Você começou sua sequência! 🔥" : streak < 7 ? `${streak} dias seguidos se cuidando 🔥` : `${streak} dias. Isso é dedicação real. 🔥`,
    en:  streak === 0 ? null : streak === 1 ? "You started your streak! 🔥" : streak < 7 ? `${streak} days in a row caring for yourself 🔥` : `${streak} days. That's real dedication. 🔥`,
  }[locale] || null;

  const statCards = [
    { label: t.conversations,  value: stats.totalMessages || 0, icon: "💬", color: "#6366f1" },
    { label: t.daysActive,     value: stats.daysActive    || 0, icon: "🗓️", color: "#8b5cf6" },
    { label: t.moodScore,      value: stats.lastMood ? `${stats.lastMood.value}/10` : "—", icon: "💙", color: "#06b6d4" },
    { label: t.reliefSessions, value: stats.daysActive > 0 ? Math.min(stats.daysActive, 99) : 0, icon: "🌿", color: "#10b981" },
  ];

  const quickTools = [
    { icon: "🫁", label: t.breatheLabel,  desc: t.breatheDesc,  page: "relief" },
    { icon: "🎯", label: t.groundLabel,   desc: t.groundDesc,   page: "relief" },
    { icon: "💬", label: t.talkLabel,     desc: t.talkDesc,     page: "chat" },
    { icon: "📊", label: t.insightsLabel, desc: t.insightsDesc, page: "insights" },
  ];

  const letterLabel = {
    es: { cta: "💌 Mi carta de esta semana", sub: "Algo especial para vos" },
    pt: { cta: "💌 Minha carta desta semana", sub: "Algo especial para você" },
    en: { cta: "💌 My letter this week",    sub: "Something special for you" },
  }[locale] || { cta: "💌 My letter", sub: "" };

  return (
    <div style={{ padding: "24px 0", animation: "fadeUp 0.4s ease" }}>

      {showLetter && (
        <LetterModal
          locale={locale}
          userName={user?.name?.split(" ")[0]}
          isPremium={user?.isPremium}
          onClose={() => setShowLetter(false)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 3 }}>{greeting} 🌿</p>
        <h1 style={{ fontFamily: "var(--font-main)", fontSize: 26, fontWeight: 700 }}>
          {t.hello}, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 14 }}>{t.howFeeling}</p>
      </div>

      {/* SOS — Alivio inmediato */}
      <button
        onClick={() => onNavigate("relief")}
        style={{
          width: "100%", marginBottom: 18,
          padding: "18px 24px",
          borderRadius: 18,
          border: "none",
          background: "linear-gradient(135deg, #7f1d1d, #9f1239)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
          boxShadow: "0 6px 28px rgba(159,18,57,0.35)",
          transition: "all .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(159,18,57,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(159,18,57,0.35)"; }}
      >
        <span style={{ fontSize: 28 }}>❓</span>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontFamily: "var(--font-main)", fontWeight: 800, fontSize: 18, color: "white", letterSpacing: "-0.3px" }}>
            ¿Necesitás alivio ahora?
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
            Respiración guiada · Ejercicio de anclaje
          </p>
        </div>
        <span style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", marginLeft: "auto" }}>›</span>
      </button>

      {/* Qué es MindEase */}
      <div style={{
        background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(16,185,129,0.06))",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 16, padding: "16px 20px", marginBottom: 18,
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        <span style={{ fontSize: 32, flexShrink: 0 }}>🌿</span>
        <div>
          <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 5 }}>
            Tu espacio para respirar
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
            MindEase es un compañero de bienestar mental. Podés hablar de lo que sentís, hacer ejercicios para calmarte en momentos difíciles, y ver cómo evolucionás con el tiempo. Sin juicios, sin diagnósticos — solo apoyo cuando lo necesitás.
          </p>
        </div>
      </div>

      {/* Racha — si existe */}
      {streakMsg && (
        <div style={{ background: "linear-gradient(135deg,rgba(251,146,60,0.12),rgba(249,115,22,0.08))", border: "1px solid rgba(251,146,60,0.25)", borderRadius: 14, padding: "13px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <span style={{ fontSize: 15, color: "#fb923c", fontWeight: 600 }}>{streakMsg}</span>
        </div>
      )}

      {/* Mood check-in */}
      {!moodSaved ? (
        <div className="glass" style={{ padding: 20, marginBottom: 18 }}>
          <h3 style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t.dailyCheckin}</h3>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {t.moods.map((mood) => (
              <button key={mood.label} onClick={() => setSelectedMood(mood)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "11px 10px", borderRadius: 14, border: "2px solid",
                borderColor: selectedMood?.label === mood.label ? mood.color : "var(--border)",
                background: selectedMood?.label === mood.label ? `${mood.color}22` : "transparent",
                cursor: "pointer", transition: "all 0.2s", flex: "1 0 52px",
              }}>
                <span style={{ fontSize: 26 }}>{mood.emoji}</span>
                <span style={{ fontSize: 11, color: selectedMood?.label === mood.label ? "#f0f1fa" : "#94a3b8", fontFamily: "var(--font-main)", textAlign: "center", fontWeight: selectedMood?.label === mood.label ? 600 : 500 }}>{mood.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <button className="btn btn-primary" style={{ marginTop: 12, width: "100%", padding: "11px" }} onClick={handleSaveMood}>
              {t.saveMood}
            </button>
          )}
        </div>
      ) : (
        <div className="glass" style={{ padding: 18, marginBottom: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>{selectedMood?.emoji || stats.lastMood?.emoji}</span>
          <div>
            <p style={{ fontFamily: "var(--font-main)", fontWeight: 600, fontSize: 14 }}>{t.moodSaved}</p>
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
              {t.moodSavedDesc} <strong>{(selectedMood?.label || stats.lastMood?.label || "").toLowerCase()}</strong>{t.moodToday}
            </p>
          </div>
        </div>
      )}

      {/* Jardín interior */}
      <Garden daysActive={stats.daysActive} locale={locale} />
      <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: -8, marginBottom: 18, lineHeight: 1.6, fontStyle: "italic" }}>
        🌱 Tu planta refleja tu constancia. Cada día que usás MindEase — hablás, respirás o registrás tu estado — ella crece. Cuidarla es cuidarte.
      </p>

      {/* Carta semanal — CTA */}
      <button
        onClick={() => setShowLetter(true)}
        style={{
          width: "100%", marginBottom: 18, padding: "16px 20px",
          borderRadius: 16, border: "1px solid rgba(99,102,241,0.3)",
          background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "all .2s", textAlign: "left",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.14))"}
        onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))"}
      >
        <div>
          <p style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontWeight: 700, fontSize: 14, color: "var(--text-primary,#f0f1fa)", marginBottom: 3 }}>
            {letterLabel.cta}
          </p>
          <p style={{ fontSize: 11, color: "var(--accent,#6366f1)" }}>{letterLabel.sub}</p>
        </div>
        <span style={{ fontSize: 20, color: "var(--accent,#6366f1)" }}>›</span>
      </button>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
        {statCards.map((s) => (
          <div key={s.label} className="glass" style={{ padding: "18px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-main)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-main)", fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick tools */}
      <h3 style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{t.quickRelief}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
        {quickTools.map((tool) => (
          <button key={tool.label} className="glass" onClick={() => onNavigate(tool.page)}
            style={{ padding: 16, textAlign: "left", border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", borderRadius: 14, transition: "all .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--bg-card)"}>
            <div style={{ fontSize: 24, marginBottom: 7 }}>{tool.icon}</div>
            <div style={{ fontFamily: "var(--font-main)", fontSize: 13, fontWeight: 600 }}>{tool.label}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{tool.desc}</div>
          </button>
        ))}
      </div>

      {/* Afirmación */}
      <div className="highlight-box">
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}>{t.affirmation}</p>
      </div>

    </div>
  );
}
