"use client";
import { useState } from "react";
import { getGreeting } from "@/lib/utils";

export default function Dashboard({ t, locale, user, onNavigate, messages }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSaved, setMoodSaved]       = useState(false);

  const greeting = getGreeting(locale);

  const stats = [
    { label: t.conversations,  value: Math.max(0, messages.filter((m) => m.role === "user").length), icon: "💬", color: "#6366f1" },
    { label: t.daysActive,     value: 7,   icon: "🗓️", color: "#8b5cf6" },
    { label: t.moodScore,      value: selectedMood ? `${selectedMood.value}/10` : "—", icon: "💙", color: "#06b6d4" },
    { label: t.reliefSessions, value: 3,   icon: "🌿", color: "#10b981" },
  ];

  const quickTools = [
    { icon: "🫁", label: t.breatheLabel,  desc: t.breatheDesc,  page: "breathing" },
    { icon: "🎯", label: t.groundLabel,   desc: t.groundDesc,   page: "grounding" },
    { icon: "💬", label: t.talkLabel,     desc: t.talkDesc,     page: "chat" },
    { icon: "📊", label: t.insightsLabel, desc: t.insightsDesc, page: "insights" },
  ];

  return (
    <div style={{ padding: "24px 0", animation: "fadeUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>{greeting} 🌿</p>
        <h1 style={{ fontFamily: "var(--font-main)", fontSize: 26, fontWeight: 700 }}>
          {t.hello}, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>{t.howFeeling}</p>
      </div>

      {/* Mood check-in */}
      {!moodSaved ? (
        <div className="glass" style={{ padding: 22, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{t.dailyCheckin}</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {t.moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  padding: "10px 14px", borderRadius: 12, border: "1px solid",
                  borderColor: selectedMood?.label === mood.label ? mood.color : "var(--border)",
                  background: selectedMood?.label === mood.label ? `${mood.color}22` : "transparent",
                  cursor: "pointer", transition: "all 0.2s", flex: "1 0 60px",
                }}
              >
                <span style={{ fontSize: 22 }}>{mood.emoji}</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-main)", textAlign: "center" }}>{mood.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 14, width: "100%" }}
              onClick={() => setMoodSaved(true)}
            >
              {t.saveMood}
            </button>
          )}
        </div>
      ) : (
        <div className="glass" style={{ padding: 22, marginBottom: 20, textAlign: "center", borderColor: "rgba(16,185,129,0.3)" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{selectedMood.emoji}</div>
          <h3 style={{ fontFamily: "var(--font-main)", fontWeight: 600, marginBottom: 4 }}>{t.moodSaved}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {t.moodSavedDesc} <strong>{selectedMood.label.toLowerCase()}</strong>{t.moodToday}
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
        {stats.map((s) => (
          <div key={s.label} className="glass" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 5, fontFamily: "var(--font-main)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                <p style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick tools */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{t.quickRelief}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {quickTools.map((tool) => (
            <button
              key={tool.label}
              className="glass tool-card"
              onClick={() => onNavigate(tool.page)}
              style={{ padding: 18, textAlign: "left", border: "1px solid var(--border)", background: "var(--bg-card)" }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{tool.icon}</div>
              <div style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 600 }}>{tool.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{tool.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      <div className="highlight-box">
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}>{t.affirmation}</p>
      </div>
    </div>
  );
}
