import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAppStore = create(
  persist(
    (set, get) => ({
      // ── User ──────────────────────────────────────────────────────────────
      user: null,
      setUser: (u) => set({ user: u }),
      clearUser: () => set({ user: null, messages: [], activeSession: null }),
      upgradeToPremium: () => set((s) => ({ user: s.user ? { ...s.user, isPremium: true } : null })),

      // ── Session management (free plan: 1 topic/month) ─────────────────────
      // sessionLog: [{ monthKey, topic, startedAt }]
      sessionLog: [],
      activeSession: null, // { topic, startedAt }
      setSessionLog: (log) => set({ sessionLog: log }),
      startSession: (topic) => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
        const session = { monthKey, topic, startedAt: now.toISOString() };
        set((s) => ({
          sessionLog: [...s.sessionLog, session],
          activeSession: session,
          messages: [], // fresh conversation per session
        }));
      },
      endSession: () => set({ activeSession: null }),

      // ── i18n ──────────────────────────────────────────────────────────────
      locale: "en",
      voiceKey: "en-US",
      langInfo: null,
      countryInfo: null,
      setRegion: ({ locale, voiceKey, langInfo, countryInfo }) =>
        set({ locale, voiceKey, langInfo, countryInfo }),

      // ── Voice ─────────────────────────────────────────────────────────────
      voiceEnabled: false,
      setVoiceEnabled: (v) => set({ voiceEnabled: v }),

      // ── Messages ──────────────────────────────────────────────────────────
      messages: [],
      addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: [] }),

      // ── Navigation ────────────────────────────────────────────────────────
      page: "dashboard",
      setPage: (p) => set({ page: p }),
      screen: "landing",
      setScreen: (s) => set({ screen: s }),

      // ── Prefs ─────────────────────────────────────────────────────────────
      pushEnabled: true,
      setPushEnabled: (v) => set({ pushEnabled: v }),
      reminderEnabled: false,
      setReminderEnabled: (v) => set({ reminderEnabled: v }),
      todayMood: null,
      setTodayMood: (m) => set({ todayMood: m }),
    }),
    {
      name: "mindease-storage",
      partialize: (s) => ({
        locale: s.locale, voiceKey: s.voiceKey,
        langInfo: s.langInfo, countryInfo: s.countryInfo,
        voiceEnabled: s.voiceEnabled,
        pushEnabled: s.pushEnabled, reminderEnabled: s.reminderEnabled,
        sessionLog: s.sessionLog, // persist monthly session usage
      }),
    }
  )
);

export default useAppStore;
