"use client";

// Jardín interior — planta que crece con los días activos del usuario
export default function Garden({ daysActive = 0, locale = "es" }) {
  // Determinar etapa de crecimiento
  const stage = daysActive === 0 ? 0
    : daysActive <= 2  ? 1
    : daysActive <= 6  ? 2
    : daysActive <= 13 ? 3
    : daysActive <= 29 ? 4
    : 5;

  const messages = {
    es: [
      "Aún no has plantado tu semilla. Tu primer día aquí la despierta.",
      "Tu semilla acaba de despertar. Ya está en camino.",
      "Está creciendo. Cada vez que volvés, crece un poco más.",
      "Mirá qué linda está quedando. Estás construyendo algo real.",
      "Tu planta está floreciendo. Esto es lo que el cuidado constante hace.",
      "Un jardín completo. Construido un día a la vez, con vos mismo.",
    ],
    pt: [
      "Você ainda não plantou sua semente. Seu primeiro dia aqui a desperta.",
      "Sua semente acabou de despertar. Já está a caminho.",
      "Está crescendo. Cada vez que você volta, ela cresce um pouco mais.",
      "Que linda está ficando. Você está construindo algo real.",
      "Sua planta está florescendo. É isso que o cuidado constante faz.",
      "Um jardim completo. Construído um dia de cada vez, com você mesmo.",
    ],
    en: [
      "You haven't planted your seed yet. Your first day here awakens it.",
      "Your seed just woke up. It's already on its way.",
      "It's growing. Every time you come back, it grows a little more.",
      "Look how beautiful it's becoming. You're building something real.",
      "Your plant is blooming. This is what consistent care does.",
      "A complete garden. Built one day at a time, with yourself.",
    ],
  };

  const msg = (messages[locale] || messages.es)[stage];

  const labels = {
    es: { title: "Tu jardín interior", days: d => `${d} día${d !== 1 ? "s" : ""} cuidándote` },
    pt: { title: "Seu jardim interior", days: d => `${d} dia${d !== 1 ? "s" : ""} se cuidando` },
    en: { title: "Your inner garden",   days: d => `${d} day${d !== 1 ? "s" : ""} caring for yourself` },
  }[locale] || { title: "Tu jardín interior", days: d => `${d} días` };

  return (
    <div className="glass" style={{ padding: "20px 22px", marginBottom: 20, overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-main,'Sora',sans-serif)", fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
            {labels.title}
          </h3>
          {daysActive > 0 && (
            <p style={{ fontSize: 13, color: "var(--text-primary,#e2e8f0)", fontWeight: 600 }}>
              🔥 {labels.days(daysActive)}
            </p>
          )}
        </div>
      </div>

      {/* Planta SVG */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <GardenSVG stage={stage} />
      </div>

      {/* Mensaje emocional */}
      <p style={{ fontSize: 14, color: "#cbd5e1", textAlign: "center", lineHeight: 1.75, fontWeight: 400 }}>
        {msg}
      </p>
    </div>
  );
}

function GardenSVG({ stage }) {
  return (
    <svg width="120" height="110" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg">
      {/* Tierra */}
      <ellipse cx="60" cy="98" rx="45" ry="10" fill="rgba(120,80,40,0.25)" />
      <ellipse cx="60" cy="96" rx="38" ry="7" fill="rgba(100,60,20,0.3)" />

      {stage === 0 && (
        // Solo tierra
        <ellipse cx="60" cy="96" rx="12" ry="4" fill="rgba(100,60,20,0.5)" />
      )}

      {stage === 1 && (
        // Semilla brotando
        <>
          <line x1="60" y1="90" x2="60" y2="72" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="55" cy="74" rx="8" ry="5" fill="#86efac" transform="rotate(-30 55 74)" opacity="0.9" />
        </>
      )}

      {stage === 2 && (
        // Planta pequeña
        <>
          <line x1="60" y1="90" x2="60" y2="58" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="50" cy="68" rx="12" ry="7" fill="#86efac" transform="rotate(-40 50 68)" />
          <ellipse cx="70" cy="63" rx="11" ry="6" fill="#4ade80" transform="rotate(30 70 63)" />
          <ellipse cx="56" cy="56" rx="9" ry="6" fill="#bbf7d0" transform="rotate(-10 56 56)" />
        </>
      )}

      {stage === 3 && (
        // Planta mediana con flores
        <>
          <line x1="60" y1="90" x2="60" y2="44" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="60" y1="72" x2="44" y2="60" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="64" x2="76" y2="52" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="38" cy="56" rx="14" ry="9" fill="#86efac" transform="rotate(-20 38 56)" />
          <ellipse cx="80" cy="48" rx="13" ry="8" fill="#4ade80" transform="rotate(15 80 48)" />
          <ellipse cx="58" cy="40" rx="12" ry="8" fill="#bbf7d0" />
          {/* Florecitas */}
          <circle cx="45" cy="50" r="4" fill="#c084fc" opacity="0.9" />
          <circle cx="45" cy="50" r="2" fill="white" />
          <circle cx="75" cy="44" r="4" fill="#f0abfc" opacity="0.9" />
          <circle cx="75" cy="44" r="2" fill="white" />
        </>
      )}

      {stage === 4 && (
        // Planta florecida
        <>
          <line x1="60" y1="90" x2="60" y2="36" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="76" x2="40" y2="62" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="66" x2="80" y2="54" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="54" x2="42" y2="44" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="34" cy="58" rx="16" ry="10" fill="#86efac" transform="rotate(-25 34 58)" />
          <ellipse cx="84" cy="50" rx="15" ry="9" fill="#4ade80" transform="rotate(20 84 50)" />
          <ellipse cx="36" cy="38" rx="13" ry="9" fill="#bbf7d0" transform="rotate(-15 36 38)" />
          <ellipse cx="62" cy="30" rx="16" ry="11" fill="#dcfce7" />
          {/* Flores */}
          <circle cx="40" cy="52" r="5" fill="#c084fc" />
          <circle cx="40" cy="52" r="2.5" fill="#fef3c7" />
          <circle cx="82" cy="46" r="5" fill="#f0abfc" />
          <circle cx="82" cy="46" r="2.5" fill="#fef3c7" />
          <circle cx="60" cy="26" r="6" fill="#818cf8" />
          <circle cx="60" cy="26" r="3" fill="#fef3c7" />
        </>
      )}

      {stage === 5 && (
        // Árbol completo — jardín pleno
        <>
          <line x1="60" y1="90" x2="60" y2="28" stroke="#14532d" strokeWidth="5" strokeLinecap="round" />
          <line x1="60" y1="74" x2="36" y2="60" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="60" y1="62" x2="84" y2="50" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="60" y1="50" x2="38" y2="38" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="42" x2="82" y2="32" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" />
          {/* Copa */}
          <ellipse cx="60" cy="20" rx="30" ry="20" fill="#166534" opacity="0.9" />
          <ellipse cx="40" cy="28" rx="20" ry="14" fill="#15803d" />
          <ellipse cx="80" cy="26" rx="20" ry="14" fill="#16a34a" />
          <ellipse cx="60" cy="16" rx="22" ry="15" fill="#22c55e" />
          {/* Flores y frutos */}
          <circle cx="44" cy="22" r="5" fill="#c084fc" />
          <circle cx="44" cy="22" r="2.5" fill="#fef3c7" />
          <circle cx="76" cy="20" r="5" fill="#f0abfc" />
          <circle cx="76" cy="20" r="2.5" fill="#fef3c7" />
          <circle cx="60" cy="10" r="6" fill="#818cf8" />
          <circle cx="60" cy="10" r="3" fill="#fef3c7" />
          <circle cx="52" cy="32" r="4" fill="#fb7185" opacity="0.9" />
          <circle cx="68" cy="30" r="4" fill="#fb7185" opacity="0.9" />
          {/* Estrellitas */}
          <text x="20" y="30" fontSize="10" opacity="0.6">✨</text>
          <text x="88" y="18" fontSize="8" opacity="0.5">✨</text>
        </>
      )}
    </svg>
  );
}
