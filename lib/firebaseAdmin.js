import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Aquí estamos inyectando las variables que configuraste en Vercel
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // El .replace es necesario para que Vercel entienda los saltos de línea de la clave
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Esto evita que Firebase intente inicializarse dos veces (causaría error)
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://mindeasecr-default-rtdb.firebaseio.com"
  });
}

export const db = getFirestore();
