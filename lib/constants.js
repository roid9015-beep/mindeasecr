// ─── Plans ────────────────────────────────────────────────────────────────────
// FREE:    1 conversation topic per month (full depth, no message cap per session)
// PREMIUM: unlimited conversations, memory, analytics — $5/month
export const PLAN_FREE_MONTHLY_SESSIONS = 1;
export const PREMIUM_PRICE = 5;

// ─── Voices ───────────────────────────────────────────────────────────────────
export const REGIONAL_VOICES = {
  "es-MX":{lang:"es-MX",name:"Español (México)",pitch:1.05,rate:0.92},
  "es-ES":{lang:"es-ES",name:"Español (España)",pitch:1.00,rate:0.90},
  "es-AR":{lang:"es-AR",name:"Español (Argentina)",pitch:1.00,rate:0.88},
  "es-CO":{lang:"es-CO",name:"Español (Colombia)",pitch:1.05,rate:0.91},
  "es-CR":{lang:"es-CR",name:"Español (Costa Rica)",pitch:1.03,rate:0.91},
  "es-US":{lang:"es-US",name:"Español (EE.UU.)",pitch:1.05,rate:0.92},
  "pt-BR":{lang:"pt-BR",name:"Português (Brasil)",pitch:1.05,rate:0.93},
  "pt-PT":{lang:"pt-PT",name:"Português (Portugal)",pitch:1.00,rate:0.88},
  "en-US":{lang:"en-US",name:"English (US)",pitch:1.00,rate:0.90},
  "en-GB":{lang:"en-GB",name:"English (UK)",pitch:0.98,rate:0.88},
  "fr-FR":{lang:"fr-FR",name:"Français",pitch:1.02,rate:0.90},
  "de-DE":{lang:"de-DE",name:"Deutsch",pitch:0.98,rate:0.88},
  "it-IT":{lang:"it-IT",name:"Italiano",pitch:1.05,rate:0.92},
};

export const COUNTRY_LANGUAGE_MAP = {
  MX:{locale:"es",voice:"es-MX",flag:"🇲🇽",country:"México"},
  ES:{locale:"es",voice:"es-ES",flag:"🇪🇸",country:"España"},
  AR:{locale:"es",voice:"es-AR",flag:"🇦🇷",country:"Argentina"},
  CO:{locale:"es",voice:"es-CO",flag:"🇨🇴",country:"Colombia"},
  CL:{locale:"es",voice:"es-CO",flag:"🇨🇱",country:"Chile"},
  PE:{locale:"es",voice:"es-CO",flag:"🇵🇪",country:"Perú"},
  VE:{locale:"es",voice:"es-MX",flag:"🇻🇪",country:"Venezuela"},
  CR:{locale:"es",voice:"es-CR",flag:"🇨🇷",country:"Costa Rica"},
  GT:{locale:"es",voice:"es-MX",flag:"🇬🇹",country:"Guatemala"},
  BO:{locale:"es",voice:"es-AR",flag:"🇧🇴",country:"Bolivia"},
  EC:{locale:"es",voice:"es-CO",flag:"🇪🇨",country:"Ecuador"},
  PY:{locale:"es",voice:"es-AR",flag:"🇵🇾",country:"Paraguay"},
  UY:{locale:"es",voice:"es-AR",flag:"🇺🇾",country:"Uruguay"},
  PA:{locale:"es",voice:"es-MX",flag:"🇵🇦",country:"Panamá"},
  HN:{locale:"es",voice:"es-MX",flag:"🇭🇳",country:"Honduras"},
  SV:{locale:"es",voice:"es-MX",flag:"🇸🇻",country:"El Salvador"},
  NI:{locale:"es",voice:"es-MX",flag:"🇳🇮",country:"Nicaragua"},
  DO:{locale:"es",voice:"es-MX",flag:"🇩🇴",country:"Rep. Dominicana"},
  CU:{locale:"es",voice:"es-MX",flag:"🇨🇺",country:"Cuba"},
  PR:{locale:"es",voice:"es-US",flag:"🇵🇷",country:"Puerto Rico"},
  US:{locale:"en",voice:"en-US",flag:"🇺🇸",country:"United States"},
  GB:{locale:"en",voice:"en-GB",flag:"🇬🇧",country:"United Kingdom"},
  CA:{locale:"en",voice:"en-US",flag:"🇨🇦",country:"Canada"},
  AU:{locale:"en",voice:"en-GB",flag:"🇦🇺",country:"Australia"},
  BR:{locale:"pt",voice:"pt-BR",flag:"🇧🇷",country:"Brasil"},
  PT:{locale:"pt",voice:"pt-PT",flag:"🇵🇹",country:"Portugal"},
  FR:{locale:"fr",voice:"fr-FR",flag:"🇫🇷",country:"France"},
  DE:{locale:"de",voice:"de-DE",flag:"🇩🇪",country:"Deutschland"},
  IT:{locale:"it",voice:"it-IT",flag:"🇮🇹",country:"Italia"},
};

export const BREATHING_COLORS    = ["#6366f1","#8b5cf6","#06b6d4","#0ea5e9"];
export const BREATHING_DURATIONS = [4,4,6,2];
export const NAV_ICONS = {
  dashboard:"🏠", chat:"💬", breathing:"🫁",
  grounding:"🎯", insights:"📊", settings:"⚙️"
};

// ─── Differentiators (shown on landing & upgrade screens) ────────────────────
export const DIFFERENTIATORS = [
  { icon:"🧠", en:"Emotional Memory", es:"Memoria emocional", pt:"Memória emocional",
    descEn:"Remembers your patterns, your triggers, and your progress — unlike any generic AI.",
    descEs:"Recuerda tus patrones, tus detonantes y tu progreso — a diferencia de cualquier IA genérica.",
    descPt:"Lembra seus padrões, gatilhos e progresso — diferente de qualquer IA genérica." },
  { icon:"🎯", en:"Guided Experience", es:"Experiencia guiada", pt:"Experiência guiada",
    descEn:"No need to know what to ask. MindEase guides you through emotional clarity step by step.",
    descEs:"No necesitas saber qué preguntar. MindEase te guía hacia la claridad emocional paso a paso.",
    descPt:"Não precisa saber o que perguntar. MindEase guia você para a clareza emocional passo a passo." },
  { icon:"🫁", en:"Integrated Tools", es:"Herramientas integradas", pt:"Ferramentas integradas",
    descEn:"Breathing, grounding, mood tracking — built in, not bolted on.",
    descEs:"Respiración, anclaje, seguimiento emocional — integrados, no añadidos.",
    descPt:"Respiração, ancoragem, rastreamento emocional — integrados, não adicionados." },
  { icon:"🔒", en:"Safe Space Identity", es:"Identidad de espacio seguro", pt:"Identidade de espaço seguro",
    descEn:"People share what they won't type into ChatGPT. MindEase is built for vulnerability.",
    descEs:"La gente comparte lo que no escribiría en ChatGPT. MindEase está construido para la vulnerabilidad.",
    descPt:"As pessoas compartilham o que não digitariam no ChatGPT. MindEase é feito para a vulnerabilidade." },
];
