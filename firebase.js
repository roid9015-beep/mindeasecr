"use client";

export default function Insights({ t }) {
  const moodData = [4, 5, 3, 6, 7, 6, 8].map((score, i) => ({
    day: t.moodDays[i],
    score,
  }));

  const patterns = [
    { label: t.emotionLabels[0], pct: 35, color: "#8b5cf6" },
    { label: t.emotionLabels[1], pct: 28, color: "#6366f1" },
    { label: t.emotionLabels[2], pct: 22, color: "#06b6d4" },
    { label: t.emotionLabels[3], pct: 15, color: "#10b981" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.4s ease", padding: "24px 0" }}>
      <h2 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        📊 {t.insightsTitle}
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 22, fontSize: 13 }}>{t.insightsSubtitle}</p>

      {/* Mood chart */}
      <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
        <h3 style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
          {t.moodTrend}
        </h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
          {moodData.map((d) => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: "100%", borderRadius: 5,
                  height: `${(d.score / 10) * 100}px`,
                  background: "linear-gradient(to top, var(--accent), var(--accent-3))",
                  opacity: 0.5 + d.score / 20,
                  minHeight: 6, transition: "height 1s ease",
                }}
              />
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-main)" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion patterns */}
      <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
        <h3 style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
          {t.emotionalPatterns}
        </h3>
        {patterns.map((e) => (
          <div key={e.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{e.label}</span>
              <span style={{ fontSize: 13, color: e.color, fontFamily: "var(--font-main)", fontWeight: 600 }}>{e.pct}%</span>
            </div>
            <div style={{ height: 7, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${e.pct}%`, borderRadius: 4, background: e.color, transition: "width 1.2s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* AI observations */}
      <div className="glass" style={{ padding: 22 }}>
        <h3 style={{ fontFamily: "var(--font-main)", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
          {t.mindEaseObs}
        </h3>
        {t.insightItems.map((ins, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 10, padding: "11px 14px", background: "var(--bg-secondary)", borderRadius: 11, marginBottom: 8 }}
          >
            <span style={{ fontSize: 18 }}>{t.insightIcons[i]}</span>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{ins}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
