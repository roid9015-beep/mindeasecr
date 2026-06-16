export const metadata = {
  title: "Política de Privacidad — MindEase AI",
  description: "Política de privacidad y aviso legal de MindEase AI",
};

export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0b12",
      color: "#e2e8f0",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "40px 24px",
      maxWidth: 720,
      margin: "0 auto",
      lineHeight: 1.7,
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
        Política de Privacidad
      </h1>
      <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 36 }}>
        Última actualización: junio 2026
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          ⚕️ Aviso médico importante
        </h2>
        <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ margin: 0, fontSize: 14 }}>
            <strong>MindEase AI NO es un servicio médico, terapeuta ni profesional de salud mental.</strong>{" "}
            No reemplaza la atención psicológica o psiquiátrica profesional. Si experimentás una crisis
            emocional, pensamientos de hacerte daño o síntomas graves, buscá ayuda de un profesional
            de salud mental certificado de inmediato.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          1. Qué información recopilamos
        </h2>
        <p>Recopilamos únicamente la información necesaria para que la app funcione:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Cuenta:</strong> nombre y dirección de correo electrónico al registrarte (vía Google o email).</li>
          <li><strong>Conversaciones de chat:</strong> los mensajes que escribís se envían a la IA para generar respuestas. No los almacenamos de forma permanente en nuestros servidores.</li>
          <li><strong>Preferencias de la app:</strong> idioma, voz habilitada, y configuración de PIN (almacenados localmente en tu dispositivo).</li>
          <li><strong>Datos de uso anónimos:</strong> información técnica para detectar errores (sin datos personales identificables).</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          2. Cómo usamos tu información
        </h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Para autenticar tu cuenta y mantener tu sesión segura.</li>
          <li>Para procesar tus mensajes con la IA y devolverte respuestas personalizadas.</li>
          <li>Para mejorar el funcionamiento técnico de la aplicación.</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          <strong>No vendemos, alquilamos ni compartimos tu información personal con terceros para fines publicitarios.</strong>
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          3. Servicios de terceros
        </h2>
        <p>MindEase AI utiliza los siguientes servicios externos:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Firebase (Google):</strong> autenticación de usuarios y base de datos. <a href="https://firebase.google.com/support/privacy" style={{ color: "#a5b4fc" }}>Política de privacidad de Firebase</a>.</li>
          <li><strong>Anthropic:</strong> procesamiento de conversaciones de IA. Los mensajes se envían a sus servidores para generar respuestas. <a href="https://www.anthropic.com/privacy" style={{ color: "#a5b4fc" }}>Política de privacidad de Anthropic</a>.</li>
          <li><strong>Vercel:</strong> alojamiento de la aplicación web. <a href="https://vercel.com/legal/privacy-policy" style={{ color: "#a5b4fc" }}>Política de privacidad de Vercel</a>.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          4. Seguridad de tus datos
        </h2>
        <p>
          Todas las comunicaciones entre tu dispositivo y nuestros servidores se realizan mediante
          HTTPS (cifrado TLS). Las conversaciones no se almacenan permanentemente. Tu información
          de cuenta está protegida por Firebase Authentication de Google.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          5. Tus derechos
        </h2>
        <p>Tenés derecho a:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Acceder a los datos de tu cuenta en cualquier momento.</li>
          <li>Eliminar tu cuenta y todos tus datos asociados.</li>
          <li>Solicitar información sobre qué datos tenemos sobre vos.</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Para ejercer estos derechos o por cualquier consulta, escribinos a:{" "}
          <a href="mailto:roid9015@gmail.com" style={{ color: "#a5b4fc" }}>roid9015@gmail.com</a>
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          6. Menores de edad
        </h2>
        <p>
          MindEase AI no está dirigida a menores de 13 años. No recopilamos intencionalmente
          datos de menores. Si creés que un menor ha creado una cuenta, contactanos para
          eliminarla de inmediato.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          7. Cambios a esta política
        </h2>
        <p>
          Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios importantes
          dentro de la app. Continuar usando MindEase AI después de un cambio implica aceptación
          de la nueva política.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#a5b4fc", marginBottom: 12 }}>
          8. Contacto
        </h2>
        <p>
          MindEase AI — Costa Rica<br />
          <a href="mailto:roid9015@gmail.com" style={{ color: "#a5b4fc" }}>roid9015@gmail.com</a>
        </p>
      </section>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, color: "#64748b", fontSize: 12 }}>
        © 2026 MindEase AI. Esta política aplica tanto a la aplicación Android como a la versión web.
      </div>
    </div>
  );
}
