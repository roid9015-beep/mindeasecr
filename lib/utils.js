import { COUNTRY_LANGUAGE_MAP } from "./constants";

export function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

export function getGreeting(locale) {
  const h = new Date().getHours();
  const g = {
    en:{morning:"Good morning",afternoon:"Good afternoon",evening:"Good evening"},
    es:{morning:"Buenos días",afternoon:"Buenas tardes",evening:"Buenas noches"},
    pt:{morning:"Bom dia",afternoon:"Boa tarde",evening:"Boa noite"},
  };
  const t = g[locale] || g.en;
  return h < 12 ? t.morning : h < 18 ? t.afternoon : t.evening;
}

// Returns { used, limit, canChat, resetDate }
export function getSessionStatus(sessionLog) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const thisMonth = (sessionLog || []).filter(s => s.monthKey === monthKey);
  const used = thisMonth.length;
  const limit = 1; // free: 1 conversation topic/month
  const canChat = used < limit;
  // Next reset: 1st of next month
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toLocaleDateString([], { month:"long", day:"numeric" });
  return { used, limit, canChat, monthKey, resetDate };
}

export function startNewSession(sessionLog, topic) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
  return [...(sessionLog || []), { monthKey, topic, startedAt: now.toISOString() }];
}

export async function detectRegion() {
  try {
    const res  = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const code = data.country_code;
    if (code && COUNTRY_LANGUAGE_MAP[code]) {
      const info = COUNTRY_LANGUAGE_MAP[code];
      return { countryCode:code, locale:info.locale, voiceKey:info.voice, flag:info.flag, country:info.country };
    }
  } catch {}
  const bl = (typeof navigator !== "undefined" ? navigator.language : null) || "en-US";
  const bc = bl.split("-")[1]?.toUpperCase();
  if (bc && COUNTRY_LANGUAGE_MAP[bc]) {
    const info = COUNTRY_LANGUAGE_MAP[bc];
    return { countryCode:bc, locale:info.locale, voiceKey:info.voice, flag:info.flag, country:info.country };
  }
  return { countryCode:"US", locale:"en", voiceKey:"en-US", flag:"🇺🇸", country:"United States" };
}
