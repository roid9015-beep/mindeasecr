"use client";
import { useState, useEffect } from "react";
import { getTranslation } from "@/lib/i18n";
import useAppStore from "@/store/useAppStore";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";
import Dashboard from "@/components/features/Dashboard";
import AIChat from "@/components/features/AIChat";

export default function MindEaseApp() {
  const { user, locale, page, setPage, messages, setMessages, sessionLog, startSession } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div style={{ color: "white", padding: 20 }}>Cargando...</div>;

  const t = getTranslation(locale);

  const renderContent = () => {
    switch (page) {
      case "chat":
        return <AIChat t={t} locale={locale} messages={messages} setMessages={setMessages} sessionLog={sessionLog} startSession={startSession} />;
      default:
        return <Dashboard t={t} />;
    }
  };

  return (
    <>
      <BackgroundOrbs />
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex" }}>
        <Sidebar page={page} setPage={setPage} />
        <main style={{ flex: 1, padding: 20 }}>{renderContent()}</main>
      </div>
      <BottomNav page={page} setPage={setPage} />
    </>
  );
}
