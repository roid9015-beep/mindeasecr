"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getLetter, saveLetter } from "@/lib/firestore";

export default function LetterModal({ locale = "es", userName, onClose, isPremium = false }) {
  const [letter,    setLetter]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [generating,setGenerating]= useState(false);

  const labels = {
    es: {
      title: "Tu carta de esta semana",
      from: "Con cariño, MindEase",
      generate: "Generar mi carta",
      generating: "Escribiendo tu carta...",
      premiumOnly: "La carta semanal es parte del plan Premium.",
      upgrade: "Quiero ser Premium",
      free: "Con el plan gratuito recibís 1 carta al mes. ¡Esta es la tuya!",
      error: "No pude generar tu carta ahora. Intenta más tarde.",
    },
    pt: {
      title: "Sua carta desta semana",
      from: "Com carinho, MindEase",
      generate: "Gerar minha carta",
      generating: "Escrevendo sua carta...",
      premiumOnly: "A carta semanal faz parte do plano Premium.",
      upgrade: "Quero ser Premium",
      free: "Com o plano gratuito você recebe 1 carta por mês. Esta é a sua!",
      error: "Não consegui gerar sua carta agora. Tente mais tarde.",
    },
    en: {
      title: "Your letter this week",
      from: "With care, MindEase",
      generate: "Generate my letter",
      generating: "Writing your letter...",
      premiumOnly: "The weekly letter is part of the Premium plan.",
      upgrade: "Go Premium",
      free: "With the free plan you get 1 letter per month. Here it is!",
      error: "Couldn't generate your letter right now. Try again later.",
    },
  }[locale] || {};

  const t = labels;

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setLoading(false); return; }
    getLetter(uid).then((saved) => {
      setLetter(saved?.text || null);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setGenerating(true);
    try {
      const token = await auth.currentUser?.getIdToken(true).catch(() => null);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Genera mi carta semanal." }],
          userName,
          locale,
          isLetter: true,
        }),
      });
      const data = await response.json();
      if (data?.reply?.trim()) {
        setLetter(data.reply.trim());
        await saveLetter(uid, data.reply.trim());
      }
    } catch {
      // silencioso
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:350, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"var(--bg-secondary,#1a1a2e)", border:"1px solid var(--border,rgba(255,255,255,0.1))", borderRadius:24, width:"100%", maxWidth:480, maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ padding:"22px 24px 16px", borderBottom:"1px solid var(--border,rgba(255,255,255,0.08))", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:24 }}>💌</span>
            <span style={{ fontFamily:"var(--font-main,'Sora',sans-serif)", fontWeight:700, fontSize:16 }}>{t.title}</span>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", border:"none", background:"var(--bg-card,rgba(255,255,255,0.05))", color:"var(--text-muted,#64748b)", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        {/* Contenido */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div className="spinner" style={{ width:24, height:24, margin:"0 auto" }} />
            </div>

          ) : letter ? (
            // Carta generada
            <div>
              <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))", border:"1px solid rgba(99,102,241,0.2)", borderRadius:16, padding:"22px 24px", marginBottom:16 }}>
                <p style={{ fontSize:14.5, color:"var(--text-primary,#f0f1fa)", lineHeight:1.85, whiteSpace:"pre-line" }}>
                  {letter}
                </p>
              </div>
              <p style={{ fontSize:12, color:"var(--accent,#6366f1)", fontStyle:"italic", textAlign:"right" }}>— {t.from}</p>
            </div>

          ) : !isPremium ? (
            // Usuario free — puede generar 1 carta mensual
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>💌</div>
              <p style={{ fontSize:14, color:"var(--text-secondary,#94a3b8)", lineHeight:1.7, marginBottom:24 }}>
                {t.free}
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn btn-primary"
                style={{ padding:"12px 28px" }}>
                {generating ? t.generating : t.generate}
              </button>
            </div>

          ) : (
            // Usuario premium — generar carta
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>💌</div>
              <p style={{ fontSize:14, color:"var(--text-secondary,#94a3b8)", lineHeight:1.7, marginBottom:24 }}>
                {locale === "es" ? "Cada semana MindEase te escribe una carta pensada solo para vos, basada en todo lo que compartiste." : locale === "pt" ? "Cada semana o MindEase te escreve uma carta pensada só para você." : "Each week MindEase writes you a personal letter based on everything you've shared."}
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn btn-primary"
                style={{ padding:"12px 28px" }}>
                {generating ? t.generating : t.generate}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
