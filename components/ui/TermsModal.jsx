"use client";
import { auth } from "@/lib/firebase";
import { saveTermsAcceptance } from "@/lib/firestore";

const TERMS = {
  es: {
    title: "Términos de Uso y Política de Privacidad",
    lastUpdated: "Última actualización: mayo 2025",
    sections: [
      {
        heading: "1. Naturaleza del Servicio",
        body: `MindEase AI es una aplicación de acompañamiento emocional impulsada por inteligencia artificial. NO es un servicio de salud mental, NO es una plataforma de psicología clínica y NO reemplaza el diagnóstico, tratamiento ni consejo de un profesional de salud mental licenciado.

El uso de MindEase AI no establece ninguna relación médico-paciente ni terapeuta-cliente. Las respuestas generadas por la inteligencia artificial son de carácter informativo y de apoyo emocional general, y no deben interpretarse como consejo médico, psicológico ni terapéutico profesional.`,
      },
      {
        heading: "2. Aviso Crítico — Emergencias y Crisis",
        body: `MindEase AI NO está diseñada para manejar emergencias de salud mental, situaciones de crisis aguda, ideación suicida, autolesión, abuso ni ninguna condición que requiera atención médica o psiquiátrica inmediata.

Si usted o alguien que conoce se encuentra en riesgo inmediato, abandone esta aplicación y comuníquese de inmediato con los servicios de emergencia locales (911 en Costa Rica y muchos países) o una línea de crisis de salud mental de su país.

MindEase AI no monitorea conversaciones en tiempo real ni puede tomar acciones de emergencia. La responsabilidad de buscar ayuda profesional en situaciones de crisis recae exclusivamente en el usuario.`,
      },
      {
        heading: "3. Limitaciones de la Inteligencia Artificial",
        body: `Las respuestas de MindEase AI son generadas por modelos de lenguaje de inteligencia artificial y pueden contener imprecisiones, ser inapropiadas para su situación específica o carecer del contexto necesario para brindar apoyo adecuado.

La IA no tiene capacidad de diagnóstico clínico, no puede evaluar el riesgo real de una persona y puede malinterpretar información compleja. El usuario acepta que el uso de esta tecnología conlleva estas limitaciones inherentes.`,
      },
      {
        heading: "4. Privacidad y Protección de Datos",
        body: `MindEase AI opera en cumplimiento de la Ley N.° 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales de Costa Rica y principios del Reglamento General de Protección de Datos (GDPR) de la Unión Europea.

Los datos recopilados incluyen: información de registro (nombre, correo electrónico), historial de conversaciones y preferencias de uso. Esta información se utiliza exclusivamente para brindar el servicio de acompañamiento emocional personalizado.

Sus conversaciones se procesan a través de la API de Anthropic (Claude) para generar respuestas. Anthropic cuenta con sus propias políticas de privacidad y seguridad de datos. MindEase AI no vende, alquila ni comparte sus datos personales con terceros con fines publicitarios o comerciales.

Sus datos de conversación se almacenan en servidores seguros de Google Firebase con cifrado en tránsito y en reposo. Usted tiene derecho a solicitar la eliminación de sus datos en cualquier momento escribiendo a nuestro correo de contacto.`,
      },
      {
        heading: "5. Suscripción y Pagos",
        body: `MindEase AI ofrece un plan gratuito con funcionalidades limitadas y un plan Premium de $5 USD mensuales con acceso completo.

Los pagos del plan Premium se procesan a través de PayPal. Al suscribirse al plan Premium, usted autoriza cargos recurrentes mensuales hasta que cancele su suscripción. Puede cancelar en cualquier momento desde su cuenta de PayPal sin cargos adicionales.

No se realizan reembolsos por períodos parciales ya utilizados. MindEase AI se reserva el derecho de modificar los precios con un aviso previo de 30 días.`,
      },
      {
        heading: "6. Responsabilidades del Usuario",
        body: `Al usar MindEase AI, usted declara tener al menos 18 años de edad. Si es menor de edad, debe contar con el consentimiento expreso de su padre, madre o tutor legal para usar esta aplicación.

Usted se compromete a no usar la aplicación para fines ilegales, a no intentar eludir las medidas de seguridad, a no compartir su cuenta con terceros y a proporcionar información verídica durante el registro.

Usted entiende y acepta que es el único responsable de las decisiones que tome basándose en las respuestas de la inteligencia artificial.`,
      },
      {
        heading: "7. Limitación de Responsabilidad",
        body: `En la máxima medida permitida por la ley aplicable, MindEase AI, sus fundadores, empleados y colaboradores no serán responsables por daños directos, indirectos, incidentales, especiales ni consecuentes derivados del uso o la imposibilidad de uso de la aplicación.

MindEase AI no garantiza que el servicio sea ininterrumpido, libre de errores ni que los resultados obtenidos sean precisos o confiables. El servicio se proporciona "tal como está" sin garantías de ningún tipo.`,
      },
      {
        heading: "8. Propiedad Intelectual",
        body: `Todo el contenido de MindEase AI, incluyendo su diseño, texto, funcionalidades, marca y código, es propiedad exclusiva de MindEase AI y está protegido por las leyes de propiedad intelectual de Costa Rica y tratados internacionales.

Queda prohibida la reproducción, distribución o modificación de cualquier parte de la aplicación sin autorización escrita previa.`,
      },
      {
        heading: "9. Modificaciones a los Términos",
        body: `MindEase AI se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios entrarán en vigor al publicarse en la aplicación. El uso continuado de la aplicación después de la publicación de cambios constituye su aceptación de los nuevos términos.`,
      },
      {
        heading: "10. Ley Aplicable y Jurisdicción",
        body: `Estos Términos se rigen por las leyes de la República de Costa Rica. Cualquier disputa derivada del uso de MindEase AI se someterá a la jurisdicción de los Tribunales de Justicia de Costa Rica, específicamente en el I Circuito Judicial de San José.`,
      },
      {
        heading: "11. Contacto",
        body: `Para consultas sobre estos Términos, solicitudes de eliminación de datos o cualquier pregunta relacionada con la privacidad, puede contactarnos en: soporte@mindease.ai`,
      },
    ],
  },

  en: {
    title: "Terms of Use & Privacy Policy",
    lastUpdated: "Last updated: May 2025",
    sections: [
      {
        heading: "1. Nature of the Service",
        body: `MindEase AI is an AI-powered emotional support companion application. It is NOT a mental health service, NOT a clinical psychology platform, and does NOT replace the diagnosis, treatment, or advice of a licensed mental health professional.

Use of MindEase AI does not establish any doctor-patient or therapist-client relationship. Responses generated by artificial intelligence are informational and provide general emotional support only, and should not be interpreted as professional medical, psychological, or therapeutic advice.`,
      },
      {
        heading: "2. Critical Notice — Emergencies and Crisis",
        body: `MindEase AI is NOT designed to handle mental health emergencies, acute crisis situations, suicidal ideation, self-harm, abuse, or any condition requiring immediate medical or psychiatric attention.

If you or someone you know is in immediate danger, leave this application immediately and contact your local emergency services (911 or equivalent) or a mental health crisis line in your country.

MindEase AI does not monitor conversations in real time and cannot take emergency action. The responsibility to seek professional help in crisis situations lies solely with the user.`,
      },
      {
        heading: "3. Limitations of Artificial Intelligence",
        body: `MindEase AI responses are generated by artificial intelligence language models and may contain inaccuracies, be inappropriate for your specific situation, or lack the necessary context to provide adequate support.

The AI has no clinical diagnostic capability, cannot assess a person's real risk level, and may misinterpret complex information. By using this service, you acknowledge and accept these inherent limitations.`,
      },
      {
        heading: "4. Privacy and Data Protection",
        body: `MindEase AI operates in compliance with Costa Rica's Law No. 8968 on Personal Data Protection and the principles of the European Union's General Data Protection Regulation (GDPR).

Data collected includes: registration information (name, email address), conversation history, and usage preferences. This information is used exclusively to provide personalized emotional support.

Conversations are processed through Anthropic's API (Claude) to generate responses. Anthropic has its own privacy and data security policies. MindEase AI does not sell, rent, or share your personal data with third parties for advertising or commercial purposes.

Your conversation data is stored on secure Google Firebase servers with encryption in transit and at rest. You have the right to request deletion of your data at any time by contacting us.`,
      },
      {
        heading: "5. Subscription and Payments",
        body: `MindEase AI offers a free plan with limited features and a Premium plan at $5 USD/month with full access.

Premium plan payments are processed through PayPal. By subscribing, you authorize recurring monthly charges until you cancel. You may cancel at any time through your PayPal account with no additional fees.

No refunds are issued for partial periods already used. MindEase AI reserves the right to modify pricing with 30 days advance notice.`,
      },
      {
        heading: "6. User Responsibilities",
        body: `By using MindEase AI, you confirm you are at least 18 years of age. If you are a minor, you must have the express consent of a parent or legal guardian.

You agree not to use the application for illegal purposes, not to attempt to circumvent security measures, not to share your account with third parties, and to provide accurate information during registration.

You understand and accept that you are solely responsible for any decisions you make based on the AI's responses.`,
      },
      {
        heading: "7. Limitation of Liability",
        body: `To the fullest extent permitted by applicable law, MindEase AI, its founders, employees, and collaborators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the application.

MindEase AI makes no warranty that the service will be uninterrupted, error-free, or that results obtained will be accurate or reliable. The service is provided "as is" without warranties of any kind.`,
      },
      {
        heading: "8. Intellectual Property",
        body: `All content of MindEase AI, including its design, text, features, brand, and code, is the exclusive property of MindEase AI and is protected by Costa Rican intellectual property laws and international treaties.

Reproduction, distribution, or modification of any part of the application without prior written authorization is prohibited.`,
      },
      {
        heading: "9. Changes to Terms",
        body: `MindEase AI reserves the right to modify these Terms at any time. Changes will take effect upon publication within the application. Continued use after changes are published constitutes acceptance of the updated terms.`,
      },
      {
        heading: "10. Governing Law and Jurisdiction",
        body: `These Terms are governed by the laws of the Republic of Costa Rica. Any dispute arising from the use of MindEase AI shall be submitted to the jurisdiction of the Courts of Justice of Costa Rica, specifically the First Judicial Circuit of San José.`,
      },
      {
        heading: "11. Contact",
        body: `For questions about these Terms, data deletion requests, or any privacy-related inquiries, contact us at: soporte@mindease.ai`,
      },
    ],
  },

  pt: {
    title: "Termos de Uso e Política de Privacidade",
    lastUpdated: "Última atualização: maio de 2025",
    sections: [
      {
        heading: "1. Natureza do Serviço",
        body: `MindEase AI é um aplicativo de acompanhamento emocional com inteligência artificial. NÃO é um serviço de saúde mental, NÃO é uma plataforma de psicologia clínica e NÃO substitui o diagnóstico, tratamento ou aconselhamento de um profissional de saúde mental licenciado.

O uso do MindEase AI não estabelece nenhuma relação médico-paciente ou terapeuta-cliente. As respostas geradas pela inteligência artificial são de caráter informativo e de apoio emocional geral, e não devem ser interpretadas como conselho médico, psicológico ou terapêutico profissional.`,
      },
      {
        heading: "2. Aviso Crítico — Emergências e Crises",
        body: `MindEase AI NÃO foi projetado para lidar com emergências de saúde mental, situações de crise aguda, ideação suicida, automutilação, abuso ou qualquer condição que exija atenção médica ou psiquiátrica imediata.

Se você ou alguém que você conhece estiver em perigo imediato, saia deste aplicativo imediatamente e entre em contato com os serviços de emergência locais (190, 192 ou equivalente) ou com o CVV: 188.

MindEase AI não monitora conversas em tempo real e não pode tomar ações de emergência. A responsabilidade de buscar ajuda profissional em situações de crise é exclusivamente do usuário.`,
      },
      {
        heading: "3. Limitações da Inteligência Artificial",
        body: `As respostas do MindEase AI são geradas por modelos de linguagem de inteligência artificial e podem conter imprecisões, ser inadequadas para sua situação específica ou carecer do contexto necessário. A IA não tem capacidade de diagnóstico clínico e pode interpretar mal informações complexas. Ao usar este serviço, você reconhece e aceita essas limitações inerentes.`,
      },
      {
        heading: "4. Privacidade e Proteção de Dados",
        body: `MindEase AI opera em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil, a Lei N.° 8968 da Costa Rica e os princípios do GDPR da União Europeia.

Os dados coletados incluem: informações de cadastro (nome, e-mail), histórico de conversas e preferências de uso. Essas informações são usadas exclusivamente para fornecer o serviço de acompanhamento emocional personalizado.

As conversas são processadas pela API da Anthropic (Claude). MindEase AI não vende, aluga nem compartilha seus dados pessoais com terceiros para fins publicitários. Você tem o direito de solicitar a exclusão dos seus dados a qualquer momento.`,
      },
      {
        heading: "5. Assinatura e Pagamentos",
        body: `MindEase AI oferece um plano gratuito com funcionalidades limitadas e um plano Premium de $5 USD/mês com acesso completo. Os pagamentos são processados pelo PayPal. Você pode cancelar a qualquer momento sem taxas adicionais. Não são feitos reembolsos por períodos parciais já utilizados.`,
      },
      {
        heading: "6. Responsabilidades do Usuário",
        body: `Ao usar o MindEase AI, você confirma ter pelo menos 18 anos. Menores de idade precisam do consentimento expresso de um responsável legal. Você é o único responsável pelas decisões tomadas com base nas respostas da IA.`,
      },
      {
        heading: "7. Limitação de Responsabilidade",
        body: `Na máxima extensão permitida pela lei aplicável, MindEase AI não será responsável por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso ou incapacidade de uso do aplicativo. O serviço é fornecido "como está", sem garantias de qualquer tipo.`,
      },
      {
        heading: "8. Propriedade Intelectual",
        body: `Todo o conteúdo do MindEase AI é propriedade exclusiva de MindEase AI e está protegido pelas leis de propriedade intelectual aplicáveis. É proibida a reprodução ou distribuição sem autorização prévia por escrito.`,
      },
      {
        heading: "9. Alterações nos Termos",
        body: `MindEase AI reserva-se o direito de modificar estes Termos a qualquer momento. O uso continuado após as alterações constitui aceitação dos novos termos.`,
      },
      {
        heading: "10. Lei Aplicável",
        body: `Estes Termos são regidos pelas leis da República da Costa Rica. Qualquer disputa será submetida à jurisdição dos Tribunais de Justiça da Costa Rica.`,
      },
      {
        heading: "11. Contato",
        body: `Para dúvidas sobre estes Termos ou solicitações de exclusão de dados: soporte@mindease.ai`,
      },
    ],
  },
};

export default function TermsModal({ locale = "es", onClose }) {
  const content = TERMS[locale] || TERMS.es;

  const handleAccept = () => {
    const uid = auth.currentUser?.uid;
    if (uid) saveTermsAcceptance(uid, locale);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "var(--bg-secondary,#1a1a2e)",
        border: "1px solid var(--border,rgba(255,255,255,0.1))",
        borderRadius: 20, width: "100%", maxWidth: 640,
        maxHeight: "85vh", display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid var(--border,rgba(255,255,255,0.08))",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontWeight: 700, fontSize: 16 }}>
              🌿 {content.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted,#64748b)", marginTop: 3 }}>
              {content.lastUpdated}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: "var(--bg-card,rgba(255,255,255,0.05))",
            color: "var(--text-muted,#64748b)", cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Contenido scrollable */}
        <div style={{ overflowY: "auto", padding: "24px", flex: 1 }}>

          {/* Aviso destacado */}
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 12, padding: "14px 18px", marginBottom: 24,
          }}>
            <p style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.6, margin: 0 }}>
              {locale === "es"
                ? "⚠️ MindEase AI NO es un servicio de salud mental ni reemplaza a un terapeuta profesional. En caso de emergencia, llama al 911 o a la línea de crisis de tu país."
                : locale === "pt"
                ? "⚠️ MindEase AI NÃO é um serviço de saúde mental. Em emergências, ligue 190 ou CVV: 188."
                : "⚠️ MindEase AI is NOT a mental health service. In emergencies, call 911 or your local crisis line."}
            </p>
          </div>

          {/* Secciones */}
          {content.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <h3 style={{
                fontFamily: "var(--font-main,'Sora',sans-serif)",
                fontSize: 13, fontWeight: 700, color: "var(--accent,#6366f1)",
                marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {sec.heading}
              </h3>
              <p style={{
                fontSize: 13, color: "var(--text-secondary,#94a3b8)",
                lineHeight: 1.75, whiteSpace: "pre-line",
              }}>
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--border,rgba(255,255,255,0.08))",
          flexShrink: 0,
        }}>
          <button onClick={handleAccept} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
            {locale === "es" ? "Entendido y acepto" : locale === "pt" ? "Entendido e aceito" : "I understand and agree"}
          </button>
        </div>
      </div>
    </div>
  );
}
