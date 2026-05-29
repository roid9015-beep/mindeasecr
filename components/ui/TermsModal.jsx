"use client";

export default function TermsModal({ locale, onClose }) {
  const es = locale === "es";
  const pt = locale === "pt";

  const content = {
    title: es ? "Términos, Condiciones y Aviso Legal" : pt ? "Termos, Condições e Aviso Legal" : "Terms, Conditions & Legal Disclaimer",
    sections: es ? [
      {
        heading: "1. Naturaleza del servicio",
        text: "MindEase AI es una aplicación de acompañamiento emocional basada en inteligencia artificial. NO es un servicio médico, psicológico ni de salud mental clínica. No reemplaza la consulta con profesionales de salud mental certificados."
      },
      {
        heading: "2. Limitación de responsabilidad",
        text: "MindEase AI y sus operadores no se hacen responsables por decisiones tomadas basándose en las respuestas de la IA, ni por daños directos o indirectos derivados del uso de la aplicación. El usuario acepta que la IA puede cometer errores."
      },
      {
        heading: "3. Crisis y emergencias",
        text: "Si estás experimentando una crisis de salud mental, pensamientos de autolesión o situación de emergencia, llama inmediatamente a los servicios de emergencia locales o líneas de crisis: México: 800-290-0024 | España: 024 | Argentina: (011) 5275-1135 | Costa Rica: 800-LESCUCHO (537-2824)."
      },
      {
        heading: "4. Privacidad y datos",
        text: "Las conversaciones son procesadas por inteligencia artificial para generar respuestas. No vendemos tu información personal a terceros. Los datos se usan exclusivamente para mejorar la experiencia dentro de la app."
      },
      {
        heading: "5. Uso apropiado",
        text: "El usuario se compromete a usar MindEase AI de manera responsable y a no intentar manipular la IA para obtener contenido dañino, ilegal o inapropiado."
      },
      {
        heading: "6. Menores de edad",
        text: "MindEase AI no está diseñado para menores de 13 años. Los usuarios entre 13 y 18 años deben contar con el consentimiento de un adulto responsable."
      },
      {
        heading: "7. Modificaciones",
        text: "Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la app implica la aceptación de los nuevos términos."
      },
    ] : pt ? [
      { heading: "1. Natureza do serviço", text: "MindEase AI é um aplicativo de acompanhamento emocional baseado em inteligência artificial. NÃO é um serviço médico ou psicológico clínico. Não substitui consultas com profissionais de saúde mental certificados." },
      { heading: "2. Limitação de responsabilidade", text: "MindEase AI e seus operadores não se responsabilizam por decisões tomadas com base nas respostas da IA, nem por danos decorrentes do uso do aplicativo." },
      { heading: "3. Crises e emergências", text: "Em caso de crise, ligue para o CVV: 188 (Brasil) ou serviços de emergência locais." },
      { heading: "4. Privacidade", text: "As conversas são processadas por IA para gerar respostas. Não vendemos suas informações a terceiros." },
    ] : [
      { heading: "1. Nature of Service", text: "MindEase AI is an emotional support companion powered by artificial intelligence. It is NOT a medical, psychological, or clinical mental health service and does not replace licensed mental health professionals." },
      { heading: "2. Limitation of Liability", text: "MindEase AI and its operators are not liable for decisions made based on AI responses, or for any damages arising from the use of the application." },
      { heading: "3. Crisis & Emergencies", text: "If you are experiencing a mental health crisis, call emergency services immediately. US: 988 | UK: 116 123 (Samaritans)." },
      { heading: "4. Privacy", text: "Conversations are processed by AI to generate responses. We do not sell your personal data to third parties." },
    ],
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems:"flex-start", paddingTop:40, overflowY:"auto" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"var(--bg-secondary)", border:"1px solid var(--border)",
        borderRadius:20, padding:36, maxWidth:600, width:"100%",
        position:"relative", maxHeight:"80vh", overflowY:"auto",
      }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:24 }}>×</button>

        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📋</div>
          <h2 style={{ fontFamily:"var(--font-main)", fontSize:20, fontWeight:700, color:"var(--text-primary)" }}>
            {content.title}
          </h2>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {content.sections.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontFamily:"var(--font-main)", fontSize:14, fontWeight:600, color:"var(--accent)", marginBottom:6 }}>{s.heading}</h3>
              <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7 }}>{s.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop:28, padding:"14px 18px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10 }}>
          <p style={{ fontSize:12, color:"#f87171", lineHeight:1.6, textAlign:"center" }}>
            {es ? "⚠️ MindEase AI NO es terapia. Si estás en crisis, busca ayuda profesional inmediatamente."
              : pt ? "⚠️ MindEase AI NÃO é terapia. Em crise, busque ajuda profissional imediatamente."
              : "⚠️ MindEase AI is NOT therapy. If in crisis, seek professional help immediately."}
          </p>
        </div>

        <button className="btn btn-primary" style={{ width:"100%", marginTop:20 }} onClick={onClose}>
          {es ? "Entendido, continuar" : pt ? "Entendido, continuar" : "Understood, continue"}
        </button>
      </div>
    </div>
  );
}
