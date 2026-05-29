"use client";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Toggle from "@/components/ui/Toggle";
import LanguageBadge from "@/components/ui/LanguageBadge";
import { REGIONAL_VOICES } from "@/lib/constants";

export default function Settings({ t, user, onLogout, onUpgrade, onShowTerms,
  voiceEnabled, setVoiceEnabled, voiceKey,
  pushEnabled, setPushEnabled, reminderEnabled, setReminderEnabled,
  langInfo, onChangeLocale }) {

  const handleLogout = async () => {
    try { await signOut(auth); } catch {}
    onLogout();
  };

  const sections = [
    { title: t.account, items: [
      { icon:"👤", label: t.profileLabel, sub: user?.email },
    ]},
    { title: t.preferences, items: [
      { icon:"🔔", label: t.pushNotifications, sub: t.pushNotifSub,    toggle: pushEnabled,    onToggle: () => setPushEnabled(!pushEnabled) },
      { icon:"⏰", label: t.dailyReminder,     sub: t.dailyReminderSub, toggle: reminderEnabled, onToggle: () => setReminderEnabled(!reminderEnabled) },
      { icon:"🔊", label: t.voiceEnabled,      sub: REGIONAL_VOICES[voiceKey]?.name, toggle: voiceEnabled, onToggle: () => setVoiceEnabled(!voiceEnabled) },
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
      { icon:"📋", label: t.termsOfService,  action: onShowTerms },
      { icon:"📜", label: t.privacyPolicy,   action: () => alert(t.privacyPolicyText) },
      { icon:"⚕️", label: t.medDisclaimer,   action: () => alert(t.medDisclaimerText) },
    ]},
  ];

  return (
    <div style={{ animation:"fadeUp 0.4s ease", padding:"24px 0" }}>
      <h2 style={{ fontFamily:"var(--font-main)", fontSize:22, fontWeight:700, marginBottom:20 }}>{t.settingsTitle}</h2>

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
              <div key={i} onClick={item.action||undefined} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom: i < sec.items.length-1 ? "1px solid var(--border)" : "none", cursor: item.action?"pointer":"default", transition:"background .2s" }}
                onMouseEnter={e => item.action && (e.currentTarget.style.background="var(--bg-card-hover)")}
                onMouseLeave={e => item.action && (e.currentTarget.style.background="transparent")}>
                <span style={{ fontSize:18, width:26, textAlign:"center" }}>{item.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.sub}</div>}
                </div>
                {item.toggle !== undefined ? <Toggle on={item.toggle} onToggle={item.onToggle} />
                  : item.custom ? item.custom
                  : item.action ? <span style={{ color:"var(--text-muted)", fontSize:18 }}>›</span>
                  : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleLogout} style={{ width:"100%", marginTop:8, padding:"12px 24px", borderRadius:"var(--radius-sm)", background:"rgba(239,68,68,0.12)", color:"var(--danger)", border:"1px solid rgba(239,68,68,0.2)", fontFamily:"var(--font-main)", fontSize:14, fontWeight:500, cursor:"pointer", transition:"all .2s" }}>
        {t.signOut}
      </button>
    </div>
  );
}
