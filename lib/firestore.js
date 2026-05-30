// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/firestore.js
// ─────────────────────────────────────────────────────────────────────────────

import { db } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const MAX_MESSAGES = 150;

// ── Cargar conversación ───────────────────────────────────────────────────────
export async function loadConversation(uid) {
  if (!uid) return [];
  try {
    const snap = await getDoc(doc(db, "conversations", uid));
    if (!snap.exists()) return [];
    const data = snap.data();
    return Array.isArray(data.messages) ? data.messages : [];
  } catch (err) {
    console.warn("[Firestore] loadConversation:", err?.message);
    return [];
  }
}

// ── Guardar mensaje ───────────────────────────────────────────────────────────
export async function saveMessage(uid, message) {
  if (!uid || !message) return;
  try {
    const ref  = doc(db, "conversations", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { uid, messages: [message], createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    } else {
      const existing = snap.data().messages || [];
      await updateDoc(ref, { messages: [...existing, message].slice(-MAX_MESSAGES), updatedAt: serverTimestamp() });
    }
  } catch (err) {
    console.warn("[Firestore] saveMessage:", err?.message);
  }
}

// ── Guardar estado de ánimo ───────────────────────────────────────────────────
export async function saveMood(uid, mood) {
  if (!uid || !mood) return;
  try {
    const today = new Date().toISOString().split("T")[0];
    await setDoc(doc(db, "users", uid), {
      moods: { [today]: { label: mood.label, value: mood.value, emoji: mood.emoji } },
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("[Firestore] saveMood:", err?.message);
  }
}

// ── Obtener estadísticas reales del usuario ───────────────────────────────────
export async function getStats(uid) {
  if (!uid) return { totalMessages: 0, daysActive: 0, streak: 0, lastMood: null };
  try {
    const [convSnap, userSnap] = await Promise.all([
      getDoc(doc(db, "conversations", uid)),
      getDoc(doc(db, "users", uid)),
    ]);

    // Mensajes
    const messages = convSnap.exists() ? (convSnap.data().messages || []) : [];
    const totalMessages = messages.filter(m => m.role === "user").length;

    // Días activos — días únicos con actividad
    const activeDays = new Set(
      messages
        .filter(m => m.timestamp)
        .map(m => new Date(m.timestamp).toISOString().split("T")[0])
    );
    const daysActive = activeDays.size;

    // Racha actual — días consecutivos hasta hoy
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (activeDays.has(key)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Último mood guardado
    let lastMood = null;
    if (userSnap.exists()) {
      const moods = userSnap.data().moods || {};
      const todayKey = today.toISOString().split("T")[0];
      lastMood = moods[todayKey] || null;
    }

    return { totalMessages, daysActive, streak, lastMood };
  } catch (err) {
    console.warn("[Firestore] getStats:", err?.message);
    return { totalMessages: 0, daysActive: 0, streak: 0, lastMood: null };
  }
}

// ── Guardar y obtener carta semanal ───────────────────────────────────────────
function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

export async function getLetter(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    const weekKey = getWeekKey();
    return data.letters?.[weekKey] || null;
  } catch {
    return null;
  }
}

export async function saveLetter(uid, text) {
  if (!uid || !text) return;
  try {
    const weekKey = getWeekKey();
    await setDoc(doc(db, "users", uid), {
      letters: { [weekKey]: { text, generatedAt: new Date().toISOString() } },
    }, { merge: true });
  } catch (err) {
    console.warn("[Firestore] saveLetter:", err?.message);
  }
}

// ── Guardar aceptación de Términos ────────────────────────────────────────────
export async function saveTermsAcceptance(uid, locale) {
  if (!uid) return;
  try {
    await setDoc(doc(db, "users", uid), {
      termsAccepted: true,
      termsAcceptedAt: serverTimestamp(),
      termsAcceptedLocale: locale || "es",
      termsVersion: "2025-05",
    }, { merge: true });
  } catch (err) {
    console.warn("[Firestore] saveTermsAcceptance:", err?.message);
  }
}

// ── Borrar conversación ───────────────────────────────────────────────────────
export async function clearConversation(uid) {
  if (!uid) return;
  try {
    await setDoc(doc(db, "conversations", uid), {
      uid, messages: [], updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("[Firestore] clearConversation:", err?.message);
  }
}

// ── Cargar perfil completo ────────────────────────────────────────────────────
export async function loadUserProfile(uid) {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}
