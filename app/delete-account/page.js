export const metadata = {
  title: "Eliminar cuenta — MindEase AI",
  description: "Cómo solicitar la eliminación de tu cuenta y datos en MindEase AI",
};

export default function DeleteAccountPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0b12",
      color: "#f0f1fa",
      fontFamily: "'Sora', 'Inter', sans-serif",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌿</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#ffffff" }}>
            Eliminar cuenta — MindEase AI
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Desarrollado por Roid · Contacto: roid9015@gmail.com
          </p>
        </div>

        {/* Intro */}
        <section style={{ marginBottom: 36 }}>
          <p style={{ color: "#a5b4fc", lineHeight: 1.7, fontSize: 15 }}>
            En MindEase AI respetamos tu derecho a controlar tus datos. Esta página explica
            cómo solicitar la eliminación de tu cuenta y los datos asociados.
          </p>
        </section>

        {/* Pasos */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#c7d2fe" }}>
            Cómo solicitar la eliminación de tu cuenta
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { n: "1", title: "Opción A — Desde la app", desc: 'Abre MindEase AI → ve a Configuración → desplázate hasta la sección "Cuenta" → toca "Cerrar sesión". Luego envía un correo a roid9015@gmail.com con el asunto "Eliminar cuenta" indicando el correo electrónico de tu cuenta.' },
              { n: "2", title: "Opción B — Por correo electrónico", desc: 'Envía un correo a roid9015@gmail.com con el asunto "Eliminar cuenta MindEase AI" e indica el correo electrónico asociado a tu cuenta. Procesaremos tu solicitud en un plazo máximo de 30 días.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex",
                gap: 16,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(99,102,241,0.2)",
                  color: "#a5b4fc", fontWeight: 700, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>{n}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{title}</div>
                  <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Qué se borra */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#c7d2fe" }}>
            Datos que se eliminan
          </h2>
          <div style={{
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 12,
            padding: "18px 20px",
          }}>
            <p style={{ color: "#6ee7b7", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>
              ✓ Se eliminan permanentemente:
            </p>
            <ul style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li>Tu cuenta de usuario (correo electrónico y nombre)</li>
              <li>Historial de conversaciones con la IA almacenado localmente</li>
              <li>Preferencias y configuración de la app</li>
              <li>Estado de suscripción Premium</li>
            </ul>
          </div>
        </section>

        {/* Qué se conserva */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#c7d2fe" }}>
            Datos que pueden conservarse temporalmente
          </h2>
          <div style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 12,
            padding: "18px 20px",
          }}>
            <ul style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li>Registros de Firebase Authentication se eliminan en un plazo de <strong style={{color:"#fcd34d"}}>30 días</strong></li>
              <li>Logs de acceso de Vercel (infraestructura): se eliminan automáticamente en <strong style={{color:"#fcd34d"}}>90 días</strong></li>
              <li>No conservamos copias de las conversaciones en servidores propios</li>
            </ul>
          </div>
        </section>

        {/* Eliminación parcial */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#c7d2fe" }}>
            Eliminación parcial de datos (sin borrar la cuenta)
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
            Si deseas eliminar solo el historial de conversaciones sin borrar tu cuenta,
            puedes hacerlo directamente desde la app en Configuración, o enviando un correo
            a <a href="mailto:roid9015@gmail.com" style={{ color: "#a5b4fc" }}>roid9015@gmail.com</a> indicando
            qué datos específicos deseas eliminar.
          </p>
        </section>

        {/* Contacto */}
        <section style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Contacto</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Para cualquier solicitud de eliminación de datos, escríbenos a{" "}
            <a href="mailto:roid9015@gmail.com" style={{ color: "#a5b4fc", textDecoration: "none" }}>
              roid9015@gmail.com
            </a>
            . Respondemos en un plazo máximo de <strong style={{ color: "#f0f1fa" }}>30 días hábiles</strong>.
          </p>
        </section>

        <p style={{ color: "#334155", fontSize: 12, textAlign: "center" }}>
          MindEase AI · Última actualización: junio 2026
        </p>
      </div>
    </div>
  );
}
