"use client";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";
import LanguageBadge  from "@/components/ui/LanguageBadge";
import { DIFFERENTIATORS, PREMIUM_PRICE } from "@/lib/constants";

export default function LandingPage({ t, locale, langInfo, onChangeLocale, onGetStarted }) {
  const getDiff = (d) => ({
    title: locale==="es" ? d.es : locale==="pt" ? d.pt : d.en,
    desc:  locale==="es" ? d.descEs : locale==="pt" ? d.descPt : d.descEn,
  });

  return (
    <div style={{ minHeight:"100vh", position:"relative" }}>
      <BackgroundOrbs />
      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── Header ── */}
        <header style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 32px", borderBottom:"1px solid var(--border)",
          background:"rgba(10,11,18,0.85)", backdropFilter:"blur(20px)",
          position:"sticky", top:0, zIndex:50, flexWrap:"wrap", gap:12,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div>
            <span className="logo-text" style={{ fontSize:20 }}>{t.appName}</span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <LanguageBadge langInfo={langInfo} onChangeLocale={onChangeLocale} />
            <button className="btn btn-ghost" style={{ padding:"8px 18px" }} onClick={onGetStarted}>{t.signIn}</button>
            <button className="btn btn-primary" style={{ padding:"8px 18px" }} onClick={onGetStarted}>{t.startFree} →</button>
          </div>
        </header>

        {/* ── Hero ── */}
        <section style={{ textAlign:"center", padding:"100px 24px 80px", maxWidth:800, margin:"0 auto" }}>
          {langInfo && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 14px", background:"rgba(6,182,212,0.1)", border:"1px solid rgba(6,182,212,0.25)", borderRadius:20, marginBottom:20, fontSize:12, color:"var(--accent-3)" }}>
              {langInfo.flag} {t.detectedLang}: {langInfo.country || langInfo.locale?.toUpperCase()}
            </div>
          )}
          <h1 style={{ fontFamily:"var(--font-main)", fontSize:"clamp(36px,7vw,68px)", fontWeight:700, lineHeight:1.1, marginBottom:24 }}>
            {t.heroTitle}<br /><span className="grad-text">{t.heroTitleGrad}</span>
          </h1>
          <p style={{ fontSize:"clamp(16px,2.5vw,20px)", color:"var(--text-secondary)", lineHeight:1.7, maxWidth:580, margin:"0 auto 40px" }}>
            {t.heroDesc}
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn btn-primary" style={{ fontSize:16, padding:"14px 32px" }} onClick={onGetStarted}>{t.startFree}</button>
            <button className="btn btn-ghost"   style={{ fontSize:16, padding:"14px 32px" }} onClick={onGetStarted}>{t.seeHow}</button>
          </div>
          <div style={{ display:"flex", gap:28, justifyContent:"center", marginTop:48, flexWrap:"wrap" }}>
            {[["10k+", t.usersSupported], ["4.9★", t.userRating], [t.free, t.freeToStart]].map(([v,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-main)", fontSize:24, fontWeight:700 }}>{v}</div>
                <div style={{ fontSize:13, color:"var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why not ChatGPT — the differentiator section ── */}
        <section style={{ padding:"60px 24px", maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ display:"inline-block", padding:"5px 16px", background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:20, fontSize:12, color:"var(--accent)", fontFamily:"var(--font-main)", fontWeight:600, marginBottom:14 }}>
              {locale==="es" ? "¿Por qué no simplemente ChatGPT?" : locale==="pt" ? "Por que não o ChatGPT?" : "Why not just use ChatGPT?"}
            </div>
            <h2 style={{ fontFamily:"var(--font-main)", fontSize:"clamp(24px,4vw,38px)", fontWeight:700, marginBottom:12 }}>
              {locale==="es" ? "MindEase es diferente por diseño"
                : locale==="pt" ? "MindEase é diferente por design"
                : "MindEase is different by design"}
            </h2>
            <p style={{ color:"var(--text-secondary)", fontSize:16, maxWidth:520, margin:"0 auto" }}>
              {locale==="es" ? "ChatGPT es una herramienta. MindEase es una experiencia construida para tu bienestar emocional."
                : locale==="pt" ? "ChatGPT é uma ferramenta. MindEase é uma experiência construída para o seu bem-estar emocional."
                : "ChatGPT is a tool. MindEase is an experience built for your emotional wellbeing."}
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18 }}>
            {DIFFERENTIATORS.map((d, i) => {
              const { title, desc } = getDiff(d);
              return (
                <div key={i} className="glass" style={{ padding:26, borderTop:`2px solid ${["#6366f1","#8b5cf6","#06b6d4","#10b981"][i]}` }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>{d.icon}</div>
                  <h3 style={{ fontFamily:"var(--font-main)", fontSize:16, fontWeight:600, marginBottom:8 }}>{title}</h3>
                  <p style={{ color:"var(--text-secondary)", fontSize:13, lineHeight:1.6 }}>{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding:"60px 24px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-main)", fontSize:"clamp(26px,5vw,42px)", fontWeight:700, marginBottom:12 }}>
              {t.featuresTitle} <span className="grad-text">{t.featuresBold}</span>
            </h2>
            <p style={{ color:"var(--text-secondary)", fontSize:17 }}>{t.featuresDesc}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
            {t.features.map((f,i) => (
              <div key={i} className="glass" style={{ padding:26, cursor:"default", transition:"all .25s" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,.4)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
                <div style={{ fontSize:34, marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontFamily:"var(--font-main)", fontSize:17, fontWeight:600, marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:"var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ padding:"60px 24px", maxWidth:1000, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"var(--font-main)", fontSize:34, fontWeight:700, textAlign:"center", marginBottom:40 }}>{t.testimonialsTitle}</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18 }}>
            {t.testimonials.map((tst,i) => (
              <div key={i} className="glass" style={{ padding:26 }}>
                <div style={{ fontSize:34, marginBottom:14 }}>{tst.avatar}</div>
                <p style={{ color:"var(--text-secondary)", fontSize:14, lineHeight:1.7, marginBottom:18, fontStyle:"italic" }}>"{tst.text}"</p>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{tst.name}</div>
                  <div style={{ fontSize:12, color:"var(--text-muted)" }}>{tst.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section style={{ padding:"60px 24px", maxWidth:760, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"var(--font-main)", fontSize:34, fontWeight:700, textAlign:"center", marginBottom:10 }}>{t.pricingTitle}</h2>
          <p style={{ color:"var(--text-secondary)", textAlign:"center", marginBottom:40, fontSize:16 }}>{t.pricingDesc}</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {t.plans.map((plan) => (
              <div key={plan.name} className="glass" style={{ padding:30, position:"relative",
                border: plan.highlight ? "1px solid rgba(99,102,241,0.4)" : undefined,
                background: plan.highlight ? "rgba(99,102,241,0.07)" : undefined }}>
                {plan.highlight && (
                  <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"var(--accent)", color:"white", padding:"3px 14px", borderRadius:20, fontSize:11, fontFamily:"var(--font-main)", fontWeight:600, whiteSpace:"nowrap" }}>
                    {t.mostPopular}
                  </div>
                )}
                <div style={{ fontFamily:"var(--font-main)", fontSize:18, fontWeight:600, marginBottom:8 }}>{plan.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:22 }}>
                  <span style={{ fontFamily:"var(--font-main)", fontSize:40, fontWeight:700, color: plan.highlight ? "var(--accent)" : "var(--text-muted)" }}>
                    {plan.highlight ? `$${PREMIUM_PRICE}` : plan.price}
                  </span>
                  <span style={{ color:"var(--text-muted)", fontSize:14 }}>{plan.period}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
                  {(plan.highlight ? t.planFeatures.premium : t.planFeatures.free).map((f) => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--text-secondary)" }}>
                      <span style={{ color:"var(--success)" }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button className={plan.highlight ? "btn btn-primary" : "btn btn-ghost"} style={{ width:"100%" }} onClick={onGetStarted}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding:"80px 24px", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-main)", fontSize:"clamp(26px,5vw,42px)", fontWeight:700, marginBottom:14 }}>{t.ctaTitle}</h2>
          <p style={{ color:"var(--text-secondary)", fontSize:17, marginBottom:28 }}>{t.ctaDesc}</p>
          <button className="btn btn-primary" style={{ fontSize:16, padding:"14px 36px" }} onClick={onGetStarted}>{t.beginFree}</button>
        </section>

        {/* ── Footer ── */}
        <footer style={{ padding:"32px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
          <span className="logo-text" style={{ fontSize:16 }}>🌿 {t.appName}</span>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {[t.privacyPolicy, t.termsOfService, t.medDisclaimer].map((l) => (
              <span key={l} style={{ fontSize:13, color:"var(--text-muted)", cursor:"pointer" }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize:13, color:"var(--text-muted)" }}>© 2025 MindEase AI</div>
        </footer>
      </div>

      <style>{`
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:10px;font-family:var(--font-main);font-size:14px;font-weight:500;cursor:pointer;transition:all .2s;border:none;outline:none;white-space:nowrap}
        .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:white;box-shadow:0 4px 16px rgba(99,102,241,.3)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,102,241,.45)}
        .btn-ghost{background:var(--bg-card);color:var(--text-secondary);border:1px solid var(--border)}
        .btn-ghost:hover{background:var(--bg-card-hover);color:var(--text-primary);border-color:var(--border-hover)}
        .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
      `}</style>
    </div>
  );
}
