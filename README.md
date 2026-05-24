export const CLAUDE_MODEL = "claude-sonnet-4-20250514";
export const FREE_MESSAGE_LIMIT = 10;

export const REGIONAL_VOICES = {
  "es-MX": { lang:"es-MX", name:"Español (México)",     pitch:1.05, rate:0.92 },
  "es-ES": { lang:"es-ES", name:"Español (España)",     pitch:1.00, rate:0.90 },
  "es-AR": { lang:"es-AR", name:"Español (Argentina)",  pitch:1.00, rate:0.88 },
  "es-CO": { lang:"es-CO", name:"Español (Colombia)",   pitch:1.05, rate:0.91 },
  "es-CL": { lang:"es-CL", name:"Español (Chile)",      pitch:1.00, rate:0.89 },
  "es-CR": { lang:"es-CR", name:"Español (Costa Rica)", pitch:1.03, rate:0.91 },
  "es-US": { lang:"es-US", name:"Español (EE.UU.)",     pitch:1.05, rate:0.92 },
  "pt-BR": { lang:"pt-BR", name:"Português (Brasil)",   pitch:1.05, rate:0.93 },
  "pt-PT": { lang:"pt-PT", name:"Português (Portugal)", pitch:1.00, rate:0.88 },
  "en-US": { lang:"en-US", name:"English (US)",         pitch:1.00, rate:0.90 },
  "en-GB": { lang:"en-GB", name:"English (UK)",         pitch:0.98, rate:0.88 },
  "fr-FR": { lang:"fr-FR", name:"Français",             pitch:1.02, rate:0.90 },
  "de-DE": { lang:"de-DE", name:"Deutsch",              pitch:0.98, rate:0.88 },
  "it-IT": { lang:"it-IT", name:"Italiano",             pitch:1.05, rate:0.92 },
};

export const COUNTRY_LANGUAGE_MAP = {
  MX:{ locale:"es", voice:"es-MX", flag:"🇲🇽", country:"México" },
  ES:{ locale:"es", voice:"es-ES", flag:"🇪🇸", country:"España" },
  AR:{ locale:"es", voice:"es-AR", flag:"🇦🇷", country:"Argentina" },
  CO:{ locale:"es", voice:"es-CO", flag:"🇨🇴", country:"Colombia" },
  CL:{ locale:"es", voice:"es-CL", flag:"🇨🇱", country:"Chile" },
  PE:{ locale:"es", voice:"es-CO", flag:"🇵🇪", country:"Perú" },
  VE:{ locale:"es", voice:"es-MX", flag:"🇻🇪", country:"Venezuela" },
  CR:{ locale:"es", voice:"es-CR", flag:"🇨🇷", country:"Costa Rica" },
  GT:{ locale:"es", voice:"es-MX", flag:"🇬🇹", country:"Guatemala" },
  BO:{ locale:"es", voice:"es-AR", flag:"🇧🇴", country:"Bolivia" },
  EC:{ locale:"es", voice:"es-CO", flag:"🇪🇨", country:"Ecuador" },
  PY:{ locale:"es", voice:"es-AR", flag:"🇵🇾", country:"Paraguay" },
  UY:{ locale:"es", voice:"es-AR", flag:"🇺🇾", country:"Uruguay" },
  PA:{ locale:"es", voice:"es-MX", flag:"🇵🇦", country:"Panamá" },
  HN:{ locale:"es", voice:"es-MX", flag:"🇭🇳", country:"Honduras" },
  SV:{ locale:"es", voice:"es-MX", flag:"🇸🇻", country:"El Salvador" },
  NI:{ locale:"es", voice:"es-MX", flag:"🇳🇮", country:"Nicaragua" },
  DO:{ locale:"es", voice:"es-MX", flag:"🇩🇴", country:"Rep. Dominicana" },
  CU:{ locale:"es", voice:"es-MX", flag:"🇨🇺", country:"Cuba" },
  PR:{ locale:"es", voice:"es-US", flag:"🇵🇷", country:"Puerto Rico" },
  US:{ locale:"en", voice:"en-US", flag:"🇺🇸", country:"United States" },
  GB:{ locale:"en", voice:"en-GB", flag:"🇬🇧", country:"United Kingdom" },
  CA:{ locale:"en", voice:"en-US", flag:"🇨🇦", country:"Canada" },
  AU:{ locale:"en", voice:"en-GB", flag:"🇦🇺", country:"Australia" },
  BR:{ locale:"pt", voice:"pt-BR", flag:"🇧🇷", country:"Brasil" },
  PT:{ locale:"pt", voice:"pt-PT", flag:"🇵🇹", country:"Portugal" },
  FR:{ locale:"fr", voice:"fr-FR", flag:"🇫🇷", country:"France" },
  DE:{ locale:"de", voice:"de-DE", flag:"🇩🇪", country:"Deutschland" },
  IT:{ locale:"it", voice:"it-IT", flag:"🇮🇹", country:"Italia" },
};

export const BREATHING_COLORS    = ["#6366f1","#8b5cf6","#06b6d4","#0ea5e9"];
export const BREATHING_DURATIONS = [4,4,6,2];

export const NAV_ICONS = {
  dashboard: "🏠",
  chat:      "💬",
  breathing: "🫁",
  grounding: "🎯",
  insights:  "📊",
  settings:  "⚙️",
};
