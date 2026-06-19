# Preferencias de trabajo — Roid

## Comunicación
- Responder SIEMPRE en español
- Ser directo y conciso — explica el qué y el por qué, no el cómo paso a paso si no es necesario
- Cuando algo no funciona después de varios intentos, NO sugerir workarounds — encontrar la causa raíz real
- El usuario se frustra si se le pide hacer cosas sin estar seguro de que van a funcionar
- Frases como "intenta esto" o "puede que..." son señal de que no se llegó a la causa raíz

## Flujo de trabajo
- Claude hace todos los cambios de código en el filesystem montado
- Usuario pushea desde Android Studio (Git → Push)
- Vercel despliega automáticamente al hacer push a main
- Para builds de Android: usuario usa Android Studio → Build → Generate Signed Bundle
- No pedirle al usuario que corra comandos en terminal — él no lo hace

## Archivos y ediciones
- Siempre usar Python heredoc para rewrites completos de archivos (previene truncamiento)
- Verificar cambios con `git diff -w --stat -- <archivo>` antes de commit
- Nunca `git add -A`, siempre archivos específicos
- Los lock files de git se mueven con `python3 -c "os.rename(...)"`, no con rm

## Diagnóstico
- Cuando algo falla, ir a la causa raíz antes de proponer fixes
- Revisar logs de Vercel con MCP (runtime logs, build logs) antes de asumir qué falló
- Si el usuario dice "sigue igual", significa que la causa raíz no fue encontrada, no que el fix falló
