"use client";
import { useState, useCallback, useRef, useEffect } from "react";

// ── Configuración de voz por región ──────────────────────────────────────────
// Prioridades de nombre de voz por idioma/región (en orden de preferencia)
// Las voces "Neural", "Natural" y "Enhanced" suenan más humanas en los SO modernos
const VOICE_PREFERENCES = {
  "es-MX": {
    names: ["Paulina", "Monica", "Esperanza", "Google español", "Microsoft Sabina", "es-MX"],
    lang: "es-MX", pitch: 1.05, rate: 0.88, volume: 1,
  },
  "es-ES": {
    names: ["Monica", "Mónica", "Google español de España", "Microsoft Helena", "es-ES"],
    lang: "es-ES", pitch: 1.00, rate: 0.86, volume: 1,
  },
  "es-AR": {
    names: ["Diego", "Google español", "Microsoft Sabina", "es-AR", "es-MX"],
    lang: "es-AR", pitch: 0.98, rate: 0.87, volume: 1,
  },
  "es-CO": {
    names: ["Google español", "Esperanza", "Microsoft Sabina", "es-CO", "es-MX"],
    lang: "es-CO", pitch: 1.03, rate: 0.88, volume: 1,
  },
  "es-CR": {
    names: ["Google español", "Esperanza", "Microsoft Sabina", "es-CR", "es-MX"],
    lang: "es-CR", pitch: 1.02, rate: 0.88, volume: 1,
  },
  "es-US": {
    names: ["Esperanza", "Paulina", "Google español", "Microsoft Sabina", "es-US", "es-MX"],
    lang: "es-US", pitch: 1.04, rate: 0.89, volume: 1,
  },
  "pt-BR": {
    names: ["Luciana", "Google português do Brasil", "Microsoft Maria", "pt-BR"],
    lang: "pt-BR", pitch: 1.05, rate: 0.90, volume: 1,
  },
  "pt-PT": {
    names: ["Joana", "Google português", "Microsoft Helia", "pt-PT"],
    lang: "pt-PT", pitch: 1.00, rate: 0.86, volume: 1,
  },
  "en-US": {
    names: ["Samantha", "Google US English", "Microsoft Zira", "Microsoft Jenny", "en-US"],
    lang: "en-US", pitch: 1.00, rate: 0.88, volume: 1,
  },
  "en-GB": {
    names: ["Daniel", "Google UK English Female", "Microsoft Hazel", "en-GB"],
    lang: "en-GB", pitch: 0.97, rate: 0.86, volume: 1,
  },
  "fr-FR": {
    names: ["Thomas", "Google français", "Microsoft Julie", "fr-FR"],
    lang: "fr-FR", pitch: 1.02, rate: 0.88, volume: 1,
  },
  "de-DE": {
    names: ["Anna", "Google Deutsch", "Microsoft Katja", "de-DE"],
    lang: "de-DE", pitch: 0.98, rate: 0.86, volume: 1,
  },
  "it-IT": {
    names: ["Alice", "Google italiano", "Microsoft Elsa", "it-IT"],
    lang: "it-IT", pitch: 1.04, rate: 0.90, volume: 1,
  },
};

const DEFAULT_CONFIG = { lang: "es-MX", pitch: 1.0, rate: 0.88, volume: 1, names: [] };

// ── Seleccionar la mejor voz disponible ───────────────────────────────────────
function selectBestVoice(voices, config) {
  if (!voices || voices.length === 0) return null;

  // 1. Intentar por nombre preferido (voces neurales/naturales tienen nombres específicos)
  for (const preferredName of (config.names || [])) {
    const match = voices.find(v =>
      v.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Buscar voces "Neural", "Natural" o "Enhanced" en el idioma correcto
  const qualityKeywords = ["neural", "natural", "enhanced", "premium", "wavenet"];
  const langPrefix = config.lang.split("-")[0]; // "es", "pt", "en", etc.

  for (const keyword of qualityKeywords) {
    const match = voices.find(v =>
      v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  // 3. Buscar por locale exacto
  const exactMatch = voices.find(v => v.lang === config.lang);
  if (exactMatch) return exactMatch;

  // 4. Buscar por idioma base (ej: cualquier "es-*")
  const langMatch = voices.find(v => v.lang.startsWith(langPrefix));
  if (langMatch) return langMatch;

  return null;
}

// ── Hook principal ────────────────────────────────────────────────────────────
export function useVoice(voiceKey, enabled) {
  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const utteranceRef = useRef(null);

  const config = VOICE_PREFERENCES[voiceKey] || DEFAULT_CONFIG;

  // Esperar a que el navegador cargue las voces (tarda un momento en algunos SO)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      if (voices.length > 0) setVoicesReady(true);
    };

    checkVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      checkVoices();
    };
  }, []);

  const speak = useCallback((text) => {
    if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
    if (!text?.trim()) return;

    // Cancelar cualquier reproducción anterior
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utter;

    // Configurar parámetros de voz
    utter.lang   = config.lang;
    utter.pitch  = config.pitch;
    utter.rate   = config.rate;
    utter.volume = config.volume;

    // Seleccionar la mejor voz disponible
    const voices = window.speechSynthesis.getVoices();
    const bestVoice = selectBestVoice(voices, config);
    if (bestVoice) utter.voice = bestVoice;

    // Eventos
    utter.onstart = () => setSpeaking(true);
    utter.onend   = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utter.onpause = () => setSpeaking(false);

    // Fix para Chrome: a veces se congela en textos largos
    // Dividir en frases cortas para mejor naturalidad
    if (text.length > 200) {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      let index = 0;

      const speakNext = () => {
        if (index >= sentences.length) { setSpeaking(false); return; }
        const chunk = new SpeechSynthesisUtterance(sentences[index].trim());
        chunk.lang   = config.lang;
        chunk.pitch  = config.pitch;
        chunk.rate   = config.rate;
        chunk.volume = config.volume;
        if (bestVoice) chunk.voice = bestVoice;
        chunk.onend   = () => { index++; speakNext(); };
        chunk.onerror = () => setSpeaking(false);
        if (index === 0) chunk.onstart = () => setSpeaking(true);
        window.speechSynthesis.speak(chunk);
      };

      speakNext();
      return;
    }

    window.speechSynthesis.speak(utter);
  }, [enabled, config, voicesReady]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  // Cleanup al desmontar
  useEffect(() => () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop, speaking, voicesReady, config };
}
