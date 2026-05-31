"use client";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PAYPAL_CLIENT_ID, PAYPAL_PLANS } from "@/lib/paypal";

const FEATURES = [
  "💬 Chat con IA ilimitado",
  "🎙️ Respuestas de voz",
  "📊 Análisis emocional completo",
  "💌 Carta semanal personalizada",
  "🚫 Sin límites, sin anuncios",
];

export default function PremiumModal({ t, locale, onClose, onUpgrade, user }) {
  const [plan,    setPlan]    = useState("monthly"); // "monthly" | "yearly"
  const [status,  setStatus]  = useState("idle");    // "idle" | "processing" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const planId = PAYPAL_PLANS[plan];

  // ── Al aprobar la suscripción ──────────────────────────────────────────────
  const handleApprove = async (data) => {
    setStatus("processing");
    try {
      const uid = user?.uid;
      if (uid) {
        // Guardar en Firestore: marcar como premium + subscription ID
        await updateDoc(doc(db, "users", uid), {
          isPremium:      true,
          subscriptionId: data.subscriptionID,
          planId:         planId,
          upgradedAt:     new Date().toISOString(),
        });
      }
      setStatus("success");
      setTimeout(() => {
        onUpgrade?.();
        onClose?.();
      }, 2000);
    } catch (err) {
      console.error("Error al guardar suscripción:", err);
      // Aunque falle Firestore, la suscripción está activa en PayPal
      setStatus("success");
      setTimeout(() => { onUpgrade?.(); onClose?.(); }, 2000);
    }
  };

  const handleError = (err) => {
    console.error("PayPal error:", err);
    setErrorMsg("Hubo un problema con el pago. Intenta de nuevo.");
    setStatus("error");
  };

  const savings = locale === "pt"
    ? "Economize 30% — equivale a $2,08/mês"
    : "Ahorrás 30% — equivale a $2.08/mes";

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={{
        background: "var(--bg-card)", borderRadius: 22, padding: "32px 28px",
        width: "100%", maxWidth: 440, position: "relative",
        border: "1px solid rgba(99,102,241,0.3)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        maxHeight: "90vh", overflowY: "auto",
      }}>

        {/* Cerrar */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "none",
          border: "none", cursor: "pointer", fontSize: 20, color: "var(--text-muted)", lineHeight: 1,
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>⭐</div>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            MindEase Premium
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Todo el apoyo que necesitás, sin restricciones
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 22 }}>
          {FEATURES.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {/* Mensual */}
          <button onClick={() => { setPlan("monthly"); setStatus("idle"); setErrorMsg(""); }} style={{
            flex: 1, padding: "14px 10px", borderRadius: 14, cursor: "pointer",
            border: `2px solid ${plan === "monthly" ? "var(--accent)" : "var(--border)"}`,
            background: plan === "monthly" ? "rgba(99,102,241,0.1)" : "var(--bg-secondary)",
            textAlign: "center", transition: "all .2s",
          }}>
            <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>$2.99</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>por mes</p>
          </button>

          {/* Anual */}
          <button onClick={() => { setPlan("yearly"); setStatus("idle"); setErrorMsg(""); }} style={{
            flex: 1, padding: "14px 10px", borderRadius: 14, cursor: "pointer",
            border: `2px solid ${plan === "yearly" ? "var(--accent)" : "var(--border)"}`,
            background: plan === "yearly" ? "rgba(99,102,241,0.1)" : "var(--bg-secondary)",
            textAlign: "center", position: "relative", transition: "all .2s",
          }}>
            {/* Badge ahorro */}
            <span style={{
              position: "absolute", top: -10, right: 8,
              background: "linear-gradient(135deg,#10b981,#059669)",
              color: "white", fontSize: 10, fontWeight: 700,
              padding: "2px 8px", borderRadius: 20,
            }}>AHORRÁS 30%</span>
            <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>$24.99</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>por año</p>
            <p style={{ fontSize: 10, color: "#10b981", marginTop: 3, fontWeight: 600 }}>{savings}</p>
          </button>
        </div>

        {/* Estados */}
        {status === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
            <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
              ¡Bienvenido/a a Premium!
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
              Tu suscripción está activa.
            </p>
          </div>
        )}

        {status === "processing" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div className="spinner" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Activando tu suscripción…</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#f87171" }}>
            {errorMsg}
          </div>
        )}

        {/* Botones PayPal */}
        {(status === "idle" || status === "error") && planId && (
          <PayPalScriptProvider options={{
            clientId: PAYPAL_CLIENT_ID,
            vault: true,
            intent: "subscription",
            currency: "USD",
          }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "subscribe", height: 44 }}
              createSubscription={(data, actions) =>
                actions.subscription.create({ plan_id: planId })
              }
              onApprove={handleApprove}
              onError={handleError}
              onCancel={() => setStatus("idle")}
            />
          </PayPalScriptProvider>
        )}

        {/* Sin plan configurado aún */}
        {(status === "idle" || status === "error") && !planId && (
          <div style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fb923c", textAlign: "center" }}>
            ⚠️ Planes de suscripción pendientes de configurar en PayPal Dashboard.
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
          Podés cancelar cuando quieras. Sin compromisos.
        </p>
      </div>
    </div>
  );
}
