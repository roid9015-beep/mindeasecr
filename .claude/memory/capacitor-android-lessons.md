# Capacitor + Android + Play Store — Lecciones

## Configuración que funciona
- `server.url` en `capacitor.config.ts` → app siempre carga desde Vercel. El `out/` bundleado es irrelevante.
- IMPORTANTE: `npx cap sync` debe correrse después de cambiar `capacitor.config.ts` para actualizar `android/app/src/main/assets/capacitor.config.json`.
- `skipNativeAuth: false` → Google login usa el SDK nativo de Android, no el redirect web.
- SHA-1 del keystore debe estar registrado en Firebase Console → google-services.json actualizado → en el proyecto Android.

## Play Store — flujo de publicación
1. Build → Generate Signed Bundle (AAB), release keystore
2. Play Console → Prueba interna → Nueva versión → subir AAB
3. Para producción: todos los pasos de "Registro previo" deben estar completos (política de privacidad, clasificación de contenido, etc.)
4. Primera revisión: 3-7 días hábiles. Actualizaciones posteriores: <24h generalmente.
5. Notificación por email cuando aprueban o rechazan.

## Actualizaciones futuras
- Cambios web (UI, lógica, chat): push a GitHub → Vercel despliega → usuarios ven el cambio INMEDIATAMENTE sin nuevo APK.
- Cambios nativos (permisos, plugins Capacitor, config nativa): requiere nuevo AAB + subir a Play Console.
- Incrementar versionCode en `android/app/build.gradle` para cada APK nuevo.

## Errores comunes
- `unimplemented` en Google login → google-services.json desactualizado o SHA-1 faltante en Firebase.
- `ERR_FAILED` en WebView → casi siempre Service Worker roto (ver service-worker-lessons.md).
- Build falla en Vercel → revisar `LandingPage.jsx` u otros componentes truncados.
- Modelo IA inválido → en route.js usar `claude-opus-4-6` (no `claude-opus-4-5`).

## Play Console
- App ID: `com.mindease.cr`
- Prueba interna activa con 13 verificadores ("Prueba MindEase")
- versionCode 10 (1.3) — estado: Prueba Interna, junio 2026
