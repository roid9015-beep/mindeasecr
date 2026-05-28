"use client";
import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";

export default function MindEaseApp() {
  const [mounted, setMounted] = useState(false);
  // Obtenemos todo el estado para ver qué hay dentro
  const state = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si no ha montado, no renderizamos nada para evitar errores de hidratación
  if (!mounted) return <div style={{ color: "white" }}>Cargando...</div>;

  // Renderizado defensivo: Si algo falta, mostramos un estado de error amigable
  if (!state) return <div style={{ color: "white" }}>Error: El store no ha cargado.</div>;

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>MindEase</h1>
      <p>La aplicación está cargada.</p>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
