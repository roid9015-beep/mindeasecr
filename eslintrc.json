"use client";
import { NAV_ICONS } from "@/lib/constants";
import { REGIONAL_VOICES } from "@/lib/constants";
import LanguageBadge from "@/components/ui/LanguageBadge";

export default function Sidebar({ t, user, page, setPage, voiceEnabled, voiceKey, langInfo, onChangeLocale, onShowPremium }) {
  const navItems = [
    { id: "dashboard",  icon: NAV_ICONS.dashboard,  label: t.homeLabel },
    { id: "chat",       icon: NAV_ICONS.chat,        label: t.talkLabel },
    { id: "breathing",  icon: NAV_ICONS.breathing,   label: t.breatheLabel },
    { id: "grounding",  icon: NAV_ICONS.grounding,   label: t.groundLabel },
    { id: "insights",   icon: NAV_ICONS.insights,    label: t.insightsLabel },
    { id: "settings",   icon: NAV_ICONS.settings,    label: t.settingsLabel },
  ];

  return (
    <aside
      className="desktop-only"
      style={{
        width: 230, flexShrink: 0, padding: "22px 14px",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", gap: 3,
        minHeight: "100vh", position: "sticky", top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", marginBottom: 18 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
        <span className="logo-text" style={{ fontSize: 16 }}>{t.appName}</span>
      </div>

      {/* Nav */}
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`sidebar-item ${page === item.id ? "active" : ""}`}
          onClick={() => setPage(item.id)}
        >
          <span style={{ fontSize: 17, minWidth: 22, textAlign: "center" }}>{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Voice indicator */}
      {voiceEnabled && (
        <div style={{ margin: "0 8px 10px", padding: "10px 14px", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: "var(--accent-3)", fontFamily: "var(--font-main)", fontWeight: 600, marginBottom: 3 }}>
            🔊 {t.voiceEnabled}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{REGIONAL_VOICES[voiceKey]?.name}</div>
        </div>
      )}

      {/* Premium upsell */}
      {!user?.isPremium && (
        <div
          onClick={onShowPremium}
          style={{ margin: "0 8px 14px", padding: "14px", background: "var(--accent-soft)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, cursor: "pointer", transition: "opacity 0.2s" }}
        >
          <div style={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 600, marginBottom: 3 }}>⭐ {t.goPremiumTitle}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{t.goPremiumSub}</div>
        </div>
      )}

      {/* User + language */}
      <div style={{ padding: "7px 14px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name?.split(" ")[0]}</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{user?.isPremium ? t.premium : t.free}</div>
        </div>
        <LanguageBadge langInfo={langInfo} onChangeLocale={onChangeLocale} />
      </div>
    </aside>
  );
}
