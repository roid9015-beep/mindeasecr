# Proyecto MindEase AI

## Stack
- **Web:** Next.js 13+ (App Router), Tailwind CSS, Zustand (persist), Firebase Auth + Firestore
- **IA:** Anthropic API — modelo `claude-opus-4-6` en `/app/api/chat/route.js`
- **Mobile:** Capacitor (Android), `server.url: 'https://mindeasecr.vercel.app'`
- **Deploy web:** Vercel (auto-deploy desde GitHub main)
- **Package:** `com.mindease.cr`, versionCode 10 (1.3) — junio 2026

## Configs críticas
- `capacitor.config.ts` y `android/app/src/main/assets/capacitor.config.json` — AMBOS deben tener `server.url`
- `skipNativeAuth: false` — usa Firebase Auth nativa de Android para Google login
- `androidScheme: 'https'`, `cleartext: false`
- Firebase: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindeasecr.firebaseapp.com`
- `NEXT_PUBLIC_APP_URL` en `.env.local` apunta a localhost — solo es dev, Vercel tiene la producción correcta

## Estado actual (junio 2026)
- Web (Vercel): ✅ funcionando — sin Service Worker, carga directa a red
- App Play Store: ✅ versionCode 10 en Prueba Interna, funcionando
- Chat API: ✅ funcionando (POST /api/chat → 200)
- Google login web: ✅ usa `signInWithRedirect` (popups bloqueados en móvil)
- Google login nativo: ✅ usa `@capacitor-firebase/authentication`

## Archivos clave
- `app/api/chat/route.js` — endpoint de IA
- `app/layout.js` — NO registra SW (eliminado intencionalmente)
- `public/sw.js` — SW mínimo sin fetch handler (v3)
- `hooks/useVoice.js` — speechSynthesis con null check en línea 116
- `android/app/src/main/java/com/mindease/app/MainActivity.java` — limpia app_webview en primer arranque
- `android/app/src/main/AndroidManifest.xml` — `allowBackup=false`

## Git — quirks del sandbox
- `unlink()` falla → usar `python3 -c "os.rename('.git/HEAD.lock', ...)"` para remover locks
- Nunca usar Write/Edit + verificar con bash → puede truncar archivos en el filesystem montado
- Usar Python heredoc (`python3 - <<'PYEOF'`) para rewrites seguros
- Nunca `git add -A` → siempre `git add <archivo específico>`
- No se puede hacer push desde bash → usuario pushea desde Android Studio
