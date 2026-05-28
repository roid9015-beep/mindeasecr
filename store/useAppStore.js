import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAppStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      locale: "en",
      messages: [],
      setMessages: (messages) => set({ messages }),
      page: "dashboard",
      setPage: (p) => set({ page: p }),
      activeSession: null,
      startSession: (topic) => set({ activeSession: { topic, startedAt: Date.now() }, messages: [] }),
    }),
    {
      name: "mindease-storage",
      partialize: (s) => ({
        user: s.user,
        locale: s.locale,
        messages: s.messages,
        activeSession: s.activeSession,
      }),
    }
  )
);

export default useAppStore;
