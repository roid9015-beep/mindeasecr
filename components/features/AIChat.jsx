"use client";
import { useState } from "react";

export default function AIChat({ messages, setMessages, locale, startSession }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      const aiMsg = { role: "assistant", content: data.content || "Sin respuesta", timestamp: Date.now() };
      setMessages([...newMessages, aiMsg]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Error de conexión.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: "white", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ height: "70vh", overflowY: "auto", marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <span style={{ background: "#333", padding: 8, borderRadius: 8 }}>{m.content}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1 }} />
        <button onClick={sendMessage} disabled={loading}>{loading ? "..." : "Enviar"}</button>
      </div>
    </div>
  );
}
