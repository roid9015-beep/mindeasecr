// lib/paypal.js
// Configuración central de PayPal para MindEase

export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

// ── IDs de planes de suscripción (creados en PayPal Dashboard)
// Instrucciones para obtener estos IDs en README_PAYPAL.md
export const PAYPAL_PLANS = {
  monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY, // $2.99/mes
  yearly:  process.env.NEXT_PUBLIC_PAYPAL_PLAN_YEARLY,  // $24.99/año
};

// ── Verificar si PayPal está configurado
export const isPayPalReady = () =>
  Boolean(PAYPAL_CLIENT_ID && PAYPAL_PLANS.monthly && PAYPAL_PLANS.yearly);
