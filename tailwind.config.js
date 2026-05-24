import { COUNTRY_LANGUAGE_MAP } from "./constants";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

export function getGreeting(locale) {
  const h = new Date().getHours();
  const g = {
    en:{ morning:"Good morning", afternoon:"Good afternoon", evening:"Good evening" },
    es:{ morning:"Buenos días",  afternoon:"Buenas tardes",  evening:"Buenas noches" },
    pt:{ morning:"Bom dia",      afternoon:"Boa tarde",      evening:"Boa noite" },
    fr:{ morning:"Bonjour",      afternoon:"Bon après-midi", evening:"Bonsoir" },
    de:{ morning:"Guten Morgen", afternoon:"Guten Tag",      evening:"Guten Abend" },
    it:{ morning:"Buongiorno",   afternoon:"Buon pomeriggio",evening:"Buonasera" },
  };
  const t = g[locale] || g.en;
  return h < 12 ? t.morning : h < 18 ? t.afternoon : t.evening;
}

export async function detectRegion() {
  try {
    const res  = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    const code = data.country_code;
    if (code && COUNTRY_LANGUAGE_MAP[code]) {
      const info = COUNTRY_LANGUAGE_MAP[code];
      return { countryCode:code, locale:info.locale, voiceKey:info.voice, flag:info.flag, country:info.country, source:"geoip" };
    }
  } catch {}

  const browserLang    = (typeof navigator !== "undefined" ? navigator.language : null) || "en-US";
  const browserLocale  = browserLang.split("-")[0].toLowerCase();
  const browserCountry = browserLang.split("-")[1]?.toUpperCase();

  if (browserCountry && COUNTRY_LANGUAGE_MAP[browserCountry]) {
    const info = COUNTRY_LANGUAGE_MAP[browserCountry];
    return { countryCode:browserCountry, locale:info.locale, voiceKey:info.voice, flag:info.flag, country:info.country, source:"browser" };
  }

  const localeVoiceMap = { es:"es-MX", pt:"pt-BR", fr:"fr-FR", de:"de-DE", it:"it-IT" };
  if (localeVoiceMap[browserLocale]) {
    return { countryCode:null, locale:browserLocale, voiceKey:localeVoiceMap[browserLocale], flag:"🌍", country:"", source:"browser-lang" };
  }

  return { countryCode:"US", locale:"en", voiceKey:"en-US", flag:"🇺🇸", country:"United States", source:"default" };
}
