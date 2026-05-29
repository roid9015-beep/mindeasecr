"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { REGIONAL_VOICES } from "@/lib/constants";

export function useVoice(voiceKey, enabled) {
  const [speaking, setSpeaking] = useState(false);
  const voiceConfig = REGIONAL_VOICES[voiceKey] || REGIONAL_VOICES["en-US"];

  const speak = useCallback((text) => {
    if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang   = voiceConfig.lang;
    utter.pitch  = voiceConfig.pitch;
    utter.rate   = voiceConfig.rate;
    utter.volume = 1;
    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang === voiceConfig.lang)
                 || voices.find(v => v.lang.startsWith(voiceConfig.lang.split("-")[0]));
      if (match) utter.voice = match;
    };
    trySetVoice();
    window.speechSynthesis.onvoiceschanged = trySetVoice;
    utter.onstart = () => setSpeaking(true);
    utter.onend   = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, [enabled, voiceConfig]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);

  return { speak, stop, speaking, voiceConfig };
}
