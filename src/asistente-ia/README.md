# Asistente IA de correo

Revisa la bandeja de Gmail de la agencia cada 5 minutos. Si un cliente
pregunta algo que se puede responder con el catálogo vigente (precio,
fechas, cupos, destinos), la IA responde sola dentro del mismo hilo de
Gmail. Si no está segura (reserva existente, pago, reclamo, dato que no
está en el catálogo), deja el correo sin leer y avisa al admin por correo
para que lo conteste una persona.

Todo queda registrado en la tabla `consultas_email`
(`GET /asistente-ia/consultas` y `GET /asistente-ia/consultas/pendientes`,
requiere rol ADMIN/SUPER_ADMIN).

## 1. Configurar credenciales de Gmail (una sola vez)

1. Ir a https://console.cloud.google.com/ → crear un proyecto (o usar uno existente).
2. **APIs y servicios → Biblioteca** → activar "Gmail API".
3. **APIs y servicios → Pantalla de consentimiento OAuth**: tipo "Externo",
   completar datos básicos, y en "Usuarios de prueba" agregar la cuenta
   Gmail real de la agencia (mientras la app no esté verificada por
   Google, solo esa cuenta va a poder autorizar).
4. **APIs y servicios → Credenciales → Crear credenciales → ID de cliente
   OAuth**, tipo "Aplicación web", con URI de redirección
   `https://developers.google.com/oauthplayground`.
   Esto genera `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
5. Ir a https://developers.google.com/oauthplayground →
   ícono de engranaje (arriba a la derecha) → tildar "Use your own OAuth
   credentials" → pegar el client id/secret del paso anterior.
6. En el panel izquierdo, buscar "Gmail API v1" y tildar estos dos scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.modify`
7. "Authorize APIs" → iniciar sesión con la cuenta Gmail de la agencia →
   aceptar permisos.
8. "Exchange authorization code for tokens" → copiar el **Refresh token**
   que aparece. Ese es `GOOGLE_REFRESH_TOKEN`. Este token no expira solo,
   así que este paso se hace una única vez.

## 2. Variables de entorno

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
ANTHROPIC_API_KEY=...
```

`ANTHROPIC_API_KEY` se obtiene en https://console.anthropic.com/settings/keys.

Si cualquiera de estas variables queda vacía, el módulo se desactiva solo
(loguea un warning al arrancar) y el resto de la app sigue funcionando
normal — no hace falta tener esto configurado para que el backend levante.

## 3. Qué NO responde la IA (a propósito)

- Preguntas sobre una reserva ya hecha, pagos o reembolsos.
- Reclamos.
- Cualquier dato que no esté en el catálogo de paquetes/ofertas activos.
- Cualquier consulta ambigua.

En esos casos el correo queda **sin marcar como leído** en la bandeja real
de Gmail (para que se note) y se manda un aviso a `ADMIN_NOTIFICATION_EMAIL`.

## 4. Costo y límites

- El cron corre cada 5 minutos y solo mira correos no leídos de `INBOX`
  (excluye promociones/social). Si no hay correos nuevos, no se llama a
  la IA (costo cero esa corrida).
- Se usa `claude-haiku-4-5`, el modelo más económico y rápido de Anthropic,
  suficiente para esta tarea porque solo clasifica y redacta a partir de
  datos ya estructurados (no requiere razonamiento profundo).
