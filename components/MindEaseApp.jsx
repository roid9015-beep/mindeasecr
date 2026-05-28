"use client";
import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import Dashboard from "@/components/features/Dashboard";
import AIChat from "@/components/features/AIChat";

export default function MindEaseApp() {
  const [mounted, setMounted] = useState(false);
  const { user, page, messages, setMessages, startSession } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ color: "white", padding: "20px" }}>Cargando...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0b12" }}>
      {!user ? (
        <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
          <h1>Bienvenido a MindEase</h1>
          <button onClick={() => useAppStore.getState().setUser({ email: "demo@user.com" })}>
            Entrar a la app
          </button>
        </div>
      ) : (
        page === "chat" ? (
          <AIChat messages={messages} setMessages={setMessages} startSession={startSession} />
        ) : (
          <Dashboard />
        )
      )}
    </div>
  );
}
