# Service Worker — Causa Raíz y Solución Definitiva

## El bug original
`public/sw.js` tenía un `fetch` handler que usaba `CACHE_NAME` sin definirlo:
```js
caches.open(CACHE_NAME) // ReferenceError → .catch() → caches.match() → undefined → ERR_FAILED
```
Resultado: TODAS las peticiones fallaban con `net::ERR_FAILED`.

## Por qué persistía después de "reinstalar"
1. **Chrome móvil:** el SW se registra por ORIGEN (`https://mindeasecr.vercel.app`), separado del APK. Limpiar Chrome ≠ limpiar SW. Solución: `chrome://settings/content/all` → sitio → Clear & reset.
2. **APK nativo:** Android Backup (`allowBackup=true`) restaura el directorio `app_webview/` (que contiene el SW) al reinstalar. El SW roto volvía con cada reinstalación.
3. **Chicken-and-egg:** el SW roto bloqueaba la carga del page → el script de registro nunca corría → el SW nunca se actualizaba solo.

## Solución final aplicada
1. `public/sw.js` → SW mínimo v3: solo `install` (skipWaiting) + `activate` (limpia caches + clients.claim). **Sin fetch handler.**
2. `app/layout.js` → eliminado el `navigator.serviceWorker.register()`. Sin registro = sin futuro SW.
3. `MainActivity.java` → limpia `app_webview/` en primer arranque con flag `sw_cleared_v3`:
   ```java
   File webViewDir = new File(getApplicationInfo().dataDir, "app_webview");
   deleteRecursive(webViewDir); // antes de super.onCreate()
   ```
4. `AndroidManifest.xml` → `android:allowBackup="false"` para que Google Backup no restaure el SW roto.

## Regla general
Nunca agregar un SW con `.catch(() => caches.match(...))` sin garantizar que el cache tenga el recurso. En apps Capacitor con `server.url`, el SW es más problemático que útil — es mejor no usarlo.
