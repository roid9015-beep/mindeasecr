"use client";
import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import Dashboard from "@/components/features/Dashboard";
import AIChat from "@/components/features/AIChat";

export default function MindEaseApp() {
  const { user, page } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Si no hay usuario, forzamos la vista de login o lo que tenías antes
  if (!user) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        <h1>Bienvenido a MindEase</h1>
        <p>Por favor, inicia sesión para continuar.</p>
        {/* Aquí iría tu componente de Login si lo tienes separado */}
      </div>
    );
  }

  return (
    <div>
      {page === "chat" ? <AIChat /> : <Dashboard />}
    </div>
  );
}
