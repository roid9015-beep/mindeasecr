// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/firestore.js
// Helpers para guardar y cargar conversaciones en Firestore
// ─────────────────────────────────────────────────────────────────────────────

import { db } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, serverTimestamp,
} from "firebase/firestore";

// Máximo de mensajes a guardar por usuario (evita superar el límite de 1MB de Firestore)
const MAX_MESSAGES = 150;

// ── Cargar conversación del usuario ──────────────────────────────────────────
export async function loadConversation(uid) {
  if (!uid) return [];
  try {
    const ref  = doc(db, "conversations", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    const data = snap.data();
    return Array.isArray(data.messages) ? data.messages : [];
  } catch (err) {
    console.warn("[Firestore] Error cargando conversación:", err?.message);
    return [];
  }
}

// ── Guardar un nuevo mensaje en la conversación ───────────────────────────────
export async function saveMessage(uid, message) {
  if (!uid || !message) return;
  try {
    const ref  = doc(db, "conversations", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // Primera vez — crear el documento
      await setDoc(ref, {
        uid,
        messages:  [message],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Ya existe — agregar mensaje
      const existing = snap.data().messages || [];
      const updated  = [...existing, message].slice(-MAX_MESSAGES);
      await updateDoc(ref, {
        messages:  updated,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn("[Firestore] Error guardando mensaje:", err?.message);
  }
}

// ── Guardar estado de ánimo del día ───────────────────────────────────────────
export async function saveMood(uid, mood) {
  if (!uid || !mood) return;
  try {
    const ref = doc(db, "users", uid);
    const today = new Date().toISOString().split("T")[0]; // "2025-05-29"
    await setDoc(ref, {
      moods: { [today]: mood },
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("[Firestore] Error guardando mood:", err?.message);
  }
}

// ── Cargar perfil del usuario (moods, stats) ──────────────────────────────────
export async function loadUserProfile(uid) {
  if (!uid) return null;
  try {
    const ref  = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn("[Firestore] Error cargando perfil:", err?.message);
    return null;
  }
}

// ── Borrar conversación (para el PIN de privacidad en el futuro) ─────────────
export async function clearConversation(uid) {
  if (!uid) return;
  try {
    const ref = doc(db, "conversations", uid);
    await setDoc(ref, {
      uid,
      messages:  [],
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn("[Firestore] Error borrando conversación:", err?.message);
  }
}
