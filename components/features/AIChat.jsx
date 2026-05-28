"use client";
import { useState, useRef, useEffect } from "react";

export default function AIChat({ messages = [], setMessages, startSession }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Scroll automático hacia abajo al recibir mensajes
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: "user", content: input, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      
      const data = await res.json();
      const aiMsg = { role: "assistant", content: data.content || "Error: Sin contenido", timestamp: Date.now() };
      setMessages([...updatedMessages, aiMsg]);
    } catch (e) {
      setMessages([...updatedMessages, { role: "assistant", content: "Error de conexión. Intenta de nuevo.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "white", maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", height: "80vh" }}>
      {/* Área de mensajes */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", background: "#161821", borderRadius: "12px", marginBottom: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "12px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <div style={{ 
              display: "inline-block", 
              padding: "10px 15px", 
              borderRadius: "16px", 
              background: m.role === "user" ? "#4f46e5" : "#333" 
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: "#888", textAlign: "left", padding: "10px" }}>Pensando...</div>}
        <div ref={endRef} />
      </div>

      {/* Input de texto */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje..."
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none" }} 
        />
        <button 
          onClick={sendMessage} 
          disabled={loading}
          style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
