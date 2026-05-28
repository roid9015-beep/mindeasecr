"use client";
import { useState, useEffect } from "react";
import { getTranslation } from "@/lib/i18n";
import useAppStore from "@/store/useAppStore";
// ... mantén tus otros imports

export default function MindEaseApp() {
  const { user, locale, page, setPage, messages, setMessages, sessionLog, startSession } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div style={{ color: "white", padding: 20 }}>Cargando...</div>;

  // Corrección clave: usamos un objeto por defecto si getTranslation falla
  const t = getTranslation(locale) || { 
    appName: "MindEase", 
    homeLabel: "Inicio", 
    chatPlaceholder: "Escribe algo..." 
  };

  // ... resto de tu lógica de renderizado
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Tu contenido principal */}
    </div>
  );
}
