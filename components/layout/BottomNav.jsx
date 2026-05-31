"use client";
import { NAV_ICONS } from "@/lib/constants";

export default function BottomNav({ t, page, setPage }) {
  const items = [
    { id: "dashboard", icon: NAV_ICONS.dashboard, label: t.homeLabel },
    { id: "chat",      icon: NAV_ICONS.chat,       label: t.talkLabel },
    { id: "relief",    icon: "🆘",                 label: "SOS" },
    { id: "insights",  icon: NAV_ICONS.insights,   label: t.insightsLabel },
    { id: "settings",  icon: "👤",                 label: "Perfil" },
  ];

  return (
    <nav
      className="mobile-nav"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(10,11,18,0.97)", backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-around",
        padding: "6px 0 10px", zIndex: 50,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${page === item.id ? "active" : ""}`}
          onClick={() => setPage(item.id)}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
