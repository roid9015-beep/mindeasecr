"use client";
import { useState } from "react";
import { COUNTRY_LANGUAGE_MAP } from "@/lib/constants";

export default function LanguageBadge({ langInfo, onChangeLocale }) {
  const [open, setOpen] = useState(false);
  if (!langInfo) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 20, cursor: "pointer", fontSize: 12,
          color: "var(--text-secondary)", transition: "all 0.2s",
        }}
      >
        <span>{langInfo.flag}</span>
        <span>{langInfo.country || langInfo.locale?.toUpperCase()}</span>
        <span style={{ opacity: 0.5 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "110%", right: 0, zIndex: 200,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 8, minWidth: 200,
            boxShadow: "var(--shadow-lg)", animation: "fadeIn 0.15s ease",
            maxHeight: 320, overflowY: "auto",
          }}
        >
          {Object.entries(COUNTRY_LANGUAGE_MAP).map(([code, info]) => (
            <button
              key={code}
              onClick={() => { onChangeLocale(info.locale, info.voice, info); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                borderRadius: 8, cursor: "pointer", fontSize: 13,
                border: "none", background: "none", width: "100%", textAlign: "left",
                color: "var(--text-secondary)", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>{info.flag}</span>
              <span>{info.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
