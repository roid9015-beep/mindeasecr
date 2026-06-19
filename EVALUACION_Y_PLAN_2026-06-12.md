# MindEase AI — Evaluación profesional y plan de trabajo
**Fecha:** 12 de junio de 2026

---

## 1. Resumen ejecutivo

Hoy se encontraron y corrigieron **3 bugs críticos** que explican casi todos los síntomas que reportaste. Los 3 ya están arreglados en el código (3 commits nuevos en tu repo local). **Falta un solo paso de tu parte: hacer `git push` desde Android Studio** para que se publiquen en Vercel.

| # | Problema reportado | Causa raíz encontrada | Estado |
|---|---|---|---|
| 1 | "No me funciona el chat, da error" | Modelo de IA inválido (`claude-opus-4-5`, no existe) usado en el primer mensaje de **cada** sesión nueva y en usuarios premium | ✅ Corregido (commit `2618975`) |
| 2 | El último cambio del header (responsive) no se veía reflejado | El archivo `LandingPage.jsx` que se subió a GitHub quedó **cortado a la mitad** (error de sincronización), por lo que el build de Vercel fallaba desde ayer | ✅ Corregido (commit `2618975`) |
| 3 | "Hay que configurar lo de recordar contraseña" | La función "Recordarme" + "Olvidé mi contraseña" **ya estaba programada** pero nunca se subió a GitHub | ✅ Commiteado (commit `0c10ac1`) |
| 4 | Logo/branding pendiente | El ícono de la app y la pantalla de carga (splash) usaban el ícono genérico de Capacitor (la "X" azul), no tu logo de la plantita 🌿 | ✅ Corregido (commit `9fce5b5`) |
| 5 | "La imagen no se adapta a la pantalla" | Diagnóstico: muy probablemente se refiere a la **pantalla de carga (splash)**, que mostraba un ícono genérico pequeño flotando en una pantalla blanca — ya rediseñada con tu logo sobre fondo oscuro de marca | ✅ Corregido junto con el punto 4 — **por favor confírmame si esto era lo que veías** |
| 6 | Sync de versión Android (`build.gradle`) | `git` tenía `versionCode 5` / `com.mindease.app` (desactualizado); el AAB real subido es `versionCode 9` / `com.mindease.cr` | ✅ Sincronizado (commit `0c10ac1`) |
| 7 | Google login no funciona en app descargada "por aparte" de Google Play | Necesito que me cuentes **cómo obtuviste ese instalador** (¿link de prueba interna, APK que te compartió alguien, build propio?) para poder diagnosticarlo — ver sección 4 | ⏳ Pendiente de tu info |

---

## 2. Diagnóstico técnico detallado

### 2.1 Bug del chat — modelo de IA inválido (CRÍTICO)

En `app/api/chat/route.js` había dos referencias a `"claude-opus-4-5"`, un identificador de modelo **que no existe**. Esto se usaba:

- En el **mensaje de apertura de toda sesión nueva** (`isOpening`) — es decir, el primer "Hola" que el usuario recibe del terapeuta IA al entrar al chat.
- En usuarios premium o en su primera sesión.

Cuando la API de Anthropic recibe un modelo inválido, responde con un error que el código no maneja específicamente (solo maneja 401 y 429), así que cae al mensaje genérico `"Algo salió mal. Intenta de nuevo."` — exactamente el error que describiste.

**Corrección aplicada:** cambié `"claude-opus-4-5"` → `"claude-opus-4-6"` (el modelo Opus vigente) en ambas líneas. Los mensajes normales de usuarios free (que usan `claude-haiku-4-5-20251001`) ya estaban correctos — por eso quizá el chat "funcionaba a veces".

### 2.2 Build de Vercel roto — archivo truncado

El commit `1628475` (tu fix del header responsive de ayer) **subió un archivo `LandingPage.jsx` incompleto**: se cortó literalmente a media palabra (`...cursor:not-allowed;tran`), faltando el cierre del bloque de estilos y del componente. Esto rompió la compilación de Next.js (`Unexpected eof`) y el deploy de producción quedó en estado `ERROR` desde entonces — es decir, **tu fix del header nunca llegó a estar en línea**, y la app seguía sirviendo la versión anterior.

**Corrección aplicada:** reconstruí el archivo completo (194 líneas, verificado con un compilador), incluyendo tu fix original del header responsive. Verifiqué la sintaxis con `esbuild` antes de commitear.

> Nota técnica: durante este trabajo encontramos que el repo en este entorno tiene archivos de bloqueo de git (`index.lock`, `HEAD.lock`) que quedan "atascados" por una incompatibilidad del sistema de archivos montado. Esto probablemente fue la causa de que el commit anterior se subiera incompleto. Logré sortearlo, pero si en el futuro un `git commit` desde aquí falla con "Unable to create .git/index.lock", es ese mismo problema — dímelo y lo resuelvo de nuevo.

### 2.3 "Recordarme" y "Olvidé mi contraseña"

Esto **ya estaba programado** en `AuthPage.jsx` (checkbox "Recordarme" que usa `browserLocalPersistence` vs `browserSessionPersistence` de Firebase, más el flujo de "Olvidé mi contraseña") y en `lib/i18n.js` (traducciones ES/PT/EN), pero **nunca se había subido a GitHub** — por eso no lo veías reflejado. Ya está commiteado (`0c10ac1`) junto con los demás cambios.

### 2.4 Branding / logo

Comparé `public/icon-512.png` (tu logo real: cuadrado con gradiente morado→azul y una plantita verde 🌿) contra los íconos que Android realmente usa:

- `android/app/src/main/res/mipmap-*/ic_launcher*.png` — **eran el ícono genérico de plantilla de Capacitor** (una "X" azul sobre fondo blanco/cuadriculado). Esto es lo que ven tus 12 testers en el cajón de apps y lo que aparecerá en la ficha de Google Play.
- `android/app/src/main/res/drawable*/splash.png` — la **pantalla de carga** también era el ícono genérico de Capacitor, chiquito, flotando en una pantalla blanca.

**Corrección aplicada:** generé, a partir de tu `icon-512.png`, todos los tamaños necesarios (mdpi a xxxhdpi) para:
- Ícono adaptativo (`ic_launcher_foreground` + color de fondo `#0A0B12`, el mismo tono oscuro de tu app)
- Ícono redondo (`ic_launcher_round`)
- Ícono cuadrado clásico (`ic_launcher`)
- Splash screen (logo centrado sobre fondo oscuro de marca, en las 11 resoluciones/orientaciones)

Esto **muy probablemente es lo que veías como "la imagen no se adapta a la pantalla"**: un logo pequeño genérico flotando en blanco. Pídeme que te confirmes después de instalar la próxima build.

### 2.5 Sync `android/app/build.gradle`

Tu repo en git tenía `versionCode 5`, `versionName "1.4"` y `namespace "com.mindease.app"` — datos viejos que no coinciden con el AAB v9 (`com.mindease.cr`, `"1.2"`) que ya subiste a Play Console. Ya quedó sincronizado a `versionCode 9` / `"1.2"` / `com.mindease.cr`. **Para tu próxima subida a Play Console deberás aumentar a `versionCode 10`** (ver plan).

---

## 3. ACCIÓN INMEDIATA REQUERIDA (5 minutos, solo tú puedes hacerlo)

Hice **3 commits** en tu repositorio local (el mismo que abre Android Studio):

```
9fce5b5  Branding: aplicar logo MindEase (sprout) a icono adaptativo, redondo y splash screen de Android
0c10ac1  Feat: recordarme + restablecer contrasena en login; sync build.gradle (versionCode 9, com.mindease.cr) y MainActivity
2618975  Fix: build de Vercel roto (LandingPage.jsx truncado) y modelo IA invalido en chat (claude-opus-4-6)
```

**Pasos:**
1. Abre Android Studio (el proyecto MindEase).
2. Ve a **Git → Push** (o el ícono de la flecha hacia arriba en la barra superior).
3. Confirma el push de los 3 commits a `origin/main`.
4. Espera ~1-2 minutos: Vercel detectará el push y compilará automáticamente.

Yo verificaré el resultado del build en Vercel apenas me confirmes que hiciste el push, y si algo falla lo corrijo de inmediato.

---

## 4. Necesito tu ayuda para 2 temas

### 4.1 Google login falla en "app descargada por aparte de Google Play"

Para diagnosticar esto necesito que me cuentes exactamente:
- ¿De dónde descargaste ese APK/AAB? (¿link de "prueba interna" de Play Console, un archivo `.apk` que te compartiste a ti mismo, una build de debug desde Android Studio, etc.)
- ¿En qué dispositivo lo instalaste? ¿Es el mismo donde sí funciona la versión de Play Store, o uno distinto?
- ¿Qué error exacto da al tocar "Iniciar sesión con Google"? (mensaje en pantalla o captura)

**Hipótesis más probable:** si es un APK firmado con una llave distinta (por ejemplo, un build de debug o una firma local), su huella **SHA-1 no está registrada** en Firebase / Google Cloud Console (ahí solo están registradas la *Upload key* y la *App Signing key* de Play Console). Google rechaza el login porque no reconoce esa firma. La solución sería agregar el SHA-1 de esa firma adicional a Firebase, pero necesito confirmar el escenario antes de tocar nada.

### 4.2 Confirmar variables de entorno en Vercel (pendiente #12)

No tengo una forma de leer las variables de entorno desde aquí (por seguridad, las herramientas no las exponen). Por favor entra a:

**vercel.com → proyecto mindeasecr → Settings → Environment Variables**

y confirma que existan (no necesitas decirme los valores, solo si están presentes, en "Production"):
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `NEXT_PUBLIC_APP_URL`

Si falta `ANTHROPIC_API_KEY`, el chat seguiría fallando incluso con el modelo corregido (pero con un error 401, no el genérico que describiste — así que es poco probable que sea el problema principal).

---

## 5. Checklist completo para lanzamiento en producción (Google Play)

Cuando terminen los 14 días de prueba cerrada, esto es lo que falta para pasar a producción:

### Legal / Play Console (obligatorio, bloqueante)
- **Política de privacidad pública**: revisé `LandingPage.jsx` y los enlaces "Política de privacidad" / "Términos de servicio" / "Aviso médico" del footer son **texto sin link real** — no llevan a ninguna página. Google Play **exige una URL de política de privacidad** real y accesible, especialmente porque MindEase maneja datos de salud mental (categoría sensible en "Seguridad de los datos"). Esto es **bloqueante** para producción.
- **Formulario "Seguridad de los datos" (Data Safety)** en Play Console: declarar qué datos se recolectan (email, datos de Firebase Auth, datos de uso/chat) y cómo se usan/almacenan.
- **Clasificación de contenido** (cuestionario de IARC) — probablemente "Apto para todos" pero hay que completarlo, y considerando que es una app de bienestar emocional/salud mental, revisar si aplica alguna categoría especial.
- **Ficha de Play Store**: descripción corta/larga, capturas de pantalla (mínimo 2, recomendado 4-8), gráfico de funciones (1024×500), ícono de alta resolución (512×512 — ya lo tienes en `public/icon-512.png`, listo para subir).
- **Términos de servicio y disclaimers médicos**: dado que la app da "terapia" con IA, es muy recomendable (y en algunas jurisdicciones obligatorio) un disclaimer claro de que no sustituye atención profesional, y enlaces a líneas de ayuda en crisis.

### Técnico
- **`versionCode 10`** para la siguiente subida (después de este lote de fixes), manteniendo `com.mindease.cr`.
- Confirmar que el build de Vercel quede en verde después del push (sección 3).
- Probar el flujo completo en un dispositivo limpio: registro, login Google, chat (mensaje de apertura incluido), "Recordarme", "Olvidé contraseña", pantalla de splash/ícono nuevos.
- Revisar PayPal: `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — confirmar si está en modo **sandbox o producción** antes de lanzar (cobros reales de $5 USD/mes).
- Quitar o revisar archivos sueltos que quedaron en el repo (`error de app en celular.txt`, `test_rm.tmp`) — no afectan el build pero conviene limpiarlos.
- Considerar limpiar los recursos Android no usados (`drawable/ic_launcher_background.xml`, `drawable-v24/ic_launcher_foreground.xml` — son plantillas viejas de Capacitor, ya no se usan tras el cambio de branding, pero no rompen nada si se dejan).

### Negocio / contenido
- Revisar los **testimonios** de la landing page (`t.testimonials`) — si son de ejemplo/ficticios, considerar si Google Play los permite tal cual o si deben marcarse como ilustrativos.
- Verificar que `© 2025 MindEase AI` en el footer se actualice a 2026.

---

## 6. Plan de trabajo de hoy, paso a paso

1. **[TÚ] Push desde Android Studio** de los 3 commits (sección 3) — 5 min.
2. **[YO]** En cuanto confirmes el push, verifico que el build de Vercel termine en `READY` (y si falla, lo arreglo).
3. **[TÚ]** Cuando el deploy esté listo, prueba en tu teléfono (puede requerir cerrar y reabrir la app, o esperar 1-2 min):
   - Entrar al chat y confirmar que ya no da error.
   - Ver si la pantalla de carga / ícono ahora muestran tu logo (plantita) y fondo oscuro.
   - Probar "Recordarme" y "Olvidé mi contraseña" en el login.
4. **[TÚ]** Responde las 2 preguntas de la sección 4 (variables de entorno en Vercel, y cómo obtuviste el APK que falla con Google login).
5. **[YO]** Con esa info, diagnostico y arreglo el login de Google en ese otro APK si aplica.
6. **[TÚ + YO]** Cuando todo lo anterior esté validado, armamos juntos la política de privacidad y la ficha de Play Store (puedo redactarte el texto de política de privacidad y términos como punto de partida si quieres).
7. **[YO]** Preparo el bump a `versionCode 10` cuando estés listo para la siguiente subida del AAB.

---

¿Avanzamos primero con el push desde Android Studio? Avísame cuando lo hagas y reviso el deploy en Vercel de inmediato.
