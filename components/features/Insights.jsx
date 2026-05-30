"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { loadUserProfile, loadConversation } from "@/lib/firestore";

export default function Insights({ t, locale = "es" }) {
  const [moodData,    setMoodData]    = useState([]);
  const [patterns,    setPatterns]    = useState([]);
  const [observations,setObservations]= useState([]);
  const [loading,     setLoading]     = useState(true);
  const [totalDays,   setTotalDays]   = useState(0);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setLoading(false); return; }

    Promise.all([
      loadUserProfile(uid),
      loadConversation(uid),
    ]).then(([profile, messages]) => {
      // ── 7 días de moods ─────────────────────────────────────────
      const savedMoods = profile?.moods || {};
      const days = [];
      const dayLabels = t.moodDays; // ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"]

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const dayName = dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1];
        days.push({
          day:   dayName,
          score: savedMoods[key]?.value ?? 0,
          emoji: savedMoods[key]?.emoji ?? null,
          date:  key,
        });
      }
      setMoodData(days);

      const daysWithMoods = days.filter(d => d.score > 0);
      setTotalDays(daysWithMoods.length);

      // ── Patrones emocionales desde historial de moods ────────────
      const allMoodValues = Object.values(savedMoods).map(m => m.value || 0);
      if (allMoodValues.length > 0) {
        const counts = { anxiety: 0, stress: 0, calm: 0, good: 0 };
        allMoodValues.forEach(v => {
          if (v <= 3)      counts.anxiety++;
          else if (v <= 5) counts.stress++;
          else if (v <= 7) counts.calm++;
          else             counts.good++;
        });
        const total = allMoodValues.length;
        setPatterns([
          { label: t.emotionLabels[0], pct: Math.round(counts.anxiety / total * 100), color: "#8b5cf6" },
          { label: t.emotionLabels[1], pct: Math.round(counts.stress  / total * 100), color: "#6366f1" },
          { label: t.emotionLabels[2], pct: Math.round(counts.calm    / total * 100), color: "#06b6d4" },
          { label: t.emotionLabels[3], pct: Math.round(counts.good    / total * 100), color: "#10b981" },
        ].filter(p => p.pct > 0).sort((a, b) => b.pct - a.pct));
      }

      // ── Observaciones basadas en datos reales ────────────────────
      const obs = generateObservations(days, allMoodValues, messages, locale);
      setObservations(obs);

      setLoading(false);
    });
  }, []);

  const noDataMsg = {
    es: "Aún no hay suficientes datos. Hacé tu check-in diario para ver tus patrones aquí.",
    pt: "Ainda não há dados suficientes. Faça seu check-in diário para ver seus padrões aqui.",
    en: "Not enough data yet. Do your daily check-in to see your patterns here.",
  }[locale] || "";

  return (
    <div style={{ animation: "fadeUp 0.4s ease", padding: "24px 0" }}>
      <h2 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        📊 {t.insightsTitle}
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 22, fontSize: 14 }}>{t.insightsSubtitle}</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div className="spinner" style={{ width: 24, height: 24, margin: "0 auto" }} />
        </div>
      ) : totalDays === 0 ? (
        // Sin datos aún
        <div className="glass" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📊</div>
          <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.7 }}>{noDataMsg}</p>
        </div>
      ) : (
        <>
          {/* Gráfico 7 días */}
          <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
            <h3 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 600, marginBottom: 18 }}>
              {t.moodTrend}
            </h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
              {moodData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  {d.score > 0 ? (
                    <div style={{
                      width: "100%", borderRadius: 6,
                      height: `${Math.max((d.score / 10) * 100, 8)}px`,
                      background: d.score >= 7
                        ? "linear-gradient(to top,#06b6d4,#10b981)"
                        : d.score >= 5
                        ? "linear-gradient(to top,#6366f1,#8b5cf6)"
                        : "linear-gradient(to top,#8b5cf6,#a78bfa)",
                      transition: "height 1s ease",
                    }} />
                  ) : (
                    <div style={{ width: "100%", height: 6, borderRadius: 6, background: "var(--border,rgba(255,255,255,0.08))" }} />
                  )}
                  <span style={{ fontSize: 10, color: d.score > 0 ? "#94a3b8" : "var(--border)", fontFamily: "var(--font-main)" }}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Patrones emocionales */}
          {patterns.length > 0 && (
            <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 600, marginBottom: 18 }}>
                {t.emotionalPatterns}
              </h3>
              {patterns.map((e) => (
                <div key={e.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: "#cbd5e1" }}>{e.label}</span>
                    <span style={{ fontSize: 14, color: e.color, fontFamily: "var(--font-main)", fontWeight: 700 }}>{e.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "var(--border,rgba(255,255,255,0.08))", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${e.pct}%`, borderRadius: 4, background: e.color, transition: "width 1.2s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observaciones */}
          {observations.length > 0 && (
            <div className="glass" style={{ padding: 22 }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
                {t.mindEaseObs}
              </h3>
              {observations.map((obs, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "13px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{obs.icon}</span>
                  <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>{obs.text}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Generar observaciones basadas en datos reales ─────────────────────────────
function generateObservations(days, allMoodValues, messages, locale) {
  const obs = [];
  const daysWithData = days.filter(d => d.score > 0);
  if (daysWithData.length === 0) return obs;

  const avg = allMoodValues.reduce((a, b) => a + b, 0) / allMoodValues.length;
  const weekAvg = daysWithData.reduce((a, b) => a + b.score, 0) / daysWithData.length;
  const userMessages = (messages || []).filter(m => m.role === "user").length;

  const texts = {
    es: {
      improving:    (v) => `Tu promedio emocional esta semana es ${v.toFixed(1)}/10. Cada día que registrás tu estado es un paso hacia conocerte mejor.`,
      conversations:`Llevas ${userMessages} conversación${userMessages !== 1 ? "es" : ""} con MindEase. Hablar de lo que sentís es una de las formas más poderosas de procesar.`,
      consistent:   `Registraste tu estado emocional ${daysWithData.length} día${daysWithData.length !== 1 ? "s" : ""} esta semana. La constancia es lo que construye el autoconocimiento.`,
      highDay:      (d) => `Tu mejor día fue el ${d.day} con un ${d.score}/10. ¿Recordás qué pasó ese día? Vale la pena repetirlo.`,
      lowDay:       (d) => `El ${d.day} fue un día más difícil (${d.score}/10). Los días difíciles también tienen información valiosa sobre vos.`,
    },
    pt: {
      improving:    (v) => `Sua média emocional esta semana é ${v.toFixed(1)}/10. Cada dia que você registra seu estado é um passo para se conhecer melhor.`,
      conversations:`Você tem ${userMessages} conversa${userMessages !== 1 ? "s" : ""} com o MindEase. Falar sobre o que você sente é uma das formas mais poderosas de processar.`,
      consistent:   `Você registrou seu estado emocional ${daysWithData.length} dia${daysWithData.length !== 1 ? "s" : ""} esta semana. A consistência é o que constrói o autoconhecimento.`,
      highDay:      (d) => `Seu melhor dia foi ${d.day} com ${d.score}/10. Você lembra o que aconteceu naquele dia? Vale a pena repetir.`,
      lowDay:       (d) => `${d.day} foi um dia mais difícil (${d.score}/10). Os dias difíceis também têm informações valiosas sobre você.`,
    },
    en: {
      improving:    (v) => `Your emotional average this week is ${v.toFixed(1)}/10. Every day you log your mood is a step toward knowing yourself better.`,
      conversations:`You've had ${userMessages} conversation${userMessages !== 1 ? "s" : ""} with MindEase. Talking about what you feel is one of the most powerful ways to process emotions.`,
      consistent:   `You logged your emotional state ${daysWithData.length} day${daysWithData.length !== 1 ? "s" : ""} this week. Consistency is what builds self-awareness.`,
      highDay:      (d) => `Your best day was ${d.day} with a ${d.score}/10. Do you remember what happened that day? It's worth repeating.`,
      lowDay:       (d) => `${d.day} was a harder day (${d.score}/10). Hard days also carry valuable information about yourself.`,
    },
  };
  const tx = texts[locale] || texts.es;

  obs.push({ icon: "📈", text: tx.improving(weekAvg) });
  if (userMessages > 0) obs.push({ icon: "🗣️", text: tx.conversations });
  obs.push({ icon: "💪", text: tx.consistent });

  const bestDay = daysWithData.reduce((a, b) => b.score > a.score ? b : a, daysWithData[0]);
  const worstDay = daysWithData.reduce((a, b) => b.score < a.score ? b : a, daysWithData[0]);

  if (bestDay && bestDay.score >= 7) obs.push({ icon: "🌟", text: tx.highDay(bestDay) });
  if (worstDay && worstDay.score <= 4 && daysWithData.length > 1) obs.push({ icon: "🌙", text: tx.lowDay(worstDay) });

  return obs.slice(0, 4);
}
